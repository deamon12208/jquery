(function($) {

	$.fn.sortable = function(o) {
		this.each(function() {
			new $.ui.sortable(this,o);	
		});
	}

	$.ui.sortable = function(el,o) {

		if(!o) var o = {};			
		this.element = el;
		
		this.options = {};
		$.extend(this.options, o);
		

		$.extend(this.options, {
			items: o.items ? o.items : 'li'
		});
		o = this.options;
		
		//Make draggable
		$('> li', el).draggable({
			revert: true,
			helper: 'clone'
		});
		
		//Make droppable
		$('> '+o.items, el).droppable({
			accept: 'li',
			tolerance: 'intersect',
			hoverclass: 'hover',
			onHover: function(d) {

			},
			onOut: function() {

			},
			onDrop: function(d) {

			}

		});
			
	};
	
	$.extend($.ui.sortable.prototype, {
		
	});

})(jQuery);