'use strict'

const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;
const monk = require('monk');
const mongoose = require('mongoose');

const morgan       = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');

const http = require('http')
const path = require('path')
const passport = require('passport');  
const LocalStrategy = require('passport-local').Strategy; 
const session = require('express-session');
const flash    = require('connect-flash');

var Fascinator       		= require('./models/fascinator');


const reload = require('reload');

require('./config/passport')(passport);

app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'woot',
  resave: false, 
  saveUninitialized: false}));

	// required for passport
	app.use(passport.initialize());
	app.use(flash()); // use connect-flash for flash messages stored in session


  mongoose.connect('mongodb://localhost:27017/barbsaudshats'); // connect to our database

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

const apiKey = 'pooch';



app.get('/', function (req, res) {
		var title = "Barbs & Auds Hats and Facinators"
		var tagline = "Bespoke hats & facinators tailored to the event you're lucky enough to be attending"
	res.render('pages/index', {
			title: title, 
			tagline: tagline,
			error: null
			});
});
app.get('/about', function(req, res) {
	res.render('pages/about');
});

app.get('/login', function(req, res) {
	res.render('pages/login',{ message: req.flash('loginMessage') });
});

app.get('/facinators', function(req, res) {
    Fascinator.find({}, function(err, fascinators) {
    if (err) throw err;
  
    res.render('pages/facinators', {
      "fascinators" : fascinators
    });
    // object of all the users
    console.log(fascinators);
  });
});
app.post('/', function (req, res) {
  let dummy_input = req.body.dummy_input;
  let url = ``
request(url, function (err, response, body) {
    if(err){
      res.render('pages/index', {dummy_variable: null, error: 'Error, please try again'});
    } else {
      let dummy_variable = JSON.parse(body)
      if(dummy_variable == undefined){
        res.render('pages/index', {dummy_variable: null, error: 'Error, please try again'});
      } else {
        let dummy_text = `It's ${dummy_variable.main.dummy} text ${dummy_variable.name}!`;
        res.render('pages/index', {dummy_variable: dummy_text, error: null});
      }
    }
  });
})

app.post('/login', function(req, res){
  const user = {
     username : req.body.user,
     password : req.body.password
  }

  if(user.username === '' && user.password === ""){
    res.redirect('/')
  } else {
    res.redirect('login')
  }

});

// app.post('/login', passport.authenticate('local-login', {
//   successRedirect : '/', // redirect to the secure profile section
//   failureRedirect : '/login', // redirect back to the signup page if there is an error
//   failureFlash : true // allow flash messages
// }));

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

const server = http.createServer(app)

// Reload script
reload(app)


server.listen(3000, '0.0.0.0',function () {
  console.log('Example app listening on port 3000!')
})
