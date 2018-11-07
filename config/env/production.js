'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  app: {
    title: defaultEnvConfig.app.title + ' - Production Environment'
  },
  postgres:{
    host: 'ec2-54-225-98-131.compute-1.amazonaws.com',//'localhost',
    port: 5432,
    user: 'fhwctwfmhmnwut',//'postgres',
    password: '38019844466d74ba96c193b6a739555a64a3ac9dde5ef462e9b184092959aeb2',//'',
    database: 'daim47nk4i4lq1',//'cgdv',
    ssl: true, //Only required for Heroku...
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  },
  logs:{
    activity:false,
    error:false,
    exception:false
  },
  mailer: {
    from: process.env.MAILER_FROM || '"CGDV" <support@example.com>',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'smtp.gmail.com',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'support@example.com',
        pass: process.env.MAILER_PASSWORD || 'password'
      }
    }
  },  
  resetPasswordUrl: 'https://172.16.16.154:4200/authentication/reset'
};