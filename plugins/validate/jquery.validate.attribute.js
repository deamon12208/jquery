(function($) {

function isNumber(val) {
	return /^-?\d*\.?\d+(e-?\d+)?$/.test(val);
};

var types = [
	'creditcard',
	'date',
	'dateDE',
	'dateISO',
	'digits',
	'email',
	'number',
	'numberDE',
	'url'
];

var attrs = [
	//'accept',
	'equalTo',
	'max',
	'maxlength',
	'min',
	'minlength',
	//'pattern',
	'required',
	//'step',
	'type'
];

var _rules = $.validator.prototype.rules;
$.validator.prototype.rules = function(element) {
	var validator = this;
	$element = $(element);
	
	var props = {};
	$.each(attrs, function() {
		props[this] = $element.attr(this);
	});
	
	// maxlength may be returned as -1 for text inputs
	if (props.maxlength == -1) {
		delete props.maxlength;
	}
	
	var rules = $.extend(
		isNumber(props.min) && !isNumber(props.max) ? {min: props.min} : {},
		isNumber(props.max) && !isNumber(props.min) ? {max: props.max} : {},
		isNumber(props.min) && isNumber(props.max) ?
			{rangeValue: [props.min, props.max]} : {},
		isNumber(props.minlength) && !isNumber(props.maxlength) ?
			{minLength: props.minlength} : {},
		isNumber(props.maxlength) && !isNumber(props.minlength) ?
			{maxLength: props.maxlength} : {},
		isNumber(props.minlength) && isNumber(props.maxlength) ?
			{rangeLength: [props.minlength, props.maxlength]} : {},
		props.required ? {required: true} : {}
	);
	
	var typeRules = {};
	$.each(types, function() {
		if (props.type == this || $element.attr(this)) {
			typeRules[this] = true;
		}
	});
	$.extend(rules, typeRules);
	
	if (rules != {}) {
		validator.settings = validator.settings || $.validator.defaults;
		validator.settings.rules = validator.settings.rules || {};
		validator.settings.rules[element.name] =
			$.extend(validator.settings.rules[element.name] || {}, rules);
	}
	
	return _rules.apply(this, arguments);
};

})(jQuery);