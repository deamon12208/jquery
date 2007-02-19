/*
 * Form Validation: jQuery form validation plug-in v1.0 alpha 2
 *
 * Copyright (c) 2006 J鰎n Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * Validates either a single form on submit or a list of elements on a user-defined event.
 *
 * The normal behaviour is to validate a form when a submit button is clicked or
 * the user presses enter when an input of that form is focused.
 *
 * It is also possible to validate each individual element of that form, eg. on blur or keyup.
 *
 * Following are a few aspects that you should know about when using this plugin.
 * The examples following demonstrate these aspects.
 *
 * Markup recommendations: A good form has labels associated with each input
 * element: The for attribute of the label has the same value as the id of the input.
 * If IDs aren't provided, they are generated, combining the ID of the containing
 * form (if any) with the name of the element, with the exception of radio and checkbox
 * inputs.
 *
 * Validation methods: A valiation method decides whether an element is valid.
 * Included are a set of common validation methods, like required.
 * Except required itself and equalTo, all validation methods declare an element valid
 * when it has no value at all. That way you can specify an element input to
 * contain a valid email adress, or nothing at all. All available methods are documented
 * below, as well as $.validator.addMethod, which you can use to add your own methods.
 *
 * Validation rules: A validation rule applies one or more validation methods to an
 * input element. You can specify validation rules via metadata or via plugin
 * settings (option rules). It is more a matter of taste which way you choose.
 * Using metadata is good for fast prototyping. Plugin settings are good for perfect
 * clean markup. Valid markup results from both approaches.
 * 
 * Error messages: An error message displays a hint for the user about invalid
 * elements, and what is wrong. There are three ways to provide error messages.
 * Via the title attribute of the input element to validate, via error labels and
 * via plugin settings (option messages). All included validation rules provide a
 * default error message which you can use for prototyping, because it is used when
 * no specific message is provided.
 *
 * Error message display: Error messages are handled via label elements with an
 * additional class (option errorClass). When provided in the markup, they are shown
 * and hidden accordingly, otherwise created on demand. By default, labels are created
 * after the invalid element. It is also possible to put them into an error container
 * (option errorContainer), even a container containing a general warning followed by
 * a list of errors is possible (option errorContainer together with errorLabelContainer).
 *
 * Focusing of invalid elements: By default, the first invalid element in a form is focused
 * after validating a form with invalid elements. To prevent confusion on the behalf of the user,
 * the plugin remembers the element that had focus before starting the validation, and focuses
 * that element. That way the user can try to fill out elements of the form at the end, without
 * being forced to focus them again and again. Because this doesn't work well when validating
 * on blur, you can disable the focusing entirely (option focusInvalid).
 *
 * Form submit: By default, the form submission is prevented when the form is invalid,
 * and submitted as normal when it is valid. You can also handle the submission
 * manually (option submitHandler).
 *
 * Validation event: By default, forms are validated on submit, triggered by the user clicking
 * the submit button or pressing enter when a form input is focused. Instead, each element can
 * be validated on a certain event like blur or keyup (option event).
 *
 * Developing and debugging a form: While developing and debugging the form, you should set
 * the debug option to true. That prevents the form submission on both valid and invalid forms
 * and outputs some helpful messages to window.console (available via Firebug) that help
 * debugging. When you have everything setup and don't get any error messages displayed, check if
 * your rules all accept empty elements as valid (like email or url methods).
 *
 * Validating multiple forms on one page: The plugin can handle only one form per call. In case
 * you have multiple forms on a single page which you want to validate, you can avoid having
 * to duplicate the plugin settings by modifying the defaults via $.validator.defaults. Use
 * $.extend($.validator.defaults, {...}) to override multiple settings at once.
 *
 * Validator object: The validation plugin method returns the instance of the validator object it uses.
 * That gives you full control over every aspect of the validation. Let me know if you come up
 * with something that I didn't have in mind. Thats why the plugin has nearly no private methods.
 *
 * @example $("#myform").validate();
 * @before <form id="myform">
 *   <input name="firstname" class="{required:true}" />
 * </form>
 * @desc Validates a form on submit. Rules are read from metadata.
 *
 * @example $("input").validate({
 * 		focusInvalid: false,
 * 		event: blur
 * });
 * @desc Validates all input elements on blur event (when the element looses focus).
 * Deactivates focus of invalid elements.
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
 *   rules: {
 *     firstname: { required: true },
 *     age: { number: true },
 *     password: { min: 5, max: 32 }
 *   },
 *   messages {
 *     password: "Please enter a password between 5 and 32 characters long."
 *   }
 * });
 * @desc Validate a form on submit. Rules are specified for three element,
 * and a message is customized for the "password" element. Inline rules are ignored!
 *
 * @example $("#myform").validate({
 *   errorClass: "invalid",
 *   errorContainer: $("#messageBox"),
 *   errorWrapper: "li"
 * });
 * @desc Validates a form on submit. The class used to search, create and display
 * error labels is changed to "invalid". This is also added to invalid elements.
 *
 * All error labels are displayed inside an unordered list with the ID "messageBox", as
 * specified by the jQuery object passed as errorContainer option. All error elements
 * are wrapped inside an li element, to create a list of messages.
 *
 * To ease the setup of the form, debug option is set to true, preventing a submit
 * of the form no matter of being valid or not.
 * @before <ul id="messageBox" />
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
 *
 * @example $("#myform").validate({
 *   errorContainer: $("#messageBox1, #messageBox2"),
 *   errorLabelContainer: $("#messageBox1 ul"),
 *   errorWrapper: "li",
 * });
 * @desc Validates a form on submit. Similar to the above example, but with an additional
 * container for error messages. The elements given as the errorContainer are all shown
 * and hidden when errors occur. But the error labels themselve are added to the element(s)
 * given as errorLabelContainer, here an unordered list. Therefore the error labels are
 * also wrapped into li elements (errorWrapper option).
 *
 * @before <div id="messageBox1">
 *   <h3>The are errors in your form!</h3>
 *   <ul/>
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
 *
 * @param Map options Optional settings to configure validation
 * @option String errorClass Use this class to look for existing error labels and add it to
 *		invalid elements. Default: "error"
 * @option jQuery errorContainer Search and append error labels inside or to this container. Default: none
 * @option jQuery errorLabelContainer Search and append error labels to this container. Default: none
 *		If specified, this container is used instead of the errorContainer, but both are shown and hidden when necessary
 * @option String errorWrapper Wrap error labels with the specified element, eg "li". Default: none
 * @option Boolean debug If true, the form is not submitted and certain errors are display on the console (requires Firebug or Firebug lite). Default: none
 * @option Boolean focusInvalid Focus the last active or first invalid element. Default: true
 * @option Function submitHandler Callback for handling the actual
 *		submit when the form is valid. Gets the form as the only argmument. Default: normal form submit
 * @option Map messages Key/value pairs defining custom messages.
 *		Key is the ID or name (for radio/checkbox inputs) of an element,
 *		value the message to display for that element.
 *		Can be specified for one or more elements. If not present,
 *		the title attribute or the default message for that rule is used.
 *      Default: none
 * @option Map rules Key/value pairs defining custom rules.
 *		Key is the ID or name (for radio/checkbox inputs) of an element,
 *		value is an object consiting of rule/parameter pairs, eg. {required: true, min: 3}
 *		If not specified, rules are read from metadata via metadata plugin.
 *		Default: none
 * @option String event The event on which to validate. If anything is specified, like
 *		blur or keyup, each element is validated on that event. Default: none
 * @option Boolean onsubmit Validate the form on submit. Set to false to use only other
 *		events for validation (option event). Default: true
 * @option String metaWrapper In case you use metadata for other plugins, too, you
 *		want to wrap your validation rules
 *		into their own object that can be specified via this option. Default: none
 *
 * @name validate
 * @type $.validator
 * @cat Plugins/Validate
 */

