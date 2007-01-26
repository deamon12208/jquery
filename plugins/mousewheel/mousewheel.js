/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * $LastChangedDate$
 * $Rev$
 */

jQuery.fn.extend({
	/**
	 * Apply the mousewheel event to the elements in the jQuery object.
	 * The handler function should be prepared to take the event object
	 * and a param called 'delta'. The 'delta' param is a number
	 * either > 0 or < 0. > 0 = up and < 0 = down.
	 *
	 * Firefox, Opera and Safari has some issues preventing default 
	 * and just using event.preventDefault() will not work. By
	 * default this method will attempt to prevent the browser's
	 * default action. You can allow the default action by passing
	 * in false for the preventDefault paramater.
	 *
	 * @example $("p").mousewheel(function(event, delta){
	 *   if (delta > 0)
	 *     // do something on mousewheel scroll up
	 *   else if (delta < 0)
	 *     //do something on mousewheel scroll down
	 * });
	 *
	 * @name mousewheel
	 * @type jQuery
	 * @param Function handler A function to call when onmousewheel fires. Should take two params: event and delta.
	 * @param Boolean preventDefault Should the default action be prevented? By default the browser's default action is prevented.
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	mousewheel: function(fn, preventDefault) {
		return this.each(function() {
			
			if (!fn.guid)
				fn.guid = jQuery.event.guid++;
			
			// set preventDefault option
			if (preventDefault !== false) this._mwPreventDefault = true;
			
			// if the element already has a handler
			if (this._mwHandlers) {
				this._mwHandlers.push(fn); // add function
				return;                    // short-circuit
			}
			
			var self = this;
			
			// create array of handler functions
			if (!this._mwHandlers) this._mwHandlers = [];
			this._mwHandlers.push(fn);
			
			// create the mouseover and mouseout handler methods for easy removal later
			this._mwOver = function() {
				jQuery.event.mousewheel.giveFocus(self);
			};
			this._mwOut = function() {
				jQuery.event.mousewheel.removeFocus(self);
			};
			
			// create mousewheel handler function
			this._handleMousewheel = function(event) {
				if (!event) event = window.event;

				// cannot call any methods before preventing default (firefox)
				if (self._mwPreventDefault) 
					if (event.preventDefault) event.preventDefault();
					else event.returnValue = false;

				// fix event
				jQuery.event.fix(event);

				// normalize delta property
				var delta = 0;
				if (event.wheelDelta) {
					delta = event.wheelDelta/120;
					if (window.opera)
						delta = -(event.wheelDelta/120);
				} 
				else if (event.detail)
					delta = -event.detail/3;

				// call the handler
				for (var i=0; i<self._mwHandlers.length; i++)
					if (self._mwHandlers[i])
						self._mwHandlers[i].call(self, event, delta);
				
				return self._mPreventDefault ? false : true;
			};
			
			// add the hover event
			jQuery(this).bind('mouseover', jQuery.event.mousewheel.handleHover).bind('mouseout', jQuery.event.mousewheel.handleHover);
			
			// add element to cache to remove expandos at window.unload to avoid memory leaks in IE
			if (jQuery.browser.msie) jQuery.event.mousewheel.$elementCache.push(jQuery(this));
		});
	},

	/**
	 * This method removes one or all applied mousewheel events from the elements.
	 * You can remove a single handler function by passing it as the first param.
	 * If you do not pass anything, it will remove all handlers.
	 *
	 * @name unmousewheel
	 * @param Function handler The handler function to remove from the mousewheel event.
	 * @type jQuery
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	unmousewheel: function(fn) {
		return this.each(function() {
			if (fn && this._mwHandlers.length > 1) {
				for (var i=0; i<this._mwHandlers.length; i++)
					if (this._mwHandlers[i] && this._mwHandlers[i].guid == fn.guid)
						delete this._mwHandlers[i];
			} else {
				jQuery(this).unbind('mouseover', jQuery.event.mousewheel.handleHover).unbind('mouseout', jQuery.event.mousewheel.handleHover);
				this._mwPreventDefault = this._mwHandlers = this._mwOver = this._mwOut = null;
				jQuery.event.mousewheel.removeFocus(this);
			}
		});
	}
});


/**
 * The manager for the mousewheel event.
 * Handles the switching of focus for the
 * different elements that have the
 * mousewheel event attached to them.
 *
 * @private
 * @cat Plugins/Mousewheel
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
jQuery.event.mousewheel = {	
	/**
	 * This method handles which element is to have
	 * focus of the mousewheel event.
	 *
	 * @private
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	handleHover: function(event) {
		// Check if mouse(over|out) are still within the same parent element
		var to = p = (event.type == "mouseover" ? event.fromElement : event.toElement) || event.relatedTarget;

		// Traverse up the tree
		while ( p && p != this ) try { p = p.parentNode; } catch(e) { p = this; };
		
		// If we actually just moused on to a sub-element 
		// that doesn't have a mousewheel event attached, ignore it
		if ( p == this ) {
			
			if (event.type == 'mouseout') {
				if (!to._mwHandlers)
					while (to && !to._mwHandlers) try { to = to.parentNode; } catch(e) { to = null; }
				
				if (to && to._mwHandlers)
					jQuery.event.mousewheel.giveFocus(to);
			}
			return false;
		}
		
		// Execute the right function
		return (event.type == "mouseover" ? this._mwOver : this._mwOut).call(this, event);
	},
	
	/**
	 * Give the element passed the mousewheel event focus.
	 * If the element already has mousewheel events attached
	 * to it, they will be removed before adding them back.
	 *
	 * @private
	 * @name giveFocus
	 * @param HTMLElement element The DOM node to apply the mousewheel event too.
	 * @param Function handler The function to call when onmousewheel fires.
	 * @param Boolean preventDefault Should the default action be prevented?.
	 * @see jQuery.fn.mousewheel
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	giveFocus: function(el) {
		if (jQuery.event.mousewheel.currentFocused)
			jQuery.event.mousewheel.removeFocus(jQuery.event.mousewheel.currentFocused);
		jQuery.event.mousewheel.currentFocused = el;
		if (window.addEventListener)
			window.addEventListener('DOMMouseScroll', el._handleMousewheel, false);
		window.onmousewheel = document.onmousewheel = el._handleMousewheel;
	},

	/**
	 * Removes the mousewheel event focus from the
	 * element passed in.
	 *
	 * @private
	 * @name removeFocus
	 * @see jQuery.fn.unmousewheel
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	removeFocus: function(el) {
		jQuery.event.mousewheel.currentFocused = null;
		if (window.removeEventListener)
			window.removeEventListener('DOMMouseScroll', el._handleMousewheel, false);
		window.onmousewheel = document.onmousewheel = null;
	},
	
	/**
	 * Used to store a cache of elements for IE to aid in preventing memory leaks
	 * It is an array of jQuery objects
	 *
	 * @private
	 */
	$elementCache: []
};

// Avoid memory leaks by removing mousewheel events and expandos on each cached element
if (jQuery.browser.msie) 
	jQuery(window)
		.bind('unload', function() {
			var els = jQuery.event.mousewheel.$elementCache; 
			for (var i=0; i<els.length; i++)
				els[i].unmousewheel();
		});