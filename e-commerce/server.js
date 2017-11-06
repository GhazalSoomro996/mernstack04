const express = require('express')
const next = require('next')
const mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
       fs = require('fs');


const passportConf = require('./config/passport');
const secret = require('./config/secret');
const User = require('./models/user');
const Admin = require('./models/admin');


var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});
var NUMBER=[];
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

//Connect to Db
mongoose.connect(secret.database,(err)=>{
    if(err){console.error(err)}
    else{console.log("Database connected")}
})

app.prepare()
.then(() => {
  const server = express()

   //MIDDLEWARE
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({extended: false}))
  server.use(cookieParser())
  server.use(session({
    secret: process.env.SESSION_SECRET || secret.key,
    resave: true,
    saveUninitialized: false
  }))
  server.use(passport.initialize())
  server.use(passport.session())


  server.get('/',(req,res)=>{
      if(req.user){
          app.render(req,res,'/index',req.query);
      }else{
          res.redirect('/Options');
      }
  })


  // server.get('/login',(req,res) => {
  //
  // })

  // server.get('/getuser',(req,res)=>{
  //     res.json(req.user);
  // })

  server.post('/userlogin',passport.authenticate('user',{failureRedirect:'/Options'}),(req,res) => {
    var encrypted = key.encrypt(req.user, 'base64');
fs.writeFileSync('./config/userdata.info',encrypted);
res.redirect('/mainpage');
  })
  server.post('/adminlogin',passport.authenticate('admin',{failureRedirect:'/Options'}),(req,res) => {
    var encrypted = key.encrypt(req.user, 'base64');
fs.writeFileSync('./config/userdata.info',encrypted);
res.redirect('/mainpage');
  })

//gmail


server.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
server.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
        }));



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

// if user is authenticated in the session, carry on
if (req.isAuthenticated())
    return next();

// if they aren't redirect them to the home page
res.redirect('/');
}




  //fb
  //
  // // route for home page
  server.get('/', function(req, res) {
      res.render('index.ejs'); // load the index.ejs file
  });
  server.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    server.get('/auth/facebook/callback',passport.authenticate('facebook', { successRedirect : '/profile',failureRedirect : '/'
        }));
//     // route for logging out
    server.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}



  server.get('/userdata',(req,res)=>{
       var encrypted = fs.readFileSync('./config/userdata.info','utf-8');
       var decrypted = key.decrypt(encrypted, 'utf8');
  res.json(decrypted);
   })

  server.post('/signup',(req,res) => {
      var user = new User();
      user.username = req.body.username;
      user.password = req.body.password;
    //  res.redirect('/login')

      user.save((err,user) => {
          if(err){console.error("Error: ", err)}
          else{res.redirect('/userlogin')}
      })
  })
  server.post('/signupAdmin',(req,res) => {
      var admin = new Admin();
      admin.username = req.body.username;
      admin.password = req.body.password;
    //  res.redirect('/login')

      admin.save((err,admin) => {
          if(err){console.error("Error: ", err)}
          else{res.redirect('/adminlogin')}
      })
  })

  // server.post('/adminlogin',(req,res) => {
  //     var user = new Admin();
  //     user.username = req.body.username;
  //     user.password = req.body.password;
  //   //  res.redirect('/login')
  //
  //     user.save((err,user) => {
  //         if(err){console.error("Error: ", err)}
  //         else{res.redirect('/Options')}
  //     })
  // })


//   server.get('/numbers',(req,res) => {
//   User.find({},(err,resul) => {
//       zNUMBER.push(result.length);
//     })
//   })
// })

  server.get('/logout',(req,res)=>{
      if(req.user){
          req.logout();
          res.redirect('/Options');
      }else{
          res.redirect('/Options');
      }
  })



  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(secret.port, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:4000')
  })
})
