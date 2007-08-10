/* jQuery UI Menu
 * 
 * m = menu being passed in
 * o = options
 * t = trigger functions
 */

(function($){
	
	$.fn.menu = function(m,o,t) {	// Constructor for the menu method
		return this.each(function() {
			new $.ui.menu(this, m, o, t);	
		});
	}	
	
	$.ui.menu = function(el, m, o, t) {
		var options = $.extend({
			timeout: 2000,
			context: 'clickContext',
			show: 'slideDown',
			hide: 'slideUp',
			speed: 'slow'
		}, o);
		var buttons = $.extend({}, t);
		console.log(buttons);
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		
		this.styleMenu(m);	// Pass the menu in to recieve it's makeover
		this[options.context](el, m, options);	// Based on contexted selected, attach to menu parent
		
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
				$(m)[o.show](o.speed, function(){
					console.log('Menu Shown');
					self.showChild(m, o);
					$(window).bind('click', function(){
						self.hideMenu(m, o);
						$(window).unbind('click');
					})
				});
			});
			return false;
		},
		hoverContext : function(a,m,o) {
			var self = this;
			$(a).bind('mouseover', function(){
				x = $(a).position();
				elBottom = x.top + $(a).height();
				elLeft = x.left;
				$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
				$(m)[o.show](o.speed, function(){
					console.log('Menu Shown');
					self.showChild(m, o);
					$(window).bind('click', function(){
						self.hideMenu(m, o);
						$(window).unbind('click');
					})
				});
			});
			return false;
		},
		context : function (a,m,o) {	// FIXME: Context click not working
			var self = this;
			$(a).bind('click', function(e){
				if (e.button == 0 || e.button == 2 || e.button == 3) {
					x = $(a).position();
					elBottom = x.top + $(a).height();
					elLeft = x.left;
					$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
					$(m)[o.show](o.speed, function(){
						console.log('Menu Shown');
						self.showChild(m, o);
						$(window).bind('click', function(){
							self.hideMenu(m, o);
							$(window).unbind('click');
						})
					});
				} else {
					
				}
			});
			return false;			
		},
		showChild : function(m, o) {
			self = this;
			console.log(o);
			$('li', m).bind('mouseover', function(){
				x = $(this).position();
				$(this).children('ul').css({position:'absolute', top:x.top, left: x.right + 1})[o.show](o.speed, function(){
					self.hideMenu(this,o);
				});
			});
		},
		hideMenu : function(m, o){
			$(m)[o.hide](o.speed);
			return false;
		}
		
	});
})($);