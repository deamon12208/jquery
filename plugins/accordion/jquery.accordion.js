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
 * Make the selected elements Accordion widgets.
 *´
 * Semantic requirements:
 * 
 * If the structure of your container is flat with unique
 * tags for header and content elements, eg. a definition list
 * (dl > dt + dd), you don't have to specify any options at
 * all.
 *
 * If your structure uses the same elements for header and
 * content or uses some kind of nested structure, you have to 
 * specify the header elements, eg. via class, see the second example.
 *
 * Use activate(Number) to change the active content programmatically.
 *
 * @example $('#list1').Accordion();
 * @before <dl id="list1"><dt>Header 1><dd>Content 1</dd>[...]</dl>
 * @desc Creates a Accordion from the given definition list
 *
 * @example $('#list2').Accordion({
 *   header: 'div.title'
 * });
 * @before <div id="nav"><div><div class="title">Header 1><div>Content 1</div></div>[...]</div>
 * @desc Creates a Accordion from the given div structure
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
 * @example $('#accordion').Accordion().change(function(event, newHeader, oldHeader, newContent, oldContent) {
 *   $('#status').html(newHeader.text());
 * });
 * @desc Updates the #status element with the text of the selected header every time the accordion changes
 *
 * @param Object settings key/value pairs of optional settings.
 * @option String|Element|jQuery active Selector for the active element, default is the first child
 * @option String|Element|jQuery header Selector for the header element, eg. div.title, a.head, default is the first child's tagname
 * @option String|Number showSpeed Speed for the slideIn, default is 'slow'
 * @option String|Number hideSpeed Speed for the slideOut, default is 'fast'
 * @option String selectedClass Class for active header elements, default is 'selected'
 *
 * @event change Called everytime the accordion changes, params: event, newHeader, oldHeader, newContent, oldContent
 *
 * @type jQuery
 *
 * @see activate(Number)
 *
 * @name Accordion
 * @cat Plugin/Accordion
 * @author Jörn Zaefferer (http://bassistance.de)
 */
 
/**
 * Activate a content part of the Accordion programmatically with the position zero-based index.
 *
 * If the index is not specified, it defaults to zero, if it is an invalid index, eg. a string,
 * nothing happens.
 *
 * Requires jQuery core revision >= 557.
 *
 * @example $('#accordion').activate(1);
 * @desc Activate the second content of the Accordion contained in <div id="accordion">.
 * @example $('#nav').activate();
 * @desc Activate the first content of the Accordion contained in <ul id="nav">.
 *
 * @param Number index An Integer specifying the zero-based index of the content to be
 *				 activated. Defaults to 0.
 * @type jQuery
 *
 * @name activate
 * @cat Plugins/Accordion
 * @author Jörn Zaefferer (http://bassistance.de)
 */
 
// create private scope with $ alias for jQuery
(function($) {
	// save reference to plugin method
	var plugin = $.fn.Accordion = function(settings) {
		
		// setup configuration
		// TODO: allow multiple arguments to extend, see bug #344
		settings = $.extend($.extend({}, arguments.callee.defaults), $.extend({
			// define context defaults
			header: $(':first-child', this)[0].tagName // take first childs tagName as header
		}, settings || {}));
		
		// calculate active if not specified, using the first header
		var container = this,
			active = settings.active ? $(settings.active, this) : $(settings.header, this).eq(0),
			running = 0;
		
		$(settings.header, container)
			.not(active[0])
			.nextUntil(settings.header)
			.hide();
		active.addClass(settings.selectedClass);
		
		var clickHandler = function(event) {
			// get the click target
			var clicked = $(event.target);
		
			// if animations are still active, or the active header is the target, ignore click
			if(running || clicked[0] == active[0] || !clicked.is(settings.header))
				return;
			
			// switch classes
			active.removeClass(settings.selectedClass);
			clicked.addClass(settings.selectedClass);
			
			// find elements to show and hide
			var toShow = $(clicked).nextUntil(settings.header),
				toHide = $(active).nextUntil(settings.header),
				data = [clicked, active, toShow, toHide];
			active = clicked;
			// count elements to animate
			running = toHide.size() + toShow.size();
			var finished = function() {
				if(--running)
					return;
				// maintain flexible height
				toHide.css({height: ''});
				toShow.css({height: ''});
				
				// trigger custom change event
				container.trigger("change", data);
			};
			// TODO if hideSpeed is set to zero, animations are crappy
			// workaround: use hide instead
			// solution: animate should check for speed of 0 and do something about it
			toHide.slideUp(settings.hideSpeed, finished);
			toShow.slideDown(settings.showSpeed, finished);
			event.preventDefault();
		};
		var activateHandlder = function(event, index) {
			// call clickHandler with custom event
			clickHandler($.event.fix({
				target: $(settings.header, this)[index]
			}));
		};
	
		return container
			.bind("click", clickHandler)
			.bind("activate", activateHandlder);
	};
	// define static defaults
	plugin.defaults = {
		selectedClass: "selected",
		showSpeed: 'slow',
		hideSpeed: 'fast'
	};
	
	// shortcut for trigger, nicer API and easily to document
	$.fn.activate = function(index) {
		return this.trigger('activate', [index || 0]);
	};
	
})(jQuery);