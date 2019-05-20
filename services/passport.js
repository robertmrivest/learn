const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id,done) =>{
  User.findById(id).then((user) => {
     done(null,user)
  })
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: 'localhost:5000/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          console.log('We have a user We are done');
          done(null, existingUser);
        } else {
          new User({ googleId: profile.id })
            .save()
            .then(user => {
              console.log('A new User !! - We have a user We are done');
              done(null, user);
            })
            .catch(err => {
              console.log('This is the User Error', err);
            })
            .catch(err => {
              console.log('This is the All Error', err);
            });
        }
      });

      console.log('Access Token', accessToken);
      console.log('refresh Token', refreshToken);
      console.log('Profile', profile.id);
    }
  )
);