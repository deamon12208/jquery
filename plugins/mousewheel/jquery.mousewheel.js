/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * $LastChangedDate$
 * $Rev$
 *
 * Version: @VERSION
 * 
 * Requires: jQuery 1.2+
 */

(function($) {
	
var cache = [];
	
$.fn.extend({
	mousewheel: function(f) {
		f.guid = f.guid || $.event.guid++;
		
		return this.each( function() {
			var elem = this, handlers = $.data(elem, 'mwhandlers') || [];
			handlers.push(f);
			$.data(elem, 'mwhandlers', handlers);
			
			// Create handler
			!$.data(elem, 'mwhandler') && $.data(elem, 'mwhandler', function(event) {
				event = $.event.fix(event || window.event);
				$.extend( event, $.data(elem, 'mwcursorpos') || {} );
				var delta = 0, returnValue = true;
				
				if ( event.wheelDelta ) delta = event.wheelDelta/120;
				if ( event.detail     ) delta = -event.detail/3;
				if ( $.browser.opera  ) delta = -event.wheelDelta;
				
				$.each( $.data(elem, 'mwhandlers'), function(i, handler) {
					if ( handler )
						if ( handler.call(elem, event, delta) === false ) {
							returnValue = false;
							event.preventDefault();
							event.stopPropagation();
						}
				});
				
				return returnValue;
			});
			
			// Fix pageX, pageY, clientX and clientY for mozilla
			if ( $.browser.mozilla && !$.data(elem, 'mwfixcursorpos') ) {
				$.data(elem, 'mwfixcursorpos', function(event) {
					$.data(elem, 'mwcursorpos', {
						pageX: event.pageX,
						pageY: event.pageY,
						clientX: event.clientX,
						clientY: event.clientY
					});
				});
				$(elem).bind('mousewheel:mousemove', $.data(elem, 'mwfixcursorpos'));
			}
			
			if ( elem.addEventListener )
				if ( $.browser.mozilla ) elem.addEventListener('DOMMouseScroll', $.data(elem, 'mwhandler'), false);
				else                     elem.addEventListener('mousewheel',     $.data(elem, 'mwhandler'), false);
			else
				elem.onmousewheel = $.data(elem, 'mwhandler');
			
			cache.push( $(elem) );
		});
	},
	
	unmousewheel: function(f) {
		return this.each( function() {
			var elem = this;
			if ( f )
				$.data( elem, 'mwhandlers', $.grep($.data(elem, 'mwhandlers'), function(i, handler) {
					return handler && handler.guid != f.guid;
				}) );
			else {
				if ( $.browser.mozilla )
					$(elem).unbind('mousewheel:mousemove');
					
				if ( elem.addEventListener )
					if ( $.browser.mozilla ) elem.removeEventListener('DOMMouseScroll', $.data(elem, 'mwhandler'), false);
					else                     elem.removeEventListener('mousewheel',     $.data(elem, 'mwhandler'), false);
				else
					elem.onmousewheel = null;
				
				$.removeData(elem, 'mwhandlers');
				$.removeData(elem, 'mwhandler');
				$.removeData(elem, 'mwfixcursorpos');
				$.removeData(elem, 'mwcursorpos');
			}
		});
	}
});

// clean-up
$(window)
	.one('unload', function() {
		var els = cache || [];
		for (var i=0; i<els.length; i++)
			els[i].unmousewheel();
	});
	
})(jQuery);