(function($) {
	
	$.ui.plugin("droppable", "over", "hoverClass", function() {
		if(this.options.hoverClass)
			$(this.element).addClass(this.options.hoverClass);
	});
	
	$.ui.plugin("droppable", "out", "hoverClass", function() {
		if(this.options.hoverClass)
			$(this.element).removeClass(this.options.hoverClass);
	});
	
	$.ui.plugin("droppable", "drop", "hoverClass", function() {
		if(this.options.hoverClass)
			$(this.element).removeClass(this.options.hoverClass);
	});

})(jQuery);
