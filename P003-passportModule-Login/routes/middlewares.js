exports.isLoggedIn = (req,res,next)=>{

    if(req.isAuthenticated()){
        //passport는 req객체에 isAuthenticated 메서드를 추가한다. 
        //로그인 중이면 true 
        
        
        next(); 
    }else{

        res.status(403).send('로그인 필요');
    }
}

exports.isNotLoggedIn = (req,res,next)=>{S
    if(!req.isAuthenticated()){;
        //로그인을 하지 않은 경우 false  

        next();
    }else{

        res.redirect('/');
    }
}