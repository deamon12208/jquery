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
		var o = $.extend({
			delay: 500,
			timeout: 2000,
			context: 'clickContext',
			show: {opacity:'show'},
			hide: {opacity:'hide'},
			speed: 'normal'
		}, o);
		
		$(m).appendTo(el);
		this.styleMenu(m);	// Pass the menu in to recieve it's makeover
		this[o.context](el, m, o);	// Based on contexted selected, attach to menu parent
		
    	if(t&&t.buttons)
      		$('a',$(m)).click(function(){
	  		if (t.buttons[this.className])
        		t.buttons[this.className]();
      	});
	}
	
	$.extend($.ui.menu.prototype, {
		styleMenu : function(m){
			$(m).addClass('ui-menu-parent').children('li').addClass('ui-menu-node');
			var parents = $('ul',m).addClass('ui-menu-parent')
				.css('MozUserSelect', 'none');
			var node = $('li',m).addClass('ui-menu-node')
				.css('MozUserSelect', 'none');
			var hassub = $('ul',m).parent('li').addClass('ui-menu-sub');
			return false;
		},
		clickContext : function(a,m,o) {
			var self = this;
			$(a).click(function(){
				x = $(a).position();
				y = x.bottom + ( $(a).height() + 1);
				$(m).css({position:'absolute', top: y, left: x.left})
				.animate(o.show, o.speed);
				self.showChild(m,o);
			});
			return false;
		},
		hoverContext : function(a,m,o) {
			var self = this;
			
			if (typeof $.fn.hoverIntent != 'undefined') {
				var htype = 'hoverIntent';
			} else {
				var htype = 'hover';
			}
			
			$(a)[htype](function(){
				x = $(a).position();
				y = x.top + ( $(a).height() + 1);
				$(m).css({position:'absolute', top: y, left: x.left})
					.animate(o.show, o.speed);
				self.showChild(m,o);
				},
			function(){
				
			});
			return false;
		},
		context : function (a,m,o) {	
			var self = this;
			$(m).prepend('<span>' + o.title + '</span>');
			$(a).bind('mouseup', function(e){
				if (e.button == 2 || e.button == 3) {
					e.preventDefault();	//FIXME: Not stopping right-click menu in FF
					e.stopPropagation();
					
					$(m).css({position:'absolute', top: e.clientY, left: e.clientX})
						.animate(o.show, o.speed);
					self.showChild(m,o);
					return false;
				} else {
					
				}
			});
			return false;			
		},
		showChild : function(m, o) {
			$('li', m).hover(
				function(){
					x = $(this).position();
					$(this).find('>ul').css({position:'absolute', top:x.top, left:$(m).width()})
							.animate(o.show,o.speed);
				},
				function(){
					$(this).find('>ul').animate(o.hide,o.speed);
			});
		},
		hideMenu : function(m, o){
			$(m).animate(o.hide,o.speed);
			return false;
		}
		
	});
})($);
