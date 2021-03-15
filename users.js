 const mongoose = require('mongoose');
 const passportLocalMongoose = require('passport-local-mongoose');

 mongoose.connect('mongodb://localhost/sas');

 var userSchema = mongoose.Schema({
   username : String,
   password : String,
   tweet:[{
     type: mongoose.Schema.Types.ObjectId,
     ref:'tweet'
   }]
 })

 userSchema.plugin(passportLocalMongoose);

 module.exports = mongoose.model('user', userSchema);
 

 
