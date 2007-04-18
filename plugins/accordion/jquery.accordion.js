/*
 * Accordion 1.5 - jQuery menu widget
 *
 * Copyright (c) 2007 Jörn Zaefferer, Frank Marcia
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
 * This is very similar to the Squeezebox widget, only that there
 * can be only one open element.
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
 *	 cloneFirst: true
 * });
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
 *     <ul>
 *       <li><a href="books/">Books</a></li>
 *       <li><a href="books/fantasy/">Fantasy</a></li>
 *       <li><a href="books/programming/">Programming</a></li>
 *     </ul>
 *   </li>
 *   <li>
 *     <a class="head" href="">Movies</a>
 *     <ul>
 *       <li><a href="movies/">Movies</a>
 *       <li><a href="movies/fantasy/">Fantasy</a></li>
 *       <li><a href="movies/programming/">Programming</a></li>
 *     </ul>
 *   </li>
 * </ul>
 * @desc Creates an Accordion from the given navigation list, cloning the header element to produce a clickable
 * link. The class as specified in the header selector is removed from the cloned element. Currently this works
 * only with the above structure, the header must be an anchor followed by a list.
 *
 * @example jQuery('#accordion').Accordion().change(function(event, newHeader, oldHeader, newContent, oldContent) {
 *   jQuery('#status').html(newHeader.text());
 * });
 * @desc Updates the element with id status with the text of the selected header every time the accordion changes
 *
 * @param Map options key/value pairs of optional settings.
 * @option String|Element|jQuery|Boolean active Selector for the active element, default is the first child, set to false to display none at start
 * @option String|Element|jQuery header Selector for the header element, eg. div.title, a.head, default is the first child's tagname
 * @option String|Number showSpeed Speed for the slideIn, default is 'normal' (for numbers: smaller = faster)
 * @option String|Number hideSpeed Speed for the slideOut, default is 'normal' (for numbers: smaller = faster)
 * @option String selectedClass Class for active header elements, default is 'selected'
 * @option Boolean alwaysOpen Whether there must be one content element open, default is true.
 * @option Boolean animated Set to false to disable animations. Default: true
 * @option String event The event on which to trigger the accordion, eg. "mouseover". Default: "click"
 * @option Boolean cloneFirst Use this for a navigation menu where the header element must be available as a selectable target, see related example for more details
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
 * or a string expression matching an element.
 *
 * @example jQuery('#accordion').activate(1);
 * @desc Activate the second content of the Accordion contained in <div id="accordion">.
 *
 * @example jQuery('#accordion').activate("a:first");
 * @desc Activate the first element matching the given expression.
 *
 * @example jQuery('#nav').activate();
 * @desc Close all content parts of the accordion.
 *
 * @param String|Number index (optional) An Integer specifying the zero-based index of the content to be
 *				 activated or an expression specifying the element to close. Default: closes all.
 *
 * @type jQuery
 * @name activate
 * @cat Plugins/Accordion
 */
 
/**
 * Override the default settings of the Accordion. Affects only following plugin calls.
 *
 * @example jQuery.Accordion.setDefaults({
 * 	showSpeed: 1000,
 * 	hideSpeed: 150
 * });
 *
 * @param Map options key/value pairs of optional settings, see Accordion() for details
 *
 * @type jQuery
 * @name jQuery.Squeezebox.setDefaults
 * @cat Plugins/Accordion
 */

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

		// calculate active if not specified, using the first header
		var container = this,
			active = settings.active
				? jQuery(settings.active, this)
				: settings.active === false
					? jQuery("<div>")
					: jQuery(settings.header, this).eq(0),
			running = 0;

		var headers = container.find(settings.header);

		if ( settings.cloneFirst ) {
			headers.each(function() {
				jQuery(this).clone().removeClass( settings.header.replace(/\./, '') ).prependTo( jQuery(this).next() ).wrap("<li>");
			}).attr("href", "");
		}

		headers
			.not(active || "")
			.nextUntil(settings.header)
			.hide();
		active.addClass(settings.selectedClass);
		
		function toggle(toShow, toHide, data, clickedActive) {
			var finished = function(cancel) {
				running = cancel ? 0 : --running;
				if ( running )
					return;

				// trigger custom change event
				container.trigger("change", data);
			};
			
			// count elements to animate
			running = toHide.size() + toShow.size();
			
			// TODO if hideSpeed is set to zero, animations are crappy
			// workaround: use hide instead
			// solution: animate should check for speed of 0 and do something about it
			if ( settings.animated ) {
				if ( !settings.alwaysOpen && clickedActive ) {
					toShow.slideToggle(settings.showSpeed);
					finished(true);
				} else {
					toHide.filter(":hidden").each(finished).end().filter(":visible").slideUp(settings.hideSpeed, finished);
					toShow.slideDown(settings.showSpeed, finished);
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
			// TODO replace with parentUntil!
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
				data = [clicked, active, toShow, toHide];

			active = clickedActive ? jQuery([]) : clicked;
			
			toggle( toShow, toHide, data, clickedActive );

			return !toShow.length;
		};
		function activateHandlder(event, index) {
			// call clickHandler with custom event
			var target = 
			clickHandler({
				target: index >= 0
					? jQuery(settings.header, this)[index]
					: typeof index == "string"
						? jQuery(index, this)[0]
						: null
			});
		};

		return container
			.bind(settings.event, clickHandler)
			.bind("activate", activateHandlder);
	},
	// programmatic triggering
	activate: function(index) {
		return this.trigger('activate', [index]);
	}
});

jQuery.Accordion = {};
jQuery.extend(jQuery.Accordion, {
	defaults: {
		selectedClass: "selected",
		showSpeed: 'normal',
		hideSpeed: 'normal',
		alwaysOpen: true,
		animated: true,
		event: "click"
	},
	setDefaults: function(settings) {
		jQuery.extend(jQuery.Accordion.defaults, settings);
	}
});
