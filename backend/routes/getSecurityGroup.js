const express = require('express');
const bodyParser = require('body-parser');
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

// bodyParser.json() 미들웨어는 여기서는 제거합니다. 이는 서버 레벨에서 이미 적용되기 때문입니다.

// Define route to get all security groups in a region
router.post('/security-groups', (req, res) => {
    // 여기서의 로직은 변경 없이 유지
    const { region } = req.body;

    if (!region) {
        return res.status(400).json({ error: 'Region not provided' });
    }

    const ec2 = new AWS.EC2({ region });

    ec2.describeSecurityGroups({}, (err, data) => {
        if (err) {
            return handleAWSError(res, err);
        }

        try {
            const securityGroups = data.SecurityGroups.map(group => group.GroupName);
            return res.json({ securityGroups });
        } catch (error) {
            return handleAWSError(res, error);
        }
    });
});

module.exports = router;
