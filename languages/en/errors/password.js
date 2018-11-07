'use strict';

exports.EMAIL_NOT_REGISTERED_WITH_US = {
    status: 0,
    statusCode: 409,
    error: "Conflict",
    message: 'Email not register with us.'
}

exports.INVALID_RESET_PASSWORD_TOKEN = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Invalid reset password token.'
}

exports.INVALID_RESET_PASSWORD_OTP = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Invalid reset password OTP.'
}

exports.INVALID_CURRENT_PASSWORD = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Invalid current password.'
}