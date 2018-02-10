// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

// define the schema for our user model
var fascinatorSchema = new Schema({
        code      : { type: String, required: true},
        price     : { type: String, required: true }, 
        image     : { type: String, required: true}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('fascinator', fascinatorSchema);