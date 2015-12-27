var gulp = require('gulp');
var named = require('vinyl-named');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config');
var karma = require('karma');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('build', function() {
	return gulp.src('lib/*.js')
		.pipe(named())
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('dist/'))
		.pipe(rename(function(path) {
			path.basename += '.min';
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/'))
});


gulp.task('dev', function() {
	webpackConfig.watch = true;
	gulp.run('build');
	return gulp.watch('lib/**/*.js', ['build']);
});


gulp.task('tests', function(done) {
	new karma.Server({
		configFile: __dirname + '/karma.conf.js'
	}, done).start();
});



gulp.task('default', ['build']);