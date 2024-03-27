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

// Define route to get all security groups in a region
app.post('/security-groups', (req, res) => {
    // Get region from request body
    const { region } = req.body;

    if (!region) {
        return res.status(400).json({ error: 'Region not provided' });
    }

    // Create an EC2 client with the specified region
    const ec2 = new AWS.EC2({ region });

    // Describe security groups in the specified region
    ec2.describeSecurityGroups({}, (err, data) => {
        if (err) {
            return handleAWSError(res, err);
        }

        try {
            // Extract security group names
            const securityGroups = data.SecurityGroups.map(group => group.GroupName);

            return res.json({ securityGroups });
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
