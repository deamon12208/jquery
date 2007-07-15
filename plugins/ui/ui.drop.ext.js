(function($) {
	
	$.ui.plugin("droppable", "over", "hoverClass", function() {
		$(this.element).addClass(this.options.hoverClass);
	});
	
	$.ui.plugin("droppable", "out", "hoverClass", function() {
		$(this.element).removeClass(this.options.hoverClass);
	});
	
	$.ui.plugin("droppable", "drop", "hoverClass", function() {
		$(this.element).removeClass(this.options.hoverClass);
	});

})(jQuery);