(function($) { 

$.fn.validate = function(options) {
	var validator = new $.validator(options, this);
	if( validator.settings.onsubmit ) {
		// validate the form on submit
		this.submit(function(event) {
			if(validator.settings.debug) {
				// prevent form submit to be able to see console output
				event.preventDefault();
			}
			return validator.validateForm();
		});
	}
	if( validator.settings.event ) {
		// validate all elements on some other event like blur or keypress
		validator.elements.bind(validator.settings.event, function() {
			validator.errorList = {};
			validator.hideElementErrors(this);
			validator.validateElement(this);
			validator.showErrors();
		});
	}
	return validator;
};

// constructor for validator
var v = $.validator = function(options, form) {
	this.errorList = {};

	// override defaults with client settings
	var settings = this.settings = $.extend({}, v.defaults, options);
	
	// select all valid inputs inside the form (no submit or reset buttons)
	this.elements = $(":input:not(:submit):not(:reset)", form);

	this.currentForm = form[0];
	// find the element to look for error labels
	this.errorContainer = settings.errorLabelContainer.length && settings.errorLabelContainer
		|| settings.errorContainer.length && settings.errorContainer
		|| $([])
	this.errorContext = this.errorContainer.length && this.errorContainer || form;
	
	// listen for focus events to save reference to last focused element
	var instance = this;
	this.elements.focus(function() {
		instance.lastActive = this;
	});

};

/**
 * Default settings for validation.
 *
 * @see validate(Object)
 * @name $.validator.defaults
 * @type Object<String, Object>
 * @cat Plugins/Validate
 */ 
v.defaults = {
	errorClass: "error",
	focusInvalid: true,
	errorContainer: $([]),
	errorLabelContainer: $([]),
	onsubmit: true
};

// methods for validator object
v.prototype = {

	/*
	 * Validates a form.
	 * Prevents the form from being submitted if it is invalid
	 * (or if debug mode is on).
	 */
	validateForm: function() {

		// reset errors
		this.errorList = {};

		// TODO try to move some more of these into validateElement
		
		this.settings.errorLabelContainer.hide();
		this.settings.errorContainer.hide();

		// hide all error labels for the form
		var labels = $("label." + this.settings.errorClass, this.errorContext).hide();
		if( this.settings.errorWrapper ) {
			labels.parents(this.settings.errorWrapper).hide();
		}

		// validate elements
		var instance = this;
		this.elements.each(function() {
			instance.validateElement(this);
		});

		// check if the form is valid and return
		return this.isFormValid();
	},

	/*
	 * Searches the given element for rules and then
	 * tests the element to these rules.
	 */
	validateElement: function(element) {
		// TODO fails in opera at first line of $.className.has
		$(element).removeClass(this.settings.errorClass);
		var rules = this.findRules(element);
		for( var i=0, rule; rule = rules[i]; i++ ) {
			try {
				var method = v.methods[rule.name];
				if( !method)
					throw("validateElement() error: No method found with name " + rule.name);
				if( !method( $(element).val(), element, rule.parameters ) ) {
					// add the error to the array of errors for the element
					var id = this.findId(element);
					if(!id && this.settings.debug) {
						console.error("could not find id/name for element, please check the element %o", element);
					}
					var list = this.errorList[id] || (this.errorList[id] = []);
					list[list.length] = this.formatMessage(method, rule, id);
				}
			} catch(e) {
				if(this.settings.debug) {
					console.error("exception occured when checking element " + element.id
						 + ", check the '" + rule.name + "' method");
				}
				throw e;
			}
		}
	},
	
	/*
	 * Replace placeholders in messages, if any.
	 *
	 * Currently limited to a maxium of two placeholders.
	 *
	 * Expected format: "first placeholder: {0}, second placeholder: {1}, both optional"
	 *
	 * @param Object method
	 * @param Object rule
	 * @param String elementID
	 */
	formatMessage: function(method, rule, elementID) {
		var m = this.settings.messages,
			param = rule.parameters,
			first = param.constructor == Array ? param[0] : param;
		if(m && m[elementID])
			if(m[elementID].constructor == String)
				message = m[elementID];
			else
				message = m[elementID][rule.name];
		else
			message = method.message;
		return message && message.replace("{0}", first || "").replace("{1}", param[1] || "");
	},

	/*
	 * Searches for all error labels associated
	 * with the given element and hides them.
	 * To hide labels for a form, use hideFormErrors().
	 */
	hideElementErrors: function(element) {
		var errorLabel = $("label." + this.settings.errorClass + "[@for=" + this.findId(element) + "]", this.errorContext).hide();
		if( this.settings.errorWrapper ) {
			errorLabel.parent(this.settings.errorWrapper).hide();
		}
	},

	/*
	 * Check if the validated form has errors or not,
	 * if it has, display them.
	 */
	isFormValid: function() {
		var count = 0;
		// iterate over properties and count them
		for( var i in this.errorList ) {
			count++;
		}
		// if form has errors
		if(count) {
			// form has errors, display them and do not submit
			this.showErrors();
			return false;
		} else {
			// delgate submission if possible, if it has no errors
			if(this.settings.submitHandler) {
				// delegate submission to handler
				this.settings.submitHandler(this.currentForm);
				return false;
			}
			return true;
		}
	},

	/*
	 * Display an error label for every invalid element.
	 * If there is more than one error, only the label
	 * associated with the first error is displayed.
	 * The first invalid element is also focused.
	 */
	showErrors: function() {
		this.settings.errorContainer.show();
		this.settings.errorLabelContainer.show();
		var first = true;
		for(var elementID in this.errorList) {
			if( first && this.settings.focusInvalid ) {
				// check if the last focused element is invalid
				if( this.lastActive && this.errorList[this.lastActive.id])
					// focus it
					this.lastActive.focus();
				// otherwise, find the firt invalid lement
				else {
					// focus the first invalid element
					try {
						var element = $("#"+elementID);
						// radio/checkbox doesn't have an ID
						if(!element.length)
							element = $('[@name='+elementID+']', this.currentForm);
						element[0].focus();
					} catch(e) { if( this.settings.debug ) console.error(e); }
				}
				first = false;
			}
			// display the error label for the first failed method
			this.showError(elementID, this.errorList[elementID][0]);
		}
	},

	/*
	 * Searches for an error label inside an errorContainer (if specified) or
	 * the current form or, when validating single elements, inside the document.
	 * If errors are not specified for every rule, it searches for a generic error.
	 * Check settings and markup, if the form is invalid, but no error is displayed.
	 */
	showError: function(elementID, message) {
		var element = $("#" + elementID).addClass(this.settings.errorClass),
			// find message for this label
			message = element.attr('title') || message || "<strong>Warning: No message defined for " + elementID + "</strong>",
			errorLabel = $("label." + this.settings.errorClass, this.errorContext).filter("[@for=" + elementID + "]"),
			wrapper = this.settings.errorWrapper;
		if( errorLabel.length ) {
			// check if we have a generated label, replace the message then
			if( errorLabel.attr("generated") ) {
				errorLabel.text(message);
			}
			errorLabel.show();
			if(wrapper) {
				errorLabel.parents(wrapper).show();
			}
		} else {
			// create label with custom message or title or default message
			// display default message
			// TODO can't change message
			var errorLabel = $("<label>").attr({"for": elementID, generated: true}).addClass("error").html(message);
			if(wrapper) {
				errorLabel = errorLabel.show().wrap("<" + wrapper + "></" + wrapper + ">").parent();
			}
			if(!this.errorContainer.append(errorLabel).length) 
				errorLabel.insertAfter(element);
			errorLabel.show();
		}
	},

	/*
	 * Searches all rules for the given element and returns them as an
	 * array of rule object, each with a name and parameters.
	 */
	findRules: function(element) {
		var data;
		if(this.settings.rules) {
			data = this.settings.rules[this.findId(element)];
		} else {
			data = $(element).data();
			var metaWrapper = this.settings.metaWrapper;
			if(metaWrapper)
				data = data[metaWrapper];
		}
		var rules = [];
		if(!data)
			return rules;
		$.each(data, function(key, value) {
			var rule = rules[rules.length] = {};
			rule.name = key;
			rule.parameters = value;
		});
		return rules;
	},
	
	findId: function(element) {
		var id = ( /radio|checkbox/i.test(element.type) ) ? element.name : element.id;
		// generate id when none is found
		if(!id) {
			var formId = element.form.id,
				idcleanup = /[^a-zA-Z0-9\-_]/g;
			id = element.id = (formId ? formId.replace(idcleanup, "") : "") + element.name.replace(idcleanup, "");
		}
		return id;
	}
	
};

function getLength(value, element) {
	switch( element.nodeName.toLowerCase() ) {
	case 'select':
		return $("option:selected", element).length;
	case 'input':
		if( /radio|checkbox/i.test(element.type) )
			return $(element.form || document).find('[@name=' + element.name + ']:checked').length;
	}
	return value.length;
};

/**
 * Defines a standard set of useful validation methods.
 * 
 * Can be extended, see example below.
 *
 * If "all kind of text inputs" is mentioned for any if the methods defined here,
 * it refers to input elements of type text, password and file and textareas.
 *
 * Note: When you pass strings as paramters to your methods, explicitly convert them
 * to strings before using them. Strings read from metadata are of type "object", which
 * can cause weird problems. See the equalTo method for an example.
 *
 * @example $.validator.methods.myMethod = function(value, element, parameters, validate) {
 * 	 var isValid = ...;
 *   return isValid;
 * }
 * @desc Defines a new method called "myMethod".
 *
 * @example $.validator.methods.containsFoobar = function(value) {
 *   return value == "foobar";
 * }
 * @desc If you only need the value parameter, you don't have to specify the other arguments.
 *
 * @param String value the value of the element, eg. the text of a text input
 * @param Element element the input element itself, to check for content of attributes other then value
 * @param Object paramater Some parameter, like a number for min/max rules
 *
 * @name $.validator.methods
 * @type Object<String, Function(String,Element,Object):Boolean>
 * @cat Plugins/Validate/Methods
 */
v.methods = {

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
	 * 	<label for="family_weird">
	 * 		<input  type="radio" id="family_weird" value="w" name="family" />
	 * 		Something weird
	 * 	</label>
	 * 	<label for="family" class="error">Please select your family status.</label>
	 * </fieldset>
	 * @desc Specifies a group of radio elements. The validation rule is specified only for the first
	 * element of the group.
	 *
	 * @name $.validator.methods.required
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	required: function(value, element) {
		switch( element.nodeName.toLowerCase() ) {
		case 'select':
			var options = $("option:selected", element);
			return options.length > 0 && ( element.type == "select-multiple" || options[0].value.length > 0);
		case 'input':
			switch( element.type.toLowerCase() ) {
			case 'checkbox':
			case 'radio':
				return getLength(value, element) > 0;
			}
		default:
			return $.trim(value).length > 0;
		}
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
	 * @name $.validator.methods.min
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	minLength: function(value, element, param) {
		var length = getLength(value, element);
		return !v.methods.required(value, element) || length >= param;
	},

	/**
	 * Return false, if the element is
	 *
	 * - some kind of text input and its value is too big
	 *
	 * - a set of checkboxes has too many boxes checked
	 *
	 * - a select and has too many options selected
	 *
	 * Works with all kind of text inputs, checkboxes and selects.
	 *
	 * @example <input name="firstname" class="{maxLength:5}" />
	 * @desc Declares an input element with at most 5 characters.
	 *
	 * @example <input name="firstname" class="{required:true,maxLength:5}" />
	 * @desc Declares an input element that must have at least one and at most 5 characters.
	 *
	 * @param Number max
	 * @name $.validator.methods.max
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	maxLength: function(value, element, param) {
		var length = getLength(value, element);
		return !v.methods.required(value, element) || length <= param;
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
	 * @desc Specifies a select that must have at least two but no more then three options selected.
	 *
     * @param Array<Number> min/max
     * @name $.validator.methods.rangeLength
     * @type Boolean
     * @cat Plugins/Validate/Methods
     */
	rangeLength: function(value, element, param) {
		var length = getLength(value, element);
		return !v.methods.required(value, element) || ( length >= param[0] && length <= param[1] );
	},

	/**
	 * Return true, if the value is greater than or equal to the specified minimum.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example <input name="age" class="{minValue:16}" />
	 * @desc Declares an optional input element whose value must be at least 16 (or none at all).
	 *
	 * @example <input name="age" class="{required:true,minValue:16}" />
	 * @desc Declares an input element whose value must be at least 16.
	 *
	 * @param Number min
	 * @name $.validator.methods.minValue
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	minValue: function( value, element, param ) {
		return !v.methods.required(value, element) || value >= param;
	},
	
	/**
	 * Return true, if the value is less than or equal to the specified maximum.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example <input name="age" class="{maxValue:16}" />
	 * @desc Declares an optional input element whose value must be at most 16 (or none at all).
	 *
	 * @example <input name="age" class="{required:true,maxValue:16}" />
	 * @desc Declares an input element whose required value must be at most 16.
	 *
	 * @param Number max
	 * @name $.validator.methods.maxValue
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	maxValue: function( value, element, param ) {
		return !v.methods.required(value, element) || value <= param;
	},
	
	/**
	 * Return true, if the value is in the specified range.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example <input name="age" class="{rangeValue:[4,12]}" />
	 * @desc Declares an optional input element whose value must be at least 4 and at most 12 (or none at all).
	 *
	 * @example <input name="age" class="{required:true,rangeValue:[4,12]}" />
	 * @desc Declares an input element whose required value must be at least 4 and at most 12.
	 *
	 * @param Array<Number> min/max
	 * @name $.validator.methods.rangeValue
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	rangeValue: function( value, element, param ) {
		return !v.methods.required(value, element) || ( value >= param[0] && value <= param[1] );
	},
	
	/**
	 * Return true, if the value is not a valid email address.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example <input name="email1" class="{email:true}" />
	 * @desc Declares an optional input element whose value must be a valid email address (or none at all).
	 *
	 * @example <input name="email1" class="{required:true,email:true}" />
	 * @desc Declares an input element whose value must be a valid email address.
	 *
	 * @name $.validator.methods.email
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	email: function(value, element) {
		return !v.methods.required(value, element) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value);
	},

	/**
	 * Return true, if the value is a valid url.
	 *
	 * Works with all kind of text inputs.
	 *
	 * See http://www.w3.org/Addressing/rfc1738.txt for URL specification.
	 *
	 * @example <input name="homepage" class="{url:true}" />
	 * @desc Declares an optional input element whose value must be a valid URL (or none at all).
	 *
	 * @example <input name="homepage" class="{required:true,url:true}" />
	 * @desc Declares an input element whose value must be a valid URL.
	 *
	 * @name $.validator.methods.url
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	url: function(value, element) {
		return !v.methods.required(value, element) || /^(https?|ftp):\/\/[A-Z0-9](\.?[A-Z0-9能謁[A-Z0-9_\-能謁*)*(\/([A-Z0-9能謁[A-Z0-9_\-\.能謁*)?)*(\?([A-Z0-9能謁[A-Z0-9_\-\.%\+=&能謁*)?)?$/i.test(value);
	},

	/**
	 * Return true, if the value is a valid date. Uses JavaScripts built-in
	 * Date to test if the date is valid, and is therefore very limited.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example <input name="birthdate" class="{date:true}" />
	 * @desc Declares an optional input element whose value must be a valid date (or none at all).
	 *
	 * @example <input name="birthdate" class="{required:true,date:true}" />
	 * @desc Declares an input element whose value must be a valid date.
	 *
	 * @name $.validator.methods.date
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	date: function(value, element) {
		return !v.methods.required(value, element) || !/Invalid|NaN/.test(new Date(value));
	},

	/**
	 * Return true, if the value is a valid date, according to ISO date standard.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example $.validator.methods.date("1990/01/01")
	 * @result true
	 *
	 * @example $.validator.methods.date("1990-01-01")
	 * @result true
	 *
	 * @example $.validator.methods.date("01.01.1990")
	 * @result false
	 *
	 * @example <input name="birthdate" class="{dateISO:true}" />
	 * @desc Declares an optional input element whose value must be a valid ISO date (or none at all).
	 *
	 * @name $.validator.methods.date
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	dateISO: function(value, element) {
		return !v.methods.required(value, element) || /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/.test(value);
	},

	/**
	 * Return true, if the value is a valid date. Supports german
	 * dates (29.04.1994 or 1.1.2006). Doesn't make any sanity checks.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example $.validator.methods.date("1990/01/01")
	 * @result false
	 *
	 * @example $.validator.methods.date("01.01.1990")
	 * @result true
	 *
	 * @example $.validator.methods.date("0.1.2345")
	 * @result true
	 *
	 * @example <input name="geburtstag" class="{dateDE:true}" />
	 * @desc Declares an optional input element whose value must be a valid german date (or none at all).
	 *
	 * @name $.validator.methods.dateDE
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	dateDE: function(value, element) {
		return !v.methods.required(value, element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
	},

	/**
	 * Return true, if the value is a valid number. Checks for
	 * international number format, eg. 100,000.59
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example <input name="amount" class="{number:true}" />
	 * @desc Declares an optional input element whose value must be a valid number (or none at all).
	 *
	 * @name $.validator.methods.number
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	number: function(value, element) {
		return !v.methods.required(value, element) || /^-?[,0-9]+(\.\d+)?$/.test(value); 
	},

	/**
	 * Return true, if the value is a valid number.
	 *
	 * Works with all kind of text inputs.
	 *
	 * Checks for german numbers (100.000,59)
	 *
	 * @example <input name="menge" class="{numberDE:true}" />
	 * @desc Declares an optional input element whose value must be a valid german number (or none at all).
	 *
	 * @name $.validator.methods.numberDE
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	numberDE: function(value, element) {
		return !v.methods.required(value, element) || /^-?[\.0-9]+(,\d+)?$/.test(value);
	},

	/**
	 * Returns true if the value contains only digits.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example <input name="serialnumber" class="{digits:true}" />
	 * @desc Declares an optional input element whose value must contain only digits (or none at all).
	 *
	 * @name $.validator.methods.digits
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	digits: function(value, element) {
		return !v.methods.required(value, element) || /^\d+$/.test(value);
	},
	
	/**
	 * Returns true if the value has the same value
	 * as the element specified by the first parameter.
	 *
	 * Keep the expression simple to avoid spaces when using metadata.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example <input name="email" id="email" class="{required:true,email:true'}" />
	 * <input name="emailAgain" class="{equalTo:'#email'}" />
	 * @desc Declares two input elements: The first must contain a valid email address,
	 * the second must contain the same adress, enter once more. The paramter is a
	 * expression used via jQuery to select the element.
	 *
	 * @param String selection A jQuery expression
	 * @name $.validator.methods.digits
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	equalTo: function(value, element, param) {
		// strings read from metadata have typeof object, convert to string
		return value == $(""+param).val();
	}
};

/*
 * Add default messages directly to method functions.
 *
 * To add new methods, use $.validator.addMethod
 *
 * To change default messages, change $.validator.methods.[method].message
 */
var messages = {
	required: "This field is required.",
	maxLength: "Please enter a value no longer then {0} characters.",
	minLength: "Please enter a value of at least {0} characters.",
	rangeLength: "Please enter a value between {0} and {1} characters long.",
	email: "Please enter a valid email address.",
	url: "Please enter a valid URL.",
	date: "Please enter a valid date.",
	dateISO: "Please enter a valid date (ISO).",
	dateDE: "Bitte geben Sie ein g黮tiges Datum ein.",
	number: "Please enter a valid number.",
	numberDE: "Bitte geben Sie eine Nummer ein.",
	digits: "Please enter only digits",
	equalTo: "Please enter the same value again.",
	rangeValue: "Please enter a value between {0} and {1}.",
	maxValue: "Please enter a value less than or equal to {0}.",
	minValue: "Please enter a value greater than or equal to {0}."
};
for(var key in messages) {
	v.methods[key].message = messages[key];
}

/**
 * Add a new validation method. It must consist of a name (must be a legal
 * javascript identifier), a function and a default message.
 *
 * Please note: While the temptation is great to
 * add a regex method that checks it's paramter against the value,
 * it is much cleaner to encapsulate those regular expressions
 * inside their own method. If you need lots of slightly different
 * expressions, try to extract a common parameter.
 *
 * A library of regular expressions: http://regexlib.com/DisplayPatterns.aspx
 *
 * @example $.validator.addMethod("domain", function(value) {
 *   return /^http://mycorporatedomain.com/.test(value);
 * }, "Please specify the correct domain for your documents");
 * @desc Adds a method that checks if the value starts with http://mycorporatedomain.com
 *
 * @example $.validator.addMethod("math", function(value, element, params) {
 *  return value == params[0] + params[1];
 * }, "Please enter the correct value for this simple question.");
 *
 * @see $.validator.methods
 *
 * @param String name The name of the method, used to identify and referencing it, must be a valid javascript identifier
 * @param Function rule The actual method implementation, returning true if an element is valid
 * @param String message The default message to display for this method
 *
 * @name $.validator.addMethod
 * @type undefined
 * @cat Plugins/Validate
 */
v.addMethod = function(name, method, message) {
	(v.methods[name] = method).message = message;
};

})(jQuery);