/*
 * 'this' -> original element
 * 1. argument: browser event
 * 2.argument: ui object
 */

(function($) {

	$.ui.plugin.add("resizable", "grid", {
		
		resize: function(e, ui) {
			var o = ui.options, data = ui.instance.cssData, mp = o.originalMousePosition, a = o.axis, ratio = o._aspectRatio || e.shiftKey;
			var ox = Math.round((e.pageX - mp.left) / o.grid[0]) * o.grid[0], oy = Math.round((e.pageY - mp.top) / o.grid[1]) * o.grid[1];
			var rehw = /height|width/, reth = /top|height/, 
			
			c = function(e, ui, attr) {
				var ishw = rehw.test(attr), isth = reth.test(attr), ish = /height/.test(attr);
				if (/^n/.test(a) && ish) oy = -oy;
				if (/w$/.test(a) && /width/.test(attr)) ox = -ox;
				
				if (ratio) {
					
					/*TODO*/
					
				}
				
				if (data[attr]) data[attr] = o[ ishw ? 'originalSize' : 'originalPosition' ][attr] + (isth ? oy : ox);
			};
			
			//console.log(ox + ":" + oy)
			
			$.each(data, function(attr) { c.apply(this, [e, ui, attr]); });
			ui.instance.cssData = data;
		}
		
	});

})(jQuery);

