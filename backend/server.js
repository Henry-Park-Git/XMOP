// express 모듈을 먼저 불러옵니다.
const express = require('express');
const app = express();

// cors 모듈을 불러옵니다.
const cors = require('cors');

// cors를 사용하기 전에 express.json()과 express.urlencoded() 미들웨어를 사용하는 것이 좋습니다.
// 이는 POST 및 PUT 요청에서 넘어오는 데이터를 쉽게 처리하기 위함입니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors 설정을 활성화합니다. 모든 도메인에서의 요청을 허용하려면 이렇게 설정할 수 있습니다.
app.use(cors({
    origin: '*' // 이 부분을 특정 도메인으로 제한하고 싶다면, '*' 대신 'http://localhost:3001' 같은 도메인을 설정하면 됩니다.
}));

// 'getRegion.js' 파일이 위치한 경로에 맞게 'require' 경로를 수정합니다.
const regionsRouter = require('./routes/getRegion');
app.use('/api', regionsRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
