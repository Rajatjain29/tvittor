
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var tweetSchema = mongoose.Schema({
    caption: String,
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
       ref:'user'
    }],
    retweets:{
        type:Number,
        default:0
    },
    time:{
        type:[Date],
        default:Date.now
    },
    userid:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
    }

  })
  
  
  
  module.exports = mongoose.model('tweet',tweetSchema);
   