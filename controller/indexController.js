'use strict'
const Content = require('../models/content');
var loggedIn = false;

exports.index_create_post = function (req, res, displaytext) {
    var index = new Content({
        page: req.body.page,
        content: [{
            text: "Test",//req.body.text,
            type: "test"//req.body.type
        }],

    });

    index.save(function (err) {
        if (err) console.log("Problems saving :( - " + err)
        else {
            console.log(index + " <-- Saved this to db");
            res.redirect(index.page);
        }
    });
}

exports.index_read_get = function (req, res, cpage, displaytext) {
    Content.findOne({ 'page': cpage }, function (err, results) {
        if (err) throw err;
        if (req.user) loggedIn = true;
        res.render('pages' + cpage, {
            loggedIn:loggedIn,
            cpage: cpage,
            displayText: displaytext
        });
    });
}

exports.index_update_post = function (req, res) {
    var parentPage = Content.findOne({ 'page': '/index' }, function (err, results) {
        if (err) throw err;
        if (req.user) loggedIn = true;

        console.log('parentPage ' + parentPage);
        Content.updateOne({"page": req.body.page ,"content.type": req.body.type},
                    { $set:
                        {
                            "content.$.text": req.body.text
                        }
                }, function (err, result) {
            if (err) console.log(err)
            else  exports.index_read_get(req, res, req.body.page);
        })
    });


    if (req.body.action === "delete") {
        console.log(req.body.id + " " + index)
        index.findByIdAndRemove(req.body.id, index, function (err, model) {
            if (err) console.log(err)
            else console.log(index + " <-- Deleted this in db");
        })
    }



}
