module.exports = inputMask;

function inputMask($input, options) {
	var input = $input[0];
	var caret = require('./caret')(input);
	var stringMask = require('./string-mask')(options);

	$input.val(stringMask.getPlaceholder($input.val()));

	$input
		.on('focus.mask', onFocus)
//		.on('keydown.mask', onKeydown)
//		.on('input', onInput)
		.on('keypress.mask', onKeypress)
//		.on('keyup.mask', onKeyup);

	function onFocus(e) {
		var placeholder = stringMask.getPlaceholder(input.value);
		input.value = placeholder;
		var pos = stringMask.firstToType(placeholder);
		caret.set(pos);
		setTimeout(function() {
			if (input === document.activeElement){
				caret.set(pos);
			}
		}, 0);
	}


//	function onKeydown(e) {
//		var key = e.which || e.keyCode;
//		var pos = caret.get();
//		var value = input.value;
////		console.log('keydown', value, key, pos);
//	}
//
//	function onInput(e) {
//		var key = e.which || e.keyCode;
//		var pos = caret.get();
//		var begin = pos.begin;
//		var end = pos.end;
//		var value = input.value;
////		console.log('input', key, begin, value);
//	}

	function onKeypress(e) {
		var key = e.which || e.keyCode;
		if (e.ctrlKey || e.altKey || e.metaKey || !key || (key < 40 && [8, 32].indexOf(key) < 0)) {
			return;
		}

		var maskedValue = input.value;
		var maskedPos = caret.get();
		var value = stringMask.unmask(maskedValue);
		var begin = stringMask.unmaskIndex(maskedPos.begin);
		var end = stringMask.unmaskIndex(maskedPos.end);

//		console.log('keyPress', value, begin, end);

		var resValue = null;
		var nextIndex;
		var isBs = key == 8;
		var isDel = key == 46;

		if (isDel || isBs) {
			var removePos = begin;
			if (isBs) removePos--;
			if (end !== begin) {
				resValue = value.substring(0, begin) + value.substring(end);
			} else {
				resValue = value.substring(0, removePos) + value.substring(removePos + 1);
			}

			nextIndex = stringMask.maskIndex(removePos);
			if (isDel) {
				nextIndex = stringMask.skip(nextIndex, 1);
			}
		} else {
			var char = String.fromCharCode(key);
			var actualBegin = stringMask.skip(maskedPos.begin, 1);
			var resChar = stringMask.charMask(actualBegin, char);
			if (resChar) {
				resValue = value.substring(0, begin) + resChar + value.substring(end);
				nextIndex = stringMask.skip(stringMask.maskIndex(begin + 1), 1);
			}
		}

		if (resValue !== null) {
			var resMaskedValue = stringMask.mask(resValue);
			input.value = stringMask.getPlaceholder(resMaskedValue);
			caret.set(nextIndex);
		}

		e.preventDefault();
	}
//	function onKeyup(e) {
//		var key = e.which || e.keyCode;
//		var pos = caret.get();
//		var begin = pos.begin;
//		var end = pos.end;
//		var value = input.value;
////		console.log('keyup', value, key, pos);
//	}

}


//var KEY = {
//	PAGEUP: 33,
//	PAGEDOWN: 34,
//	END: 35,
//	HOME: 36,
//
//	LEFT: 37,
//	UP: 38,
//	RIGHT: 39,
//	DOWN: 40,
//
//	BACKSPACE: 8,
//	DELETE: 46,
//
//	TAB: 9,
//	ENTER: 13,
//	ESC: 27,
//
//	SHIFT: 16,
//	CTRL: 17,
//	ALT: 18,
//	INSERT: 0,
//	CAPSLOCK: 0
//};