const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

function hash(password) {
    return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
}

const Account = new Schema({
    profile: {
        username: String,
        thumbnail: { type: String, default: '/static/images/defualt_thumbnail.png'}
    },
    email: { type: String },
    // 소셜 계정으로 회원가입을 할 경우에는 각 서비스에서 제공되는 id와 accessToken을 저장함.
    social: {
        facebook: {
            id: String,
            accessToken: String
        },
        google: {
            id: String,
            accessToken: String
        }
    },
    password: String,   // 로컬 계정의 경우에는 비밀번호를 해싱해서 저장함.
    thoughtCount: { type: Number, default: 0 }, // 서비스에서 포스트를 작성할 때마다 1씩  올라감
    createdAt:  { type: Date, default: Date.now }
});

Account.statics.findByUsername = function(username) {
    // 객체에 내장되어 있는 값을 사용할 때는 객체명.키 이런식으로 퀴리를 실행하면 됨.
    return this.findOne({'profile.username': username}).exec();
};

Account.statics.findByEmail = function(email) {
    return this.findOne({email}).exec();
};

Account.statics.findByEmailOrUsername = function({username, email}) {
    return this.findOne({
        // $or 연산자를 통해 둘 중에 하나를 만족하는 데이터를 찾음
        $or: [
            { 'profile.username':username },
            { email }
        ]
    }).exec();
};

Account.statics.localRegister = function({ username, email, password }) {
    // 데이터를 생성할 때에는 new this() 를 사용함.
    const account = new this({
        profile: {
            username
            // thumbnail 값을 설정하지 않으면 기본값으로 설정됨.
        },
        email,
        password: hash(password)
    });

    return account.save();
};

Account.methods.validatePassword = function(password) {
    // 함수로 전달받은 password의 해시값과, 데이터에 담겨있는 해시값과 비교함
    const hashed = hash(password);
    return this.password === hashed;
};

module.exports = mongoose.model('Account', Account);