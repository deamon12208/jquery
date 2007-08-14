/*
 * Accordion 1.4 - jQuery menu widget
 *
 * Copyright (c) 2007 Jörn Zaefferer, Frank Marcia
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-accordion/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

/**
 * Make the selected elements Accordion widgets.
 *
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
 * A change event is triggered everytime the accordion changes. Apart from
 * the event object, all arguments are jQuery objects.
 * Arguments: event, newHeader, oldHeader, newContent, oldContent
 *
 * @example jQuery('#nav').Accordion();
 * @before <dl id="nav">
 *   <dt>Header 1</dt>
 *   <dd>Content 1</dd>
 *   <dt>Header 2</dt>
 *   <dd>Content 2</dd>
 * </dl>
 * @desc Creates an Accordion from the given definition list
 *
 * @example jQuery('#nav').Accordion({
 *   header: 'div.title'
 * });
 * @before <div id="nav">
 *  <div>
 *    <div class="title">Header 1</div>
 *    <div>Content 1</div>
 *  </div>
 *  <div>
 *    <div class="title">Header 2</div>
 *    <div>Content 2</div>
 *  </div>
 * </div>
 * @desc Creates an Accordion from the given div structure
 *
 * @example jQuery('#nav').Accordion({
 *   header: '.head',
 * 	 navigation: true
 * });
 * location.href == "somedomain.com/movies/fantasy/"
 * @before <ul id="nav">
 *   <li>
 *     <a class="head" href="books/">Books</a>
 *     <ul>
 *       <li><a href="books/fantasy/">Fantasy</a></li>
 *       <li><a href="books/programming/">Programming</a></li>
 *     </ul>
 *   </li>
 *   <li>
 *     <a class="head" href="movies/">Movies</a>
 *     <ul>
 *       <li><a href="movies/fantasy/">Fantasy</a></li>
 *       <li><a href="movies/programming/">Programming</a></li>
 *     </ul>
 *   </li>
 * </ul>
 * @after <ul id="nav">
 *   <li>
 *     <a class="head" href="">Books</a>
 *     <ul style="display: none">
 *       <li><a href="books/fantasy/">Fantasy</a></li>
 *       <li><a href="books/programming/">Programming</a></li>
 *     </ul>
 *   </li>
 *   <li>
 *     <a class="head" href="">Movies</a>
 *     <ul>
 *       <li><a class="current" href="movies/fantasy/">Fantasy</a></li>
 *       <li><a href="movies/programming/">Programming</a></li>
 *     </ul>
 *   </li>
 * </ul>
 * @desc Creates an Accordion from the given navigation list, activating those accordion parts
 * that match the current location.href. Assuming the user clicked on "Fantasy" in the "Movies" section,
 * the accordion displayed after loading the page with the "Movies" section open and the "Fantasy" link highlighted
 * with a class "current".
 *
 * @example jQuery('#accordion').Accordion().change(function(event, newHeader, oldHeader, newContent, oldContent) {
 *   jQuery('#status').html(newHeader.text());
 * });
 * @desc Updates the element with id status with the text of the selected header every time the accordion changes
 *
 * @param Map options key/value pairs of optional settings.
 * @option String|Element|jQuery|Boolean|Number active Selector for the active element. Set to false to display none at start. Default: first child
 * @option String|Element|jQuery header Selector for the header element, eg. 'div.title', 'a.head'. Default: first child's tagname
 * @option String|Number speed 
 * @option String selectedClass Class for active header elements. Default: 'selected'
 * @option Boolean alwaysOpen Whether there must be one content element open. Default: true
 * @option Boolean animated Speed for animations (for numbers: smaller = faster, for strings: 'fast', 'normal' or 'slow'). Set to false to disable animations. Default: 'fast'
 * @option String event The event on which to trigger the accordion, eg. "mouseover". Default: "click"
 * @option Boolean navigation If set, looks for the anchor that matches location.href and activates it. Great for href-based pseudo-state-saving. Default: false
 *
 * @type jQuery
 * @see activate(Number)
 * @name Accordion
 * @cat Plugins/Accordion
 */

/**
 * Activate a content part of the Accordion programmatically.
 *
 * The index can be a zero-indexed number to match the position of the header to close
 * or a string expression matching an element. Pass -1 to close all (only possible with alwaysOpen:false).
 *
 * @example jQuery('#accordion').activate(1);
 * @desc Activate the second content of the Accordion contained in <div id="accordion">.
 *
 * @example jQuery('#accordion').activate("a:first");
 * @desc Activate the first element matching the given expression.
 *
 * @example jQuery('#nav').activate(false);
 * @desc Close all content parts of the accordion.
 *
 * @param String|Element|jQuery|Boolean|Number index An Integer specifying the zero-based index of the content to be
 *				 activated or an expression specifying the element, or an element/jQuery object, or a boolean false to close all.
 *
 * @type jQuery
 * @name activate
 * @cat Plugins/Accordion
 */
 jQuery.easing.bounceout = function(x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	};
