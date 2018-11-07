'use strict';


exports.INVALID_ACTION = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Invalid action.'
}

exports.SOMETHING_WRONG = {
    status: 0,
    statusCode: 500,
    error: "Internal Server Error",
    message: 'Something went wrong, Please try again later.'
};

exports.NOT_IMPLEMENTED = {
    status: 0,
    statusCode: 501,
    error: "Not Implemented",
    message: 'Method not implemented. \uD83D\uDE20'
};

exports.SERVICE_UNAVAILABLE = {
    status: 0,
    statusCode: 503,
    error: "Service Unavailable",
    message: 'Unavailable.'
};

exports.INVALID_QUERY = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Invalid query.'
}

exports.INVALID_DATA = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Invalid data.'
}

exports.LOGIN_REQUIRED = {
    status: 0,
    statusCode: 401,
    error: "Unauthorized",
    message: 'Login required.'
}

exports.INVALID_IMAGE_TYPE = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Uploaded file is not a valid image. Only JPG, JPEG and PNG files are allowed.'
}

exports.INVALID_IMAGE_SIZE = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Uploaded file is not a valid image size. maximum 5 MB is allowed.'
}

exports.NO_IMAGE_FOUND = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Please upload image.'
}

exports.INVALID_FILE_TYPE = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Uploaded file is not a valid file. Only PDF files are allowed.'
}

exports.INVALID_FILE_SIZE = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Uploaded file is not a valid file size. maximum 100 MB is allowed.'
}

exports.NO_FILE_FOUND = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Please upload file.'
}


exports.INVALID_AVATAR_IMAGETOKEN = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Please upload avatar image.'
}

exports.INVALID_BANNER_IMAGETOKEN = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Please upload banner image.'
}


exports.INVALID_ID = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Invalid id.'
}

exports.NO_DATA_FOUND = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Data not found.'
}


exports.NOT_ALLOWED = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'You are not allowed to access this.'
}


exports.ALREADY_THERE = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Visual already there in viz of day.'
}

exports.ALREADY_VOTED = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Visual already upvoted before.'
}

exports.ALREADY_EXIST = {
    status: 0,
    statusCode: 400,
    error: "Bad Request",
    message: 'Already exist.'
}


exports.VALIDATION_FAILED = {
    status: 0,
    statusCode: 400,
    error: 'Validation fail',
    message: 'Validation fail'
}


exports.STILL_REFERENCED = {
    status: 0,
    statusCode: 400,
    error: 'item is still referenced somewhere',
    message: 'Can\'t delete, item is still referenced somewhere'
}