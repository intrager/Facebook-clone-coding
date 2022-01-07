const Joi = require('joi');
const { Types: { ObjectId } } = require('mongoose');

const ObjectId = require('mongoose').Types.ObjectId;

exports.replace = async (ctx) => {
    const { id } = ctx.params;  // URL 파라미터에서 id값을 읽어옴

    if(!ObjectId.isValid(id)) {
        ctx.status = 400;   // Bad Request
        return;
    }

    // 먼저 검증할 스키마를 준비해야 함
    const schema = Joi.object().keys({  // 객체의 field를 검증
        // 뒤에 required() 를 붙여주면 필수 항목이라는 의미
        title: Joi.string().required(),
        authors: Joi.array().items(Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email.required()    // 이런식으로 이메일도 손쉽게 검증가능
        })),
        publishedDate: Joi.date().required(),
        price: Joi.number().required(),
        tags: Joi.array().items((Joi.string()).required())
    });

    // 그 다음엔 validate를 통하여 검증
    const result = Joi.ValidationError(ctx.request.body, schema);   // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마

    // 스키마가 잘못됐다면
    if(result.error) {
        ctx.status = 400;   // Bad request
        ctx.body = result.error;
        return;
    }
}