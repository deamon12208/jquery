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
		this.set = [];
		var self = this;
		
		this.options = {};
		$.extend(this.options, o);
		

		$.extend(this.options, {
			items: o.items ? o.items : '> li'
		});
		o = this.options;
		
		//Get the items
		var items = $(o.items, el);
		
		//Let's determine the floating mode
		o.floating = items.css('float') == 'left' || items.css('float') == 'right' ? true : false;
		
		//Make draggable
		items.draggable({
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
						if(o.hoverclass) {
							self.helper = $('<div class="'+o.hoverclass+'"></div>').appendTo('body').css({
								height: this.element.offsetHeight+'px',
								width: this.element.offsetWidth+'px',
								position: 'absolute'	
							});
						}
						break;
					case 'drag':

						var m = self.set;
						var p = this.pos[1]-this.options.cursorAt.top;
						
						for(var i=0;i<m.length;i++) {
							
							var ci = $(m[i][0]); var cio = m[i][0];
							var cO = ci.offsetLite({ border: false }); //TODO: Caching
							
							var mb = function(e) { if(o.lba != cio) { ci.before(e); o.lba = cio; } }
							var ma = function(e) { if(o.laa != cio) { ci.after(e); o.laa = cio; } }
							
							if(o.floating) {
								
								var overlap = ((cO.left - (this.pos[0]+(this.options.po ? this.options.po.left : 0)))/this.helper.offsetWidth);

								if(!(cO.top < this.pos[1]+(this.options.po ? this.options.po.top : 0) + cio.offsetHeight/2 && cO.top + cio.offsetHeight > this.pos[1]+(this.options.po ? this.options.po.top : 0) + cio.offsetHeight/2)) continue;								
								
							} else {

								var overlap = ((cO.top - (this.pos[1]+(this.options.po ? this.options.po.top : 0)))/this.helper.offsetHeight);

								if(!(cO.left < this.pos[0]+(this.options.po ? this.options.po.left : 0) + cio.offsetWidth/2 && cO.left + cio.offsetWidth > this.pos[0]+(this.options.po ? this.options.po.left : 0) + cio.offsetWidth/2)) continue;

							}
							
							if(overlap >= 0 && overlap <= 0.5) { //Overlapping at top
								ci.prev().length ? ma(this.element) : mb(this.element);
							}

							if(overlap < 0 && overlap > -0.5) { //Overlapping at bottom
								ci.next()[0] == this.element ? mb(this.element) : ma(this.element);
							}

						}

						if(self.helper) { //reposition helper if available
							var to = $(this.element).offset({ border: false });
							self.helper.css({
								top: to.top+'px',
								left: to.left+'px'	
							});
						}


						break;
					case 'stop':
						if(self.helper)
							self.helper.remove();
						break;	
				}
			},
			//Here come additional options
			containment: o.containment ? (o.containment == 'sortable' ? el : o.containment) : null,
			axis: o.axis ? o.axis : null,
			handle: o.handle ? o.handle : null,
			dragPrevention: o.dragPrevention ? o.dragPrevention : null,
			preventionDistance: o.preventionDistance ? o.preventionDistance : null,
			zIndex: o.zIndex ? o.zIndex : 1000
		});
		
		//Add current items to the set
		items.each(function() {
			self.set.push([this,null]);
		});
			
	};
	
	$.extend($.ui.sortable.prototype, {
		refresh: function() {
			//Add current items to the set
			var self = this;
			$(this.options.items, this.element).each(function() {
				self.set.push([this]);
			});				
		},
		add: function(w) {
			if(w.items) {	//It's a sortable container
				for(var i=0;i<w.items.length;i++) {
					this.set = this.set.concat(w.items[i].set);
				}
			}
		}
	});

})(jQuery);