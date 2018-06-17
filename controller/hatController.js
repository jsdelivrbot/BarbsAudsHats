'use strict'
const Hat = require('../models/hat');
const Fascinator = require('../models/fascinator');
const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
const fs = require('file-system');
const path = require('path');

exports.hat_create_post = function (req, res, aws) {
    console.log(aws);
    let s3 = new aws.S3({ apiVersion: '2006-03-01' });
    let uploadParams = { Bucket: S3_BUCKET, Key: '', Body: '', ACL: 'public-read' };
    let imageToSave = req.files.upload;
    let filePath;
    let fileStream;
    let fascinator = new Hat({
        code: req.body.code,
        price: req.body.price,
        image: ''
    });

    imageToSave.mv('./public/images/fascinators/' + imageToSave.name, function (err) {
        if (err) return res.status(500).send(err);
    });
    filePath = './public/images/fascinators/' + imageToSave.name;
    fileStream = fs.createReadStream(filePath);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(filePath);

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            //Success then save to DB
            console.log("Upload Success", data.Location);
            fascinator.image = data.Location;
            fascinator.save(function (err) {
                if (err) console.log("Problems saving :( - " + err)
                else res.redirect(req.get('referer'));;
            });
        }
    });
}

exports.hat_read_get = function (req, res, loggedIn, dynamic_content_width) {
    let contentCode;
    let mongooQuery;
    if (req.url === "/hats") {
        contentCode = "H";
        mongooQuery = { code: /^H/ }
    }
    else if (req.url === "/fascinators") {
        contentCode = "F";
        mongooQuery = { code: /^F/ }
    }
    else if (req.url === "/showroom") {
        contentCode = "S";
        mongooQuery = { code: /^S/ }
    }
    Hat.find(mongooQuery, function (err, fascinators) {
        if (err) throw err;
        let lastCode;
        fascinators.forEach(function (fascinator) {
            lastCode = Number(fascinator.code.replace(/\D/g, ''));
            lastCode = contentCode + Number(lastCode + 1);
        })
        res.render('pages' + req.url, {
            "fascinators": fascinators,
            loggedIn: loggedIn,
            dynamic_width: dynamic_content_width,
            lastCode, lastCode
        });
    });
}

exports.hat_update_post = function (req, res) {
    let fascinator = new Fascinator({
        _id: req.body.id,
        code: req.body.code,
        price: req.body.price,
        image: req.body.image
    })
    if (req.body.action === "update") {
        Fascinator.findByIdAndUpdate(req.body.id, fascinator, function (err, model) {
            if (err) console.log(err)
            else res.redirect(req.get('referer'));
        })
    }
    if (req.body.action === "delete") {
        Fascinator.findByIdAndRemove(req.body.id, fascinator, function (err, model) {
            if (err) console.log(err)
            else res.redirect(req.get('referer'));
        })
    }
}
