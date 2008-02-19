/*
 * 'this' -> original element
 * 1. argument: browser event
 * 2.argument: ui object
 */

(function($) {

	$.ui.plugin.add("resizable", "grid", {
		
		resize: function(e, ui) {
			//var o = ui.options;
			//ui.instance.options._currentPosition.top = ui.instance.options.originalPosition.top + Math.round((e.pageY - ui.instance._pageY) / o.grid[1]) * o.grid[1];
		}
		
	});

})(jQuery);

