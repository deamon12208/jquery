/*
 * Tooltip 2.0 Alpha - jQuery plugin  for styled tooltips
 *
 * Copyright (c) 2006 Jörn Zaefferer, Stefan Petre
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

/*
TODO
- more testing need for Modaltip and Foottip, maybe rename both
- provide a nice approach to show URLs only for external links
- change p.body and p.url to div.body and div.url
- finally: release 2.0, being as backwards compatible as possible
- build example similar to http://codylindley.com/blogstuff/js/tooltip/tooltip.htm
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
 * #tooltip p.body - The tooltip body, shown when using showBody
 *
 * #tooltip p.url - The tooltip url, shown when using showURL
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
 * @example // modify global settings
 * $.extend($.fn.Tooltip.defaults, {
 * 	track: true,
 * 	delay: 0,
 * 	showURL: false,
 * 	showBody: " - ",
 *  fixPNG: true
 * });
 * // setup fancy tooltips
 * $('a.pretty').Tooltip({
 * 	 extraClass: "fancy"
 * });
 $('img.pretty').Tooltip({
 * 	 extraClass: "fancy-img",
 * });
 * @desc This example starts with modifying the global settings, applying them to all following Tooltips; Afterwards, Tooltips for anchors with class pretty are created with an extra class for the Tooltip: "fancy" for anchors, "fancy-img" for images
 *
 * @param Object settings (optional) Customize your Tooltips
 * @option Number delay The number of milliseconds before a tooltip is display, default is 250
 * @option String event The event on which the tooltip is displayed, default is "mouseover", "click" works fine, too
 * @option Boolean track If true, let the tooltip track the mousemovement, default is false
 * @option Boolean showURL If true, shows the href or src attribute within p.url, default is true
 * @option String showBody If specified, uses the String to split the title, displaying the first part in the h3 tag, all following in the p.body tag, separated with <br/>s, default is null
 * @option String extraClass If specified, adds the class to the tooltip helper, default is null
 * @option Boolean fixPNG If true, fixes transparent PNGs in IE, default is false
 * @option Function bodyHandler TODO document me
 *
 * @name Tooltip
 * @type jQuery
 * @cat Plugins/Tooltip
 * @author Jörn Zaefferer (http://bassistance.de)
 */
