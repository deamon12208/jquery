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
	
	$.fn.menuItemDisable = function(options) {	// Constructor for the menu method
		return this.each(function() {
			new $.ui.menu.prototype.menuItemDisable(this, options);	
		});
	}
	
	$.fn.menuItemEnable = function(options) {	// Constructor for the menu method
		return this.each(function() {
			new $.ui.menu.prototype.menuItemEnable(this, options);	
		});
	}
	
	$.ui.menu = function(el, menu, options) {
		
		var self = this;
		
		self.options = {};
		
		$.extend(self.options, {
			context: 'clickContext',	// Context to attach to menu
			show: {opacity:'show'},		// Animation object to show menu
			hide: {opacity:'hide'},		// Animation object to hide menu	
			delay: 500,					// Delay for animation
			contexttitle: "Context Menu",
			_menuItemEnable: function(h, p, c, t, e) {
				self.menuItemEnable.apply(t, [self, e]); // Trigger the menuItemEnable callback				
			},
			_menuItemDisable: function(h, p, c, t, e) {
				self.menuItemDisable.apply(t, [self, e]); // Trigger the menuItemDisable callback
			},
			_menuItemClick: function(h, p, c, t, e) {
				self.menuItemClick.apply(t, [self, e]); // Trigger the menuItemClick callback				
			},
			_menuItemOver: function(h, p, c, t, e) {
				self.menuItemOver.apply(t, [self, e]); // Trigger the menuItemOver callback
			},
			_menuItemOut: function(h, p, c, t, e) {
				self.menuItemOut.apply(t, [self, e]); // Trigger the menuItemOut callback				
			},
			_menuOpen: function(h, p, c, t, e) {
				self.menuOpen.apply(t, [self, e]); // Trigger the menuOpen callback
			},
			_menuClose: function(h, p, c, t, e) {
				self.menuClose.apply(t, [self, e]); // Trigger the menuClose callback				
			},
			_submenuOpen: function(h, p, c, t, e) {
				self.submenuOpen.apply(t, [self, e]); // Trigger the submenuOpen callback
			},
			_submenuClose: function(h, p, c, t, e) {
				self.submenuClose.apply(t, [self, e]); // Trigger the submenuClose callback
			}
		},options);
		
		if (typeof self.options.hovertype == 'undefined') {
			self.options.hovertype = hoverType();	// If not overidden, check to if hoverIntent is available
		}
		
		$(menu).appendTo(el);	// This makes sure our menu is attached in the DOM to the parent to keep things clean
		self.styleMenu(menu);	// Pass the menu in to recieve it's makeover
		self[self.options.context](el, menu);	// Based on contexted selected, attach to menu parent
	}
	
	$.extend($.ui.menu.prototype, {
		styleMenu : function(menu){
			$(menu).addClass('ui-menu-items').children('li').addClass('ui-menu-item');	//Apply first level and child items
			var parents = $('ul',menu).addClass('ui-menu-items').parent('li').addClass('ui-menu-item-parent')	// Apply sublevels
			var node = $('li',menu).addClass('ui-menu-item');	// Finish up any unmatched items
			return false;
		},
		clickContext : function(el,menu) {
			var self = this;
			$(el).bind('click', function(event){	//FIXME: Something inside the function is breaking IE
				var x = $(el).position();
				var y = x.bottom + ( $(el).height() + 1);
				$(menu).css({position:'absolute', top: y, left: x.left}) // Apply the menu directly below
				.animate(self.options.show, self.options.speed);				//TODO: Add vertial menu support
				$(menu)[self.options.hovertype](function(){
					self.showChild(menu);
				}, function(){
					self.hideMenu(menu);
				});
				$('a', $(menu)).bind('click', function(ev){
					$().triggerHandler(this.className, [ev, {item:this}], self.options.buttons[this.className]);
					return false;
				});
				$('a', $(menu)).bind(self.options.hovertype, function(ev){
					$().triggerHandler(this.className, [ev, {item:this}], self.options.hovers[this.className]);
				});
			});
			return false;
		},
		hoverContext : function(el,menu) {
			var self = this;
			$(el)[self.options.hovertype](function(event){
				var x = $(el).position();
				var y = x.top + ( $(el).height() + 1);
				$(menu).css({position:'absolute', top: y, left: x.left})
					.animate(self.options.show, self.options.speed);
				self.showChild(menu);
				$('a', $(menu)).click(function(ev){
					$().triggerHandler(this.className, [ev, {item:this}], self.options.buttons[this.className]);
				});
				$('a', $(menu))[self.options.hovertype](function(ev){
					$().triggerHandler(this.className, [ev, {item:this}], self.options.hovers[this.className]);
				});
				},
			function(){
				self.hideMenu(menu);
			});
			
			return false;
		},
		context : function (el,menu) {	
			var self = this;
			var ctrlPressed=0;

			$(menu).not($('.ui-context-header').parents()).prepend('<span class="ui-context-header">' + self.options.contexttitle + '</span>');
				
			var renderMenu = function(event, self, menu) {
				$(menu).css({position:'absolute', top: event.clientY, left: event.clientX})
						.animate(self.options.show, self.options.speed);
					$(menu)[self.options.hovertype](function(){
						self.showChild(menu);
					}, function(){
						self.hideMenu(menu);
					});
			}
			
			if (!$.browser.opera) {
				$(el).bind('contextmenu', function(e){
					renderMenu(e, self, menu);
					$('a', $(menu)).click(function(ev){
						$().triggerHandler(this.className, [e, {item:this}], self.options.buttons[this.className]);
					});
					$('a', $(menu))[self.options.hovertype](function(ev){
						$().triggerHandler(this.className, [e, {item:this}], self.options.hovers[this.className]);
					});
					return false;
				});
			} else {
				$(el).bind('click', function(e){
					var ctrlPressed =e.ctrlKey;
					if (ctrlPressed && e.button == 0) 
						renderMenu(e, self, menu);
						$('a', $(menu)).click(function(ev){
							$().triggerHandler(this.className, [ev, {item:e.target}], self.options.buttons[this.className]);
						});
						$('a', $(menu))[self.options.hovertype](function(ev){
							$().triggerHandler(this.className, [ev, {item:e.target}], self.options.hovers[this.className]);
						});
						return false;
				});						
			}
			return false;			
		},
		showChild : function(menu) {
			var self = this;
			$('li', menu)[self.options.hovertype](
				function(ev){
					x = $(this).position();
					$(this).find('>ul').css({position:'absolute', top:x.top, left:$(menu).width()})
							.animate(self.options.show,self.options.speed);
					$(this).triggerHandler("submenuOpen", [ev, {item:this}], self.options.submenuOpen);
				},
				function(){
					$(this).find('>ul').animate(self.options.hide,self.options.speed);
			});
		},
		hideMenu : function(menu){
			var self = this;
			$(menu).animate(self.options.hide,self.options.speed);
			$(menu).triggerHandler("menuClose", [null, {item:menu}], self.options.menuClose);
			return false;
		},
		menuItemDisable : function (el, options) {
			return $(el).each(function(){
				var t = $('a', this).text();
				$('a', el).hide();
				$(el).append('<span class="ui-menu-item-disabled">' + t + '</span>');
				$(el).triggerHandler("menuItemDisabled", [null, {item:el}], options.menuItemDisabled);
			});
		},
		menuItemEnable : function (el, options) {
			return $(el).each(function(){
				$('span', el).remove();
				$('a', el).show();
				$(el).triggerHandler("menuItemEnabled", [null, {item:el}], options.menuItemEnabled);
			});
		}
	});
	
	
	$.extend($.fn, {
	/*	menuItemDisable : function () {
			return this.each(function(){
				var t = $('a', this).text();
				$('a', this).hide();
				$(this).append('<span class="ui-menu-item-disabled">' + t + '</span>');
				$(this).triggerHandler("menuItemDisabled", [null, {item:this}], self.options.menuItemDisable);
			});
		},
		menuItemEnable : function () {
			return this.each(function(){
				$('span', this).remove();
				$('a', this).show();
			});
		},*/
		menuItemAdd : function (item) {
			
			var item = $.extend({
				position: 'insertAfter'
			}, item);
			
			var append = $('<li id="' + item.id + '" class="ui-menu-item"><a href="' + item.href + '" class="' + item.linkclass + '">' + item.linktext + '</a>');
			$(append)[item.position](this); // FIXME: This appends after in IE, but can append after the wrong element

			if(item&&item.buttons){	// Check to see if the menu has a buttons object
      			append.find('a').bind('click', function(){
	  				if (item.buttons[this.className]) {
        				item.buttons[this.className]();	//If the classname of the link has a matching function, execute
					}
				});
			}
        	if(item&&item.hovers){	// Check to see if the menu has a buttons object
	      		append.find('a')[htype](function(){
		  			if (item.hovers[this.className]){
        					item.hovers[this.className]();	//If the classname of the link has a matching function, execute
        			}
      			}, function(){});	// Do nothing at the moment
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
