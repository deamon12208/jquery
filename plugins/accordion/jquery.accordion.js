/*
 * Accordion - jQuery widget
 *
 * Copyright (c) 2006 Jörn Zaefferer, Frank Marcia
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

// nextUntil is necessary, would be nice to have this in jQuery core
jQuery.fn.nextUntil = function(expr) {
    var match = [];

    // We need to figure out which elements to push onto the array
    this.each(function(){
        // Traverse through the sibling nodes
        for( var i = this.nextSibling; i; i = i.nextSibling ) {
            // Make sure that we're only dealing with elements
            if ( i.nodeType != 1 ) continue;

            // If we find a match then we need to stop
            if ( jQuery.filter( expr, [i] ).r.length ) break;

            // Otherwise, add it on to the stack
            match.push( i );
        }
    });

    return this.pushStack( match, arguments );
}; 

/**
 * Create an Accordion from the selected container(s).
 * The structure inside the container must be flat, that
 * is, a header element must be followed by one or more
 * content elements.
 *
 * A definition list (dl, dt, dd) is an obvious, but not
 * necessary choice.
 *
 * If your structure uses the same elements for header and
 * content, you have to specify the header (eg. by class),
 * see the second example.
 *
 * If you use nested lists, eg. for a navigation, you have to
 * mark the header elements with their own class and specify
 * that via the header option, see third example.
 * 
 * @example $('#list1').Accordion();
 * @before <dl id="list1"><dt>Header 1><dd>Content 1</dd>[...]</dl>
 * @desc Creates a Accordion from the given definition list
 *
 * @example $('#list2').Accordion({
 *   header: 'div.title'
 * });
 * @before <div id="list2"><div class="title">Header 1><div>Content 1</div>[...]</div>
 * @desc Creates a Accordion from the given definition list
 *
 * @example $('#nav').Accordion({
 *   header: 'a.head'
 * });
 * @before <ul id="nav">
 *   <li>
 *     <a class="head">Header 1>
 *     <ul>
 *       <li><a href="#">Link 1</a></li>
 *       <li><a href="#">Link 2></a></li>
 *     </ul>
 *   </li>
 *   [...]
 * </ul>
 * @desc Creates a Accordion from the given navigation list
 *
 * @name Accordion
 * @type jQuery
 * @param Object options
 * @option Element active The header element that is active, default is the first child
 * @option String header Selector for the header element, eg. div.title, a.head, default is the first child's tagname
 * @option Function onClick Callback whenever a header is clicked, no default
 * @option Function onShow Callback when a part is shown, no default
 * @option Function onHide Callback when a part is hidden, no default
 * @option String|Number showSpeed Speed for the slideIn, default is 'slow'
 * @option String|Number hideSpeed Speed for the slideOut, default is 'fast'
 * @option String onClass Class for active header elements, default is 'on'
 * @option String offClass Class for inactive header elements, default is 'off'
 * @cat Plugin/Accordion
 * @author Jörn Zaefferer (http://bassistance.de)
 */
 
(function($) {
$.fn.Accordion = function(conf) {

	conf = jQuery.extend({
		active: $(this).children(":eq(0)")[0], // first child is active
		header: $(this).children(':eq(0)')[0].tagName, // first child is header, take it's tagname
		onClick: function(){}, // no default handler
		onShow: function(){}, // no default handler
		onHide: function(){}, // no default handler
		onClass: "on",
		offClass: "off",
		showSpeed: 'slow', // slide in slow
		hideSpeed: 'fast' // slide out fast
	}, conf || {});
	
	var active = conf.active;
	var running = 0;
	var title = conf.header;
	
	$(title, this)
		.not(active)
		.addClass(conf.offClass)
		.nextUntil(title)
		.hide()
		.end()
		.each(conf.onHide);
	$(active, this).addClass(conf.onClass).each(conf.onShow);

	$(this).click(function(event) {
		if(running > 0)
			return;
		var target = $(event.target);
		if( target.is(title) ) {
			$(active).removeClass(conf.onClass).addClass(conf.offClass);
			target.removeClass(conf.offClass).addClass(conf.onClass);
			
			target.each(conf.onClick);
			var content = $(target).nextUntil(title);
			
			if (content.is(":visible")) return;
			running = 2;
			var finished = function() { --running };
			$(active)
				.nextUntil(title)
				.not(':hidden')
				.slideUp(conf.hideSpeed, finished);
			content.slideDown(conf.showSpeed, finished);
	
			$(active).each(conf.onHide);
			active = target;
			$(active).each(conf.onShow);
			event.preventDefault();
		}
	});
	return this;
};
})(jQuery);