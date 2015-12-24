module.exports = function(input) {
	var caret = {};

	caret.set = function(begin, end) {
		var range;
		end = typeof end === 'number' ? end : begin;

		if (input.setSelectionRange) {
			input.setSelectionRange(begin, end);
		} else if (input.createTextRange) {
			range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', begin);
			range.select();
		}
	};

	caret.get = function() {
		var range;
		var begin;
		var end;
		if (input.setSelectionRange) {
			begin = input.selectionStart;
			end = input.selectionEnd;
		} else if (document.selection && document.selection.createRange) {
			range = document.selection.createRange();
			begin = 0 - range.duplicate().moveStart('character', -100000);
			end = begin + range.text.length;
		}
		return { begin: begin, end: end };
	};

	return caret;
};

