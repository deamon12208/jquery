/*
 * 'this' -> original element
 * 1. argument: browser event
 * 2.argument: ui object
 */

(function($) {

	$.ui.plugin.add("resizable", "grid", {
		
		resize: function(e, ui) {
			var o = ui.options, data = ui.instance.cssData, cs = o._currentSize, os = o.originalSize, a = o.axis, ratio = o._aspectRatio || e.shiftKey;
			o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
			
			var ox = Math.round((cs.width - os.width) / o.grid[0]) * o.grid[0], oy = Math.round((cs.height - os.height) / o.grid[1]) * o.grid[1];
			var rehw = /height|width/, reth = /top|height/, relw = /width|left/, 
			
			c = function(e, ui, attr) {
				var ishw = rehw.test(attr), isth = reth.test(attr), ish = /height/.test(attr), ist = /top/.test(attr);
				
				
				
				if (ratio) {
					
					
				}
				
				if (/^n/.test(a) && reth.test(attr)) oy = -oy;
				if (/w$/.test(a) && (relw.test(attr))) ox = -ox;
				
				if (data[attr]) data[attr] = o[ ishw ? 'originalSize' : 'originalPosition' ][attr] + (isth ? oy : ox);
			};
			
			//console.log(ox + ":" + oy)
			
			$.each(data, function(attr) { c.apply(this, [e, ui, attr]); });
			ui.instance.cssData = data;
		}
		
	});

})(jQuery);