(function($) {
	
	// the tooltip element
	var helper = {},
		// the current tooltipped element
		current,
		// the title of the current element, used for restoring
		title,
		// timeout id for delayed tooltips
		tID,
		// IE 5.5 or 6
		IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
		// block all tooltips when one is transformed to a popup
		blocked = false,
		track = false;
		
	$.fn.extend({
		Tooltip: function(settings) {
			settings = $.extend({}, $.Tooltip.defaults, settings);
			createHelper();
			return this.each(function() {
					this.tSettings = settings;
				})
				.bind("mouseover", save)
				.bind(settings.event, handle);
		},
		Foottip: function(settings) {
			this.each(function() {
				$($(this).attr('href')).hide();
			});
			settings = $.extend({
				bodyHandler: function() {
					return $($(this).attr('href')).html();
				},
				showURL: false
			}, settings);
			return this.Tooltip(settings).click(function() {
				return false;
			});
		},
		Modaltip: function(settings) {
			settings = $.extend({
				drag: "h3"
			}, settings);
			return this.click(function() {
				var self = this;
				blocked = true;
				helper.parent
				.addClass("modal")
				.append("<span class='resize' />")
				.append("<span class='close' />")
				.jqDrag(settings.drag)
				.jqResize("span.resize")
				.click(function(event) {
					event.stopPropagation();
				}).find("span.close").add(document.body).one('click', function(event) {
					blocked = false;
					helper.parent
					.unbind('click')
					.css({
						height: "",
						width: ""
					})
					.removeClass("modal")
					.find("span.resize, span.close").remove();
					hide.call(self, event);
				});
				return false;
			});
		},
		fixPNG: IE ? function() {
			return this.each(function () {
				var image = $(this).css('backgroundImage');
				if (image.match(/^url\(["'](.*\.png)["']\)$/i)) {
					image = RegExp.$1;
					$(this).css({
						'backgroundImage': 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
					}).each(function () {
						var position = $(this).css('position');
						if (position != 'absolute' && position != 'relative')
							$(this).css('position', 'relative');
					});
				}
			});
		} : function() { return this; },
		unfixPNG: IE ? function() {
			return this.each(function () {
				$(this).css({'filter': '', backgroundImage: ''});
			});
		} : function() { return this; },
		getAndSetAttr: function(name, value) {
			var result = this.attr(name);
			this.attr(name, value);
			return result;
		},
		hideWhenEmpty: function() {
			return this.each(function() {
				$(this)[ $(this).html() ? "show" : "hide" ]();
			});
		},
		url: function() {
			return this.attr('href') || this.attr('src');
		}
	});
	
	function createHelper() {
		// there can be only one tooltip helper
		if( helper.parent )
			return;
		// create the helper, h3 for title, div for url
		helper.parent = $('<div id="tooltip"><h3></h3><p class="body"></p><p class="url"></p></div>')
			// hide it at first
			.hide()
			// add to document
			.appendTo('body');
		
		// save references to title and url elements
		helper.title = $('h3', helper.parent);
		helper.body = $('p.body', helper.parent);
		helper.url = $('p.url', helper.parent);
	}
	
	// main event handler to start showing tooltips
	function handle(event) {
		if(blocked)
			return;
		// show helper, either with timeout or on instant
		if( this.tSettings.delay )
			tID = setTimeout(show, this.tSettings.delay);
		else
			show();
		
		// if selected, update the helper position when the mouse moves
		track = !!this.tSettings.track;
		$('body').bind('mousemove', update);
			
		// update at least once
		update(event);
		
		// hide the helper when the mouse was clicked on the element
		if (this.tSettings.event != "click")
			//$(this).bind('click', hide);
		
		// hide the helper when the mouse moves out of the element
		$(this).bind('mouseout', hide);
	}
	
	// save elements title before the tooltip is displayed
	function save() {
		// if this is the current source, or it has no title (occurs with click event), stop
		if ( blocked || this == current || !this.title )
			return;

		// save current
		current = this;
		title = $(this).getAndSetAttr('title', '');
		
		if ( this.tSettings.bodyHandler ) {
			helper.title.hide();
			helper.body.html( this.tSettings.bodyHandler.call(this) ).show();
		} else if ( this.tSettings.showBody ) {
			var parts = title.split(this.tSettings.showBody);
			helper.title.html(parts.shift()).show();
			helper.body.empty();
			for(var i = 0, part; part = parts[i]; i++) {
				if(i > 0)
					helper.body.append("<br/>");
				helper.body.append(part);
			}
			helper.body.hideWhenEmpty();
		} else {
			helper.title.html(title).show();
			helper.body.hide();
		}
		
		// if element has href or src, add and show it, otherwise hide it
		if( this.tSettings.showURL && $(this).url() )
			helper.url.html( $(this).url().replace('http://', '') ).show();
		else 
			helper.url.hide();
		
		// add an optional class for this tip
		helper.parent.addClass(this.tSettings.extraClass);
		
		// fix PNG background for IE
		if (this.tSettings.fixPNG )
			helper.parent.fixPNG();
	}
	
	// delete timeout and show helper
	function show() {
		tID = null;
		helper.parent.show();
		update();
	}
	
	/**
	 * callback for mousemove
	 * updates the helper position
	 * removes itself when no current element
	 */
	function update(event)	{
		if(blocked)
			return;
		
		// stop updating when tracking is disabled and the tooltip is visible
		if ( !track && helper.parent.is(":visible")) {
			$('body').unbind('mousemove', update)
		}
		
		// if no current element is available, remove this listener
		if( current == null ) {
			$('body').unbind('mousemove', update);
			return;	
		}

		var left = helper.parent[0].offsetLeft;
		var top = helper.parent[0].offsetTop;
		if(event) {
			// position the helper 15 pixel to bottom right, starting from mouse position
			left = event.pageX + 15;
			top = event.pageY + 15;
			helper.parent.css({
				left: left + 'px',
				top: top + 'px'
			});
		}
		
		var v = viewport(),
			h = helper.parent[0];
		// check horizontal position
		if(v.x + v.cx < h.offsetLeft + h.offsetWidth) {
			left -= h.offsetWidth + 20;
			helper.parent.css({left: left + 'px'});
		}
		// check vertical position
		if(v.y + v.cy < h.offsetTop + h.offsetHeight) {
			top -= h.offsetHeight + 20;
			helper.parent.css({top: top + 'px'});
		}
	}
	
	function viewport() {
		var e = document.documentElement || {},
			b = document.body || {},
			w = window;
		function min() {
			var v = Infinity;
			for( var i = 0;  i < arguments.length;  i++ ) {
				var n = arguments[i];
				if( n && n < v ) v = n;
			}
			return v;
		}
		return {
			x: w.pageXOffset || e.scrollLeft || b.scrollLeft || 0,
			y: w.pageYOffset || e.scrollTop || b.scrollTop || 0,
			cx: min( e.clientWidth, b.clientWidth, w.innerWidth ),
			cy: min( e.clientHeight, b.clientHeight, w.innerHeight )
		};
	}
	
	// hide helper and restore added classes and the title
	function hide(event) {
		if(blocked)
			return;
		// clear timeout if possible
		if(tID)
			clearTimeout(tID);
		// no more current element
		current = null;
		
		helper.parent.hide().removeClass( this.tSettings.extraClass );
		
		// restore title and remove this listener
		//if (event.type != "click") {
			$(this)
				.unbind('mouseout', hide)
				.attr('title', title);
		//}
		if (this.tSettings.event != "click")
			$(this).unbind('click', hide);
			
		if( this.tSettings.fixPNG )
			helper.parent.unfixPNG();
	}
	
	$.Tooltip = {};
	
	// define global defaults, editable by client
	$.Tooltip.defaults = {
		delay: 250,
		event: "mouseover",
		showURL: true,
		extraClass: ""
	};

})(jQuery);

/*
 * jqDnR - Minimalistic Drag'n'Resize for jQuery.
 *
 * Copyright (c) 2007 Brice Burgess <bhb@iceburg.net>, http://www.iceburg.net
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * $Version: 2007.02.09 +r1
 */
(function($){
$.fn.jqDrag=function(r){$.jqDnR.init(this,r,'d'); return this;};
$.fn.jqResize=function(r){$.jqDnR.init(this,r,'r'); return this;};
$.jqDnR={
init:function(w,r,t){ r=(r)?$(r,w):w;
	r.bind('mousedown',{w:w,t:t},function(e){ var h=e.data; var w=h.w;
	hash=$.extend({oX:f(w,'left'),oY:f(w,'top'),oW:f(w,'width'),oH:f(w,'height'),pX:e.pageX,pY:e.pageY,o:w.css('opacity')},h);
	h.w.css('opacity',0.8); $().mousemove($.jqDnR.drag).mouseup($.jqDnR.stop);
	return false;});
},
drag:function(e) {var h=hash; var w=h.w[0];
	if(h.t == 'd') h.w.css({left:h.oX + e.pageX - h.pX,top:h.oY + e.pageY - h.pY});
	else h.w.css({width:Math.max(e.pageX - h.pX + h.oW,0),height:Math.max(e.pageY - h.pY + h.oH,0)});
	return false;},
stop:function(){var j=$.jqDnR; hash.w.css('opacity',hash.o); $().unbind('mousemove',j.drag).unbind('mouseup',j.stop);},
h:false};
var hash=$.jqDnR.h;
var f=function(w,t){return parseInt(w.css(t)) || 0};
})(jQuery);