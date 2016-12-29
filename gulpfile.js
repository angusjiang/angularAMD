var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');


gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      fallback: './index.html',
      livereload: true,
      port: 8360,
      directoryListing: false,
      open: true
    }));
});
gulp.task('testLess',function(){
	gulp.src('style/less/*.less')
		.pipe(less())
		.pipe(minifycss())
		.pipe(gulp.dest('style/css'));
});
gulp.task('testWatch',function(){
	gulp.run('webserver');
	gulp.watch('style/less/*.less',function(){
		gulp.run('testLess');
	});
});

gulp.task('ugJs',function(){
	gulp.src('scripts/testjs/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('scripts/ugjs'))
});
gulp.task('default',['testWatch','ugJs']);