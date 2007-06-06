/* Copyright (c) 2007 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */

/**
 * This extension allows you to bind and unbind multiple
 * event types at the same time. Just pass the type as
 * a space seperated string of types.
 *
 * $("input").bind("mouseover focus", fn);
 * $("input").unbind("mouseover focus", fn);
 */
(function($){
	
	var add    = $.event.add,
	    remove = $.event.remove;
	
	$.event.add = function( element, type, handler, data ) {
		$.each( type.split(/\s+/), function() {
			add.call($.event, element, this, handler, data );
		});
	};
	
	$.event.remove = function( element, type, handler ) {
		$.each( type.split(/\s+/), function() {
			remove.call($.event, element, this, handler );
		});
	};
	
})(jQuery);