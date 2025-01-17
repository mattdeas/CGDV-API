'use strict';

var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  plugins = gulpLoadPlugins({
    rename: {
      'gulp-angular-templatecache': 'templateCache'
    }
  }),
  pm2 = require('pm2');


// Watch Files For Changes
gulp.task('watch', function () {
  // Start livereload
  plugins.livereload.listen();
  // Add watch rules
  // gulp.watch(['server.js', 'modules/**', 'gulpfile.js'], ['eslint']).on('change', plugins.livereload.changed);
  gulp.watch(['server.js', 'app/**/*.js', 'modules/**', 'gulpfile.js']).on('change', plugins.livereload.changed);
});


gulp.task('eslint', function () {
  return gulp.src([ 'modules/**', '!public', '!node_modules/**' ])
    .pipe(eslint())
    .pipe(eslint.format());

});


gulp.task('pm2:dev', function () {
  pm2.connect(function (err) {
    if (err) {
      process.exit(2);
    }
    pm2.start({
      name: 'API_Server',
      script: 'server.js', // Script to be run
      exec_mode: 'cluster', // Allow your app to be clustered
      instances: 1, // Optional: Scale your app by 4
      max_memory_restart: '1000M', // Optional: Restart your app if it reaches 100Mb
      watch: true,
      'ignore_watch': ['node_modules', 'public', 'location'],
      args: ['--color']
    }, function (err) {
      // pm2.disconnect();   // Disconnect from PM2
      if (err) {
        throw err;
      } else {
        pm2.streamLogs('API_Server', 0);
      }
    });
  });
});


gulp.task('pm2:prod', function () {
  pm2.connect(function (err) {
    if (err) {
      process.exit(2);
    }
    pm2.start({
      name: 'API_Server',
      script: 'server.js', // Script to be run
      exec_mode: 'cluster', // Allow your app to be clustered
      instances: 1, // Optional: Scale your app by 4
      max_memory_restart: '1000M', // Optional: Restart your app if it reaches 100Mo
      watch: true,
      'ignore_watch': ['node_modules', 'public', 'location'],
      args: ['--color']
    }, function (err) {
      // pm2.disconnect();   // Disconnect from PM2
      if (err) {
        throw err;
      } else {
        pm2.streamLogs('API_Server', 0);
      }
    });
  });
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
  process.env.NODE_ENV = 'production';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  process.env.NODE_ENV = 'development';
});


// Run the project in production mode
gulp.task('prod', function (done) {
  runSequence('env:prod', 'pm2:prod', 'watch', done);
});


// Run the project in development mode
gulp.task('default', function (done) {
  runSequence('env:dev', 'pm2:dev', 'watch', done);
  //runSequence('env:dev', 'pm2:dev', 'watch', done);
});

// Run the project in development mode
gulp.task('lint', function (done) {
  runSequence(['eslint', 'watch'], done);
});
