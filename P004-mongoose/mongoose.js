const mongoose = require('mongoose'); 
const MONGO_URL= "mongodb://jun:wnsdlf!213@localhost:27017/admin"; 


mongoose.connect(MONGO_URL,{useNewUrlParser:true}); 

const db = mongoose.connection; 
db.on('error',console.error.bind(console,'connection error')); 
db.once('open',()=>{
    console.log('connection 성공'); 
}); 


const kittySchema = new mongoose.Schema({
    name:String, 
    nickName:String, 
}); 

kittySchema.methods.speak = function () {
    var greeting = this.nickName
      ? "Meow name is " + this.nickName
      : "I don't have a name";
    console.log(greeting);
  }

const Kitten = mongoose.model('Kitten',kittySchema); 


var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"

var nick = new Kitten({nickName : 'helloCat'}); 
nick.speak();
/*
nick.save(function (err, nick) {
    if (err) return console.error(err);
    
  });


fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
    fluffy.speak();
  });
*/

const array = Kitten.find({ name: /^fluff/ });

