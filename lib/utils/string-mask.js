module.exports = function stringMaskInit(options) {
	return new StringMask(options);
};

function StringMask(options) {
	this._options = {
		mask: options.mask || '',
		placeholder: options.placeholder || '',
		definitions: Object.assign({}, StringMask._defaultDefinitions, options.definitions)
	};

	this._maskParsed = StringMask._parseMask(this._options.mask, this._options.definitions);
	this._offsets = StringMask._countOffsets(this._maskParsed);
}


StringMask._defaultDefinitions = {
	'9': '[0-9]',
	'a': '[A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5]',
	'*': '[0-9A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5]'
};


StringMask._parseMask = function(mask, definitions) {
	var maskParsed = [];
	for (var i = 0; i < mask.length; i++) {
		var char = mask[i];
		var def = definitions[char];

		var parseChar;
		if (typeof def === 'string') {
			parseChar = {regExp: new RegExp(def)};
		} else if (typeof def === 'function') {
			parseChar = {method: def};
		} else if (typeof def === 'object') {
			parseChar = def;
		} else {
			parseChar = {const: char};
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
		if (!charTest.const) l++;
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
		while (maskParsed[index] && maskParsed[index].const) {
			result += maskParsed[index].const;
			index++;
		}

		var char = value.charAt(i);
		var charRes = this.charMask(index, char);
		result += charRes || placeholder[index] || '';
	}
	return result;
};


StringMask.prototype.unmask = function getPlaceholder(value) {
	var result = '';
	for (var i = 0; i < value.length; i++) {
		var char = value.charAt(i);
		var charTest = this._maskParsed[i];
		if (charTest && charTest.const) {
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

		while (maskParsed[index] && maskParsed[index].const && char !== maskParsed[index].const) {
			result += maskParsed[index].const;
			index++;
		}
		var charRes = this.charMask(index, char);
		result += charRes || placeholder[index] || '';
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
	if (charTest.const) {
		return charTest.const;
	}
	return char;
};


StringMask.prototype.skip = function skip(index, direction) {
	var maskParsed = this._maskParsed;
	while (maskParsed[index] && maskParsed[index].const) {
		index += direction;
	}
	return index;
};


StringMask.prototype.firstToType = function firstToType(value) {
	var placeholderDiffFrom = 0;
	var placeholder = this._options.placeholder;
	var maskParsed = this._maskParsed;
	for (var i = 0; i < value.length; i++) {
		var char = value[i];
		var resChar = this.charMask(i, char);
		if (char != placeholder.charAt(i) || maskParsed[i].const) placeholderDiffFrom = i + 1;
		if (!resChar) break;
	}
	return Math.min(i, placeholderDiffFrom);
};
