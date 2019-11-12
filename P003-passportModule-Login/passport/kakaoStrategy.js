const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,      //카카오에서 발급해주는 아이디
    callbackURL: '/auth/kakao/callback', //카카오로부터 인증 결과를 받을 라우터 주소 
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('profile --> ' , profile); 
      const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } });
    
      if (exUser) {
        done(null, exUser);


      } else {

        const newUser = await User.create({
          email: profile._json && profile._json.kakao_account.email,
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