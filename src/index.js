const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');

router.use('/api', api.routes());   // api 라우트를 /api 경로 하위 라우트로 설정

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
    console.log('heurm server is listening to port 3000');
});

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