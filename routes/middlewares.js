// 접근 권한 제어 미들웨이 (로그인 여부 판단)
// 로그인 중이면 req.isAuthenticated() 가 true, 아니면 false
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};