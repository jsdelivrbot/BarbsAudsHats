'use strict'

const express = require('express')
const app = express()

const mongoose = require('mongoose');

const morgan       = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');
var cookieParser = require('cookie-parser');

const http = require('http')
const path = require('path')
const passport = require('passport');  
const LocalStrategy = require('passport-local').Strategy; 
const session = require('express-session');
const flash    = require('connect-flash');


const reload = require('reload');

require('./config/passport')(passport);

mongoose.connect('mongodb://localhost:27017/barbsaudshats'); // connect to our database



app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes.js')(app, passport);

//static filse prefix
app.use(express.static('public'));



const server = http.createServer(app)

// Reload script
reload(app)


server.listen(3000, '0.0.0.0',function () {
  console.log('Example app listening on port 3000!')
})
