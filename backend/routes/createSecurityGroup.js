const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router(); // 'router' 인스턴스 생성

// AWS.config.update 부분과 함수 정의는 변경 없이 유지

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
router.post('/create-security-group', (req, res) => {
    const { region, groupName, description, inboundRules } = req.body;

    if (!groupName || !description || !inboundRules) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const ec2 = new AWS.EC2({ region });

    ec2.createSecurityGroup({ GroupName: groupName, Description: description }, (err, data) => {
        if (err) {
            return handleAWSError(res, err);
        }

        const groupId = data.GroupId;

        ec2.authorizeSecurityGroupIngress({ GroupId: groupId, IpPermissions: inboundRules }, (err) => {
            if (err) {
                return handleAWSError(res, err);
            }

            return res.json({ message: 'Security group created successfully' });
        });
    });
});

module.exports = router;
