var charMap = {
	'9': '[0-9]',
	'a': '[A-Za-z]',
	'*': '[A-Za-z0-9]',
	'x': function(char) {
		return char === 'x' ? 'z' : char;
	}
};

module.exports = function stringMaskInit(options) {
	return new StringMask(options);
};

function StringMask(options) {
	this._options = {
		mask: options.mask || '',
		placeholder: options.placeholder || ''
	};
	var charsTests = this._charsTests = [];
	for (var i = 0; i < options.mask.length; i++) {
		var char = options.mask[i];

		var def = charMap[char];
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

		charsTests.push(parseChar);
	}
}

StringMask.prototype.addConsts = function getPlaceholder(value, pos) {
	var result = '';
	var begin = pos.begin;
	var end = pos.end;
	var charsTests = this._charsTests;
	var placeholder = this._options.placeholder;
	var index = 0;
	for (var i = 0; i < value.length; i++, index++) {
		var char = value.charAt(i);

		while (charsTests[index] && charsTests[index].const) {
			result += charsTests[index].const;
			index++;
			if (pos.begin >= i) begin++;
			if (pos.end >= i) end++;
		}
		var charRes = this.charMask(index, char);
		result += charRes || placeholder[index] || '';
	}
	return {
		value: result,
		pos: {
			begin: begin,
			end: end
		}
	}
};

StringMask.prototype.removeConsts = function getPlaceholder(value, pos) {
	var result = '';
	var begin = pos.begin;
	var end = pos.end;
	for (var i = 0; i < value.length; i++) {
		var char = value.charAt(i);
		var charTest = this._charsTests[i];
		if (charTest && charTest.const) {
			if (pos.begin > i) begin--;
			if (pos.end > i) end--;
			continue;
		}
		result += char;
//		console.log('check', result, begin, end)
	}
	return {
		value: result,
		pos: {
			begin: begin,
			end: end
		}
	};
};

StringMask.prototype.getPlaceholder = function getPlaceholder(value) {
//	console.log('getPlaceholder', value)
	var result = '';
	var placeholder = this._options.placeholder;
	var charsTests = this._charsTests;
	var index = 0;
	for (var i = 0; i < value.length; i++, index++) {
		var char = value.charAt(i);

		while (charsTests[index] && charsTests[index].const && char !== charsTests[index].const) {
			result += charsTests[index].const;
			index++;
		}
		var charRes = this.charMask(index, char);
		result += charRes || placeholder[index] || '';
	}
	return result + placeholder.substring(result.length);
};

StringMask.prototype.charMask = function charMask(index, char) {
	var charTest = this._charsTests[index];
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
	do {
		index += direction;
		var charTest = this._charsTests[index];
	} while (charTest && charTest.const);
	return index;
};

StringMask.prototype.firstToType = function firstToType(value) {
	var placeholderDiffFrom = 0;
	var placeholder = this._options.placeholder;
	var charsTests = this._charsTests;
	for (var i = 0; i < value.length; i++) {
		var char = value[i];
		var resChar = this.charMask(i, char);
		if (char != placeholder.charAt(i) || charsTests[i].const) placeholderDiffFrom = i + 1;
		if (!resChar) break;
	}
	return Math.min(i, placeholderDiffFrom);
};


//var res = stringMaskParse('99.99.9999');
//console.log('res', res)
