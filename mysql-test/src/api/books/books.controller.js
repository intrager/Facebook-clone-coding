exports.list = (ctx) => {
    ctx.body = 'listed';
};

exports.create = (ctx) => {
    ctx.body = 'created';
};

exports.delete = (ctx) => {
    ctx.body = 'deleted';
};

exports.replace = (ctx) => {
    ctx.body = 'replaced';
};

exports.update = (ctx) => {
    ctx.body = 'updated';
};

/**
 * exports.변수명 = ... 은
 * const 모듈명 = require('파일명');
 * 모듈명.변수명 
 * 처럼 사용 가능
 * 
 * 내보낼 때는 일반 변수값을 내보낼 수도 있고, 함수를 내보낼 수도 있음. 
 * */ 

