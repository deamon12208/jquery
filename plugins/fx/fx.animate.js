(function($) {
	
	$.fn.animateClass = function(value, duration, easing, callback) {

		var cb = (typeof easing == "function" ? easing : (callback ? callback : null));
		var ea = (typeof easing == "object" ? easing : null);
		
		this.each(function() {
			
			var offset = {}; var oldStyleAttr = $(this).attr("style") || '';
			if(typeof oldStyleAttr == 'object') oldStyleAttr = oldStyleAttr["cssText"]; /* Stupidly in IE, style is a object.. */
			
			//Let's get a style offset
			var oldStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
			
			if(value.add) $(this).addClass(value.add);
			if(value.remove) $(this).removeClass(value.remove);
			var newStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
			if(value.add) $(this).removeClass(value.add);
			if(value.remove) $(this).addClass(value.remove);
	
			// The main function to form the object for animation
			for(var n in newStyle) {
				if( typeof newStyle[n] != "function" && newStyle[n] /* No functions and null properties */
					&& n.indexOf("Moz") == -1 && n.indexOf("length") == -1 /* No mozilla spezific render properties. */
					&& newStyle[n] != oldStyle[n] /* Only values that have changed are used for the animation */
					&& (n.match(/color/i) || (!n.match(/color/i) && !isNaN(parseInt(newStyle[n])))) /* Only things that can be parsed to integers or colors */
					&& (oldStyle.position != "static" || (oldStyle.position == "static" && !n.match(/left|top|bottom|right/))) /* No need for positions when dealing with static positions */
				) offset[n] = newStyle[n];
			}

			// Animate the newly constructed offset object
			$(this).animate(offset, duration, ea, function() {			

				// Change style attribute back to original. For stupid IE, we need to clear the damn object.
				if(typeof $(this).attr("style") == 'object') { $(this).attr("style")["cssText"] = ""; $(this).attr("style")["cssText"] = oldStyleAttr; } else $(this).attr("style", oldStyleAttr);
				
				if(value.add) $(this).addClass(value.add);
				if(value.remove) $(this).removeClass(value.remove);
				
				if(cb) cb.apply(this, arguments);

			});

		});

	};
	
})(jQuery);