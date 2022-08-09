const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        const newUser = { //object here must match with profile schema
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }

        try {
            let user = await User.findOne({ googleId: profile.id})

            if (user) { //if user exists, call callback and pass user in
                done(null, user)
            } else { //if user does not exist, then create a user (newUser info gets stored in mongodb)
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (err) {
            console.error(err)
        }
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}

