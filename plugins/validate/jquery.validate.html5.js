(function($) {

function isNumber(val) {
	return /^-?\d*\.?\d+(e-?\d+)?$/.test(val);
};

var attrs = [
	'type',
	'min',
	'max',
	//'step',
	//'maxlength',
	//'pattern',
	'required'
];

var _rules = $.validator.prototype.rules;
$.validator.prototype.rules = function(element) {
	var validator = this;
	
	var props = {};
	$.each(attrs, function() {
		props[this] = $(element).attr(this);
	});
	
	var rules = $.extend(
		props.type == 'email' ? {email: true} : {},
		props.type == 'url' ? {url: true} : {},
		isNumber(props.min) ? {minValue: props.min} : {},
		isNumber(props.max) ? {maxValue: props.max} : {},
		props.required ? {required: true} : {}
	);
	
	if (rules != {}) {
		validator.settings = validator.settings || $.validator.defaults;
		validator.settings.rules = validator.settings.rules || {};
		validator.settings.rules[element.name] =
			$.extend(validator.settings.rules[element.name] || {}, rules);
	}
	
	return _rules.apply(this, arguments);
};

})(jQuery);