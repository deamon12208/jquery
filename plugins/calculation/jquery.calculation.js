/*
 * jQuery Calculation Plug-in
 *
 * Copyright (c) 2007 Dan G. Switzer, II
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: 1
 * Version: 0.1
 *
 * Revision History
 * v0.1a
 * - Added semi-colons after object declaration (for min protection)
 * 
 * v0.1
 * - First public release
 *
*/
(function($){

	// set the defaults
	var defaults = {
		// regular expression used to detect numbers
		reNumbers: /\d+(,\d{3})*(\.\d{1,})?/g,
		// the character that indicates the delimiter used for separating numbers (US 1,000 = comma, UK = 1.000 = period)
		comma: ",",
		// should the Field plug-in be used for getting values of :input elements?
		useFieldPlugin: (!!$.fn.getValue)
	};

	// set default options
	$.Calculation = {
		version: "0.1",
		setDefaults: function(options){
			$.extend(defaults, options);
		}
	};


	/*
	 * jQuery.fn.parseNumber()
	 *
	 * returns Array - detects the DOM element and returns it's value. input
	 *                 elements return the field value, other DOM objects
	 *                 return their text node
	 *
	 * NOTE: Breaks the jQuery chain, since it returns a Number.
	 *
	 * Examples:
	 * $("input[@name^='price']").parseNumber();
	 * > This would return an array of potential number for every match in the selector
	 *
	 */
	// the parseNumber() method -- break the chain
	$.fn.parseNumber = function(){
		var aValues = [];
		this.each(
			function (){
				var
					// get a pointer to the current element
					$el = $(this),
					// determine what method to get it's value
					sMethod = ($el.is(":input") ? (defaults.useFieldPlugin ? "getValue" : "val") : "text"),
					// parse the string and get the first number we find
					v = $el[sMethod]().match(defaults.reNumbers, "");
				// if the value is null, we need use 0, otherwise we take the number
				// we found and remove any commas
				v = (v==null) ? 0 : v[0].replace(new RegExp(defaults.comma, "g"), "");
				aValues.push(parseFloat(v, 10));
			}
		);

		// return an array of values
		return aValues;
	};

	/*
	 * jQuery.fn.calc()
	 *
	 * returns Number - performance a calculation and updates the field
	 *
	 * Examples:
	 * $("input[@name='price']").calc();
	 * > This would return the sum of all the fields named price
	 *
	 */
	// the calc() method
	$.fn.calc = function(expr, vars, cbFormat, cbDone){
		var
			// create a pointer to the jQuery object
			$this = this,
			// the value determine from the expression
			exprValue = "",
			// a pointer to the current jQuery element
			$el,
			// store an altered copy of the vars
			parsedVars = {},
			// temp variable
			tmp,
			// the current method to use for updating the value
			sMethod,
			// a hash to store the local variables
			hVars,
			// track whether an error occured in the calculation
			bIsError = false;

		// look for any jQuery objects and parse the results into numbers			
		for( var k in vars ){
			if( !!vars[k] && !!vars[k].jquery ){
				parsedVars[k] = vars[k].parseNumber();
/*
				vars[k].filter(":input").bind(
					"blur",
					function (){
						console.log("blur!");
					}
				);
*/
			} else {
				parsedVars[k] = vars[k];
			}
		}
		
		this.each(
			function (i, el){
				// get a pointer to the current element
				$el = $(this);
				// determine what method to get it's value
				sMethod = ($el.is(":input") ? (defaults.useFieldPlugin ? "getValue" : "val") : "text");

				// initialize the hash vars
				hVars = {};
				for( var k in parsedVars ){
					if( typeof parsedVars[k] == "number" ){
						hVars[k] = parsedVars[k];
					} else if( typeof parsedVars[k] == "string" ){
						hVars[k] = parseFloat(parsedVars[k], 10);
					} else if( !!parsedVars[k] && (parsedVars[k] instanceof Array) ) {
						// if the length of the array is the same as number of objects in the jQuery
						// object we're attaching to, use the matching array value, otherwise use the
						// value from the first array item
						tmp = (parsedVars[k].length == $this.length) ? i : 0;
						hVars[k] = parsedVars[k][tmp];
					}
					
					// if we're not a number, make it 0
					if( isNaN(hVars[k]) ) hVars[k] = 0;
				}

				// try the calculation
				try {
					exprValue = eval( expr.replace(/([A-Za-z]+)/g, "hVars.$1") );
					
					// if there's a format callback, call it now
					if( !!cbFormat ) exprValue = cbFormat(exprValue);
		
				// if there's an error, capture the error output
				} catch(e){
					exprValue = e;
					bIsError = true;
				}
				
				// update the value
				$el[sMethod](exprValue.toString());
			}
		);
		
		// if there's a format callback, call it now
		if( !!cbDone ) cbDone(this);

		return this;
	};

	/*
	 * jQuery.fn.sum()
	 *
	 * returns Number - the sum of all fields
	 *
	 * NOTE: Breaks the jQuery chain, since it returns a Number.
	 *
	 * Examples:
	 * $("input[@name='price']").sum();
	 * > This would return the sum of all the fields named price
	 *
	 * $("input[@name='price1'], input[@name='price2'], input[@name='price3']").sum();
	 * > This would return the sum of all the fields named price1, price2 or price3
	 *
	 */
	// the sum() method -- break the chain
	$.fn.sum = function(){
		// TODO: add arguments to allow automatic binding with a callback
		
		// return the values as a comma-delimited string
		return sum(this.parseNumber());
	};

	/*
	 * jQuery.fn.avg()
	 *
	 * returns Number - the sum of all fields
	 *
	 * NOTE: Breaks the jQuery chain, since it returns a Number.
	 *
	 * Examples:
	 * $("input[@name='price']").avg();
	 * > This would return the average of all the fields named price
	 *
	 * $("input[@name='price1'], input[@name='price2'], input[@name='price3']").avg();
	 * > This would return the average of all the fields named price1, price2 or price3
	 *
	 */
	// the avg() method -- break the chain
	$.fn.avg = function(){
		// TODO: add arguments to allow automatic binding with a callback

		// return the values as a comma-delimited string
		return avg(this.parseNumber());
	};

	/*
	 * Mathmatical functions
	 */
	// sum an array
	var sum = function (a){
		var total = 0;

		$.each(a, function (i, v){
			var v = parseFloat(v, 10);
			total += (isNaN(v) ? 0 : v);
		});

		// return the values as a comma-delimited string
		return total;
	};

	// average an array
	var avg = function (a){
		// return the values as a comma-delimited string
		return sum(a)/a.length;
	};

})(jQuery);
