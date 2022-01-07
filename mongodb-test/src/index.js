require('dotenv').config(); // .env 파일에서 환경변수 불러오기

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

mongoose.Promise = global.Promise;  // Node의 네이티브 Promise 사용
// mongodb 연결
mongoose.connect(process.env.MONGO_URI).then(
    (response) => {
        console.log('Successfully connected to mongodb');
    }
).catch(e => {
    console.error(e);
});

const port = process.env.PORT || 4000;  // PORT 값이 설정되어 있지 않다면 4000 사용

app.use(bodyParser());  // 바디파서 적용, 라우터 적용코드보다 상단에 있어야 함.

router.use('/api', api.routes());   // api 라우트를 /api 경로 하위 라우트로 설정

// 순서 주의
app.use(router.routes()).use(router.allowedMethods());

app.use(async ctx => {
    // 아무것도 없으면 {} 가 반환됩니다.
    ctx.body = ctx.request.body;
});
// 순서 주의

app.listen(port, () => {
    console.log('heurm server is listening to port ' + port);
});

const crypto = require('crypto');

const password = 'abc123';
const secret = 'MySecretKey1$1$234';

const hashed = crypto.createHmac('sha256', secret).update(password).digest('hex');

console.log(hashed);
// router.get('/', (ctx, next) => {
//     ctx.body = '홈';
// });

// router.get('/about', (ctx, next) => {
//     ctx.body = '소개';
// });

// router.get('/about/:name', (ctx, next) => {
//     const { name } = ctx.params;    // 라우트 경로에서 :파라미터명 으로 정의된 값이 ctx.params 안에 설정됨.
//     ctx.body = name + '의 소개';
// });

// router.get('/post', (ctx, next) => {
//     const { id } = ctx.request.query;   // 주소 뒤에 ?id=101 이런 식으로 작성된 쿼리는 ctx.request.query에 파싱됩니다.
//     if(id) {
//         ctx.body = '포스트 #' + id;
//     } else {
//         ctx.body = '포스트 아이디가 없습니다.';
//     }
// });