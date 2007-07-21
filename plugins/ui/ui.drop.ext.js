(function($) {
	
	// options.activeClass
	$.ui.plugin.add("droppable", "activate", "activeClass", function() {
		$(this.element).addClass(this.options.activeClass);
	});
	$.ui.plugin.add("droppable", "deactivate", "activeClass", function() {
		$(this.element).removeClass(this.options.activeClass);
	});
	$.ui.plugin.add("droppable", "drop", "activeClass", function() {
		$(this.element).removeClass(this.options.activeClass);
	});

	// options.hoverClass
	$.ui.plugin.add("droppable", "over", "hoverClass", function() {
		$(this.element).addClass(this.options.hoverClass);
	});
	$.ui.plugin.add("droppable", "out", "hoverClass", function() {
		$(this.element).removeClass(this.options.hoverClass);
	});
	$.ui.plugin.add("droppable", "drop", "hoverClass", function() {
		$(this.element).removeClass(this.options.hoverClass);
	});

})(jQuery);
