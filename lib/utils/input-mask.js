module.exports = inputMask;

function inputMask(input, options) {
	var caret = require('./caret')(input);
	var stringMask = require('./string-mask')(options);

	input.value = stringMask.getPlaceholder(input.value);

	on('focus', onFocus);
	on('keydown', onKeydown);
	on('input', onInput);
	on('keyup', onInput);

	var IGNORE_KEYS = [
		45, /* insert */
		91, /* l-win */
		92, /* r-win */
		93, /* select key */
		112, /* f1 */
		113, /* f2 */
		114, /* f3 */
		115, /* f4 */
		116, /* f5 */
		117, /* f6 */
		118, /* f7 */
		119, /* f8 */
		120, /* f9 */
		121, /* f10 */
		122, /* f11 */
		123, /* f12 */
		144, /* num lock */
		145, /* scroll lock */
	];

	function on(eventName, callback) {
		if (input.addEventListener) {
			input.addEventListener(eventName, callback, false);
		} else {
			input.attachEvent('on' + eventName, callback);
		}
	}

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
		var isBs = key == 8;
		var isDel = key == 46;
		if (e.ctrlKey || e.altKey || e.metaKey || !key || (key < 40 && !isBs && !isDel) || IGNORE_KEYS.indexOf(key) >= 0) {
			return;
		}

		var maskedValue = input.value;

		var maskedPos = caret.get();
		var value = stringMask.unmask(maskedValue);
		var begin = stringMask.unmaskIndex(maskedPos.begin);
		var end = stringMask.unmaskIndex(maskedPos.end);

		var resValue = null;
		var nextIndex;

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
