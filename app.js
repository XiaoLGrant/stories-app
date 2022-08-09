const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session') // middleware for this must be above passport middleware
const MongoStore = require('connect-mongo') //prevents user from being logged out any time changes are made to server
const connectDB = require('./config/db')


//Load config (where global variables are)
dotenv.config({ path: './config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//Handlebars
app.engine('.hbs', engine({ helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
}, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

//Sessions middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false, //don't save a session if nothing is modified
    saveUninitialized: false, //don't create a session until something is stored
    // cookie: { secure: true } remove here b/c it won't work without https
    store: MongoStore.create({ mongooseConnection: mongoose.connection, mongoUrl: process.env.MONGO_URI })
  }))

//Passport middlewawre
app.use(passport.initialize())
app.use(passport.session())

//Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))