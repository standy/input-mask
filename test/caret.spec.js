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
	});

	it('should say Hello to the World', function() {
		expect(caret).toBeDefined();
	});

	it('should get equal to set', function() {
		input.focus();
		caret.set(5);

		expect(caret.get()).toEqual({begin: 5, end: 5});
	});
});