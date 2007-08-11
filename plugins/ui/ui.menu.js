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
			speed: 'slow',
			title: 'Context Menu'
		}, o);
		//var buttons = $.extend({}, t);
		console.log(t);
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		
		this.styleMenu(m);	// Pass the menu in to recieve it's makeover
		this[options.context](el, m, options);	// Based on contexted selected, attach to menu parent
		
		$('a').click(function(){  // FIXME: Testing to see if button custom functions can be executed
			console.log(this);
			t[this.className];
		})
		
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
				y = x.top + ( $(a).height() + 1);
				$(m).css({position:'absolute', top: y, left: x.left});
				$(m)[o.show](o.speed, function(){
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
				y = x.top + ( $(a).height() + 1);
				$(m).css({position:'absolute', top: y, left: x.left});
				$(m)[o.show](o.speed, function(){
					self.showChild(m, o);
					$(window).bind('click', function(){
						self.hideMenu(m, o);
						$(window).unbind('click');
					})
				});
			});
			return false;
		},
		context : function (a,m,o) {	
			var self = this;
			$(a).bind('mouseup', function(e){
				if (e.button == 2 || e.button == 3) {
					e.preventDefault();	//FIXME: Not stopping right-click menu in FF
					e.stopPropagation();
					x = $(a).position();
					elBottom = x.top + $(a).height();
					$(m).css({position:'absolute', top: e.clientY, left: e.clientX});
					$(m).prepend('<span>' + o.title + '</span>');
					$(m)[o.show](o.speed, function(){
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