const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

//회원가입
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) { //이메일 중복시 회원가입 창으로 돌려보냄.
            return res.redirect('/join?error=exist');
        } //중복 아닐시 회원가입 시켜줌
        const hash = await bcrypt.hash(password, 12);
        // 비번 암호화 & 비번 12자리 이상으로 설정하도록
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    }   catch (error) {
        console.error(error);
        return next(error);
    }
});

// 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) { //실패
            console.error(authError);
            return next(authError);
        }
        if (!user) { //성공
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
              }
              return res.redirect('/');
        });
    })(req, res, next); 
    // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙임
    // 사용자 정의 기능 추가하고 싶을 때 미들웨어 내에 미들웨어 추가 가능
});

// 로그아웃
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(); // req.user 객체 제거
    req.session.destroy(); // req.session 객체의 내용 제거
    res.redirect('/');
  });
  
  // 카카오 로그인 라우터 생성
  router.get('/kakao', passport.authenticate('kakao')); // 카카오 로그인 과정 시작
  
  router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
  }), (req, res) => {
    res.redirect('/');
  });
  
  module.exports = router;
  









