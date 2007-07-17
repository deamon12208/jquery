(function($) {
	
	// options.activeClass
	$.ui.plugin("droppable", "activate", "activeClass", function() {
		$(this.element).addClass(this.options.activeClass);
	});
	$.ui.plugin("droppable", "deactivate", "activeClass", function() {
		$(this.element).removeClass(this.options.activeClass);
	});
	$.ui.plugin("droppable", "drop", "activeClass", function() {
		$(this.element).removeClass(this.options.activeClass);
	});

	// options.hoverClass
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
