/* jQuery UI Menu
 * 
 * m = menu being passed in
 * o = options
 * t = trigger functions
 */

(function($){
	
	var menuItems = [];	// This is the array we will store the menu items in
	
	$.fn.menu = function(m,o,t) {	// Constructor for the clickContext method
		return this.each(function() {
			new $.ui.menu(this, m, o, t);	
		});
	}	
	
	$.ui.menu = function(el, m, o, t) {
		var attach = el;
		var menu = m;
		var shown = false;
		
		var options = $.extend({
			timeout: 2000,
			context: 'clickContext',
			anim: 'slideDown',
			speed: 'slow'
		}, o);
		var buttons = $.extend({}, t);

		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		
		this.styleMenu(menu);
		this[options.context](attach, menu, options);
		
	}
	
	$.extend($.ui.menu.prototype, {
		styleMenu : function(m){
			
			$(m).addClass('ui-menu-nodes').children('li').addClass('ui-menu-node');
			var nodes = $('ul',m).addClass('ui-menu-nodes')
				.css('MozUserSelect', 'none').attr('unselectable', 'on');
			var node = $('li',m).addClass('ui-menu-node')
				.css('MozUserSelect', 'none').attr('unselectable', 'on');
			return false;
		},
		clickContext : function(a,m,o) {
			var self = this;
			$(a).bind('click', function(){
				x = $(a).position();
				elBottom = x.top + $(a).height();
				elLeft = x.left;
				$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
				$(m)[o.anim](o.speed, function(){
					console.log('Menu Shown');
					$(window).bind('click', function(){
						self.hideMenu(m, o);
						$(window).unbind('click');
					})
				});
			});
		},
		hoverContext : function(a,m,o) {
			var self = this;
			$(a).bind('mouseover', function(){
				x = $(a).position();
				elBottom = x.top + $(a).height();
				elLeft = x.left;
				$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
				$(m)[o.anim](o.speed, function(){
					console.log('Menu Shown');
					$(window).bind('click', function(){
						self.hideMenu(m, o);
						$(window).unbind('click');
					})
				});
			});
		},
		hideMenu : function(m, o){
			
			switch (o.anim) {
				case "show" :
					var alt = "hide";
					break;
				case "slideDown":
					var alt = "slideUp";
					break;
				case "fadeIn" :
					var alt = "fadeOut";
					break;
			}
			$(m)[alt](o.speed);
			return false;
		}
		
	});
})($);