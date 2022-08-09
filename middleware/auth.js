//middleware is just a function that has access to the request and response objects
module.exports = {
    ensureAuth: function(req, res, next) { //redirects to home page if user is logged out
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: function(req, res, next) {
        if (req.isAuthenticated()) {    //redirect to dashboard if use is authenticated
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}