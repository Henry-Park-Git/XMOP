const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

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
