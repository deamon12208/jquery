/* jQuery UI Menu
 * 
 * m = menu being passed in
 * o = options
 * t = trigger functions
 */

(function($){

	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};
	
	$.fn.menu = function(menu,options,buttons,hovers) {	// Constructor for the menu method
		return this.each(function() {
			new $.ui.menu(this, menu, options, buttons, hovers);	
		});
	}	
	
	$.ui.menu = function(el, menu, options, buttons, hovers) {
		var options = $.extend({
			context: 'clickContext',	// Context to attach to menu
			show: {opacity:'show'},		// Animation object to show menu
			hide: {opacity:'hide'},		// Animation object to hide menu	
			delay: 500,					// Delay for animation
			contexttitle: "Menu"
		}, options);
		
		var htype = hoverType();	// Check if hoverIntent is available
		
		$(menu).appendTo(el);	// This makes sure our menu is attached in the DOM to the parent to keep things clean
		this.styleMenu(menu);	// Pass the menu in to recieve it's makeover
		this[options.context](el, menu, options);	// Based on contexted selected, attach to menu parent
		
    	if(buttons&&buttons.buttons)	// Check to see if the menu has a buttons object
      		$('a',$(menu)).click(function(){
	  		if (buttons.buttons[this.className])
        		buttons.buttons[this.className]();	//If the classname of the link has a matching function, execute
      	});
		if(hovers&&hovers.hovers)	// Check to see if the menu has a buttons object
      		$('a',$(menu))[htype](function(){
	  		if (hovers.hovers[this.className])
        		hovers.hovers[this.className]();	//If the classname of the link has a matching function, execute
      	},
		function(){});	// Do nothing at the moment
	}
	
	$.extend($.ui.menu.prototype, {
		styleMenu : function(menu){
			$(menu).addClass('ui-menu-items').children('li').addClass('ui-menu-item');	//Apply first level and child items
			var parents = $('ul',menu).addClass('ui-menu-items').parent('li').addClass('ui-menu-item-parent')	// Apply sublevels
			var node = $('li',menu).addClass('ui-menu-item');	// Finish up any unmatched items
			return false;
		},
		clickContext : function(el,menu,options) {
			var self = this;
			var htype = hoverType();
			$(el).click(function(){
				x = $(el).position();
				y = x.bottom + ( $(el).height() + 1);
				$(menu).css({position:'absolute', top: y, left: x.left}) // Apply the menu directly below
				.animate(options.show, options.speed);				//TODO: Add vertial menu support
				$(menu)[htype](function(){
					self.showChild(menu,options,htype);	
				}, function(){
					self.hideMenu(menu,options);
				});
			});
			return false;
		},
		hoverContext : function(el,menu,options) {
			var self = this;
			var htype = hoverType();
			$(el)[htype](function(){
				x = $(el).position();
				y = x.top + ( $(el).height() + 1);
				$(menu).css({position:'absolute', top: y, left: x.left})
					.animate(options.show, options.speed);
				self.showChild(menu,options,htype);
				},
			function(){
				self.hideMenu(menu,options);
			});
			return false;
		},
		context : function (el,menu,options) {	
			var self = this;
			var htype = hoverType();
			var ctrlPressed=0;
			$(menu).prepend('<span>' + options.contexttitle + '</span>');
			
			if (!$.browser.opera) {
				$(el).bind('contextmenu', function(e){
					$(menu).css({position:'absolute', top: e.clientY, left: e.clientX})
						.animate(options.show, options.speed);
					$(menu)[htype](function(){
						self.showChild(menu,options,htype);
					}, function(){
						self.hideMenu(menu,options);
					});
					return false;
				});
			} else {
				$(el).bind('click', function(e){
					ctrlPressed =e.ctrlKey;
					if (ctrlPressed && e.button == 0) {
						$(menu).css({position:'absolute', top: e.clientY, left: e.clientX})
							.animate(options.show, options.speed);
						$(menu)[htype](function(){
							self.showChild(menu,options,htype);
						}, function(){
							self.hideMenu(menu,options);
						});
						return false;
					}
				});
			}
			return false;			
		},
		showChild : function(menu, options, htype) {
			$('li', menu)[htype](
				function(){
					x = $(this).position();
					$(this).find('>ul').css({position:'absolute', top:x.top, left:$(menu).width()})
							.animate(options.show,options.speed);
				},
				function(){
					$(this).find('>ul').animate(options.hide,options.speed);
			});
		},
		hideMenu : function(menu, options){
			$(menu).animate(options.hide,options.speed);
			return false;
		}		
	});
	
	
	$.extend($.fn, {
		menuItemDisable : function (options) {
			var options = $.extend({
				disableCss: {color: "#aaa", background: "transparent"}
			},options);
			
			return this.each(function(){
				var t = $('a', this).text();
				$('a', this).hide();
				$(this).append('<span>' + t + '</span>');
				$('span', this).css(options.disableCss);
			});
		},
		menuItemEnable : function () {
			return this.each(function(){
				$('span', this).remove();
				$('a', this).show();
			});
		},
		menuAddItemAfter : function (item, buttons, hovers) {
			var append = $('<li id="' + item.id + '"><a href="' + item.href + '" class="' + item.linkclass + '">' + item.linktext + '</a>');
			$(append).insertAfter(this);

			if(buttons&&buttons.buttons)	// Check to see if the menu has a buttons object
      			append.find('a').bind('click', function(){
	  			if (buttons.buttons[this.className])
        			buttons.buttons[this.className]();	//If the classname of the link has a matching function, execute

        	if(hovers&&hovers.hovers)	// Check to see if the menu has a buttons object
	      		append.find('a')[htype](function(){
		  		if (hovers.hovers[this.className])
        			hovers.hovers[this.className]();	//If the classname of the link has a matching function, execute
      			},
				function(){});	// Do nothing at the moment
      			});
			// TODO: Bind button or hover event to new item
		},
		menuAddItemBefore : function (item, buttons, hovers) {
			var append = $('<li id="' + item.id + '"><a href="' + item.href + '" class="' + item.linkclass + '">' + item.linktext + '</a>');
			$(append).insertBefore(this);

			if(buttons&&buttons.buttons)	// Check to see if the menu has a buttons object
      			append.find('a').bind('click', function(){
	  			if (buttons.buttons[this.className])
        			buttons.buttons[this.className]();	//If the classname of the link has a matching function, execute

        	if(hovers&&hovers.hovers)	// Check to see if the menu has a buttons object
	      		append.find('a')[htype](function(){
		  		if (hovers.hovers[this.className])
        			hovers.hovers[this.className]();	//If the classname of the link has a matching function, execute
      			},
				function(){});	// Do nothing at the moment
      			});
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
