const express= require('express');
const passport= require('passport'); 
const bcrypt   =require('bcrypt'); 
const {isLoggedIn,isNotLoggedIn} = require('./middlewares'); 
const {User} = require('../models'); 

const router = express.Router(); 


//회원가입 라우터
router.post('/join',isNotLoggedIn,async(req,res,next)=>{

    const {email,nick,password} = req.body; 

    try{

        const exUser = await User.findOne({where:{email}}); 
        
        if(exUser){
            
            req.flash('joinError','이미 가입된 이메일입니다.'); 
            return res.redirect('/join'); 
    
        }
        const hash = await bcrypt.hash(password,12); 
        await User.create({
           
            email,
            nick,
            password:hash,
            partCode:password,

        });
        return res.redirect('/'); 

    }catch(err){

        console.error(err); 
        return next(err);
    }
}); 


//로그인 라우터
router.post('/login',isNotLoggedIn,(req,res,next)=>{

        passport.authenticate('local',(authError,user,info)=>{
                //전략이 성공하거나 실패하면 authenticate 메서드에서 콜백 함수가 실행됩니다. 
                //콜백 함수의 첫 번째 인자 값이 있다면 실패한 것이다. 
                //두 번째 인자값이 있다면 성공한 것이고, req.login 메서드를 호출한다. 
                //Passport는 req 객체에 login, logout 메서드를 추가한다. 

                //req.login은 passport.serializeUser를 호출한다. 
                //

            if(authError){
                console.error('authError ---> ' , authError);
                return next(authError); 
            }

            if(!user){
                req.flash('loginError',info.message); 
                return res.redirect('/'); 

            }

            return req.login(user,(loginError)=>{
                   //req.login 메서드가 
                if(loginError){
                    console.error('loginError --->  ', loginError); 
                    return next(loginError); 
                }

                return res.redirect('/')

            }); 

        })(req,res,next);  

}); 

//카카오톡 버튼 누르면 실행된다. 
//GET /auth/kakao에서 카카오 로그인 창으로 리다이렉트 하고,
//결과를 /auth/kakao/callback으로 받는다. 
router.get('/kakao', passport.authenticate('kakao'));
//↓
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
  //passport.authenticate 메서드에서 콜백 함수를 제공하지 않는다. 
  //카카오 로그인은 내부적으로 req.login을 호출하므로 우리가 직접 호출할 필요가 없다.
  //콜백 함수 대신에 로그인에 실패했을 때 어디로 이동할지를 객체 안 failureRedirect 속성에 적어둔다.
}), (req, res) => {
    
  res.redirect('/');
});


//로그아웃 라우터 
router.get('/logout',isLoggedIn,(req,res)=>{

    req.logout(); 
    req.session.destroy(); 
    res.redirect('/'); 

});

module.exports = router;