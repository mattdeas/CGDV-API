module.exports = (swaggerJson) => {
    swaggerJson.paths['/api/auth/user/register'] = {
        'post': {
            'tags': [
                'User authentication'
            ],
            'description': 'User signUp',
            'summary': 'User signUp',
            'parameters': [
                {
                    'in': 'body',
                    'name': 'body',
                    'description': 'Body parameter',
                    'required': true,
                    'schema': {
                        '$ref': '#/definitions/Signup'
                    }
                }
            ],
            'responses': genericResponse
        }
    };

    swaggerJson.paths['/api/auth/user/login'] = {
        'post': {
            'tags': [
                'User authentication'
            ],
            'description': 'User login',
            'summary': 'User login',
            'parameters': [
                {
                    'in': 'body',
                    'name': 'body',
                    'description': 'Body parameter',
                    'required': true,
                    'schema': {
                        '$ref': '#/definitions/Login'
                    }
                }
            ],
            'responses': genericResponse
        }
    };

    swaggerJson.paths['/api/auth/admin/login'] = {
        'post': {
            'tags': [
                'User authentication'
            ],
            'description': 'Admin login',
            'summary': 'Admin login',
            'parameters': [
                {
                    'in': 'body',
                    'name': 'body',
                    'description': 'Body parameter',
                    'required': true,
                    'schema': {
                        '$ref': '#/definitions/Login'
                    }
                }
            ],
            'responses': genericResponse
        },
        
    };

    swaggerJson.paths['/api/visual'] = {
        'get': {
            'tags': [
                'Visual'
            ],
            'description': 'Get Visual List',
            'summary': 'Get Visual List',
            'parameters': [
                tokenConst,
                {
                    'in': 'query',
                    'name': 'viz_id',
                    'description': 'Search by visual id',
                    'type': 'integer'
                },
                {
                    'in': 'query',
                    'name': 'title',
                    'description': 'Search by Title',
                    'type': 'string'
                },
                {
                    'in': 'query',
                    'name': 'author',
                    'description': 'Search by author',
                    'type': 'string'
                },
                {
                    'in': 'query',
                    'name': 'tags',
                    'description': 'Search by Tags',
                    'type': 'string'
                },
                {
                    'in': 'query',
                    'name': 'is_featured',
                    'description': 'Search by author',
                    'type': 'integer'
                },
                {
                    'in': 'query',
                    'name': 'user_id',
                    'description': 'Search by user_id',
                    'type': 'integer'
                },
                {
                    'in': 'query',
                    'name': 'country_id',
                    'description': 'Search by country id',
                    'type': 'integer'
                },
                {
                    'in': 'query',
                    'name': 'university_id',
                    'description': 'Search by university id',
                    'type': 'integer'
                },
                {
                    'in': 'query',
                    'name': 'category_id',
                    'description': 'Search by category id',
                    'type': 'integer'
                }
                
            ],
            'responses': genericResponse
        }
    };

    swaggerJson.paths['/api/category'] = {
        'get': {
            'tags': [
                'Category'
            ],
            'description': 'Get Category List',
            'summary': 'Get Category List',
            'parameters': [
                {
                    'in': 'query',
                    'name': 'id',
                    'description': 'Search by Category id',
                    'type': 'string'
                },
                {
                    'in': 'query',
                    'name': 'type',
                    'description': 'Search by type',
                    'type': 'string'
                },
                {
                    'in': 'query',
                    'name': 'name',
                    'description': 'Search by name',
                    'type': 'string'
                }
            ],
            'responses': genericResponse
        },
        'post': {
            'tags': [
                'Category'
            ],
            'description': 'Add Category',
            'summary': 'Add Category',
            'parameters': [
                tokenConst,
                {
                    'in': 'body',
                    'name': 'body',
                    'description': 'Body parameter',
                    'required': true,
                    'schema': {
                        '$ref': '#/definitions/addCategory'
                    }
                }
            ],
            'responses': genericResponse
        },
        
    };

    swaggerJson.paths['/api/category/{id}'] = {
        'put': {
            'tags': [
                'Category'
            ],
            'description': 'Update Category',
            'summary': 'Update Category',
            'parameters': [
                tokenConst,                
                {
                    'in': 'path',
                    'name': 'id',
                    'description': 'Category Id',
                    'required': true,
                    'type': 'string'
                },
                {
                    'in': 'body',
                    'name': 'body',
                    'description': 'Body parameter',
                    'required': true,
                    'schema': {
                        '$ref': '#/definitions/addCategory'
                    }
                }
            ],
            'responses': genericResponse
        },
        'delete': {
            'tags': [
                'Category'
            ],
            'description': 'Delete Category',
            'summary': 'Delete Category',
            'parameters': [
                tokenConst,                
                {
                    'in': 'path',
                    'name': 'id',
                    'description': 'Category Id',
                    'required': true,
                    'type': 'string'
                }
            ],
            'responses': genericResponse
        }
    };

    swaggerJson.paths['/api/university'] = {
        'get': {
            'tags': [
                'University'
            ],
            'description': 'Get University List',
            'summary': 'Get University List',
            'parameters': [
                {
                    'in': 'query',
                    'name': 'id',
                    'description': 'Search by University id',
                    'type': 'string'
                },
                {
                    'in': 'query',
                    'name': 'country_id',
                    'description': 'Search by country id',
                    'type': 'string'
                },
                {
                    'in': 'query',
                    'name': 'name',
                    'description': 'Search by name',
                    'type': 'string'
                }
            ],
            'responses': genericResponse
        },
        'post': {
            'tags': [
                'University'
            ],
            'description': 'Add University',
            'summary': 'Add University',
            'parameters': [
                tokenConst,
                {
                    'in': 'body',
                    'name': 'body',
                    'description': 'Body parameter',
                    'required': true,
                    'schema': {
                        '$ref': '#/definitions/addUniversity'
                    }
                }
            ],
            'responses': genericResponse
        },
        
    };

    swaggerJson.paths['/api/university/{id}'] = {
        'put': {
            'tags': [
                'University'
            ],
            'description': 'Update University',
            'summary': 'Update University',
            'parameters': [
                tokenConst,                
                {
                    'in': 'path',
                    'name': 'id',
                    'description': 'University Id',
                    'required': true,
                    'type': 'string'
                },
                {
                    'in': 'body',
                    'name': 'body',
                    'description': 'Body parameter',
                    'required': true,
                    'schema': {
                        '$ref': '#/definitions/addUniversity'
                    }
                }
            ],
            'responses': genericResponse
        },
        'delete': {
            'tags': [
                'University'
            ],
            'description': 'Delete University',
            'summary': 'Delete University',
            'parameters': [
                tokenConst,                
                {
                    'in': 'path',
                    'name': 'id',
                    'description': 'University Id',
                    'required': true,
                    'type': 'string'
                }
            ],
            'responses': genericResponse
        }
    };
    

    swaggerJson.definitions.Signup = {
        'type': 'object',
        'properties': {
            'email': {
                'type': 'string',
                'example': 'test@mail.com'
            },
            'password': {
                'type': 'string',
                'example': 'techuz'
            }
        }
    };

    

    swaggerJson.definitions.Login = {
        'type': 'object',
        'properties': {
            'email': {
                'type': 'string',
                'example': 'testuser@techuz.com'
            },
            'password': {
                'type': 'string',
                'example': 'techuz123'
            }
        }
    };

    swaggerJson.definitions.addCategory = {
        'type': 'object',
        'properties': {
            'name': {
                'type': 'string',
                'example': 'New Category'
            },
            'type': {
                'type': 'string',
                'example': 'team'
            }
        }
    };

    swaggerJson.definitions.addUniversity = {
        'type': 'object',
        'properties': {
            'name': {
                'type': 'string',
                'example': 'New University'
            },
            'country_id': {
                'type': 'integer',
                'example': 1
            }
        }
    };

    swaggerJson.definitions.genericSuccess = {
        'properties': {
            'status': {
                'type': 'number',
                'example': 1
            },
            'message': {
                'example': 'Success message.'
            }
        }
    };

    swaggerJson.definitions.genericError = {
        'properties': {
            'status': {
                'type': 'number',
                'example': 0
            },
            'message': {
                'example': 'Error Message'
            }
        }
    };
    swaggerJson.definitions.unexpectedError = {
        'properties': {
            'status': {
                'type': 'number',
                'example': 0
            },
            'message': {
                'example': 'Something went wrong please try again.'
            }
        }
    };

    
    return swaggerJson;
};
