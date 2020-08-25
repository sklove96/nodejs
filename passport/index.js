const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => { // 사용자 정보 담겨있음
        // 로그인 시 실행 , 사용자 정보 저장
        // 매개변수로 user 받고
        done(null, user.id); // done 함수에 두 번째 인수로 user.id 넘김
    });

    passport.deserializeUser((id, done) => { // 여기서 id는 위에서의 user.id 받아온 것
        // 매 요청 시 실행, 사용자 정보 객체 불러옴
        // 위에서 저장했던 아이디 받아 데이터베이스에서 사용자 정보 조회
        User.findOne({ where: { id } })
           .then(user => done(null, user))
           .catch(err => done(err));
    });

    local();
    kakao();
}

