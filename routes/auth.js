const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc authenticate with google
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] })) //authenticate with google strategy (created in passport.js file), get scope of whatever is included in profile 

// @desc Google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => { //if fails, redirects to root
    res.redirect('/dashboard') //if successful, redirect to dashboard
})

// @desc Logout user
// @route /auth/logout
router.get('/logout', (req, res) => {
    req.logout( error => {
        if (error) { return next(error) }
        res.redirect('/') 
    })
    
})

module.exports = router