/*
 * Tooltip - jQuery plugin  for styled tooltips
 *
 * Copyright (c) 2006 Jörn Zaefferer, Stefan Petre
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Display a customized tooltip instead of the default one
 * for every selected element. The tooltip behaviour mimics
 * the default one, but lets you style the tooltip and
 * specify the delay before displaying it.
 *
 * In addition, it displays the href value, if it is available.
 * 
 * To style the tooltip, use these selectors in your stylesheet:
 *
 * #tooltip - The tooltip container
 *
 * #tooltip h3 - The tooltip title
 *
 * #tooltip p - The tooltip url, use "display: none !important" to always hide
 *
 * @example $('a, input, img').Tooltip();
 * @desc Shows tooltips for anchors, inputs and images, if they have a title
 *
 * @example $('label').Tooltip({
 *   delay: 0,
 *   track: true,
 *   event: "click"
 * });
 * @desc Shows tooltips for labels with no delay, tracking mousemovement, displaying the tooltip when the label is clicked.
 *
 * @name Tooltip
 * @param Hash options (optional) Customize your Tooltips
 * @option Number delay The number of milliseconds before a tooltip is display, default is 250
 * @option String event The event on which the tooltip is displayed, default is "mouseover", "click" works fine, too
 * @option Boolean track If true, let the tooltip track the mousemovement, default is false
 * @type jQuery
 * @cat Plugins/Tooltip
 * @author Jörn Zaefferer (http://bassistance.de)
 */
(function($) {
	
	var helper, // the tooltip element
		tTitle, // it's title part
		tUrl, // it's url part
		current, // the current tooltipped element
		oldTitle, // the title of the current element, used for restoring
		current; // current selected element, necessary when binding click
	var tID;
	
	$.fn.Tooltip = function(options)	{
		options = $.extend({
			delay: 250,
			event: "mouseover",
			track: false
		}, options || {});
	
		// there can be only one tooltip helper
		if( !helper ) {
			// create the helper, h3 for title, div for url
			helper = $('<div id="tooltip"><h3></h3><p></p></div>')
				// hide it at first
				.hide()
				// move to top and position absolute, to let it follow the mouse
				.css({ position: 'absolute', zIndex: 3000 })
				// add to document
				.appendTo('body');
				
			// save references to title and url elements
			tTitle = $('h3', helper);
			tUrl = $('p', helper);
		}
		
		// bind events for every selected element with a title attribute
		var $this = $(this)
			// remove elements without a title attribute
			.filter('[@title]')
			// save options into each element
			// TODO: pass options via event system, not yet possible
			.each(function() {
				this.tOptions = options;
			})
			// bind event
			.bind("mouseover", saveTitle)
			.bind(options.event, bind);
		return this;
	};
	
	function bind(event, options) {
		var title,
			href,
			// save this as current
			$this = $(current = this),
			options = this.tOptions;
		// show helper, either with timeout or on instant
		if( options.delay )
			tID = setTimeout(show, options.delay);
		else
			show();
		
		// if element has a href, add and show it, otherwise hide it
		if( href = $this.attr('href') )
			tUrl.html(href.replace('http://', '')).show();
		else 
			tUrl.hide();
			
		// if selected, update the helper position when the mouse moves
		if(options.track)
			$('body').bind('mousemove', update);
			
		// update at least once
		update(event);
		
		// hide the helper when the mouse moves out of the element
		$(this).bind('mouseout', hide);
	}
	
	function saveTitle() {
		if(this == current)
			return;
		current = this;
		var $this = $(this);
		// save title, remove from element and set to helper
		oldTitle = title = $this.attr('title');
		$this.attr('title','');
		tTitle.html(title);
	}
	
	/**
	 * callback for timeout
	 */
	function show() {
		tID = null;
		helper.show();
	}
	
	/**
	 * callback for mousemove
	 * updates the helper position
	 * removes itself when no current element
	 */
	function update(event)	{
		// if no current element is available, remove this listener
		if( current == null ) {
			$('body').unbind('mousemove', update);
			return;	
		}
		
		// get the current mouse position
		function pos(c) {
			var p = c == 'X' ? 'Left' : 'Top';
			return event['page' + c] || (event['client' + c] + (document.documentElement['scroll' + p] || document.body['scroll' + p])) || 0;
		}
		
		// position the helper 15 pixel to bottom right, starting from mouse position
		helper.css({
			top: pos('Y') + 15 + 'px',
			left: pos('X') + 15 + 'px'
		});
	}
	
	/**
	 * callback for mouseout
	 */
	function hide()	{
		// clear timeout if possible
		if(tID)
			clearTimeout(tID);
		// no more current element
		current = null;
		helper.hide();
		// restore title and remove this listener
		$(this)
			.attr('title', oldTitle)
			.unbind('mouseout', hide);
	}

})(jQuery);