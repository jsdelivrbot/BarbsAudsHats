'use strict'

const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');

const http = require('http')
const path = require('path')

const reload = require('reload');
const logger = require('morgan');

const app = express()


const apiKey = 'pooch';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

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
app.get('/facinators', function(req, res) {
  var fascinators = [
    {code: "F001", price: "£9.99", image: "facinator_010.jpg"},
    {code: "F002", price: "£19.99", image: "facinator_003.jpg"},
    {code: "F003", price: "£29.99", image: "facinator_005.jpg"},
    {code: "F004", price: "£129.99", image: "facinator_006.jpg"},
    {code: "F005", price: "£529.99", image: "facinator_007.jpg"},
    {code: "F006", price: "£29.99", image: "facinator_008.jpg"},
    {code: "F007", price: "£129.99", image: "facinator_016.jpg"},
    {code: "F008", price: "£529.99", image: "facinator_011.jpg"},
    ]
	res.render('pages/facinators', {
    fascinators: fascinators
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

const server = http.createServer(app)

// Reload script
reload(app)


server.listen(3000, '0.0.0.0',function () {
  console.log('Example app listening on port 3000!')
})
