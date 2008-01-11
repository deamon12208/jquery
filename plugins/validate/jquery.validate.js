/*
 * jQuery form validation plug-in v1.2pre
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id$
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * Validates a single form.
 *
 * The normal behaviour is to validate a form when a submit button is clicked or
 * the user presses enter when an input of that form is focused.
 *
 * It is also possible to validate each individual element of that form, eg. on blur or keyup.
 *
 * @example $("#myform").validate();
 * @before <form id="myform">
 *   <input name="firstname" class="{required:true}" />
 * </form>
 * @desc Validates a form on submit. Rules are read from metadata.
 *
 * @example $("input").validate({
 * 		event: "blur",
 *		success: "valid"
 * });
 * @desc Validates all input elements on blur event (when the element looses focus).
 * Adds a class "valid" to all error labels when the elements are valid and keeps showing
 * them.
 *
 * @example $("#myform").validate({
 *   submitHandler: function(form) {
 *   	$(form).ajaxSubmit();
 *   }
 * });
 * @desc Uses form plugin's ajaxSubmit method to handle the form submit, while preventing
 * the default submit.
 *
 * @example $("#myform").validate({
 *  event: "keyup"
 * 	rules: {
 * 		"first-name": "required",
 * 		age: {
 *			required: "#firstname:blank",
 * 			number: true,
 * 			minValue: 3
 * 		},
 * 		password: {
 * 			required: function() {
 * 				return $("#age").val() < 18;
 * 			},
 * 			minLength: 5,
 * 			maxLength: 32
 * 		}
 * 	},
 *  messages: {
 * 		password: {
 * 			required: function(element, validator) {
 * 				return "Your password is required because with " + $("#age").val() + ", you are not old enough yet."
 * 			},
 * 			minLength: "Please enter a password at least 5 characters long.",
 * 			maxLength: "Please enter a password no longer than 32 characters long."
 * 		},
 *		age: "Please specify your age as a number (at least 3)."
 * 	}
 * });
 * @desc Validate a form on submit and each element on keyup. Rules are specified
 * for three elements, and a message is customized for the "password" and the
 * "age" elements. Inline rules are ignored. The password is only required when the age is lower
 * than 18. The age is only required when the firstname is blank. Note that "first-name" is quoted, because
 * it isn't a valid javascript identifier. "first-name": "required" also uses a shortcut replacement for
 * { required: true }. That works for all trivial validations that expect no more than a boolean-true argument.
 * The required-message for password is specified as a function to use runtime customization.
 *
 * @example $("#myform").validate({
 *   errorClass: "invalid",
 *   errorLabelContainer: $("#messageBox"),
 *   wrapper: "li"
 * });
 * @before <ul id="messageBox"></ul>
 * <form id="myform" action="/login" method="post">
 *   <label>Firstname</label>
 *   <input name="fname" class="{required:true}" />
 *   <label>Lastname</label>
 *   <input name="lname" title="Your lastname, please!" class="{required:true}" />
 * </form>
 * @result <ul id="messageBox">
 *   <li><label for="fname" class="invalid">Please specify your firstname!</label></li>
 *   <li><label for="lname" class="invalid">Your lastname, please!</label></li>
 * </ul>
 * <form id="myform" action="/login" method="post">
 *   <label>Firstname</label>
 *   <input name="fname" class="{required:true} invalid" />
 *   <label>Lastname</label>
 *   <input name="lname" title="Your lastname, please!" class="{required:true} invalid" />
 * </form>
 * @desc All error labels are displayed inside an unordered list with the ID "messageBox", as specified by the jQuery object passed as errorContainer option. All error elements are wrapped inside an li element, to create a list of messages.
 *
 *
 * @example $("#myform").validate({
errorPlacement: function(error, element) {
	error.appendTo( element.parent("td").next("td") );
},
 * 	success: function(label) {
 * 		label.text("ok!").addClass("success");
 * 	}
 * });
 * @before <form id="myform" action="/login" method="post">
<table>
	<tr>
		<td><label>Firstname</label>
		<td><input name="fname" class="{required:true}" value="Pete" /></td>
		<td></td>
	</tr>
	<tr>
		<td><label>Lastname</label></td>
		<td><input name="lname" title="Your lastname, please!" class="{required:true}" /></td>
		<td></td>
	</tr>
</table>
</form>
 * @result <form id="myform" action="/login" method="post">
<table>
	<tr>
		<td><label>Firstname</label>
		<td><input name="fname" class="{required:true}" value="Pete" /></td>
		<td><label for="fname" class="invalid success">ok!</label></td>
	</tr>
	<tr>
		<td><label>Lastname</label></td>
		<td><input name="lname" title="Your lastname, please!" class="{required:true}" /></td>
		<td><label for="lname" class="invalid">Your lastname, please!</label></td>
	</tr>
</table>
 * </form>
 * @desc Validates a form on submit. Customizes the placement of the generated labels
 * by appending them to the next table cell. Displays "ok!" for valid elements and adds a class
 * "success" to the message (the class "invalid" is kept to identify the error label).
 *
 * @example $("#myform").validate({
 *   errorContainer: $("#messageBox1, #messageBox2"),
 *   errorLabelContainer: $("#messageBox1 ul"),
 *   wrapper: "li",
 * });
 * @before <div id="messageBox1">
 *   <h3>The are errors in your form!</h3>
 *   <ul></ul>
 * </div>
 * <form id="myform" action="/login" method="post">
 *   <label>Firstname</label>
 *   <input name="fname" class="{required:true}" />
 *   <label>Lastname</label>
 *   <input name="lname" title="Your lastname, please!" class="{required:true}" />
 * </form>
 * <div id="messageBox2">
 *   <h3>The are errors in your form, see details above!</h3>
 * </div>
 * @result <ul id="messageBox">
 *   <li><label for="fname" class="error">Please specify your firstname!</label></li>
 *   <li><label for="lname" class="error">Your lastname, please!</label></li>
 * </ul>
 * <form id="myform" action="/login" method="post">
 *   <label>Firstname</label>
 *   <input name="fname" class="{required:true} error" />
 *   <label>Lastname</label>
 *   <input name="lname" title="Your lastname, please!" class="{required:true} error" />
 * </form>
 * @desc Validates a form on submit. Similar to the above example, but with an additional
 * container for error messages. The elements given as the errorContainer are all shown
 * and hidden when errors occur. But the error labels themselve are added to the element(s)
 * given as errorLabelContainer, here an unordered list. Therefore the error labels are
 * also wrapped into li elements (wrapper option).
 *
 * @param Map options Optional settings to configure validation
 * @option String errorClass Use this class to look for existing error labels and add it toinvalid elements. Default: "error"
 * @option String wrapper Wrap error labels with the specified element, eg "li". Default: none
 * @option Boolean debug If true, the form is not submitted and certain errors are display on the console (requires Firebug or Firebug lite). Default: none
 * @option Boolean focusInvalid Focus the last active or first invalid element on submit or via validator.focusInvalid(). Default: true
 * @option Function submitHandler Callback for handling the actual submit when the form is valid. Gets the form as the only argmument. Default: normal form submit
 * @option Map<String, Object> messages Key/value pairs defining custom messages. Key is the name of an element, value the message to display for that element. Instead of a plain message	another map with specific messages for each rule can be used. Can be specified for one or more elements. Overrides the title attribute of an element. Each message can be a String or a Function. The Function is called with the element as the first and the validator as the second argument and must return a String to display as the message for that element. Default: none, the default message for the method is used.
 * @option Map<String, Object> rules Key/value pairs defining custom rules. Key is the ID or name (for radio/checkbox inputs) of an element, value is an object consisting of rule/parameter pairs, eg. {required: true, min: 3}. Once specified, metadata rules are completely ignored. Default: none, rules are read from metadata via metadata plugin
 * @option Boolean onsubmit Validate the form on submit. Set to false to use only other events for validation (option event). Default: true
 * @option String meta In case you use metadata for other plugins, too, you want to wrap your validation rules into their own object that can be specified via this option. Default: none
 * @option jQuery errorContainer Hide and show this container when validating. Default: none
 * @option jQuery errorLabelContainer Search and append error labels to this container, and show and hide it accordingly. Default: none
 * @option Function showErrors A custom message display handler. Gets the map of errors as the first argument and a refernce to the validator object as the second. You can trigger (in addition to your own messages) the default behaviour by calling the defaultShowErrors() method of the validator. Default: none, uses built-in message disply.
 * @option Function errorPlacement Used to customize placement of created error labels. First argument: jQuery object containing the created error label Second argument: jQuery object containing the invalid element Default: Places the error label after the invalid element
 * @option String errorElement The element to use for generated error messages. Default: "label"
 * @option String|Function success If specified, the error label is displayed to show a valid element. If a String is given, its added as a class to the label. If a Function is given, its called with the label (as a jQuery object) as its only argument. That can be used to add a text like "ok!". Default: none
 * @option Boolean focusCleanup If enabled, removes the errorClass from the invalid elements and hides all errors messages whenever the element is focused. Avoid combination with focusInvalid. Default: false
 * @option String|Element ignore Elements to ignore when validating, simply filtering them out. jQuery's not-method is used, therefore everything that is accepted by not() can be passed as this option. Inputs of type submit and reset are always ignored, so are disabled elements. Default: None
 * @opton Boolean onblur Validate elements on blur. If nothing is entered, all rules are skipped, except when the field was already marked as invalid. Default: true
 * @option Callback subformRequired Called to determine if a subform is required. An input is passed as the argument, and a boolean is expected to return: If it returns false, the input is part of an optional subform, therefore not required. Default: none
 * @option Function highlight Function that "highlights" errored fields. By default, it adds the current 'errorClass' setting
 *      directly to the errored element. Replace this with your own function when you want to modify how or which elements get
 *      highlighted when a field is invalid. Accepts two parameters: a reference to the error element, and the current errorClass.
 * @option Function unHighlight Function that undoes the highlighting by the above function. By default, it removes the current
 *      'errorClass' setting from the errored element. Accepts two parameters: a reference to the error element, and the
 *      current errorClass.
 *
 * @name validate
 * @type $.validator
 * @cat Plugins/Validate
 */

