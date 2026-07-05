const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router(); // 'router' 인스턴스 생성

// Credentials are resolved by the AWS SDK's default provider chain (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars, shared config, or instance role)
AWS.config.update({
    region: process.env.AWS_REGION || 'ap-southeast-2'
});

// Define a function to handle AWS errors
function handleAWSError(res, e) {
    const error_message = `An error occurred while communicating with AWS: ${e}`;
    return res.status(500).json({ error: error_message });
}

// Define route for getting DB instance types
router.post('/instance_types', (req, res) => {
    const { engine, engine_version } = req.body;

    if (!engine || !engine_version) {
        return res.status(400).json({ error: 'Engine option and engine version are required' });
    }

    const rds = new AWS.RDS();

    rds.describeOrderableDBInstanceOptions({
        Engine: engine,
        EngineVersion: engine_version,
        MaxRecords: 1000
    }, (err, data) => {
        if (err) {
            return handleAWSError(res, err);
        }

        const instance_types = data.OrderableDBInstanceOptions.map(option => option);

        return res.json({ instance_types });
    });
});

module.exports = router;
