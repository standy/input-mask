var caretInit = require('../lib/utils/caret.js');

describe('caret', function() {
	var $input;
	var input;
	var caret;
	beforeEach(function() {
		$input = $('<input type="text" value="1234567890" />');
		$input.appendTo('body');
		input = $input.get(0);
		caret = caretInit(input);
		input.focus();
	});

	it('should be zero for a start', function() {
		expect(caret.get()).toEqual({begin: 0, end: 0});
	});

	it('should work for one argument', function() {
		caret.set(5);
		expect(caret.get()).toEqual({begin: 5, end: 5});
	});

	it('should work for two arguments', function() {
		caret.set(3, 7);
		expect(caret.get()).toEqual({begin: 3, end: 7});
	});

	it('should set last position for larger numbers', function() {
		caret.set(15);
		expect(caret.get()).toEqual({begin: 10, end: 10});
	});

	it('should set zero position for negative numbers', function() {
		caret.set(-5);
		expect(caret.get()).toEqual({begin: 0, end: 0});
	});

});
