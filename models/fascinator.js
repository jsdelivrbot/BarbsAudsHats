// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
var fascinatorSchema = new Schema({
        id        : { type: String, required: true, unique: true },
        price     : { type: String, required: true }, 
        image     : { type: String, required: true}
});

var Fascinator = mongoose.model('fascinator', fascinatorSchema);
 


// create the model for users and expose it to our app
module.exports = Fascinator;