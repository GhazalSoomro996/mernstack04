const passport = require('passport');
const Strategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const Admin = require('../models/admin');
const configAuth = require('./auth');
const configAuth1 = require('./fbAuth');
let clientID;
let clientSecret;
let callback

// //PASSPORT STRATEGY
passport.use('user',new Strategy(function(username, password, done){
    User.findOne({username:username},function(err,user){
        if(err) return done(err);
        if(!user){
            return done(null,false);
        }
        if(!user.comparePassword(password)){
            return done(null,false);
        }
        return done(null,user);
    });
}));

passport.use('admin',new Strategy(function(username, password, done){
    Admin.findOne({username:username},function(err,user){
        if(err) return done(err);
        if(!user){
            return done(null,false);
        }
        if(!user.comparePassword(password)){
            return done(null,false);
        }
        return done(null,user);
    });
}));

// // facebook Strategy
passport.use(new FacebookStrategy({
       // pull in our app id and secret from our auth.js file
       clientID        : configAuth1.clientID,
       clientSecret    : configAuth1.clientSecret,
       callbackURL     : configAuth1.callbackURL
   },
   // facebook will send back the token and profile
   function(token, refreshToken, profile, done) {
       process.nextTick(function() {
           // find the user in the database based on their facebook id
           User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
               // if there is an error, stop everything and return that
               // ie an error connecting to the database
               if (err)
                   return done(err);
               // if the user is found, then log them in
               if (user) {
                   return done(null, user); // user found, return that user
               } else {
                   // if there is no user found with that facebook id, create them
                   var newUser = new User();
                   // set all of the facebook information in our user model
                   newUser.facebook.id    = profile.id; // set the users facebook id
                   newUser.facebook.token = token; // we will save the token that facebook provides to the user
                   newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                   newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                   // save our user to the database
                   newUser.save(function(err) {
                       if (err)
                           throw err;
                       // if successful, return the new user
                       return done(null, newUser);
                   });
               }
           });
       });
   }));


// GOOGLE

passport.use(new GoogleStrategy({

    clientID        : configAuth.clientID,
    clientSecret    : configAuth.clientSecret,
    callbackURL     : configAuth.callbackURL,
},
function(token, refreshToken, profile, done) {
    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {
        // try to find the user based on their google id
        User.findOne({ 'google.id' : profile.id }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                // if a user is found, log them in
                return done(null, user);
            } else {
                // if the user isnt in our database, create a new user
                var newUser = new User();
                // set all of the relevant information
                newUser.google.id    = profile.id;
                newUser.google.token = token;
                newUser.google.name  = profile.displayName;
                newUser.google.email = profile.emails[0].value; // pull the first email
                console.log(newUser)
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    });

}));



//passport Serialization
passport.serializeUser(function(user,done){
    done(null,user._id);
});

//passport Deserialize
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err) return done(err);
        if(user){
          done(null,user)

} else{
          Admin.findById(id,function(err,user){
              if(err) return done(err);
              if(user){
                done(null,user)
        }

})
}
})
})

module.exports = passport;
