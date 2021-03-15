var express = require('express');
const passport = require('passport');
const userModel = require('./users');
// const Tweet = require('./tweet');
var router = express.Router();

const localStrategy = require('passport-local');
const { post } = require('../app');
const tweetModel = require('./tweet');
const { session } = require('passport');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index')
});

// get login page
router.get('/login',function(req,res){
  res.render('login')
});

// get profile page
router.get('/profile',function(req,res){
  res.render('profile')
})

// get signup page 
router.get('/signup',function(req,res){
  res.render('index')
})

// passport part

router.post('/reg',function(req,res){
  var newUser = new userModel({
    username:req.body.username
  })
  userModel.register(newUser,req.body.password)
  .then(function(u){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')

    })
  })
  .catch(function(e){
    res.send(e);
  })
})

router.post('/login', passport.authenticate('local',
{
  successRedirect: '/profile',
  failureRedirect:'/'
}),function(req,res,next){});


router.get('/logout',function(req,res,next){
  req.logOut();
  res.redirect('/');
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}


// tweet post feature
router.post('/tweet',function(req,res){
  userModel.
  findOne({
    username: req.session.passport.user})
    .then(function(foundUser){
    tweetModel.create({
      caption: req.body.caption,
      userid:foundUser
     
    }).then(function(createdTweet){
      foundUser.tweet.push(createdTweet);
      foundUser.save().then(function(savedet){
        res.send(savedet)
      })
    })
  })
})
 


router.post('/profile',function(req,res){
  userModel.
  findOne({
    username: req.session.passport.user
  })
  .populate('tweet')
  .then(function(foundUser){
    res.send(foundUser)
   
   
  })
})

router.get('/likes/:id',function(req,res){
  userModel.findOne({
    username:req.session.passport.user
  })
  .then(function(foundUser){
    tweetModel
    .findOne({_id: req.params.id})
    .then(function(foundtweet){
      if(foundtweet.likes.indexOf(foundUser._id )=== -1){
        foundtweet.likes.push(foundUser._id);

      }
      else{
        foundtweet.likes.splice(foundtweet.likes.indexOf(foundUser._id ),1) ;
      }
      foundtweet.save().then(function(savedtweet){
        res.send(savedtweet);
      })
    })
      
    
  })
})







module.exports = router;
