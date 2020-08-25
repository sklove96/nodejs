const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

// 카카오 로그인에 대한 설정
module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID, //카카오에서 발급해주는 아이디
    callbackURL: '/auth/kakao/callback', //카카오로부터 인증 결과를 받을 라우터 주소
  }, async (accessToken, refreshToken, profile, done) => { // 카카오 통해 회원가입한 사용자 있는지 조회
    console.log('kakao profile', profile);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'kakao' },
      });
      if (exUser) {
        done(null, exUser);
      } else { // 회원가입한 사용자 없다면 여기로와서 실행
        const newUser = await User.create({
          email: profile._json && profile._json.kaccount_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
