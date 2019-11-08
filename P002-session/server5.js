const http =require('http'); 
const fs   =require('fs'); 
const url  =require('url'); 
const qs   =require('querystring'); 


const parseCookies = (cookie='')=>


    cookie
    .split(';')
    .map(v=>v.split('='))
    .map(([k,...vs])=>[k, vs.join('=')])
    .reduce((acc,[k,v])=>{

        acc[k] = decodeURIComponent(v); 
        return acc; 
    },{});

    const session = {}; 

    http.createServer((req,res)=>{
    const cookies = parseCookies(req.headers.cookie);

    if(req.url.startsWith('/login')){

        const {query} = url.parse(req.url); 
        const {name}  = qs.parse(query); 
        const expires = new Date(); 
        expires.setMinutes(expires.getMinutes()+3); 
        
        const randomInt = +new Date(); 
        
        session[randomInt] = {
            name,
            expires,
        }; 

        res.writeHead(302,{
            Location:'/',       //▼헤더 값은 한글이 들어갈 수 없어서 인코등해 줬다.
            'Set-Cookie':`session=${randomInt};Expires=${expires.toUTCString()};HttpOnly;Path=/`,
             //Set-Cookie 로 쿠키명 session 값 randomInt했으므로 
        });

        res.end(); 

    }else if(cookies.session && (session[cookies.session].expires > new Date())){
     
        res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}); 
        res.end(`${session[cookies.session].name}님 안녕하세요`); 

    }else{
        fs.readFile('./P001-cookie/server4.html',(err,data)=>{

            if(err){
                throw err
            }

            res.end(data); 

        });
    }
}).listen(9995,()=>{
    console.log('9995번 포트에서 서버 대기 중입니다.'); 
});