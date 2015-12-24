$.fn.mask = function(mask, options) {
	if (typeof mask === 'string') {
		options = options || {};
		options.mask = mask;
	} else {
		options = mask;
	}
	var inputMask = require('./utils/input-mask');
	return inputMask(this, options);
};