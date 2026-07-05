const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Credentials are resolved by the AWS SDK's default provider chain (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars, shared config, or instance role)

// Define a function to handle AWS errors
function handleAWSError(res, e) {
    const error_message = `An error occurred while communicating with AWS: ${e.message}`;
    console.error(error_message);
    return res.status(500).json({ error: error_message });
}

// Define route to create a key pair and allow user to download it
app.post('/download-keypair', (req, res) => {
    // Generate a unique key pair name
    const { region, keyName } = req.body;

    if (!keyName || !/^[a-zA-Z0-9_-]+$/.test(keyName)) {
        return res.status(400).json({ error: 'Invalid key name' });
    }

    // Create an EC2 client
    const ec2 = new AWS.EC2({ region });

    // Create key pair
    ec2.createKeyPair({ KeyName: keyName }, (err, data) => {
        if (err) {
            return handleAWSError(res, err);
        }

        try {
            // Extract private key from response
            const privateKey = data.KeyMaterial;

            // Save private key to a file
            const filename = `${keyName}.pem`;
            fs.writeFileSync(filename, privateKey);

            // Provide the file for download
            res.download(filename, filename, (err) => {
                if (err) {
                    console.error(`Error downloading file: ${err.message}`);
                }

                // Cleanup: Delete the private key file
                fs.unlinkSync(filename);
            });
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
