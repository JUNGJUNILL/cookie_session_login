const http = require('http'); 
const fs = require('fs'); 
const url = require('url'); 
const qs = require('querystring'); 


const parseCookies = (cookie='')=>


    cookie
    .split(';')
    .map(v=>v.split('='))
    .map(([k,...vs])=>[k, vs.join('=')])
    .reduce((acc,[k,v])=>{

        acc[k] = decodeURIComponent(v); 
        return acc; 
    },{});


http.createServer((req,res)=>{

    const cookies = parseCookies(req.headers.cookie); 
    console.log(cookie.session)
    if(req.url.startsWith('/login')){
      
        const {query} = url.parse(req.url);  // /login?name=이름 
        const {name} = qs.parse(query);      //  name : 이름 
        const expires = new Date(); 

        expires.setMinutes(expires.getMinutes()+1); //1분 후에 쿠키를 만료하게 만듬 

     //   console.log("req.url==>  " , req.url); 
     //   console.log("query-->"  + query); 
     //   console.log("name-->  " + name); 

        res.writeHead(302,{

            Location:'/',       //▼헤더 값은 한글이 들어갈 수 없어서 인코등해 줬다.
            'Set-Cookie':`name=${encodeURIComponent(name)};Expires=${expires.toUTCString()};HttpOnly;Path=/`,
            //쿠키의 구성요소
            // Expires : 쿠기 만료시간(만료시간 설정 안해놓으면 계속 쿠키가 살아있음)
            // Domain  : 쿠키가 사용되는 도메이나 (ex) domain=naver.com 이 값이 현재 탐색 중인 도메인과 일치하지 않을 경우 "타사 쿠기"로 간주되며 브라우저에서 거부)
            //                                  (이렇게 하여 한 도메인에서 다른 도메인에 대한 쿠키를 사용하지 못하게 설정)                            
            // Path    : 쿠키를 반환할 경로(ex) path=/ : 도메인의 루트 경로로 이동할 경우 쿠키가 전송 )
            // HttpOnly: Http외에 다른 통신 사용 가능 설정 
                           
        });
        res.end();


    }else if(cookies.name){
        
        res.writeHead(200,{'Content-Type':'text/html; charset=utf8'}); 
        res.end(`${cookies.name}님 안녕하세요`); 

    }else{
        fs.readFile('./P001-cookie/server4.html',(err,data)=>{

            if(err){
                throw err
            }

            res.end(data); 

        });
    }



})
.listen(9993,()=>{

    console.log('9993 포트에서 서버 대기 중입니다.'); 

})
