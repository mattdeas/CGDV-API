'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors')),
  fs = require('fs');

/*
* Upload image save base64 data
*/

exports.upload = function (req, res, next) {
  console.log('upload controller')
  var file = req.body.image || null;

      if (!file) {
        return res.status(Boom.NO_IMAGE_FOUND.statusCode).json(Boom.NO_IMAGE_FOUND);
      }
      // Get File extension
      var fileExt =  file.split(';')[0].split('/')[1];
      file = file.split(';base64,').pop();

      // Check image type validation
      // if (fileExt !== 'jpg' && fileExt !== 'png' && fileExt !== 'jpeg') {
      //   return res.status(Boom.INVALID_IMAGE_TYPE.statusCode).json(Boom.INVALID_IMAGE_TYPE);
      // }

      
      // Create token
      var token = helper.randomString(16);

      var filename = token + '.' + fileExt;      
      var targetPath = path.resolve('./public/storage/' + filename);

      fs.writeFile(targetPath, file, 'base64',function (err) {
        if (err) {
          next(err);
        } else {          
          let fullUrl = req.protocol + '://' + req.get('host') + '/storage/' + filename;
          let filePath = 'storage/' + filename;
          res.json({ status: 1, message: 'Upload successfully', result: {  'url': fullUrl, 'filePath': filePath } });
        }
      });
};

/**
 * removeImage
 */
exports.removeImage = function (req, res, next) {
  let image = req.body.image;
  if(image){
    var targetPath = path.resolve('./public/' + image);
    fs.unlink(targetPath);
    res.json({ status: 1, message: 'Deleted successfully'});
  }else{
    // res.json({ status: 0, message: 'Image not found'});
    return res.status(Boom.NO_IMAGE_FOUND.statusCode).json(Boom.NO_IMAGE_FOUND);  
  }
}; // End removeImage