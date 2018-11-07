'use strict';

const config = require('../config/config'),
  path = require('path'),
  bcrypt = require('bcrypt-nodejs'),
  async = require('async'),
  fs = require('fs'),
  jwt = require('jsonwebtoken'),
  _ = require('lodash'),
  crypto = require('crypto');


/* For encrypt decrypt password */
exports.encrypt = (password) => {
   return encrypt(password);
};

exports.validPassword = (password, matchPassword) => {
    return validPassword(password, matchPassword);
};


function encrypt(password, next) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null, next);
}

function validPassword(password, matchPassword, next) {
  return bcrypt.compareSync(password, matchPassword, next);
}

exports.randomString = function(length, type=null) {
  var str = '';
  if(type==='number'){
    var chars = '123456789'.split('');
  } else {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
  }
  var charsLen = chars.length;
  if (!length) {
    length = ~~(Math.random() * charsLen);
  }
  for (var i = 0; i < length; i += 1) {
    str += chars[~~(Math.random() * charsLen)];
  }
  return str;
};

exports.slugify = function(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}





exports.generateJWT = function(data) {
    const tokenOptionalInfo = { 
      expiresIn: config.key.tokenExpiry 
    };
    return jwt.sign(data, config.key.privateKey, tokenOptionalInfo);
}

