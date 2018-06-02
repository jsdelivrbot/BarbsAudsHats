'use strict'

const express = require('express')
const app = express()

const mongoose = require('mongoose');

const morgan       = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');
const cookieParser = require('cookie-parser');

const http = require('http')
const path = require('path')
const passport = require('passport');  
const LocalStrategy = require('passport-local').Strategy; 
const session = require('express-session');
const flash    = require('connect-flash');

const fileUpload = require('express-fileupload');
const util = require('util');
const concat = require('concat');
var fs = require('file-system');
const reload = require('reload');
var compressor = require('node-minify');

require('./config/passport')(passport);

concat(['./public/scss/fascinators.scss', './public/scss/index.scss', './public/scss/partials.scss', './public/scss/login.scss',
      './public/scss/main.scss', './public/scss/media-400.scss', './public/scss/media-600.scss', 
      './public/scss/media-1000.scss',  './public/scss/screen-450.scss'], 
      './public/scss/style-concat.scss');

var sass = require('node-sass');
sass.render({
  file: './public/scss/style-concat.scss',
  outFile: './public/css/style-min.css'
}, function(err, result) {
  console.log(result)
  fs.writeFile('./public/css/style-min.css', result.css);
});

mongoose.connect('mongodb://alex:12frogs@ds245250.mlab.com:45250/heroku_0sl6xq74', function(err, db){
  // console.log(err);
  // console.log(db);
}); // connect to our database

app.use(fileUpload());

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


require('./routes.js')(app, passport, fileUpload, util);


app.use(express.static('public'));

const server = http.createServer(app)

// Reload script
reload(app)

server.listen(3000, '0.0.0.0',function () {
  console.log(mongoose.connection.readyState);
  console.log('Example app listening on port 3000!')
})
