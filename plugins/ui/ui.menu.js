/* jQuery UI Menu
 * 
 * m = menu being passed in
 * o = options
 * t = trigger functions
 */

(function($){

	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};
	
	$.fn.menu = function(m,o,t,h) {	// Constructor for the menu method
		return this.each(function() {
			new $.ui.menu(this, m, o, t, h);	
		});
	}	
	
	$.ui.menu = function(el, m, o, t, h) {
		var o = $.extend({
			context: 'clickContext',
			show: {opacity:'show'},
			hide: {opacity:'hide'},			
			delay: 500
		}, o);
		
		var htype = hoverType();
		
		$(m).appendTo(el);	// This makes sure our menu is attached in the DOM to the parent to keep things clean
		this.styleMenu(m);	// Pass the menu in to recieve it's makeover
		this[o.context](el, m, o);	// Based on contexted selected, attach to menu parent
		
    	if(t&&t.buttons)	// Check to see if the menu has a buttons object
      		$('a',$(m)).click(function(){
	  		if (t.buttons[this.className])
        		t.buttons[this.className]();	//If the classname of the link has a matching function, execute
      	});
		if(h&&h.hovers)	// Check to see if the menu has a buttons object
      		$('a',$(m))[htype](function(){
	  		if (h.hovers[this.className])
        		h.hovers[this.className]();	//If the classname of the link has a matching function, execute
      	},
		function(){});
	}
	
	$.extend($.ui.menu.prototype, {
		styleMenu : function(m){
			$(m).addClass('ui-menu-items').children('li').addClass('ui-menu-item');
			var parents = $('ul',m).addClass('ui-menu-items').parent('li').addClass('ui-menu-item-parent')
			var node = $('li',m).addClass('ui-menu-item');
			return false;
		},
		clickContext : function(a,m,o) {
			var self = this;
			var htype = hoverType();
			$(a).click(function(){
				x = $(a).position();
				y = x.bottom + ( $(a).height() + 1);
				$(m).css({position:'absolute', top: y, left: x.left})
				.animate(o.show, o.speed);
				$(m)[htype](function(){
					self.showChild(m,o,htype);	
				}, function(){
					self.hideMenu(m,o);
				});
			});
			return false;
		},
		hoverContext : function(a,m,o) {
			var self = this;
			var htype = hoverType();
			console.log(htype);
			$(a)[htype](function(){
				x = $(a).position();
				y = x.top + ( $(a).height() + 1);
				$(m).css({position:'absolute', top: y, left: x.left})
					.animate(o.show, o.speed);
				self.showChild(m,o,htype);
				},
			function(){
				self.hideMenu(m,o);
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
		showChild : function(m, o, h) {
			$('li', m)[h](
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
	
	
	$.extend($.fn, {
		menuItemDisable : function (o) {
			var o = $.extend({
				disableCss: {color: "#aaa", background: "transparent"}
			},o);
			
			return this.each(function(){
				var t = $('a', this).text();
				$('a', this).hide();
				$(this).append('<span>' + t + '</span>');
				$('span', this).css(o.disableCss);
			});
		},
		menuItemEnable : function () {
			return this.each(function(){
				$('span', this).remove();
				$('a', this).show();
			});
		},
		menuAddItemAfter : function (n, b, h) {
			console.log(this);
			var item = '<li id="' + n.id + '"><a href="' + n.href + '" class="' + n.linkclass + '">' + n.linktext + '</a>';
			console.log(item);
			$(item).insertAfter(this);
			// TODO: Bind button or hover event to new item
		},
		menuAddItemBefore : function (n, b, h) {
			console.log(this);
			var item = '<li id="' + n.id + '"><a href="' + n.href + '" class="' + n.linkclass + '">' + n.linktext + '</a>';
			console.log(item);
			$(item).insertBefore(this);
			// TODO: Bind button or hover event to new item
		}
	});
	
	function hoverType() {	// Helper function, finds out if hoverIntent exists
		if (typeof $.fn.hoverIntent != 'undefined') {
			var htype = 'hoverIntent';
		} else {
			var htype = 'hover';
		}
		return htype;
	}
})($);
