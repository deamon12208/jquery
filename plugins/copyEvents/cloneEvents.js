/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate$
 * $Rev$
 */

jQuery.fn.extend({
	/**
	 * Copies event handlers from the first matched
	 * element passed in from the jQuery object to all
	 * the current matched elements in the jQuery object.
	 *
	 * @name cloneEventsFrom
	 * @param jQuery|String|DOM Element jQuery object to copy events from. Only uses the first matched element.
	 * @type jQuery
	 * @cat Plugins/cloneEvents
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	cloneEventsFrom: function(from) {
		jQuery.event.clone(from, this);
		return this;
	},
	
	/** 
	 * Copies event handlers to all the matched
	 * elements from the passed in jQuery object from 
	 * the first matched element in the jQuery object.
	 *
	 * @name cloneEventsTo
	 * @param jQuery|String|DOM Element jQuery object to copy events to. Copies to all matched elements.
	 * @type jQuery
	 * @cat Plugins/cloneEvents
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	cloneEventsTo: function(to) {
		jQuery.event.clone(this, to);
		return this;
	}
});

/**
 * Logic for copying events from one jQuery object to another.
 *
 * @private	
 * @name jQuery.events.clone
 * @param jQuery|String|DOM Element jQuery object to copy events from. Only uses the first matched element.
 * @param jQuery|String|DOM Element jQuery object to copy events to. Copies to all matched elements.
 * @type undefined
 * @cat Plugins/cloneEvents
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
jQuery.event.clone = function(from, to) {
	from = (from.jquery) ? from : jQuery(from);
	to   = (to.jquery)   ? to   : jQuery(to);
	
	if (!from.size() || !from[0].events || !to.size()) return;
		
	var events = from[0].events;
	to.each(function() {
		for (var type in events)
			for (var handler in events[type])
				jQuery.event.add(this, type, events[type][handler], events[type][handler].data);
	});
};