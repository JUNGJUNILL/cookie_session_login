const express= require('express'); 
const cookieParser = require('cookie-parser'); 
const morgan = require('morgan');
const path   = require('path'); 
const session = require('express-session'); 
const flash   =require('connect-flash'); 
const passport = require('passport'); 
require('dotenv').config(); 

const pageRouter = require('./routes/page'); 
const authRouter = require('./routes/auth'); 
const {sequelize} = require('./models'); 
const passportConfig = require('./passport'); 
//require('./passport')는  require('./passport/index.js')와 같다.
//폴더 내의 index.js 파일은 require시 이름을 생략할 수 있다. 

const app = express(); 
sequelize.sync(); 
passportConfig(passport); 

app.set('views',path.join(__dirname,'views')); 
app.set('view engine','pug'); 
app.set('port',process.env.PORT || 8001); 

app.use(morgan('dev')); 
app.use(express.static(path.join(__dirname,'public'))); 

//----------------------------------------------------start body-parser
app.use(express.json());
app.use(express.urlencoded({extended:false})); 
                              //false 인 경우 
                              //노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, 
                              //true면 qs 모듈을 사용하여 쿼리스트링을 해석한다. 
                              //qs 모듈은 내장 모듈이 아니라 npm 패키지이며, querystring 모듈의 기능을 조금 더 확장한 모듈이다. 

//요청의 본문을 해석해주는 미들웨어입니다. 보통 폼 데이터나 AJAX 요청의 데이터를 처리한다.
//하지만 express 4.16.0 버전부터 body-parser의 일부기능이 익스프레스에 내장되어 있어 
// require('body-parser'); 모듈을 설치 하지 않아도 된다.
/*
var bodyParser = require('body-parser'); 
...
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
*/

//----------------------------------------------------end body-parser

app.use(cookieParser(process.env.COOKIE_SECRET)); 
//요청에 동봉된 쿠키를 해석해줍니다. 
//해석된 쿠키들은 req.cookies 객체에 들어갑니다. 
//예를 들어 name=zerocho 쿠키를 보냈다면 req.cookies는 {name:'zerocho'} 가 됩니다. 

//app.use(cookieParser('nodebirdsecret'));
//이와 같이 첫 번째 인자로 문자열을 넣어줄 수 있습니다. 
//이제 쿠키들은 제공한 문자열로 서명된 쿠키가 됩니다. 
//서명된 쿠키는 클라이언트에서 수정했을 때 에러가 발생하므로 클라이언트에서 쿠키로 위함한 행동을 하는 것을 방지할 수 있습니다. 


app.use(session({
    resave : false,
    //요청이 왔을 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지에 대한 설정 
    //세션을 항상 저장할지 여부를 저장하는 값(false권장)

    saveUninitialized : false,
    //세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정, 보통 방문자를 추적할 때 사용 

    secret : process.env.COOKIE_SECRET ,
    //필수항목으로 cookie-parser의 비밀키와 같은 역할을 합니다. 
    //세션을 암호화 해줌

    cookie : {
        
    //1000이 1초이다.
    //1000 * 60 * 60 1시간 후 ,1000 * 60 * 120 2시간 후, 1000 * 60 * 180 3시간후.. 
      maxAge   : 1000 * 60 * 60, //세션 만료시간 설정
      httpOnly : true,
      secure : false, 
    },

}));

app.use(flash()); 
app.use(passport.initialize()); //req에 passport설정을 심는다. 
app.use(passport.session());    //req.session에 passport 정보를 저장 
                                //req.session객체는 express-session에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 
                                //연결해야 한다. 

app.use('/',pageRouter); 
app.use('/auth',authRouter); 
app.use((req,res,next)=>{
    const err = new Error('Not Fount'); 
    err.status = 404; 
    next(err); 
});

app.use((err,req,res)=>{

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'develoment'? err:{}; 
    res.status(err.status || 500);
    res.render('error'); 

}); 

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),' 번 포트에서 대기 중'); 
}); 