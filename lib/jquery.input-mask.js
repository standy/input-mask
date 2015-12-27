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
	var inputMask = require('./utils/input-mask');
	return inputMask(this, options);
};