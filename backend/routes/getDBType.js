const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();
app.use(bodyParser.json());

// Set AWS credentials
AWS.config.update({
    accessKeyId: '/*Put your details*/',
    secretAccessKey: '/*Put your details*/',
    region: "ap-southeast-2"
});

// Define a function to handle AWS errors
function handleAWSError(res, e) {
    const error_message = `An error occurred while communicating with AWS: ${e}`;
    return res.status(500).json({ error: error_message });
}

// Define route for getting DB instance types
app.post('/instance_types', (req, res) => {
    // Get engine options and engine version from request body
    const { engine, engine_version } = req.body;

    if (!engine || !engine_version) {
        return res.status(400).json({ error: 'Engine option and engine version are required' });
    }

    // Create an RDS client
    const rds = new AWS.RDS();

    // Describe available DB instance types
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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
