const Hat = require('../models/hat');
const Fascinator = require('../models/fascinator');


exports.hat_create_post = function(req, res){
    let imageToSave = req.files.upload;

    imageToSave.mv('./public/images/facinators/'+ imageToSave.name, function(err) {
        if (err)
          return res.status(500).send(err);
      });

      var fascinator = new Hat({
        _id: req.body.id,
        code: req.body.code,
        price: req.body.price,
        image: req.files.upload.name
    });

    fascinator.save(function(err) {
        if(err) console.log("Problems saving :( - " + err)
        else res.redirect('/fascinators');
    });
}

exports.hat_read_get = function(req, res, loggedIn, dynamic_content_width){
    Hat.find({}, function(err, fascinators) {
        if (err) throw err;
    var lastCode;
    fascinators.forEach(function(fascinator){
        lastCode = Number(fascinator.code.replace(/\D/g,''));
        lastCode = "F" + Number(lastCode +1);
    })


        res.render('pages/fascinators', {
        "fascinators" : fascinators,
        loggedIn: loggedIn,
        dynamic_width: dynamic_content_width,
        lastCode, lastCode
        });
    });
}

exports.hat_update_post = function(req, res){
    var fascinator = new Fascinator({
        _id: req.body.id,
        code: req.body.code,
        price: req.body.price,
        image: req.body.image
    })
    if(req.body.action === "update"){
        Fascinator.findByIdAndUpdate(req.body.id, fascinator, function(err, model) {
            if (err)  console.log(err)
            else      res.redirect('/fascinators');
            })
    }
    if(req.body.action === "delete"){
        Fascinator.findByIdAndRemove(req.body.id, fascinator, function(err, model) {
            if (err)  console.log(err)
            else      res.redirect('/fascinators');
            })
    }
}
