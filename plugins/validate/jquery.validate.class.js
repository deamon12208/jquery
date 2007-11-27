(function($) {

var classRules = {};

var rules = $.validator.prototype.rules;
$.validator.prototype.rules = function(element) {
	var validator = this;
	var classes = $(element).attr('class');
	if (classes) {
		validator.settings = validator.settings || $.validator.defaults;
		validator.settings.rules = validator.settings.rules || {};
		$.each(classes.split(' '), function() {
			if (this in classRules) {
				validator.settings.rules[element.name] =
					$.extend(validator.settings.rules[element.name] || {},
					classRules[this]);
			}
		});
	}
	return rules.apply(this, arguments);
};

$.validator.addClassRules = function(options) {
	// convert a simple string to a {string: true} rule, eg. "required" to {required:true}
	$.each(options, function(class, rules) {
		// TODO: create a utility function to do this
		if (typeof rules == "string") {
			var transformed = {};
			transformed[rules] = true;
			options[class] = transformed;
		}
	});
	$.extend(classRules, options);
};

})(jQuery);