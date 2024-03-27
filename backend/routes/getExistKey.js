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
    const error_message = `An error occurred while communicating with AWS: ${e.message}`;
    console.error(error_message);
    return res.status(500).json({ error: error_message });
}

// Define route to get available key pairs in a region
app.get('/key-pairs', (req, res) => {
    // Get region from query parameters
    const region = req.query.region;

    if (!region) {
        return res.status(400).json({ error: 'Region not provided' });
    }

    // Create an EC2 client with the specified region
    const ec2 = new AWS.EC2({ region });

    // Describe key pairs in the specified region
    ec2.describeKeyPairs({}, (err, data) => {
        if (err) {
            return handleAWSError(res, err);
        }

        try {
            // Extract key pair names
            const keyPairs = data.KeyPairs.map(pair => pair.KeyName);

            return res.json({ keyPairs });
        } catch (error) {
            return handleAWSError(res, error);
        }
    });
});

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
