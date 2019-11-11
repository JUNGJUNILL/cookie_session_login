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


//로그아웃 라우터 
router.get('/',isLoggedIn,(req,res)=>{

    req.logout(); 
    req.session.destroy(); 
    res.redirect('/'); 

});