const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();
app.use(bodyParser.json());

// Set AWS credentials
AWS.config.update({
    accessKeyId: '/*Put your details*/',
    secretAccessKey: '/*Put your details*/',
});

// Define a function to handle AWS errors
function handleAWSError(res, e) {
    const error_message = `An error occurred while communicating with AWS: ${e}`;
    return res.status(500).json({ error: error_message });
}

// Define route for getting availability zones
app.post('/availability_zones', (req, res) => {
    // Get region from request body
    const { region } = req.body;

    if (!region) {
        return res.status(400).json({ error: 'Region not provided' });
    }

    // Create an EC2 client with the specified region
    const ec2 = new AWS.EC2({ region });

    // Describe availability zones
    ec2.describeAvailabilityZones((err, data) => {
        if (err) {
            return handleAWSError(res, err);
        }

        const availability_zones = data.AvailabilityZones.map(zone => zone.ZoneName);
        return res.json({ availability_zones });
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
