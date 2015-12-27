module.exports = inputMask;

function inputMask(input, options) {
	var caret = require('./caret')(input);
	var stringMask = require('./string-mask')(options);

	input.value = stringMask.getPlaceholder(input.value);

	input.addEventListener('focus', onFocus);
	input.addEventListener('keydown', onKeydown);
	input.addEventListener('input', onInput);
	input.addEventListener('keyup', onInput);

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

	function onKeydown(e) {
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

	function onInput(e) {
		var val = input.value;
		var newVal = stringMask.getPlaceholder(val);
		if (val === newVal) return;
		var begin = caret.get().begin;
		input.value = newVal;
		caret.set(begin);
	}
}
