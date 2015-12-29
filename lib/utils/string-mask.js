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
	'*': '[0-9A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5]',
	'n': {
		length: 3,
		method: numMethod(3)
	}
};

function numMethod(length) {
	return function(string) {
		string = string.replace(/[^\d]+/g, '').substring(0, length);
		while (string.length < length) string = '0' + string;
		return string;
	}
}


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
StringMask._countOffsets = function(maskParsed) {
	var offsets = [];
	var l = 0;
	offsets.push(0);
	for (var i = 0; i < maskParsed.length; i++) {
		var charTest = maskParsed[i];
		if (charTest.sep) {
			offsets.push(l);
			continue;
		}
		var length = charTest.method ? charTest.length || 1 : 1;
		for (var j = 0; j < length; j++) {
			l++;
			offsets.push(l);
		}
	}
	return offsets;
};


StringMask.prototype.maskIndex = function(index) {
	return this._offsets.indexOf(+index);
};


StringMask.prototype.unmaskIndex = function(index) {
	return this._offsets[index];
};


StringMask.prototype.mask = function(unmaskedValue) {
	var result = '';
	var maskParsed = this._maskParsed;
	var placeholder = this._options.placeholder;
	var index = 0;
	for (var i = 0; i < unmaskedValue.length; i++, index++) {
		var charTest = maskParsed[index];
		if (!charTest) continue;
		while (charTest.sep) {
			result += charTest.sep;
			index++;
			charTest = maskParsed[index];
		}
		if (!charTest) continue;
		if (charTest.method && charTest.length) {
			var valuePart = unmaskedValue.substring(i, i + charTest.length);
			result += charTest.method(valuePart);
			i += charTest.length - 1;
		} else {
			var char = unmaskedValue.charAt(i);
			var charRes = this.charMask(index, char, unmaskedValue);
			result += charRes || placeholder.charAt(index) || '';
		}
	}
	return result;
};

/**
 * Removes separators
 * example for {mask: '!!aa!!', placeholder: '!!##!!'}: '!!z#!!' -> 'z#'
 * @param {string} value - masked input
 * @returns {string}
 */
StringMask.prototype.unmask = function(value) {
	var result = '';
	var valueIndex = 0;
	for (var maskIndex = 0; maskIndex < this._maskParsed.length; maskIndex++) {
		var charTest = this._maskParsed[maskIndex];
		if (charTest && charTest.sep) {
			valueIndex++;
			continue;
		}

		var valuePartLength = charTest && charTest.method && charTest.length ? charTest.length : 1;

		result += value.substring(valueIndex, valueIndex + valuePartLength);
		valueIndex += valuePartLength;
	}
	console.log('unmask', value, result)
	return result;
};


StringMask.prototype.getPlaceholder = function(value) {
//	var result = '';
//	var maskParsed = this._maskParsed;
	var placeholder = this._options.placeholder;
//	var index = 0;
//	for (var i = 0; i < value.length; i++, index++) {
//		var charTest = maskParsed[index];
//		while (charTest && charTest.sep) {
//			result += charTest.sep;
//			index++;
//			charTest = maskParsed[index];
//		}
//		if (charTest && charTest.method && charTest.length) {
//			var valuePart = value.substring(i, i + charTest.length);
//			result += charTest.method(valuePart);
//			i += charTest.length - 1;
//		} else {
//			var char = value.charAt(i);
//			var charRes = this.charMask(index, char, value);
//			result += charRes || placeholder.charAt(index) || '';
//		}
//	}
//	console.log('getPlaceholder', value, result)
//	return result;
	return value + placeholder.substring(value.length);
};


StringMask.prototype.charMask = function charMask(index, char, value) {
//	console.log('charMask', index, char, value)

	var valueIndex = 0;

	var valuePart;
	var charTest;
	for (var i = 0; i < this._maskParsed.length; i++) {
		charTest = this._maskParsed[i];
		var valuePartLength = charTest && charTest.method && charTest.length ? charTest.length : 1;
		valueIndex += valuePartLength;
		if (valueIndex > index) {
			valuePart = value.substring(valueIndex - valuePartLength, valueIndex);
			break;
		}
	}

//	console.log('>', valuePart);
//
	if (!charTest) return '';

	if (charTest.regExp && !charTest.regExp.test(char)) {
		return '';
	}
	if (charTest.method) {
		return charTest.method(valuePart);
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
		var resChar = this.charMask(i, char, value);
		if (!resChar) break;
	}
	return this.skip(Math.min(i, placeholderDiffFrom), 1);
};


var test = new StringMask({
	mask: '99.99',
	placeholder: 'mm.dd'
});
//var test = new StringMask({
//	mask: '.n.a.',
//	placeholder: '.xxx.@.'
//});
console.log('test', test._offsets)
StringMask._countOffsets(test._maskParsed);;
console.log('test mask', test.mask('123z5'));
console.log('test unmask', test.unmask('12.345'));
console.log('test maskIndex', test.maskIndex(5));
console.log('test unmaskIndex', test.unmaskIndex(5));
console.log('test charMask', test.charMask(6, '1', '88.88'));

