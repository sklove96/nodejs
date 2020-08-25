const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 라우터용 미들웨어 만들어 변수 설정
    res.locals.use = req.user;  // user 객체를 통해 사용자 정보에 접근
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    // res.locals 변수 설정한 이유: 세 가지 변수를 모든 템플릿 엔진에서 공통 사용하기 때문.

    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeSns'});
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title : '회원가입 - Sns'});
});

router.get('/', (req, res, next) => {
    const twits = []; //현재는 빈 배열로 선언, 나중에 값 넣어줄거임.
    res.render('main', {
        title: 'Sns',
        twits,
    });
});

module.exports = router;