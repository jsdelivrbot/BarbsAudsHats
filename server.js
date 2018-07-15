'use strict'

//Express
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
require('dotenv').config();

let server;

//Dev
const reload = require('reload');

//Authentication
const passport = require('passport');  
const session = require('express-session');
const flash    = require('connect-flash');
require('./config/passport')(passport);
let credentials;

//Mongo
const mongoose = require('mongoose');
const morgan       = require('morgan');
mongoose.connect(process.env.MONGO_DB, function(err, db){
  if(process.env.ENVIRONMENT === 'DEV' && err){
    console.log(err);
  }
}); 

//File handling
const fileUpload = require('express-fileupload');
const util = require('util');
const fs = require('file-system');

const aws = require('aws-sdk');
aws.config.update({region: 'us-west-2'});
credentials = new aws.Credentials(process.env.S3_KEY, process.env.S3_SECRET);
aws.config.credentials = credentials;
const s3 = new aws.S3({apiVersion: '2006-03-01'});
                    
// Call S3 to list current buckets
s3.listBuckets(function(err, data) {
   if (err) {
      console.log("Error", err);
   } else {
      console.log("Bucket List", data.Buckets);
   }
});


//CSS
const concat = require('concat');
const sass = require('node-sass');
concat(['./public/scss/fascinators.scss', './public/scss/index.scss', './public/scss/partials.scss', './public/scss/login.scss',
      './public/scss/main.scss', './public/scss/media-400.scss', './public/scss/media-600.scss', 
      './public/scss/media-1000.scss',  './public/scss/screen-450.scss'], 
      './public/scss/style-concat.scss');
sass.render({
  file: './public/scss/style-concat.scss',
  outFile: './public/css/style-min.css'
}, function(err, result) {
  fs.writeFile('./public/css/style-min.css', result.css);
});

//SEO
const SitemapGenerator = require('sitemap-generator');
const generator = SitemapGenerator('http://www.barbsaudshats.co.uk/', {
  filepath: './sitemap.xml',
  maxEntriesPerFile: 500,
  stripQuerystring: true
});
generator.on('done', () => {
});
generator.start();

//Text content
//let textService = '';
 const TextController = require('./controller/textController');
// TextController.text_find_all_get().then(function(result){
//   textService = result;
// });

app.use(express.static('public'));
app.use(express.static('sitemap.xml'));
app.use(fileUpload());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set up ejs for templating
if(process.env.ENVIRONMENT === 'DEV'){
  app.use(morgan('dev')); // log every request to the console
}
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes.js')(app, passport, fileUpload, util, aws, TextController.text_find_all_get());

server = http.createServer(app)

// Reload script
if(process.env.ENVIRONMENT === 'DEV'){
  reload(app)
}


server.listen(process.env.PORT ||3000, '0.0.0.0',function () {
  console.log('Example app listening on port 3000!')
});
