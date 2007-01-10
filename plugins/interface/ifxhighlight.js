/**
 * Interface Elements for jQuery
 * FX - Highlight
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

jQuery.fn.Highlight = function(duration, color, callback, easing) {
	return this.queue(
		'interfaceColorFX',
		function()
		{
			this.oldStyleAttr = jQuery(this).attr("style") || '';
			easing = typeof callback == 'string' ? callback : easing||null;
			callback = typeof callback == 'function' ? callback : null;
			var oldColor = jQuery(this).css('backgroundColor');
			
			/* In IE, style is a object.. */
			if(typeof this.oldStyleAttr == 'object') this.oldStyleAttr = this.oldStyleAttr["cssText"];
			
			jQuery(this).animateColor(
				duration,
				{'backgroundColor':[color, oldColor]},
				function() {
					jQuery.dequeue(this, 'interfaceColorFX');
					jQuery(this).css('backgroundColor',oldColor);
					if(typeof jQuery(this).attr("style") == 'object') {
						jQuery(this).attr("style")["cssText"] = "";
						jQuery(this).attr("style")["cssText"] = this.oldStyleAttr;
					} else {
						jQuery(this).attr("style", this.oldStyleAttr);	
					}
					if (callback)
						callback.apply(this);
				},
				easing
		  	);
		}
	);
};