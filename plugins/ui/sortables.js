(function($) {

	$.fn.sortable = function(o) {

		//Initialize new container that gets returned to the user
		var set = new $.ui.dragset();
		
		this.each(function() {
			set.items.push(new $.ui.sortable(this,o));	
		});
		
		return set;
	}

	$.ui.sortable = function(el,o) {

		if(!o) var o = {};			
		this.element = el;
		var self = this;
		
		this.options = {};
		$.extend(this.options, o);
		

		$.extend(this.options, {
			items: o.items ? o.items : 'li'
		});
		o = this.options;
		
		//Make draggable
		$('> '+o.items, el).draggable({
			revert: true,
			helper: 'clone',
			onStart: function(el) {
				$(el).css('visibility', 'hidden');
			},
			onStop: function(el) {
				$(el).css('visibility', 'visible');
			},
			dropBehaviour: function(state) {
				switch(state) {
					case 'start':
						break;
					case 'drag':


						var m = self.set;
						var p = this.pos[1]-this.options.cursorAt.top;
						for(var i=0;i<m.length;i++) {
							
							var cO = $(m[i][0]).offset({ border: false });
							var overlap = ((cO.top - (this.rpos[1]-this.options.cursorAt.top))/m[i][0].offsetHeight);

							//Don't execute if not touching the sortables in horizontal direction
							if(!(cO.left < this.rpos[0]-this.options.cursorAt.left + m[i][0].offsetWidth/2 && cO.left + m[i][0].offsetWidth > this.rpos[0]-this.options.cursorAt.left + m[i][0].offsetWidth/2)) return;

							//Caching...
							if(self.curTarget == m[i][0]) continue;
							if($.ui.intersect(this,{ offset: cO, item: { element: m[i][0] } }, 'intersect')) {
								self.curTarget = m[i][0];
							}

							if(overlap >= 0 && overlap <= 0.5) { //Overlapping at top	
								
								if(!$(m[i][0]).prev().length) { //If it's the first, move it to the top
									$(m[i][0]).before(this.element);
								} else {
									$(m[i][0]).after(this.element);
								}
							}

							if(overlap < 0 && overlap > -0.5) { //Overlapping at bottom

								if($(m[i][0]).next()[0] == this.element) {
									$(m[i][0]).before(this.element);
								} else {
									$(m[i][0]).after(this.element);
								}

							}

						}


						break;
					case 'stop':
						break;	
				}
			}
		});
		
		//Add current items to the set
		$('> '+o.items, el).each(function() {
			self.set.push([this]);
		});
			
	};
	
	$.extend($.ui.sortable.prototype, {
		element: null,
		set: [],
		refresh: function() {
			//Add current items to the set
			var self = this;
			$('> '+this.options.items, this.element).each(function() {
				self.set.push([this]);
			});				
		}
	});

})(jQuery);