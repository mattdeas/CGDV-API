'use strict';

exports.INVALID_CREDENTIAL = {
	status : 0,
	statusCode : 401,
  error : "Unauthorized",
  message : 'Wrong password.'
};

exports.USER_INACTIVE = {
	status : 0,
	statusCode : 401,
  error : "Unauthorized",
  message : 'Please active your account.'
};

exports.USER_BLOCKED = {
	status : 0,
	statusCode : 401,
  error : "Unauthorized",
  message : 'You are blocked by admin.'
};

exports.ALREADY_REGISTERED = {
	status : 0,
	statusCode : 400,
  error : "Bad Request",
  message : 'Child already registered by this mobile number.'
};

exports.INVALID_EMAIL = {
  status : 0,
  statusCode : 401,
  error : "Unauthorized",
  message : 'Email id not registered with us'
};