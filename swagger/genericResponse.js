

global.genericResponse = {
    '200': {
        'description': 'Success.',
        'schema': {
            '$ref': '#/definitions/genericSuccess'
        }
    },
    '400': {
        'description': 'Bad request parameter.',
        'schema': {
            '$ref': '#/definitions/genericError'
        }
    },
    '401': {
        'description': 'Unauthorized request',
        'schema': {
            '$ref': '#/definitions/genericError'
        }
    },
    '500': {
        'description': 'Internal Server Error',
        'schema': {
            '$ref': '#/definitions/unexpectedError'
        }
    }
};
