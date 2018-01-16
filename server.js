'use strict'

const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = 'pooch';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
	res.render('index', {dummy_variable: null, error: null});
})
app.post('/', function (req, res) {
  let dummy_input = req.body.dummy_input;
  let url = ``
request(url, function (err, response, body) {
    if(err){
      res.render('index', {dummy_variable: null, error: 'Error, please try again'});
    } else {
      let dummy_variable = JSON.parse(body)
      if(dummy_variable == undefined){
        res.render('index', {dummy_variable: null, error: 'Error, please try again'});
      } else {
        let dummy_text = `It's ${dummy_variable.main.dummy} text ${dummy_variable.name}!`;
        res.render('index', {dummy_variable: dummy_text, error: null});
      }
    }
  });
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
