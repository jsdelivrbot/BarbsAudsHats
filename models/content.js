// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

// define the schema for our user model
var contentSchema = new Schema({
        page: { type : String , unique : true, required : true},
                content: [{
                        text      : { type: String, required: true},
                        type     : { type: String, required: true }, 
                }]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('content', contentSchema);