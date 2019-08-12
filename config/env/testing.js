'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  app: {
    title: defaultEnvConfig.app.title + ' - Testing  Environment'
  },
  postgres:{
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'qed_test',
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