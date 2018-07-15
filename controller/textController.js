'use strict'
const Content = require('../models/content');
var loggedIn = false;

exports.text_create_update_post = function (req, callback) {
  var result =  Content.find()
    .where('content')
    .elemMatch({ type: req.body.id })
    .select({ 'content.$': 1 })
    .exec(function (err, results) {
      if (null === results) {
        saveNewContent(results);
      } else {
         return updateContent(results, req.body.text)
      }
    })
    return callback();
}
let saveNewContent = function (results) {
  console.log("New content saving...")
  var saveResult = content.save(function (err) {
    if (err) console.log("Problems saving :( - " + err)
    else {
      console.log(content + " <-- Saved this to db");
    }
  });
  return saveResult;
}

let updateContent = function (results, newData) {
  let updateData = {
    $set: {
      "content.$.text": newData
    }
  }

  var findResult = Content.findOneAndUpdate({ "content._id": results[0].content[0]._id }, updateData, { upsert: true, new: true }, function (err, response) {
    if (err) {
      console.log("Error " + err);
    } else {
      
      console.log("Resp " + JSON.stringify(response))
    }
    //your success handler
  });
  return findResult;
}

exports.text_find_all_get = function () {
  var docs = Content.find({}, function (err, docs) {
    if (!err) {
      console.log(docs);
      //return docs;
    } else { 
      throw err; 
    }
  });
  return docs;
}