jQuery.extend(jQuery.fn, {
	validate: function( options ) {
		
		// check if a validator for this form was already created
		var validator = jQuery.data(this[0], 'validator');
		if ( validator ) {
			return validator;
		}
		
		validator = new jQuery.validator( options, this[0] );
		jQuery.data(this[0], 'validator', validator); 
		
		if ( validator.settings.onsubmit ) {
		
			// allow suppresing validation by adding a cancel class to the submit button
			this.find("input.cancel:submit").click(function() {
				validator.cancelSubmit = true;
			});
		
			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug )
					// prevent form submit to be able to see console output
					event.preventDefault();
					
				function handle() {
					if ( validator.settings.submitHandler ) {
						validator.settings.submitHandler.call( validator, validator.currentForm );
						return false;
					}
					return true;
				}
					
				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}
		
		return validator;
	},
	valid: function() {
        if ( jQuery(this[0]).is('form')) {
            return this.validate().form();
        } else {
            var valid = true;
            var validator = jQuery(this[0].form).validate();
            this.each(function() {
                valid = validator.element(this) && valid;
            });
            return valid;
        }
    },
	rules: function() {
		function data( element ) {
			var validator = jQuery.data(element.form, "validator");
			return validator.settings.rules
				? validator.settings.rules[ element.name ]
				: validator.settings.meta
					? jQuery(element).metadata()[ validator.settings.meta ]
					: jQuery(element).metadata();
		}
		
		var element = this[0]
		var data = data( element );
		if( !data )
			return [];
		var rules = [];
		data = jQuery.validator.normalizeRules(data);
		if (data.min && data.max) {
			data.range = [data.min, data.max];
			delete data.min;
			delete data.max;
		}
		if (data.minlength && data.maxlength) {
			data.rangelength = [data.minlength, data.maxlength];
			delete data.minlength;
			delete data.maxlength;
		}
		jQuery.each( data, function(key, value) {
			rules[rules.length] = {
				method: key,
				parameters: jQuery.isFunction(value) ? value(element) : value
			};
		} );
		return rules;
	},
	// destructive add
	push: function( t ) {
		return this.setArray( this.add(t).get() );
	}
});

