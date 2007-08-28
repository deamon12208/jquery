/* jQuery UI Menu
 */

(function($){

	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};
	
	$.fn.menu = function(menu,options) {	// Constructor for the menu method
		return this.each(function() {
			new $.ui.menu(this, menu, options);	
		});
	}	
	
	$.ui.menu = function(el, menu, options) {
		var options = $.extend({
			context: 'clickContext',	// Context to attach to menu
			show: {opacity:'show'},		// Animation object to show menu
			hide: {opacity:'hide'},		// Animation object to hide menu	
			delay: 500,					// Delay for animation
			contexttitle: "Menu"
		}, options);
		
		if (typeof options.hovertype == 'undefined') {
			options.hovertype = hoverType();	// Check if hoverIntent is available
		}
		
		$(menu).appendTo(el);	// This makes sure our menu is attached in the DOM to the parent to keep things clean
		this.styleMenu(menu);	// Pass the menu in to recieve it's makeover
		this[options.context](el, menu, options);	// Based on contexted selected, attach to menu parent
		
    	if(options&&options.buttons)	// Check to see if the menu has a buttons object
      		$('a',$(menu)).click(function(){
	  		if (options.buttons[this.className])
        		options.buttons[this.className]();	//If the classname of the link has a matching function, execute
      	});
		if(options&&options.hovers)	// Check to see if the menu has a buttons object
      		$('a',$(menu))[options.hovertype](function(){
	  		if (options.hovers[this.className])
        		options.hovers[this.className]();	//If the classname of the link has a matching function, execute
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
			$(el).bind('click', function(){	//FIXME: Something inside the function is breaking IE, and possibly Opera
				var x = $(el).position();
				var y = x.bottom + ( $(el).height() + 1);
				$(menu).css({position:'absolute', top: y, left: x.left}) // Apply the menu directly below
				.animate(options.show, options.speed);				//TODO: Add vertial menu support
				$(menu)[options.hovertype](function(){
					self.showChild(menu,options);	
				}, function(){
					self.hideMenu(menu,options);
				});
			});
			return false;
		},
		hoverContext : function(el,menu,options) {
			var self = this;
			$(el)[options.hovertype](function(){
				var x = $(el).position();
				var y = x.top + ( $(el).height() + 1);
				$(menu).css({position:'absolute', top: y, left: x.left})
					.animate(options.show, options.speed);
				self.showChild(menu,options);
				},
			function(){
				self.hideMenu(menu,options);
			});
			return false;
		},
		context : function (el,menu,options) {	
			var self = this;
			var ctrlPressed=0;
			$(menu).prepend('<span>' + options.contexttitle + '</span>');
				
			var renderMenu = function(event, self, menu, options) {
				$(menu).css({position:'absolute', top: event.clientY, left: event.clientX})
						.animate(options.show, options.speed);
					$(menu)[options.hovertype](function(){
						self.showChild(menu,options);
					}, function(){
						self.hideMenu(menu,options);
					});
			}
			
			if (!$.browser.opera) {
				$(el).bind('contextmenu', function(e){
					renderMenu(e, self, menu, options);
					return false;
				});
			} else {
				$(el).bind('click', function(e){
					var ctrlPressed =e.ctrlKey;
					if (ctrlPressed && e.button == 0) 
						renderMenu(e, self, menu, options);
						return false;
				});						
			}
			return false;			
		},
		showChild : function(menu, options) {
			$('li', menu)[options.hovertype](
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
		menuAddItem : function (item) {
			
			var item = $.extend({
				position: 'insertAfter'
			}, item);
			
			var append = $('<li id="' + item.id + '" class="ui-menu-item"><a href="' + item.href + '" class="' + item.linkclass + '">' + item.linktext + '</a>');
			$(append)[item.position](this);

			if(item&&item.buttons){	// Check to see if the menu has a buttons object
      			append.find('a').bind('click', function(){
	  				if (item.buttons[this.className]) {
        				item.buttons[this.className]();	//If the classname of the link has a matching function, execute
					}
        			if(item&&item.hovers){	// Check to see if the menu has a buttons object
	      				append.find('a')[htype](function(){
		  					if (item.hovers[this.className]){
        						item.hovers[this.className]();	//If the classname of the link has a matching function, execute
        					}
      						}, function(){});	// Do nothing at the moment
      				}
      			});
			}
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
