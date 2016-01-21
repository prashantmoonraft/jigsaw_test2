var gulp  = require('gulp');
var shell = require('gulp-shell');
var options = {
   'cwd':'Mock'
};
gulp.task('wire-mock', shell.task([
   'java -jar wiremock-1.57-standalone.jar --port 9006 --verbose true'
],options));