// Custom selectors
jQuery.extend(jQuery.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: "!jQuery.trim(a.value)",
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: "!!jQuery.trim(a.value)",
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: "!a.checked"
});

/**
 * Simple string-templating, similar to Java's MessageFormat.
 *
 * Accepts a string template as the first argument. The second is optional:
 * If specified, it is used to replace placeholders in the first argument.
 *
 * It can be an Array of values or any other type, in which case only one value
 * is replaced.
 *
 * If the second argument is ommited, a function is returned that expects the value-argument
 * to return the formatted value (see example).
 *
 * @example jQuery.format("Please enter a value no longer than {0} characters.", 0)
 * @result "Please enter a value no longer than 0 characters."
 * @desc Formats a string with a single argument.
 *
 * @example jQuery.format("Please enter a value between {0} and {1}.", 0, 1)
 * @result "Please enter a value between 0 and 1."
 * @desc Formats a string with two arguments. Same as jQuery.format("...", [0, 1]);
 *
 * @example jQuery.format("Please enter a value no longer than {0} characters.")(0);
 * @result "Please enter a value no longer than 0 characters."
 * @desc jQuery.format is called at first without the second argument, returning a function that is called immediately
 * 		 with the value argument. Useful to defer the actual formatting to a later point without explicitly 
 *		 writing the function.
 *
 * @type String
 * @name jQuery.format
 * @cat Plugins/Validate
 */
