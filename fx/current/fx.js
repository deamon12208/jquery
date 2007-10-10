(function($) {

	$.fx = $.fx || {}; //Add the 'fx' scope

	/*
	 * Public methods (jQuery FX scope)
	 */

	$.extend($.fx, {
		save: function() {
			
		},
		restore: function() {
			
		},
		wrap: function(el) { //Creates a wrapper for the current element (use with caution!)
			var cur = $(el), wrapper = $(el).wrap("<div></div>").parent();

			if(cur.css("position") != "static" || cur.css("position") != "") {
				var s = $.fx.findSides(cur);
				wrapper.css(s[0], cur.css(s[0])).css(s[1], cur.css(s[1])).css({ position: cur.css("position") });
			}
			
			wrapper.css({
				width: cur.outerWidth(),
				height: cur.outerHeight(),
				overflow: 'hidden',
				margin: cur.css("margin"),
				marginLeft: cur.css("marginLeft"),
				marginRight: cur.css("marginRight"),
				marginTop: cur.css("marginTop"),
				marginBottom: cur.css("marginBottom")
			});
			
			$.fx.save(cur, ['margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'left', 'right', 'top', 'bottom']);
			cur.css({ margin: 0, marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0, left: 0, right: 0, top: 0, bottom: 0 });
			
		
			return wrapper;
		},
		unwrap: function(el) {
			
			
			var wrapper = $(el).parent();
			$($(el).parent().parent()).append(el);
			wrapper.remove();
			
			$.fx.restore($(el), ['margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'left', 'right', 'top', 'bottom']);	
		
		},
		findSides: function(el) { //Very nifty function (especially for IE!)
			return [ !!parseInt(el.css("left")) ? "left" : "right", !!parseInt(el.css("top")) ? "top" : "bottom" ];
		},
		animateClass: function(value, duration, easing, callback) {
	
			var cb = (typeof easing == "function" ? easing : (callback ? callback : null));
			var ea = (typeof easing == "object" ? easing : null);
			
			this.each(function() {
				
				var offset = {}; var that = $(this); var oldStyleAttr = that.attr("style") || '';
				if(typeof oldStyleAttr == 'object') oldStyleAttr = oldStyleAttr["cssText"]; /* Stupidly in IE, style is a object.. */
				if(value.toggle) { that.hasClass(value.toggle) ? value.remove = value.toggle : value.add = value.toggle; }
				
				//Let's get a style offset
				var oldStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
				if(value.add) that.addClass(value.add); if(value.remove) that.removeClass(value.remove);
				var newStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
				if(value.add) that.removeClass(value.add); if(value.remove) that.addClass(value.remove);
		
				// The main function to form the object for animation
				for(var n in newStyle) {
					if( typeof newStyle[n] != "function" && newStyle[n] /* No functions and null properties */
						&& n.indexOf("Moz") == -1 && n.indexOf("length") == -1 /* No mozilla spezific render properties. */
						&& newStyle[n] != oldStyle[n] /* Only values that have changed are used for the animation */
						&& (n.match(/color/i) || (!n.match(/color/i) && !isNaN(parseInt(newStyle[n])))) /* Only things that can be parsed to integers or colors */
						&& (oldStyle.position != "static" || (oldStyle.position == "static" && !n.match(/left|top|bottom|right/))) /* No need for positions when dealing with static positions */
					) offset[n] = newStyle[n];
				}
	
				that.animate(offset, duration, ea, function() {	// Animate the newly constructed offset object
					// Change style attribute back to original. For stupid IE, we need to clear the damn object.
					if(typeof $(this).attr("style") == 'object') { $(this).attr("style")["cssText"] = ""; $(this).attr("style")["cssText"] = oldStyleAttr; } else $(this).attr("style", oldStyleAttr);
					if(value.add) $(this).addClass(value.add); if(value.remove) $(this).removeClass(value.remove);
					if(cb) cb.apply(this, arguments);
				});
	
			});
		}
	});
	
	//Extend the methods of jQuery
	$.fn.extend({
		effect: function(fx,o) { if($.fx[fx]) this.each(function() { $.fx[fx].apply(this, [o]); }); }, //This just forwards single used effects
		_show: $.fn.show,
		_hide: $.fn.hide,
		_addClass: $.fn.addClass,
		_removeClass: $.fn.removeClass,
		_toggleClass: $.fn.toggleClass,
		show: function(obj,speed,callback){
			return typeof obj == 'string' || typeof obj == 'undefined' ? this._show(obj, speed) : $.fx[obj.method].apply(this, ['show',obj,speed,callback]);
		},
		
		hide: function(obj,speed,callback){
			return typeof obj == 'string' || typeof obj == 'undefined' ? this._hide(obj, speed) : $.fx[obj.method].apply(this, ['hide',obj,speed,callback]);
		},
		addClass: function(classNames,speed,easing,callback) {
			return speed ? $.fx.animateClass.apply(this, [{ add: classNames },speed,easing,callback]) : this._addClass(classNames);
		},
		removeClass: function(classNames,speed,easing,callback) {
			return speed ? $.fx.animateClass.apply(this, [{ remove: classNames },speed,easing,callback]) : this._removeClass(classNames);
		},
		toggleClass: function(classNames,speed,easing,callback) {
			return speed ? $.fx.animateClass.apply(this, [{ toggle: classNames },speed,easing,callback]) : this._toggleClass(classNames);
		},
		morph: function(remove,add,speed,easing,callback) {
			return $.fx.animateClass.apply(this, [{ add: add, remove: remove },speed,easing,callback]);
		},
		switchClass: function() { this.morph.apply(this, arguments); }
	});
	
})(jQuery);