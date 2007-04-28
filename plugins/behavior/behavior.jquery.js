/* Copyright (c) 2007 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate$
 * $Rev$
 *
 * Version: 0.1 ALPHA
 */

(function($) {

/**
 * Registers a behavior to be run onDOMReady and anytime
 * the DOM is updated via append, appendTo, prepend,
 * prependTo, after and before (other methods can be 
 * registered as well using the $.behavior.registerMethod).
 * The behavior will only run on elements once.
 * This method returns a number which is the id of the behavior.
 * This id can be used to only run and/or remove the specific behavior.
 * 
 * @example $.behavior('a[@href=#]', 'click', function() { return false; });
 * @example $.behavior('a[@href^=https]', 'addClass', 'secure');
 *
 * @name $.behavior
 * @param String selector The behavior will be run on the matched elements of the selector.
 * @param String action The method to be run on the matched elements.
 * @type Number
 * @cat Plugins/behavior
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
$.behavior = function(selector, action) {
	if (!$.behavior.behaviors) $.behavior.behaviors = [];
	$.behavior.behaviors.push( [false].concat($.makeArray(arguments)) );
	return $.behavior.behaviors.length-1;
};

$.extend( $.behavior, {
	/**
	 * Manually run one or all behaviors.
	 * 
	 * @example $.behavior.run(1);
	 * @example $.behavior.run();
	 *
	 * @name $.behavior.run
	 * @param Number id The id of the behavior to run.
	 * @type Undefined
	 * @cat Plugins/behavior
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	run: function(id) {
		if (id != undefined)
			$.behavior._run(id)
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
	 * @example $.behavior.remove(1);
	 * @example $.behavior.remove();
	 *
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
	 * Runs an individual behavior.
	 * @private
	 */
	_run: function(id) {
		var behavior = $.behavior.behaviors[id];
		if ($.behavior.running || !behavior) return;
		$.behavior.running = true;
		var oldEls = $(behavior[0]);
		behavior[0] = $(behavior[1]);
		var newEls = $(behavior[0]).not(oldEls);
		var args = [].concat(behavior).slice(3);
		newEls[behavior[2]].apply( newEls, args );
		$.behavior.running = false;
	}
});

// Register core DOM Manipulation methods
$.behavior.registerMethod('append', 'appendTo', 'prepend', 'prependTo', 'after', 'before');

// Auto run behaviors onDOMReady
$(function() {
	$.behavior.run();
});

})(jQuery);