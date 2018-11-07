'use strict';
const config = require('../config/config');
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const _ = require('lodash');

// create reusable transport method (opens pool of SMTP connections)
// console.log(Config.email.username+"  "+Config.email.password);
var smtpTransport = nodemailer.createTransport('smtps://' + config.mailer.options.auth.user + ':' + config.mailer.options.auth.pass + '@' + config.mailer.options.service);


exports.sentResetPasswordLink = (user, callback) => {
  fs.readFile(path.resolve('templates/resetPassword.html'), "utf8", function(err, templateHTML){
    if(err){
      callback(err)
     } else {
      var link = config.resetPasswordUrl+'?token='+ user.token;
      var messageHtml = ejs.render(templateHTML, {serverPath: config.serverUrl, name:user.name , link:link});
      var mailbody = messageHtml;
      mail(user.email , `Reset your CGDV password`, mailbody, function(err){
        callback(err)
      });
    }
  })
};


function mail(email, subject, mailbody, callback){

    var mailOptions = {
        from: config.mailer.from, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: mailbody  // html body
    };
    smtpTransport.sendMail(mailOptions, function(err, response) {
        console.log('err',err)
        if (err) {
          callback(err)
        } else{
          callback(null)
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}

function mailWithAttachment(email, subject, mailbody, attachments, callback){

    var mailOptions = {
        from: config.mailer.from, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: result.price, // plaintext body
        html: mailbody,  // html body
        attachments: attachments
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            callback(error)
        }
        else{
            callback(null)
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}