const express = require('express'); 

const router = express.Router();



router.get('/profile',(req,res)=>{

    res.render('profile',{title:'내 정보 - TEST', user: null});


}); 

router.get('/join',(req,res)=>{

    res.render('join',{
        title:'회원가입  -  TEST',
        user: null,
        joinError:req.flash('join Error'),                
    });


}); 



router.get('/',(req,res,next)=>{

    res.render('main',{
        title:'TEST',
        twits:[],
        user:null,
        loginError:req.flash('loginError'),
    });

}); 

module.exports = router; 
