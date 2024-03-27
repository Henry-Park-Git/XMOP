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

// Define route to create a new security group with specified rules
app.post('/create-security-group', (req, res) => {
    // Get parameters from request body
    const { region, groupName, description, inboundRules } = req.body;

    if (!groupName || !description || !inboundRules) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create an EC2 client
    const ec2 = new AWS.EC2({ region });

    // Create security group with specified inbound rules
    ec2.createSecurityGroup({ GroupName: groupName, Description: description }, (err, data) => {
        if (err) {
            return handleAWSError(res, err);
        }

        const groupId = data.GroupId;

        // Authorize inbound rules
        ec2.authorizeSecurityGroupIngress({ GroupId: groupId, IpPermissions: inboundRules }, (err) => {
            if (err) {
                return handleAWSError(res, err);
            }

            return res.json({ message: 'Security group created successfully' });
        });
    });
});

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});