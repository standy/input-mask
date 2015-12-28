module.exports = inputMask;

function inputMask(input, options) {
	var caret = require('./caret')(input);
	var stringMask = require('./string-mask')(options);

	input.value = stringMask.getPlaceholder(input.value);

	on('focus', onFocus);
	on('keydown', onKeydown);
	on('keypress', onKeypress);
	on('input', onInput);
	on('keyup', onInput);

	var IGNORE_KEYS = [
		45, /* insert */
		91, /* l-win */
		92, /* r-win */
		93, /* select key */
//		112, /* f1 */
//		113, /* f2 */
//		114, /* f3 */
//		115, /* f4 */
//		116, /* f5 */
//		117, /* f6 */
//		118, /* f7 */
//		119, /* f8 */
//		120, /* f9 */
//		121, /* f10 */
//		122, /* f11 */
//		123, /* f12 */
		144, /* num lock */
		145, /* scroll lock */
		224, /* apple-command */
	];
	function isIgnoreKey(key) {
		return key < 32 || key > 32 && key <= 40 || key > 111 && key < 124 || IGNORE_KEYS.indexOf(key) >= 0;
	}

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
		if (!isBs && !isDel) {
			return;
		}

		var maskedValue = input.value;

		var maskedPos = caret.get();
		var value = stringMask.unmask(maskedValue);
		var begin = stringMask.unmaskIndex(maskedPos.begin);
		var end = stringMask.unmaskIndex(maskedPos.end);

		var resValue = null;

		var removePos = begin;
		if (isBs) removePos--;
		if (end !== begin) {
			resValue = value.substring(0, begin) + value.substring(end);
		} else {
			resValue = value.substring(0, removePos) + value.substring(removePos + 1);
		}

		var nextIndex = stringMask.maskIndex(removePos);
		if (isDel) {
			nextIndex = stringMask.skip(nextIndex, 1);
		}

		setValueUnmasked(resValue, nextIndex);

		if (e.preventDefault) e.preventDefault();
		return false;
	}

	function onKeypress(e) {
		var key = e.which || e.keyCode;

		var isSpecialKey = e.which === 0 || e.charCode === 0;
		if (e.ctrlKey || e.altKey || e.metaKey || !key || (isSpecialKey && isIgnoreKey(key))) {
			return;
		}

		var maskedValue = input.value;

		var maskedPos = caret.get();
		var value = stringMask.unmask(maskedValue);
		var begin = stringMask.unmaskIndex(maskedPos.begin);
		var end = stringMask.unmaskIndex(maskedPos.end);

		var char = String.fromCharCode(key);
		var actualBegin = stringMask.skip(maskedPos.begin, 1);
		var resChar = stringMask.charMask(actualBegin, char);
		if (resChar) {
			var resValue = value.substring(0, begin) + resChar + value.substring(end);
			var nextIndex = stringMask.skip(stringMask.maskIndex(begin + 1), 1);

			setValueUnmasked(resValue, nextIndex);
		}

		if (e.preventDefault) e.preventDefault();
		return false;
	}

	function onInput(e) {
		var val = input.value;
		var newVal = stringMask.getPlaceholder(val);
		if (val === newVal) return;
		var begin = caret.get().begin;
		input.value = newVal;
		caret.set(begin);
	}

	function setValueUnmasked(value, index) {
		var resMaskedValue = stringMask.mask(value);
		input.value = stringMask.getPlaceholder(resMaskedValue);
		caret.set(index);
	}
}
