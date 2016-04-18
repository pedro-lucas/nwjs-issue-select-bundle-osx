'use strict';

let gulp = require('gulp');
let path = require('path');
let nwBuilder = require('nw-builder');
let pack = require('./package.json');

gulp.task('default', function() {

  let plataforms = [];

  if(process.platform == 'linux') {
    plataforms.push('linux32');
  }else if(process.platform == 'darwin') {
    plataforms.push('osx64');
  }else{
    plataforms.push('win32');
  }

  let nw = new nwBuilder({
    files: __dirname + '/**/*',
    platforms: plataforms,
    version: '0.14.1',
    cacheDir: path.join(__dirname, 'cache'),
    buildDir: path.join(__dirname, 'build'),
    currentPlatform: plataforms[0],
    appName: pack.title,
    appVersion: pack.version
  });

  nw.on('log', function(msg) {
    console.log('nw-builder', msg);
  });

  let listening = function() {
    setTimeout(function() {
      var theProcess = nw.getAppProcess();
      if (!theProcess) {
        listening();
      } else {
        //console.log('stdout listening', theProcess);
        theProcess.stdout.on('data', function(data) {
          console.log('node-webkit', data);
        });
        theProcess.stderr.on('data', function(data) {
          console.error('node-webkit', data.toString('utf8'));
        });
      }
    }, 1);
  };

  listening();

  return nw.run();

});