jQuery.fn.extend({
	// nextUntil is necessary, would be nice to have this in jQuery core
	nextUntil: function(expr) {
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
	
	    return this.pushStack( match );
	},
	// the plugin method itself
	Accordion: function(settings) {
		// setup configuration
		settings = jQuery.extend({}, jQuery.Accordion.defaults, {
			// define context defaults
			header: jQuery(':first-child', this)[0].tagName // take first childs tagName as header
		}, settings);
		
		if ( settings.navigation ) {
			var current = this.find("a").filter(function() { return this.href == location.href; });
			if ( current.length ) {
				if ( current.filter(settings.header).length ) {
					settings.active = current;
				} else {
					settings.active = current.parent().parent().prev();
					current.addClass("current");
				}
			}
		}
		
		// calculate active if not specified, using the first header
		var container = this,
			headers = container.find(settings.header),
			active = findActive(settings.active),
			running = 0;


		headers
			.not(active || "")
			.nextUntil(settings.header)
			.hide();
		active.addClass(settings.selectedClass);
		
		function findActive(selector) {
			return selector != undefined
				? typeof selector == "number"
					? headers.eq(selector)
					: headers.not(headers.not(selector))
				: selector === false
					? jQuery("<div>")
					: headers.eq(0)
		}
		
		function toggle(toShow, toHide, data, clickedActive, down) {
			var finished = function(cancel) {
				running = cancel ? 0 : --running;
				if ( running )
					return;

				// trigger custom change event
				container.trigger("change", data);
			};
			
			// count elements to animate
			running = toHide.size()// + toShow.size();
			
			if ( settings.animated ) {
				if ( !settings.alwaysOpen && clickedActive ) {
					toShow.slideToggle(settings.animated);
					finished(true);
				} else {
					/*
					var height = toHide.height()
					toShow.height(0).show();
					toHide.filter(":hidden").each(finished).end().filter(":visible")
						//.animate({height: "hide"}, settings.animated, "linear", finished);
						.animate({height:"hide"}, {
							step: function(n) {
								toShow.height(Math.ceil(height - (parseFloat(jQuery.fn.jquery) <= 1.1 ?
									n : n * height)));
							},
							duration: 1000,
							easing: "bounceout",
							complete: finished
						});
					toShow
						.animate({height: "show"}, settings.animated, "linear", finished);
*/					
					
					//var all = $("dd"),
						//visible = all.filter(":visible"),
						var height = toHide.height()
						//hidden = $(this).parent().next()
						//down = all.index( visible[0] ) > all.index( hidden[0] );
						//down = true
		
					//if ( !toShow.is(":visible") ) {
						toShow.show();
						toHide.filter(":hidden").each(finished).end().filter(":visible").animate({height:"hide"},{
							step: function(n){
								toShow.height(Math.ceil(height - (parseFloat(jQuery.fn.jquery) <= 1.1 ?
									n : n * height)));
							},
							duration: down ? 1000 : 200,
							easing: down ? "bounceout" : "swing",
							complete: finished
						});
					//}
				}
			} else {
				if ( !settings.alwaysOpen && clickedActive ) {
					toShow.toggle();
				} else {
					toHide.hide();
					toShow.show();
				}
				finished(true);
			}
		}
		
		function clickHandler(event) {
			if ( !event.target && !settings.alwaysOpen ) {
				active.toggleClass(settings.selectedClass);
				var toHide = active.nextUntil(settings.header);
				var toShow = active = jQuery([]);
				toggle( toShow, toHide );
			}
			// get the click target
			var clicked = jQuery(event.target);
			
			// due to the event delegation model, we have to check if one
			// of the parent elements is our actual header, and find that
			if ( clicked.parents(settings.header).length )
				while ( !clicked.is(settings.header) )
					clicked = clicked.parent();
			
			var clickedActive = clicked[0] == active[0];
			
			// if animations are still active, or the active header is the target, ignore click
			if(running || (settings.alwaysOpen && clickedActive) || !clicked.is(settings.header))
				return;

			// switch classes
			active.toggleClass(settings.selectedClass);
			if ( !clickedActive ) {
				clicked.addClass(settings.selectedClass);
			}

			// find elements to show and hide
			var toShow = clicked.nextUntil(settings.header),
				toHide = active.nextUntil(settings.header),
				data = [clicked, active, toShow, toHide],
				down = headers.index( active[0] ) > headers.index( clicked[0] );
			
			active = clickedActive ? jQuery([]) : clicked;
			toggle( toShow, toHide, data, clickedActive, down );

			return !toShow.length;
		};
		function activateHandler(event, index) {
			// IE manages to call activateHandler on normal clicks
			if ( arguments.length == 1 )
				return;
			// call clickHandler with custom event
			clickHandler({
				target: findActive(index)[0]
			});
		};

		return container
			.bind(settings.event, clickHandler)
			.bind("activate", activateHandler);
	},
	activate: function(index) {
		return this.trigger('activate', [index]);
	}
});

jQuery.Accordion = {};
jQuery.extend(jQuery.Accordion, {
	defaults: {
		selectedClass: "selected",
		alwaysOpen: true,
		animated: 'fast',
		event: "click"
	}
});
