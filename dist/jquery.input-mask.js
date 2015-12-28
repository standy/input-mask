/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	$.fn.mask = function(mask, options) {
		if (typeof mask === 'string') {
			options = options || {};
			options.mask = mask;
		} else {
			options = mask;
		}
		if (!options.mask) {
			console.warn('Mask cant be empty');
			return this;
		}
		options.placeholder = options.placeholder || options.mask;
		var inputMask = __webpack_require__(2);
		return inputMask(this[0], options);
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = inputMask;

	function inputMask(input, options) {
		var caret = __webpack_require__(3)(input);
		var stringMask = __webpack_require__(4)(options);

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
				console.log('charMask', actualBegin, char, resChar)
				if (resChar) {
					resValue = value.substring(0, begin) + resChar + value.substring(end);
					nextIndex = stringMask.skip(stringMask.maskIndex(begin + 1), 1);
				}
			}

			console.log('keydown', resChar, resValue)

			if (resValue !== null) {
				var resMaskedValue = stringMask.mask(resValue);
				input.value = stringMask.getPlaceholder(resMaskedValue);
				caret.set(nextIndex);
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
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

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



/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function stringMaskInit(options) {
		return new StringMask(options);
	};

	function StringMask(options) {
		var definitions = {};
		copyKeys(definitions, StringMask._defaultDefinitions);
		copyKeys(definitions, options.definitions);
		this._options = {
			mask: options.mask || '',
			placeholder: options.placeholder || '',
			definitions: definitions
		};

		this._maskParsed = StringMask._parseMask(this._options.mask, this._options.definitions);
		this._offsets = StringMask._countOffsets(this._maskParsed);
	}

	function copyKeys(target, obj) {
		for (var key in obj) if (obj.hasOwnProperty(key)) {
			target[key] = obj[key];
		}
	}

	StringMask._defaultDefinitions = {
		'9': '[0-9]',
		'a': '[A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5]',
		'*': '[0-9A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5]'
	};


	StringMask._parseMask = function(mask, definitions) {
		var maskParsed = [];
		for (var i = 0; i < mask.length; i++) {
			var char = mask.charAt(i);
			var def = definitions[char];

			var parseChar;
			if (typeof def === 'string') {
				parseChar = {regExp: new RegExp(def)};
			} else if (typeof def === 'function') {
				parseChar = {method: def};
			} else if (typeof def === 'object') {
				parseChar = def;
			} else {
				parseChar = {sep: char};
			}

			maskParsed.push(parseChar);
		}
		return maskParsed;
	};

	/**
	 * char in mask -> char
	 * example for 99.99.99: [0,1,2,2,3,4,4,5]
	 * @param maskParsed
	 * @private
	 */
	StringMask._countOffsets = function getPlaceholder(maskParsed) {
		var offsets = [];
		var l = 0;
		offsets.push(0);
		for (var i = 0; i < maskParsed.length; i++) {
			var charTest = maskParsed[i];
			if (!charTest.sep) l++;
			offsets.push(l);
		}
		return offsets;
	};


	StringMask.prototype.maskIndex = function(index) {
		return this._offsets.indexOf(+index);
	};


	StringMask.prototype.unmaskIndex = function(index) {
		return this._offsets[index];
	};


	StringMask.prototype.mask = function(value) {
		var result = '';
		var maskParsed = this._maskParsed;
		var placeholder = this._options.placeholder;
		var index = 0;
		for (var i = 0; i < value.length; i++, index++) {
			while (maskParsed[index] && maskParsed[index].sep) {
				result += maskParsed[index].sep;
				index++;
			}

			var char = value.charAt(i);
			var charRes = this.charMask(index, char);
			result += charRes || placeholder.charAt(index) || '';
		}
		return result;
	};


	StringMask.prototype.unmask = function getPlaceholder(value) {
		var result = '';
		for (var i = 0; i < value.length; i++) {
			var char = value.charAt(i);
			var charTest = this._maskParsed[i];
			if (charTest && charTest.sep) {
				continue;
			}
			result += char;
		}
		return result;
	};


	StringMask.prototype.getPlaceholder = function getPlaceholder(value) {
	//	console.log('getPlaceholder', value)
		var result = '';
		var placeholder = this._options.placeholder;
		var maskParsed = this._maskParsed;
		var index = 0;
		for (var i = 0; i < value.length; i++, index++) {
			var char = value.charAt(i);

			while (maskParsed[index] && maskParsed[index].sep && char !== maskParsed[index].sep) {
				result += maskParsed[index].sep;
				index++;
			}
			var charRes = this.charMask(index, char);
			result += charRes || placeholder.charAt(index) || '';
		}
		return result + placeholder.substring(result.length);
	};


	StringMask.prototype.charMask = function charMask(index, char) {
		var charTest = this._maskParsed[index];
		if (!charTest) return '';

		if (charTest.regExp && !charTest.regExp.test(char)) {
			return '';
		}
		if (charTest.method) {
			return charTest.method(char);
		}
		if (charTest.sep) {
			return charTest.sep;
		}
		return char;
	};


	StringMask.prototype.skip = function skip(index, direction) {
		var maskParsed = this._maskParsed;
		while (maskParsed[index] && maskParsed[index].sep) {
			index += direction;
		}
		return index;
	};

	/**
	 * Find out first position of invalid char
	 * or position where placeholder start to differ
	 * @param value
	 */
	StringMask.prototype.firstToType = function firstToType(value) {
		var placeholder = this._options.placeholder;
		var i = this.skip(0, 1);
		var placeholderDiffFrom = i;
		for (; i < value.length; i++) {
			var char = value.charAt(i);
			if (char !== placeholder.charAt(i)) placeholderDiffFrom = i + 1;
			var resChar = this.charMask(i, char);
			if (!resChar) break;
		}
		return this.skip(Math.min(i, placeholderDiffFrom), 1);
	};


/***/ }
/******/ ]);