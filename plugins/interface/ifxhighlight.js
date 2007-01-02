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

jQuery.fn.Highlight = function(duration, color, callback, transition) {
	return this.queue(
		'interfaceColorFX',
		function()
		{			
			jQuery(this).animateColor(
				duration,
				{'backgroundColor':[color, jQuery(this).css('backgroundColor')]},
				function() {
					jQuery.dequeue(this, 'interfaceColorFX');
					if (callback)
						callback.apply(this);
				}
		  	);
		}
	);
};