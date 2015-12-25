var gulp = require('gulp');
var named = require('vinyl-named');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config');
var karma = require('karma');

gulp.task('build', function() {
	return gulp.src('lib/*.js')
		.pipe(named())
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('dist/'));
});


gulp.task('dev', function() {
	webpackConfig.watch = true;
	return gulp.watch('lib/**/*.js', ['build']);
});


gulp.task('tests', function(done) {
	new karma.Server({
		configFile: __dirname + '/karma.conf.js'
	}, done).start();
});



gulp.task('default', ['build']);