(function($) {

$.extend($.validator, {
	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		dateDE: {dateDE: true},
		number: {number: true},
		numberDE: {numberDE: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},
	
	addClassRules: function(className, rules) {
		className.constructor == String ?
			this.classRuleSettings[className] = rules :
			$.extend(this.classRuleSettings, className);
	},
	
	classRules: function(element) {
		var rules = {};
		$.each($(element).attr('class').split(' '), function() {
			if (this in $.validator.classRuleSettings) {
				$.extend(rules, $.validator.classRuleSettings[this]);
			}
		});
		return rules;
	},
	
	attributeRules: function(element) {
		var rules = {};
		var $element = $(element);
		
		for (method in $.validator.methods) {
			var value = $element.attr(method);
			if (value !== '') {
				rules[method] = value;
			}
		}
		
		// maxlength may be returned as -1 for text inputs
		if (rules.maxlength && rules.maxlength == -1) {
			delete rules.maxlength;
		}
		
		return rules;
	},
	
	metadataRules: function(element) {
		if (!$.metadata) return {};
		
		var meta = $.data(element.form, 'validator').settings.meta;
		return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
	},
	
	normalizeRules: function(rules) {
		// convert deprecated rules
		$.each({
			minLength: 'minlength',
			maxLength: 'maxlength',
			rangeLength: 'rangelength',
			minValue: 'min',
			maxValue: 'max',
			rangeValue: 'range'
		}, function(dep, curr) {
			if (rules[dep]) {
				rules[curr] = rules[dep];
				delete rules[dep];
			}
		});
		
		// clean number parameters
		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
			if (rules[this]) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			if (rules[this]) {
				rules[this] = [Number(rules[this[0]]), Number(rules[this[1]])];
			}
		});
		
		// auto-create ranges
		if (rules.min && rules.max) {
			rules.range = [rules.min, rules.max];
			delete rules.min;
			delete rules.max;
		}
		if (rules.minlength && rules.maxlength) {
			rules.rangelength = [rules.minlength, rules.maxlength];
			delete rules.minlength;
			delete rules.maxlength;
		}
		
		return rules;
	}
});

$.fn.rules = function() {
	var element = this[0];
	var data = $.validator.normalizeRules($.extend(
		$.validator.metadataRules(element),
		$.validator.classRules(element),
		$.validator.attributeRules(element)
	));
	
	// convert from object to array
	var rules = [];
	$.each(data, function(method, value) {
		rules.push({
			method: method,
			parameters: $.isFunction(value) ? value(element) : value
		});
	});
	return rules;
};

})(jQuery);