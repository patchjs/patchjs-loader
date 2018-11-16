var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync('package.json'));

var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('minify', function() {
  gulp.src('src/*.js')
    .pipe(uglify({
      compress: {
        unused: false
      }
    }))
    .pipe(gulp.dest('dist/' + pkg.name + '/' + pkg.version));
});

gulp.task('default', ['minify']);
