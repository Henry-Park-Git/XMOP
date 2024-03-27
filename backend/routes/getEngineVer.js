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

// Define route for getting engine versions
app.post('/engine_versions', (req, res) => {
    // Get engine options from request body
    const { engine_type } = req.body;

    if (!engine_type) {
        return res.status(400).json({ error: 'Engine type not provided' });
    }

    // Create an RDS client
    const rds = new AWS.RDS();

    // Describe available engine versions
    rds.describeDBEngineVersions({ Engine: engine_type }, (err, data) => {
        if (err) {
            return handleAWSError(res, err);
        }

        const engine_versions = data.DBEngineVersions.map(version => version.EngineVersion);
        return res.json({ engine_versions });
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Engine options:
// aurora-mysql
// aurora-postgresql
// mariadb
// mysql
// postgres


//  https://instances.vantage.sh/rds/?region=ap-southeast-2