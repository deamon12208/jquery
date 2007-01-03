/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 */

jQuery.fn.extend({
	/**
	 * Apply the mousewheel event to the elements in the jQuery object.
	 * The handler function should be prepared to take the event object
	 * and a param called 'delta'. The 'delta' param is a number
	 * either > 0 or < 0. > 0 = up and < 0 = down.
	 *
	 * Firefox and Opera has some issues preventing default and just using
	 * event.preventDefault() will not work. Instead if you need
	 * to prevent the default action, just pass in 'true' for the preventDefault
	 * param.
	 *
	 * Only one handler function should be used per an element.
	 * Meaning call $().mousewheel only once per an element.
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
	 * @param Function handler The function to call when onmousewheel fires. Should take two params: event and delta.
	 * @param Boolean preventDefault Should the default action be prevented?
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	/**
	 * Apply the mousewheel event to the elements in the jQuery object.
	 * The up and down handler functions should be prepared to take the
	 * event object and a param called 'delta'. The 'delta' param is a number
	 * either > 0 or < 0. > 0 = up and < 0 = down.
	 *
	 * Firefox and Opera has some issues preventing default and just using
	 * event.preventDefault() will not work. Instead if you need
	 * to prevent the default action, just pass in 'true' for the preventDefault
	 * param.
	 *
	 * The method takes two functions. The first is fired only on when the
	 * mousewheel is moved up. The second is fired only when the mouswheel is
	 * moved down.
	 *
	 * Only one handler function should be used per an element.
	 * Meaning call $().mousewheel only once per an element.
	 *
	 * @example $("p").mousewheel(function(event, delta){
	 *   // do something on mousewheel scroll up
	 * }, function(event, delta) {
	 *   // do something on mousewheel scroll down
	 * });
	 *
	 * @name mousewheel
	 * @type jQuery
	 * @param Function upHandler The function to call when the mousewheel is moved up. Should take two params: event and delta.
	 * @param Function downHandler The function to call when the mousewheel is moved down. Should take two params: event and delta.
	 * @param Boolean preventDefault Should the default action be prevented?
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	mousewheel: function(up, down, preventDefault) {
		return this.hover(
			function() {
				jQuery.event.mousewheel.giveFocus(this, up, down, preventDefault);
			},
			function() {
				jQuery.event.mousewheel.removeFocus(this);
			}
		);
	},

	/**
	 * Apply the mousewheeldown event to the elements in the jQuery object.
	 * The handler function should be prepared to take the event object
	 * and a param called 'delta'. The 'delta' param is a number
	 * either > 0 or < 0. > 0 = up and < 0 = down.
	 *
	 * The handler function is only called if the mousewheel is moved down.
	 *
	 * Firefox and Opera has some issues preventing default and just using
	 * event.preventDefault() will not work. Instead if you need
	 * to prevent the default action, just pass in 'true' for the preventDefault
	 * param.
	 *
	 * Only one handler function should be used per an element.
	 * Meaning call $().mousewheel only once per an element. This will
	 * overwrite any previous mousewheel event, even a mousewheelup event.
	 * To get a seperate up and down function just use mousewheel and pass
	 * two functions: the first is the up handler and the second is the
	 * down handler.
	 *
	 * @example $("p").mousewheeldown(function(event, delta){
	 *   //do something on mousewheel scroll down
	 * });
	 *
	 * @name mousewheeldown
	 * @type jQuery
	 * @param Function handler The function to call when the mousewheel is moved down. Should take two params: event and delta.
	 * @param Boolean preventDefault Should the default action be prevented?
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	mousewheeldown: function(fn, preventDefault) {
		return this.mousewheel(function(){}, fn, preventDefault);
	},

	/**
	 * Apply the mousewheelup event to the elements in the jQuery object.
	 * The handler function should be prepared to take the event object
	 * and a param called 'delta'. The 'delta' param is a number
	 * either > 0 or < 0. > 0 = up and < 0 = down.
	 *
	 * The handler function is only called if the mousewheel is moved down.
	 *
	 * Firefox and Opera has some issues preventing default and just using
	 * event.preventDefault() will not work. Instead if you need
	 * to prevent the default action, just pass in 'true' for the preventDefault
	 * param.
	 *
	 * Only one handler function should be used per an element.
	 * Meaning call $().mousewheel only once per an element. This will
	 * overwrite any previous mousewheel event, even a mousewheeldown event.
	 * To get a seperate up and down function just use mousewheel and pass
	 * two functions: the first is the up handler and the second is the
	 * down handler.
	 *
	 * @example $("p").mousewheeldown(function(event, delta){
	 *   //do something on mousewheel scroll down
	 * });
	 *
	 * @name mousewheelup
	 * @type jQuery
	 * @param Function handler The function to call when the mousewheel is moved up. Should take two params: event and delta.
	 * @param Boolean preventDefault Should the default action be prevented?
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	mousewheelup: function(fn, preventDefault) {
		return this.mousewheel(fn, function(){}, preventDefault);
	},

	/**
	 * This method removes the applied mousewheel event from the elements
	 * in the jQuery object. The $().mousewheel and $().unmousewheel is only
	 * capable of handling one handler function per an element. Therefore,
	 * there is no need to pass anything to this method.
	 *
	 * @name unmousewheel
	 * @type jQuery
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	unmousewheel: function() {
		return this.each(function() {
			jQuery(this).unmouseover().unmouseout();
			jQuery.event.mousewheel.removeFocus(this);
		});
	},

	/**
	 * This method removes the applied mousewheel event from the elements
	 * in the jQuery object. The $().mousewheel and $().unmousewheel is only
	 * capable of handling one handler function per an element. Therefore,
	 * there is no need to pass anything to this method.
	 *
	 * @name unmousewheeldown
	 * @type jQuery
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	unmousewheeldown: jQuery.fn.unmousewheel,

	/**
	 * This method removes the applied mousewheel event from the elements
	 * in the jQuery object. The $().mousewheel and $().unmousewheel is only
	 * capable of handling one handler function per an element. Therefore,
	 * there is no need to pass anything to this method.
	 *
	 * @name unmousewheelup
	 * @type jQuery
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	unmousewheelup: jQuery.fn.unmousewheel
});


/**
 * The manager for the mousewheel event.
 * Handles the switching of focus for the
 * different elements that have the
 * mousewheel event attached to them.
 *
 * @private
 * @cat @cat Plugins/Mousewheel
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
jQuery.event.mousewheel = {
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
	giveFocus: function(el, up, down, preventDefault) {
		if (el._handleMousewheel) jQuery(el).unmousewheel();

		if (preventDefault == window.undefined && down && down.constructor != Function) {
			preventDefault = down;
			down = null;
		}

		el._handleMousewheel = function(event) {
			if (!event) event = window.event;
			if (preventDefault) // cannot call any methods before preventing default (firefox)
				if (event.preventDefault) event.preventDefault();
				else event.returnValue = false;
			var delta = 0;
			if (event.wheelDelta) {
				delta = event.wheelDelta/120;
				if (window.opera) delta = -delta;
			} else if (event.detail) {
				delta = -event.detail/3;
			}
			if (up && (delta > 0 || !down))
				up.apply(el, [event, delta]);
			else if (down && delta < 0)
				down.apply(el, [event, delta]);
		};

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
		if (!el._handleMousewheel) return;

		if (window.removeEventListener)
			window.removeEventListener('DOMMouseScroll', el._handleMousewheel, false);
		window.onmousewheel = document.onmousewheel = null;
		el._handleMousewheel = null;
	}
};