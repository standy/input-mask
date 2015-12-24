var $ = require('jquery');


module.exports = inputMask;

function inputMask($input, options) {
	var input = $input[0];
	var caret = require('./caret')(input);
	var stringMask = require('./string-mask')(options);

	window.stringMask = stringMask;
	window.caret = caret;

	$input
		.on('focus.mask', onFocus)
		.on('keydown.mask', onKeydown)
//		.on('input', onInput)
		.on('keypress.mask', onKeypress)
		.on('keyup.mask', onKeyup);

	function onFocus(e) {
		var placeholder = stringMask.getPlaceholder(input.value);
		input.value = placeholder;
		var pos = stringMask.firstToType(placeholder);
		console.log('firstToType>', pos)
		caret.set(pos);
	}


	function onKeydown(e) {
		var key = e.which || e.keyCode;
		var pos = caret.get();
		var value = input.value;
//		console.log('keydown', value, key, pos);
	}

	function onInput(e) {
		var key = e.which || e.keyCode;
		var pos = caret.get();
		var begin = pos.begin;
		var end = pos.end;
		var value = input.value;
//		console.log('input', key, begin, value);
	}

	function onKeypress(e) {
		var key = e.which || e.keyCode;
		var dirtyValue = input.value;
		var dirtyPos = caret.get();
		var clean = stringMask.removeConsts(dirtyValue, dirtyPos);
		var value = clean.value;
		var pos = clean.pos;
		var begin = pos.begin;
		var end = pos.end;

		var char = String.fromCharCode(key);
//		console.log('keypress', value, key, pos);


		var resValue;
		var isDel = key == 8;
		var isBs = key == 46;

		if (isDel || isBs) {
			var newPos = begin;
			if (end !== begin) {
				resValue = value.substring(0, begin) + value.substring(end);
			} else if (isDel) {
				resValue = value.substring(0, begin - 1) + value.substring(begin);
				newPos = begin - 1;
			} else {
				resValue = value.substring(0, begin) + value.substring(begin + 1);
			}

			var full = stringMask.addConsts(resValue, {begin: newPos, end: newPos});
			input.value = stringMask.getPlaceholder(full.value);
//			input.value = stringMask.getPlaceholder(resValue);
			caret.set(full.pos.begin);
		} else if (e.ctrlKey || e.altKey || e.metaKey || !key || key < 40) {
			return;
		} else {
			var resChar = stringMask.charMask(dirtyPos.begin, char);
			if (resChar) {
				resValue = value.substring(0, begin) + resChar + value.substring(end);
				var full = stringMask.addConsts(resValue, {begin: begin, end: begin});
				input.value = stringMask.getPlaceholder(full.value);
				var resPos = stringMask.skip(full.pos.begin, 1);
				caret.set(resPos);
//				input.value = stringMask.getPlaceholder(resValue);
//				caret.set(stringMask.skip(begin, 1));
			}
		}
		e.preventDefault();
	}
	function onKeyup(e) {
		var key = e.which || e.keyCode;
		var pos = caret.get();
		var begin = pos.begin;
		var end = pos.end;
		var value = input.value;
//		console.log('keyup', value, key, pos);
	}

}


/* коды кнопок */
var KEY = {
	PAGEUP: 33,
	PAGEDOWN: 34,
	END: 35,
	HOME: 36,

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	BACKSPACE: 8,
	DELETE: 46,

	TAB: 9,
	ENTER: 13,
	ESC: 27,

	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	INSERT: 0,
	CAPSLOCK: 0
};

//module.exports = inputMask;