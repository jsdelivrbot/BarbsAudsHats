'use strict'
const Hat = require('../models/hat');
const Fascinator = require('../models/fascinator');
const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;


exports.hat_create_post = function(req, res){
    let imageToSave = req.files.upload;

    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });

    // imageToSave.mv('./public/images/fascinators/'+ imageToSave.name, function(err) {
    //     if (err)
    //       return res.status(500).send(err);
    //   });

      var fascinator = new Hat({
        code: req.body.code,
        price: req.body.price,
        image: req.files.upload.name
    });

    fascinator.save(function(err) {
        if(err) console.log("Problems saving :( - " + err)
        else res.redirect(req.get('referer'));;
    });
}

exports.hat_read_get = function(req, res, loggedIn, dynamic_content_width){
    console.log(req.url);
    var contentCode;
    var mongooQuery;
    if(req.url === "/hats"){
        contentCode = "H";
        mongooQuery = {code:/^H/}
    }
    else if(req.url === "/fascinators"){
        contentCode = "F";
        mongooQuery = {code:/^F/}
    }     
    else if(req.url === "/showroom"){
        contentCode = "S";
        mongooQuery = {code:/^S/}
    }
    Hat.find(mongooQuery, function(err, fascinators) {
        console.log(fascinators);
        if (err) throw err;
    var lastCode;
    fascinators.forEach(function(fascinator){
        lastCode = Number(fascinator.code.replace(/\D/g,''));
        lastCode = contentCode + Number(lastCode +1);
    })


        res.render('pages' + req.url, {
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
    console.log(fascinator);
    if(req.body.action === "update"){
        Fascinator.findByIdAndUpdate(req.body.id, fascinator, function(err, model) {
            if (err)  console.log(err)
            else      res.redirect(req.url.replace('_update',''));
            })
    }
    if(req.body.action === "delete"){
        console.log(req.body.id + " " + fascinator)
        Fascinator.findByIdAndRemove(req.body.id, fascinator, function(err, model) {
            if (err)  console.log(err)
            else      res.redirect(req.url.replace('_update',''));
            })
    }
}
