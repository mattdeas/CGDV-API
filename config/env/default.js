'use strict';

module.exports =  {
  app: {
    title: 'API_Server',
    description: '',
    version:0.1
  },
  server : {
    host: process.env.HOST || '0.0.0.0',
    http_port: 8080,
    https_port: 8443,
    secure: false,
    certificates: {
      path: "./certificates/",
      key: "local.key",
      crt: "local.crt"
    }
    
  },
  key: {
        privateKey: '37LvDSm4XvjYOh9Y',
        tokenExpiry: 86400*30 // 30 Days
  },
  unittestUrl: 'https://localhost:8443',
};
