/*
 * Squeezebox 1.5 - jQuery menu widget
 *
 * Copyright (c) 2007 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

/**
 * Make the selected elements Squeezebox widgets.
 *
 * This is very similar to the Accordion widget, only that there
 * is no restriction on the open elements.
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
 * A change event is triggered everytime the squeezebox changes. Apart from
 * the event object, all arguments are jQuery objects.
 * Arguments: event, newHeader, newContent
 *
 * @example jQuery('#nav').Squeezebox();
 * @before <dl id="nav">
 *   <dt>Header 1</dt>
 *   <dd>Content 1</dd>
 *   <dt>Header 2</dt>
 *   <dd>Content 2</dd>
 * </dl>
 * @desc Creates a Squeezebox from the given definition list
 *
 * @example jQuery('#nav').Squeezebox({
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
 * @desc Creates a Squeezebox from the given div structure
 *
 * @example jQuery('#nav').Squeezebox({
 *   header: 'a.head'
 * });
 * @before <ul id="nav">
 *   <li>
 *     <a class="head">Header 1</a>
 *     <ul>
 *       <li><a href="#">Link 1</a></li>
 *       <li><a href="#">Link 2></a></li>
 *     </ul>
 *   </li>
 *   <li>
 *     <a class="head">Header 2</a>
 *     <ul>
 *       <li><a href="#">Link 3</a></li>
 *       <li><a href="#">Link 4></a></li>
 *     </ul>
 *   </li>
 * </ul>
 * @desc Creates a Squeezebox from the given navigation list
 *
 * @example jQuery('#squeezebox').Squeezebox().change(function(event, newHeader, newContent) {
 *   jQuery('#status').html(newHeader.text());
 * });
 * @desc Updates the element with id status with the text of the selected header every time the squeezebox changes
 *
 * @param Map options key/value pairs of optional settings.
 * @option String|Element|jQuery|Boolean active Selector for active elements. Default: none.
 * @option String|Element|jQuery header Selector for the header element, eg. div.title, a.head, default is the first child's tagname
 * @option String|Number speed Speed for the slideToggle, default is 'normal' (for numbers: smaller = faster)
 * @option String selectedClass Class for active header elements, default is 'selected'
 * @option Boolean|String animated Set to false to disable animations or change the type of animations. Default: 'slideToggle'
 * @option String event The event on which to trigger the accordion, eg. "mouseover". Default: "click"
 *
 * @type jQuery
 * @see activate(Number)
 * @name Squeezebox
 * @cat Plugins/Squeezebox
 */

/**
 * Activate a content part of the Accordion/Squeezebox programmatically at the given zero-based index.
 *
 * If the index is not specified, it defaults to zero, if it is an invalid index, eg. a string,
 * nothing happens.
 *
 * @example jQuery('div#accordion').activate(1);
 * @desc Activate the second content of the Accordion contained in <div id="accordion">.
 *
 * @example jQuery('ul#squeezebox').activate();
 * @desc Activate the first content of the Squeezebox contained in <ul id="squeezebox">.
 *
 * @param Number index (optional) An Integer specifying the zero-based index of the content to be
 *				 activated. Default: 0
 *
 * @type jQuery
 * @name activate
 * @cat Plugins/Squeezebox
 */
 
/**
 * Override the default settings of the Squeezebox. Affects only following plugin calls.
 *
 * @example jQuery.Squeezebox.setDefaults({
 * 	speed: 1000,
 *  animated: false
 * });
 *
 * @param Map options key/value pairs of optional settings, see Squeezebox() for details
 *
 * @type jQuery
 * @name jQuery.Squeezebox.setDefaults
 * @cat Plugins/Squeezebox
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
	Squeezebox: function(settings) {
		// setup configuration
		settings = jQuery.extend({}, jQuery.Squeezebox.defaults, {
			// define context defaults
			header: jQuery(':first-child', this)[0].tagName // take first childs tagName as header
		}, settings);

		// calculate active if not specified, using the first header
		var container = this,
			active = this.find(settings.active);

		container.find(settings.header)
			.not(active)
			.nextUntil(settings.header)
			.hide();
		active.addClass(settings.selectedClass);

		function clickHandler(event) {
			// get the click target
			var clicked = jQuery(event.target);
			
			// due to the event delegation model, we have to check if one
			// of the parent elements is our actual header, and find that
			if ( clicked.parents(settings.header).length )
				while ( !clicked.is(settings.header) )
					clicked = clicked.parent();
			
			// if animations are still active, or the active header is the target, ignore click
			if ( clicked[0].running || !clicked.is(settings.header) )
				return;

			// switch classes
			clicked.toggleClass(settings.selectedClass);

			// find elements to show and hide
			var toToggle = clicked.nextUntil(settings.header);

			// count elements to animate
			var running = toToggle.size();
			function finished() {
				--running;
				if ( running )
					return;
				clicked[0].running = null;
				// trigger custom change event
			};
			container.trigger("change", [clicked, toToggle]);
			if ( settings.animated ) {
				clicked[0].running = true;
				toToggle.slideToggle(settings.speed, finished);
			} else {
				toToggle.toggle();
			}

			return !toToggle.length;
		};
		function activateHandlder(event, index) {
			// call clickHandler with custom event
			clickHandler({
				target: jQuery(settings.header, this)[index]
			});
		};

		return container
			.bind(settings.event, clickHandler)
			.bind("activate", activateHandlder);
	},
	// programmatic triggering
	activate: function(index) {
		return this.trigger('activate', [index || 0]);
	}
});

jQuery.Squeezebox = {};
jQuery.extend(jQuery.Squeezebox, {
	defaults: {
		selectedClass: "selected",
		speed: 'normal',
		active: '',
		animated: true,
		event: "click"
	},
	setDefaults: function(settings) {
		jQuery.extend(jQuery.Squeezebox.defaults, settings);
	}
});
