if (window.Node && Node.prototype && !Node.prototype.contains) {
	Node.prototype.contains = function (arg) {
		return !!(this.compareDocumentPosition(arg) & 16)
	}
}

(function($) {

	$.fn.sortable = function(o) {
		return this.each(function() {
			new $.ui.sortable(this,o);	
		});
	}
	
	$.ui.sortable = function(el,o) {
	
		this.element = el;
		this.set = [];
		var options = {};
		var self = this;
		
		$.extend(options, o);
		$.extend(options, {
			items: options.items ? options.items : '> li',
			helper: 'clone',
			containment: options.containment ? (options.containment == 'sortable' ? el : options.containment) : null,
			zIndex: options.zIndex ? options.zIndex : 1000,
			_start: function(h,p,c,t,e) {
				self.start.apply(t, [self, e]); // Trigger the onStart callback				
			},
			_beforeStop: function(h,p,c,t,e) {
				self.stop.apply(t, [self, e]); // Trigger the onStart callback
			},
			_drag: function(h,p,c,t,e) {
				self.drag.apply(t, [self, e]); // Trigger the onStart callback
			}			
		});
		
		//Get the items
		var items = $(options.items, el);
		
		//Let's determine the floating mode
		options.floating = items.css('float') == 'left' || items.css('float') == 'right' ? true : false;
		
		//Let's determine the parent's offset
		if($(el).css('position') == 'static') $(el).css('position', 'relative');
		options.offset = $(el).offset({ border: false });

		items.each(function() {
			new $.ui.mouseInteraction(this,options);
		});
		
		//Add current items to the set
		items.each(function() {
			self.set.push([this,null]);
		});
		
		if(options.name) $.ui.add(options.name, 'sortable', this); //Append to UI manager if a name exists as option
		this.options = options;
	}
	
	$.extend($.ui.sortable.prototype, {
		plugins: {},
		pos: null,
		opos: null,
		currentTarget: null,
		lastTarget: null,
		helper: null,
		timer: null,
		slowMode: false,
		element: null,
		init: false,
		prepareCallbackObj: function(self, that) {
			return {
				helper: self.helper,
				position: { left: self.pos[0], top: self.pos[1] },
				offset: self.options.cursorAt,
				draggable: self,
				current: that
			}			
		},
		refresh: function() {

			//Get the items
			var self = this;
			var items = $(this.options.items, this.element);

			var unique = [];
			items.each(function() {
				old = false;
				for(var i=0;i<self.set.length;i++) { if(self.set[i][0] == this) old = true;	}
				if(!old) unique.push(this);
			});
			
			for(var i=0;i<unique.length;i++) {
				new $.ui.mouseInteraction(unique[i],self.options);
			}
			
			//Add current items to the set
			this.set = [];
			items.each(function() {
				self.set.push([this,null]);
			});
			
		},
		destroy: function() {
			
		},
		start: function(that, e) {
			
			var o = this.options;
			$.ui.plugin.call('start', this);

			if(o.hoverClass) {
				that.helper = $('<div class="'+o.hoverClass+'"></div>').appendTo('body').css({
					height: this.element.offsetHeight+'px',
					width: this.element.offsetWidth+'px',
					position: 'absolute'	
				});
			}
			
			if(o.zIndex) {
				if($(this.helper).css("zIndex")) o.ozIndex = $(this.helper).css("zIndex");
				$(this.helper).css('zIndex', o.zIndex);
			}
			
			that.firstSibling = $(this.element).prev()[0];
				
			if(o.start) o.start.apply(this.element, [this.helper, this.pos, o.cursorAt, this]);
			$.ui.trigger('start', this, e, that.prepareCallbackObj(this));
			$(this.element).css('visibility', 'hidden');
			
			return false;
						
		},
		stop: function(that, e) {			
			
			var o = this.options;
			
			$.ui.plugin.call('stop', this);
			$(this.element).css('visibility', 'visible');
			
			if(that.helper)
				that.helper.remove();
				
			if(o.ozIndex)
				$(this.helper).css('zIndex', o.ozIndex);
				
				
			//Let's see if the position in DOM has changed
			if($(this.element).prev()[0] != that.firstSibling) {
				$.ui.trigger('update', this, e, that.prepareCallbackObj(this, that));
			}
			return false;
			
		},
		drag: function(that, e) {

			var o = this.options;

			this.pos = [this.pos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.pos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];
			$.ui.plugin.call('drag', this);

			var nv = $.ui.trigger('drag', this, e, that.prepareCallbackObj(this));
			var nl = (nv && nv.left) ? nv.left :  this.pos[0];
			var nt = (nv && nv.top) ? nv.top :  this.pos[1];
			

			var m = that.set;
			var p = this.pos[1];
			
			for(var i=0;i<m.length;i++) {
				
				var ci = $(m[i][0]); var cio = m[i][0];
				if(this.element.contains(cio)) continue;
				var cO = ci.offset({ border: false, relativeTo: that.element }); //TODO: Caching
				cO = { top: o.offset.top+cO.top, left: o.offset.left+cO.left };
				
				var mb = function(e) { if(true || o.lba != cio) { ci.before(e); o.lba = cio; } }
				var ma = function(e) { if(true || o.laa != cio) { ci.after(e); o.laa = cio; } }
				
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
			
			//Let's see if the position in DOM has changed
			if($(this.element).prev()[0] != that.lastSibling) {
				$.ui.trigger('change', this, e, that.prepareCallbackObj(this, that));
				that.lastSibling = $(this.element).prev()[0];	
			}

			if(that.helper) { //reposition helper if available
				var to = $(this.element).offsetLite({ border: false });
				that.helper.css({
					top: to.top+'px',
					left: to.left+'px'	
				});
			}	
			
			
			$(this.helper).css('left', nl+'px').css('top', nt+'px'); // Stick the helper to the cursor
			return false;
			
		}
	});

 })($);
