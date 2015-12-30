// Karma configuration
module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'commonjs'],


		// list of files / patterns to load in the browser
		files: [
			{pattern: 'node_modules/jquery/dist/jquery.js', included: true},
			{pattern: 'lib/**/*.js', included: true},
			{pattern: 'test/**/*spec.js', included: true}
		],


		// list of files to exclude
		exclude: [],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'jquery': ['commonjs'],
			'lib/**/*.js': ['commonjs'],
			'test/**/*spec.js': ['commonjs'],
//			'lib/utils/**/*.js': ['coverage'],
		},
		commonjsPreprocessor: {
			modulesRoot: 'test'
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: [
			'dots',
//			'progress',
//			'coverage'
		],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		//npm install karma-firefox-launcher karma-safari-launcher karma-edge-launcher karma-ie-launcher
		browsers: [
			'Chrome',
//			'Firefox',
//			'Safari',
//			'Edge',
//			'IE',
		],



		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	})
};
