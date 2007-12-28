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
	$.each(options, function(class, rules) {
		options[class] = $.validator.normalizeRules(rules);
	});
	$.extend(classRules, options);
};

})(jQuery);