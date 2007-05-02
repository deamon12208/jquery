/* Copyright (c) 2007 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate$
 * $Rev$
 *
 * Version: 0.2 ALPHA (Only works with jQuery Rev 1845 and higher)
 */

(function($) {

$.extend($.fn, {
	behavior: function(type, fn) {
		if ($.isFunction(type)) {
			// type is function
			fn = type;
			type = undefined;
		}
		// create a new behavior
		$.behavior(this.selector, this.context, type, fn);
		// Run the behavior if document is ready
		 if ($.isReady)
		 	$.behavior.run($.behavior.behaviors.length-1);
		// continue the chain
		return this;
	},
	
	unbehavior: function(type, fn) {
		if (!type && !fn)
			// remove only based on selector and context
			$.each( $.behavior.behaviors, function(i,b) {
				if (this.selector == b.selector && this.context == b.context)
					$.behavior.remove(i);
			});
		else if (!fn && typeof a == "string")
			// remove only based on selector, context and type
			$.each( $.behavior.behaviros, function(i,b) {
				if (this.selector == b.selector && this.context == b.context && type == b[3])
					$.behavior.remove(i);
			});
		else {
			if ($.isFunction(type)) {
				// type is function
				fn = type;
				type = undefined;
			}
			// find this behavior
			var id = $.behavior.find(this.selector, this.context, type, fn);
			// remove it
			if (id != undefined)
				$.behavior.remove(id);
		}
		// continue the chain
		return this;
	}
});

/**
 * Registers a behavior to be run onDOMReady and anytime
 * the DOM is updated via append, appendTo, prepend,
 * prependTo, after, before and html (other methods can be 
 * registered as well using the $.behavior.registerMethod).
 * The behavior will only run on elements once.
 * This method returns a number which is the id of the behavior.
 * This id can be used to only run and/or remove the specific behavior.
 *
 * @private
 * @name $.behavior
 * @type Number
 * @cat Plugins/behavior
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
$.behavior = function(selector, context, type, fn) {
	if (!$.behavior.behaviors) $.behavior.behaviors = [];
	$.behavior.behaviors.push( [undefined].concat($.makeArray(arguments)) );
	return $.behavior.behaviors.length-1;
};

$.extend( $.behavior, {
	/**
	 * Manually run one or all behaviors.
	 *
	 * @private
	 * @name $.behavior.run
	 * @param Number id The id of the behavior to run.
	 * @type Undefined
	 * @cat Plugins/behavior
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	run: function(id) {
		// exit if there are no behaviors
		if (!$.behavior.behaviors) return;
		// run a specific behavior
		if (id != undefined)
			$.behavior._run(id)
		// run all behaviors
		else
			$.each( $.behavior.behaviors, function(i) {
				$.behavior._run(i);
			});
	},
	
	/**
	 * Registers one or more methods so that $.behavior.run
	 * will automatically be called once the method is done.
	 * 
	 * @example $.behavior.registerMethod("myMethod1");
	 * @example $.behavior.registerMethod("myMethod1", "myMethod2", "myMethod3");
	 *
	 * @private
	 * @name $.behavior.registerMethod
	 * @param String name The name of the method to register with behavior
	 * @type Undefined
	 * @cat Plugins/behavior
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	registerMethod: function() {
		$.each( arguments, function(i,n) {
			$.fn["_"+n] = $.fn[n];
			$.fn[n] = function() {
				var r = $.fn["_"+n].apply(this, arguments);
				$.behavior.run();
				return r;
			}
		});
	},
	
	/**
	 * Remove one or all behaviors.
	 *
	 * @private
	 * @name $.behavior.remove
	 * @param Number id The id of the behavior to remove.
	 * @type Undefined
	 * @cat Plugins/behavior
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	remove: function(id) {
		if (id != undefined)
			delete $.behavior.behaviors[id];
		else
			$.behavior.behaviors = [];
	},
	
	/**
	 * Find a particular behavior.
	 *
	 * @private
	 * @name $.behavior.find
	 * @type Number
	 * @cat Plugins/behavior
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	find: function(selector, context, type, fn) {
		var id, args = arguments;
		for (var i=0; i<$.behavior.behaviors.length; i++) {
			var b = $.behavior.behaviors[i], r = true;
			for (var k=0; k<args.length; k++) {
				if (b[k+1] != args[k]){
					r = false;
					break;
				}
			}
			if (r) {
				id = i;
				break;
			}
		}
		return id;
	},
	
	/**
	 * Runs an individual behavior.
	 * @private
	 */
	_run: function(id) {
		var behavior = $.behavior.behaviors[id];
		if ($.behavior.running || !behavior) return;
		$.behavior.running = true;
		var oldEls = $(behavior[0]), newEls,
		    type   = behavior[3],
		    fn     = behavior[4];
		behavior[0] = $(behavior[1], behavior[2]);
		newEls = $(behavior[0]).not(oldEls);
		
		if (type != undefined) 
			newEls.bind(type, fn);
		else
			newEls.each(function() {
				fn.apply(this, []);
			});
		$.behavior.running = false;
	}
});

// Register core DOM Manipulation methods
$.behavior.registerMethod('append', 'appendTo', 'prepend', 'prependTo', 'after', 'before', 'html');

// Auto run behaviors onDOMReady
$(function() {
	$.behavior.run();
});

// Overwrite jQuery.prototype.init to add context and selector properties to the jQuery object
$.prototype._init = $.prototype.init;
$.prototype.init = function(a,c) {
	var r = this._init(a,c);
	// copy over properties if they exist already
	if (a && a.selector) {
		r.context = a.context;
		r.selector = a.selector;
	}
	// set properties
	if ( typeof a  == "string" ) {
		r.context = c;
		r.selector = a;
	}
	return r;
};

})(jQuery);