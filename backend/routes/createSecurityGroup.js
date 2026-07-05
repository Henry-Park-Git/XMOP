const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router(); // 'router' 인스턴스 생성

// AWS.config.update 부분과 함수 정의는 변경 없이 유지

// Credentials are resolved by the AWS SDK's default provider chain (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars, shared config, or instance role)

// Define a function to handle AWS errors
function handleAWSError(res, e) {
    const error_message = `An error occurred while communicating with AWS: ${e.message}`;
    console.error(error_message);
    return res.status(500).json({ error: error_message });
}

// Define route to create a new security group with specified rules
router.post('/create-security-group', (req, res) => {
    const { region, groupName, description, inboundRules } = req.body;

    if (!groupName || !description || !Array.isArray(inboundRules) || inboundRules.length === 0) {
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
