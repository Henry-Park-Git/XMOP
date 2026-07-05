require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3001' }));

if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable must be set (see backend/.env.example)');
}

// Require a shared secret on every request so this AWS-mutating API isn't open to the internet
app.use((req, res, next) => {
    if (req.header('x-api-key') !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});

const regionsRouter = require('./routes/getRegion');
app.use('/', regionsRouter);

const keyPairsRouter = require('./routes/getExistKey');
app.use('/', keyPairsRouter);

const securityGroupsRouter = require('./routes/getSecurityGroup');
app.use('/', securityGroupsRouter);

const createSecurityGroupRouter = require('./routes/createSecurityGroup');
app.use('/', createSecurityGroupRouter);

const getDBTypeRouter = require('./routes/getDBType');
app.use('/', getDBTypeRouter);

// 'getEngineVer.js' 라우터 추가
const getEngineVerRouter = require('./routes/getEngineVer');
app.use('/', getEngineVerRouter); // '/' 경로에 라우터를 추가합니다.

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