jQuery.format = function(source, params) {
	if ( arguments.length == 1 ) 
		return function() {
			var args = jQuery.makeArray(arguments);
			args.unshift(source);
			return jQuery.format.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = jQuery.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	jQuery.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

// constructor for validator
jQuery.validator = function( options, form ) {
	this.settings = jQuery.extend( {}, jQuery.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

jQuery.extend(jQuery.validator, {

	defaults: {
		messages: {},
		errorClass: "error",
		errorElement: "label",
		focusInvalid: true,
		errorContainer: jQuery( [] ),
		errorLabelContainer: jQuery( [] ),
		onsubmit: true,
		ignore: [],
		onfocusin: function(element) {
			this.lastActive = element;
				
			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				this.settings.unhighlight.call( this, element, this.settings.errorClass );
				this.errorsFor(element).hide();
			}
		},
		onfocusout: function(element) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function(element) {
			if ( element.name in this.submitted || element == this.lastElement ) {
				this.element(element);
			}
		},
		onclick: function(element) {
			if ( element.name in this.submitted )
				this.element(element);
		},
		highlight: function( element, errorClass ) {
			jQuery( element ).addClass( errorClass );
		},
		unhighlight: function( element, errorClass ) {
			jQuery( element ).removeClass( errorClass );
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function(settings) {
		jQuery.extend( jQuery.validator.defaults, settings );
	},

	/**
	 * Default messages for all default methods.
	 *
	 * Use addMethod() to add methods with messages.
	 *
	 * Replace these messages for localization.
	 *
	 * @property
	 * @type String
	 * @name jQuery.validator.messages
	 * @cat Plugins/Validate
	 */
	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		dateDE: "Bitte geben Sie ein gültiges Datum ein.",
		number: "Please enter a valid number.",
		numberDE: "Bitte geben Sie eine Nummer ein.",
		digits: "Please enter only digits",
		creditcard: "Please enter a valid credit card.",
		equalTo: "Please enter the same value again.",
		accept: "Please enter a value with a valid extension.",
		maxlength: jQuery.format("Please enter a value no longer than {0} characters."),
		maxLength: jQuery.format("Please enter a value no longer than {0} characters."),
		minlength: jQuery.format("Please enter a value of at least {0} characters."),
		minLength: jQuery.format("Please enter a value of at least {0} characters."),
		rangelength: jQuery.format("Please enter a value between {0} and {1} characters long."),
		rangeLength: jQuery.format("Please enter a value between {0} and {1} characters long."),
		rangeValue: jQuery.format("Please enter a value between {0} and {1}."),
		range: jQuery.format("Please enter a value between {0} and {1}."),
		maxValue: jQuery.format("Please enter a value less than or equal to {0}."),
		max: jQuery.format("Please enter a value less than or equal to {0}."),
		minValue: jQuery.format("Please enter a value greater than or equal to {0}."),
		min: jQuery.format("Please enter a value greater than or equal to {0}.")
	},
	
	/**
	 * Converts a simple string to a {string: true} rule, e.g., "required" to
	 * {required:true}
	 */
	normalizeRules: function(data) {
		if( typeof data == "string" ) {
			var transformed = {};
			transformed[data] = true;
			data = transformed;
		}
		return data;
	},
	
	prototype: {
		
		init: function() {
			this.labelContainer = jQuery(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || jQuery(this.currentForm);
			this.containers = jQuery(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();
			
			function delegate(event) {
				var validator = jQuery.data(this[0].form, "validator");
				validator.settings["on" + event.type] && validator.settings["on" + event.type].call(validator, this[0] );
			}
			jQuery(this.currentForm)
				.delegate("focusin focusout keyup", ":text, :password, :file, select, textarea", delegate)
				.delegate("click", ":radio, :checkbox", delegate);
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.prepareForm();
			var elements = this.elements();
			for ( var i = 0; elements[i]; i++ ) {
				this.check( elements[i] );
			}
			jQuery.extend(this.submitted, this.errorMap);
			this.invalid = jQuery.extend({}, this.errorMap);
			this.settings.invalidHandler && this.settings.invalidHandler.call(this);
			this.showErrors();
			return this.valid();
		},
		
		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.clean( element );
			this.lastElement = element;
			this.prepareElement( element );
			var result = this.check( element );
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide.push( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function(errors) {
			if(errors) {
				// add items to error list and map
				jQuery.extend( this.errorMap, errors );
				this.errorList = [];
				for ( name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = jQuery.grep( this.successList, function(element) {
					return !(element.name in errors);
				});
			}
			this.settings.showErrors
				? this.settings.showErrors.call( this, this.errorMap, this.errorList )
				: this.defaultShowErrors();
		},
		
		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( jQuery.fn.resetForm )
				jQuery( this.currentForm ).resetForm();
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass );
		},
		
		/**
		 * Returns the number of invalid elements in the form.
		 * 
		 * @example $("#myform").validate({
		 * 	showErrors: function() {
		 * 		$("#summary").html("Your form contains " + this.numberOfInvalids() + " errors, see details below.");
		 * 		this.defaultShowErrors();
		 * 	}
		 * });
		 * @desc Specifies a custom showErrors callback that updates the number of invalid elements each
		 * time the form or a single element is validated.
		 * 
		 * @name jQuery.validator.prototype.numberOfInvalids
		 * @type Number
		 */
		numberOfInvalids: function() {
			var count = 0;
			for ( i in this.invalid )
				count++;
			return count;
		},
		
		/**
		 * Hides all error messages in this form.
		 * 
		 * @example var validator = $("#myform").validate();
		 * $(".cancel").click(function() {
		 * 	validator.hideErrors();
		 * });
		 * @desc Specifies a custom showErrors callback that updates the number of invalid elements each
		 * time the form or a single element is validated.
		 * 
		 * @name jQuery.validator.prototype.hideErrors
		 */
		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},
		
		valid: function() {
			return this.size() == 0;
		},
		
		size: function() {
			return this.errorList.length;
		},
		
		focusInvalid: function() {
			if( this.settings.focusInvalid ) {
				try {
					jQuery(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus();
				} catch(e) { /* ignore IE throwing errors when focusing hidden elements */ }
			}
		},
		
		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && jQuery.grep(this.errorList, function(n) {
				return n.element.name == lastActive.name;
			}).length == 1 && lastActive;
		},
		
		elements: function() {
			var validator = this;
			
			
			var rulesCache = {};
			
			// select all valid inputs inside the form (no submit or reset buttons)
			// workaround with $([]).add until http://dev.jquery.com/ticket/2114 is solved
			return jQuery([]).add(this.currentForm.elements)
			.filter("input, select, textarea")
			.not(":submit, :reset, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				!this.name && validator.settings.debug && window.console && console.error( "%o has no name assigned", this);
			
				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !jQuery(this).rules().length )
					return false;
				
				rulesCache[this.name] = true;
				return true;
			});
		},
		
		clean: function( selector ) {
			return jQuery( selector )[0];
		},
		
		errors: function() {
			return jQuery( this.settings.errorElement + "." + this.settings.errorClass, this.errorContext );
		},
		
		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = jQuery( [] );
			this.toHide = jQuery( [] );
			this.formSubmitted = false;
		},
		
		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().push( this.containers );
		},
		
		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor( this.clean(element) );
		},
	
		check: function( element ) {
			element = this.clean( element );
			this.settings.unhighlight.call( this, element, this.settings.errorClass );
			//var rules = this.rulesCache[ element.name ];
			var rules = jQuery(element).rules();
			// TODO assert that check is only called for elements with existing rules?
			if (!rules)
				return true;
			for( var i = 0; rules[i]; i++) {
				var rule = rules[i];
				try {
					var result = jQuery.validator.methods[rule.method].call( this, jQuery.trim(element.value), element, rule.parameters );
					if ( result == "dependency-mismatch" )
						break;
					if ( result == "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}
					if( !result ) {
						this.settings.highlight.call( this, element, this.settings.errorClass );
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					this.settings.debug && window.console && console.warn("exception occured when checking element " + element.id
						 + ", check the '" + rule.method + "' method");
					throw e;
				}
			}
			// show the label for valid elements if success callback is configured
			if ( rules.length )
				this.successList.push(element);
			return true;
		},
		
		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor == String
				? m
				: m[method]);
		},
		
		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined)
					return arguments[i];
			}
			return undefined;
		},
		
		defaultMessage: function( element, method) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				// title is never undefined, so handle empty string as undefined
				element.title || undefined,
				jQuery.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},
		
		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method );
			if ( typeof message == "function" ) 
				message = message.call(this, rule.parameters, element);
			this.errorList.push({
				message: message,
				element: element
			});
			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},
		
		addWrapper: function(toToggle) {
			if ( this.settings.wrapper )
				toToggle.push( toToggle.parents( this.settings.wrapper ) );
			return toToggle;
		},
		
		defaultShowErrors: function() {
			for ( var i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				this.showLabel( error.element, error.message );
			}
			if( this.errorList.length ) {
				this.toShow.push( this.containers );
			}
			if (this.settings.success) {
				for ( var i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},
		
		showLabel: function(element, message) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass().addClass( this.settings.errorClass );
			
				// check if we have a generated label, replace the message then
				if( this.settings.overrideErrors || label.attr("generated") ) {
					label.html(message);
				}
			} else {
				// create label
				label = jQuery("<" + this.settings.errorElement + "/>")
					.attr({"for":  this.idOrName(element), generated: true})
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + ">").parent();
				}
				if ( !this.labelContainer.append(label).length )
					this.settings.errorPlacement
						? this.settings.errorPlacement(label, jQuery(element) )
						: label.insertAfter(element);
			}
			if ( !message && this.settings.success ) {
				label.text("");
				typeof this.settings.success == "string"
					? label.addClass( this.settings.success )
					: this.settings.success( label );
			}
			this.toShow.push(label);
		},
		
		errorsFor: function(element) {
			return this.errors().filter("[@for='" + this.idOrName(element) + "']");
		},
		
		idOrName: function(element) {
			return this.checkable(element) ? element.name : element.id || element.name;
		},

		rules: function( element ) {
			return jQuery(element).rules();
		},

		checkable: function( element ) {
			return /radio|checkbox/i.test(element.type);
		},
		
		findByName: function( name ) {
			// select by name and filter by form for performance over form.find("[name=...]")
			var form = this.currentForm;
			return jQuery(document.getElementsByName(name)).map(function(index, element) {
				return element.form == form && element || null;
				//  && element.name == name
			});
		},
		
		getLength: function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				return jQuery("option:selected", element).length;
			case 'input':
				if( this.checkable( element) )
					return this.findByName(element.name).filter(':checked').length;
			}
			return value.length;
		},
	
		depend: function(param, element) {
			if ( this.settings.subformRequired ) {
				if ( this.settings.subformRequired(jQuery(element)) )
					return false; 
			}
			return this.dependTypes[typeof param]
				? this.dependTypes[typeof param](param, element)
				: true;
		},
	
		dependTypes: {
			"boolean": function(param, element) {
				return param;
			},
			"string": function(param, element) {
				return !!jQuery(param, element.form).length;
			},
			"function": function(param, element) {
				return param(element);
			}
		},
		
		optional: function(element) {
			return !jQuery.validator.methods.required.call(this, jQuery.trim(element.value), element);
		},
		
		startRequest: function(element) {
			if (!this.pending[element.name]) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},
		
		stopRequest: function(element, valid) {
			this.pendingRequest--;
			delete this.pending[element.name];
			if ( valid && this.pendingRequest == 0 && this.formSubmitted && this.form() ) {
				jQuery(this.currentForm).submit();
			}
		},
		
		previousValue: function(element) {
			return jQuery.data(element, "previousValue") || jQuery.data(element, "previousValue", previous = {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}
		
	},

	methods: {

		/**
		 * Return false if the element is empty.
		 *
		 * Works with all kind of text inputs, selects, checkboxes and radio buttons.
		 *
		 * To force a user to select an option from a select box, provide
		 * an empty options like <option value="">Choose...</option>
		 *
		 * @example <input name="firstname" class="{required:true}" />
		 * @desc Declares an input element that is required.
		 *
		 * @example <input id="other" type="radio" />
		 * <input name="details" class="{required:'input[@name=other]:checked'}" />
		 * @desc Declares an input element required, but only if a checkbox with name 'other' is checked.
		 * In other words: As long 'other' isn't checked, the details field is valid.
		 * Note: The expression is evaluated in the context of the current form. 
		 *
		 * @example jQuery("#myform").validate({
		 * 	rules: {
		 * 		details: {
		 * 			required: function(element) {
		 *				return jQuery("#other").is(":checked") && jQuery("#other2").is(":checked");
		 *			}
		 *		}
		 * 	}
		 * });
		 * @before <form id="myform">
		 * 	<input id="other" type="checkbox" />
		 * 	<input id="other2" type="checkbox" />
		 * 	<input name="details" />
		 * </form>
		 * @desc Declares an input element "details" required, but only if two other fields
		 * are checked.
		 *
		 * @example <fieldset>
		 * 	<legend>Family</legend>
		 * 	<label for="family_single">
		 * 		<input  type="radio" id="family_single" value="s" name="family" validate="required:true" />
		 * 		Single
		 * 	</label>
		 * 	<label for="family_married">
		 * 		<input  type="radio" id="family_married" value="m" name="family" />
		 * 		Married
		 * 	</label>
		 * 	<label for="family_divorced">
		 * 		<input  type="radio" id="family_divorced" value="d" name="family" />
		 * 		Divorced
		 * 	</label>
		 * 	<label for="family" class="error">Please select your family status.</label>
		 * </fieldset>
		 * @desc Specifies a group of radio elements. The validation rule is specified only for the first
		 * element of the group.
		 *
		 * @param String value The value of the element to check
		 * @param Element element The element to check
		 * @param Boolean|String|Function param A boolean "true" makes a field always required; An expression (String)
		 * is evaluated in the context of the element's form, making the field required only if the expression returns
		 * more than one element. The function is executed with the element as it's only argument: If it returns true,
		 * the element is required.
		 *
		 * @name jQuery.validator.methods.required
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function(value, element, param) {
			// check if dependency is met
			if ( !this.depend(param, element) )
				return "dependency-mismatch";
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				var options = jQuery("option:selected", element);
				return options.length > 0 && ( element.type == "select-multiple" || (jQuery.browser.msie && !(options[0].attributes['value'].specified) ? options[0].text : options[0].value).length > 0);
			case 'input':
				if ( this.checkable(element) )
					return this.getLength(value, element) > 0;
			default:
				return value.length > 0;
			}
		},
		
		remote: function(value, element, param) {
			if ( this.optional(element) )
				return true;
				
			var previous = this.previousValue(element);
			this.settings.messages[element.name].remote = typeof previous.message == "function" ? previous.message(value) : previous.message;
			if ( previous.old !== value ) {
				previous.old = value;
				var validator = this;
				this.startRequest(element);
				var data = {};
				data[element.name] = value;
				jQuery.ajax({
					url: param,
					mode: "abort",
					port: "validate",
					dataType: "json",
					data: data,
					success: function(response) {
						if ( typeof response == "string" || !response ) {
							var errors = {};
							errors[element.name] =  response || validator.defaultMessage( element, "remote" );
							validator.showErrors(errors);
						} else {
							validator.prepareElement(element);
							validator.successList.push(element);
							validator.showErrors();
						}
						previous.valid = response;
						validator.stopRequest(element, response);
					}
				});
				return "pending";
			} else if( this.pending[element.name] ) {
				return "pending";
			}
			return previous.valid;
		},

		/**
		 * Return false, if the element is
		 *
		 * - some kind of text input and its value is too short
		 *
		 * - a set of checkboxes has not enough boxes checked
		 *
		 * - a select and has not enough options selected
		 *
		 * Works with all kind of text inputs, checkboxes and select.
		 *
		 * @example <input name="firstname" class="{minLength:5}" />
		 * @desc Declares an optional input element with at least 5 characters (or none at all).
		 *
		 * @example <input name="firstname" class="{required:true,minLength:5}" />
		 * @desc Declares an input element that must have at least 5 characters.
		 *
		 * @example <fieldset>
		 * 	<legend>Spam</legend>
		 * 	<label for="spam_email">
		 * 		<input type="checkbox" id="spam_email" value="email" name="spam" validate="required:true,minLength:2" />
		 * 		Spam via E-Mail
		 * 	</label>
		 * 	<label for="spam_phone">
		 * 		<input type="checkbox" id="spam_phone" value="phone" name="spam" />
		 * 		Spam via Phone
		 * 	</label>
		 * 	<label for="spam_mail">
		 * 		<input type="checkbox" id="spam_mail" value="mail" name="spam" />
		 * 		Spam via Mail
		 * 	</label>
		 * 	<label for="spam" class="error">Please select at least two types of spam.</label>
		 * </fieldset>
		 * @desc Specifies a group of checkboxes. To validate, at least two checkboxes must be selected.
		 *
		 * @param Number min
		 * @name jQuery.validator.methods.minLength
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function(value, element, param) {
			return this.optional(element) || this.getLength(value, element) >= param;
		},
		
		// deprecated, to be removed in 1.3
		minLength: function(value, element, param) {
			return jQuery.validator.methods.minlength.apply(this, arguments);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function(value, element, param) {
			return this.optional(element) || this.getLength(value, element) <= param;
		},
		
		// deprecated, to be removed in 1.3
		maxLength: function(value, element, param) {
			return jQuery.validator.methods.maxlength.apply(this, arguments);
		},
		
		/**
		 * Return false, if the element is
		 *
	     * - some kind of text input and its value is too short or too long
	     *
	     * - a set of checkboxes has not enough or too many boxes checked
	     *
	     * - a select and has not enough or too many options selected
	     *
	     * Works with all kind of text inputs, checkboxes and selects.
	     *
		 * @example <input name="firstname" class="{rangeLength:[3,5]}" />
		 * @desc Declares an optional input element with at least 3 and at most 5 characters (or none at all).
		 *
		 * @example <input name="firstname" class="{required:true,rangeLength:[3,5]}" />
		 * @desc Declares an input element that must have at least 3 and at most 5 characters.
		 *
		 * @example <select id="cars" class="{required:true,rangeLength:[2,3]}" multiple="multiple">
		 * 	<option value="m_sl">Mercedes SL</option>
		 * 	<option value="o_c">Opel Corsa</option>
		 * 	<option value="vw_p">VW Polo</option>
		 * 	<option value="t_s">Titanic Skoda</option>
		 * </select>
		 * @desc Specifies a select that must have at least two but no more than three options selected.
		 *
	     * @param Array<Number> min/max
	     * @name jQuery.validator.methods.rangeLength
	     * @type Boolean
	     * @cat Plugins/Validate/Methods
	     */
		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function(value, element, param) {
			var length = this.getLength(value, element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},
		
		// deprecated, to be removed in 1.3
		rangeLength: function(value, element, param) {
			return jQuery.validator.methods.rangelength.apply(this, arguments);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},
		
		// deprecated, to be removed in 1.3
		minValue: function() {
			return jQuery.validator.methods.min.apply(this, arguments);
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},
		
		// deprecated, to be removed in 1.3
		maxValue: function() {
			return jQuery.validator.methods.max.apply(this, arguments);
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},
		
		// deprecated, to be removed in 1.3
		rangeValue: function() {
			return jQuery.validator.methods.range.apply(this, arguments);
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},
        
		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function(value, element) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function(value, element) {
			return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/dateDE
		dateDE: function(value, element) {
			return this.optional(element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/numberDE
		numberDE: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function(value, element) {
			return this.optional(element) || /^\d+$/.test(value);
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function(value, element) {
			if ( this.optional(element) )
				return true;
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				var nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9)
						nDigit -= 9;
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) == 0;
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/accept
		accept: function(value, element, param) {
			param = typeof param == "string" ? param : "png|jpe?g|gif";
			return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i")); 
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function(value, element, param) {
			return value == jQuery(param).val();
		}
		
	},
	
	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function(name, method, message) {
		jQuery.validator.methods[name] = method;
		jQuery.validator.messages[name] = message;
	}
});
