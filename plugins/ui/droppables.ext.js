(function($) {
	
	/*
	 * Provides the old-school option zIndex, as known from scriptaculous, Interface and many others
	 * zIndex: int
	 */
	$.ui.plugin("droppable", "hover", function() {
		if(this.options.hoverclass)
			$(this.element).addClass(this.options.hoverclass);
	});
	
	$.ui.plugin("droppable", "out", function() {
		if(this.options.hoverclass)
			$(this.element).removeClass(this.options.hoverclass);
	});
	
	$.ui.plugin("droppable", "drop", function() {
		if(this.options.hoverclass)
			$(this.element).removeClass(this.options.hoverclass);
	});

})(jQuery);
