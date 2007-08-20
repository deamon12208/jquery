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
	},
	$.fn.stopAll = function() {
		return this.each(function(){
			if (this.queue) {
				if (this.queue['fx']) {
					if (this.queue['fx'][0]) {
						this.queue['fx'] = [this.queue['fx'][0]];
						this.queue['fx'][0].startTime = (new Date()).getTime() - 1000000000;
					}
				}
			}
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
		self.set = $(options.items, el).each(function() {
			new $.ui.mouseInteraction(this,options);
		});
		
		//Let's determine the floating mode
		options.floating = /left|right/.test(self.set.css('float'));
		options.animated = options.animated && self.set.css('position') == 'relative';
		
		//Let's determine the parent's offset
		if($(el).css('position') == 'static') $(el).css('position', 'relative');
		options.offset = $(el).offset({ border: false });
		
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
			//cache each elements position. When we insert an element before or after the actual position will not coutn anymore TODO cache elements position for each active sortable
			that.cachedItemsPos = [];
			//remember container position
			that.pos = $(that.element).offset({ border: false});
			that.set = $(that.options.items, that.element).not(':last').each(function(nr){
				that.cachedItemsPos[nr] = {
					x: this.offsetLeft,
					y: this.offsetTop,
					w: this.offsetWidth,
					h: this.offsetHeight
				};
			});
			o.lastOverlap = -1;
			o.movedElement = null;
			
			
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
			//clear previous cache TODO: clear al active sortables
			that.cachedItemsPos = null;
			that.pos = null;
			o.lastOverlap = false;
			return false;
		},
		drag: function(that, e) {
			// remember the dragged element. We need this to exclude this one from items we check against
			draggedEl = this.element;
			var o = this.options;
			this.pos = [this.pos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.pos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];
			$.ui.plugin.call('drag', this);

			var nv = $.ui.trigger('drag', this, e, that.prepareCallbackObj(this));
			var nl = (nv && nv.left) ? nv.left :  this.pos[0];
			var nt = (nv && nv.top) ? nv.top :  this.pos[1];
			//overlaped element
			var targetIndex = null;
			//overlap index
			var targetOverlap = null;
			
			that.set.each(function(nr){
				if (o.lastOverlap == this || targetIndex != null)
					return;
				if(that.options.floating) {
					elPosition = that.pos.left + that.cachedItemsPos[nr].x;
					elDimension = that.cachedItemsPos[nr].w;
					curPosition = e.pageX;
					overlapY = (e.pageY - that.pos.top - that.cachedItemsPos[nr].y) / that.cachedItemsPos[nr].h;
					overlapY = overlapY >= 0 && overlapY <=1;
				} else {
					elPosition = that.pos.top + that.cachedItemsPos[nr].y;
					elDimension = that.cachedItemsPos[nr].h;
					curPosition = e.pageY;
					overlapY = true;
				}
				overlap = (curPosition - elPosition) / elDimension;
				if (overlap >= 0 && overlap <= 1 && overlapY) {
					targetIndex = nr;
					targetOverlap = overlap;
				}
			});
			//one element was overlaped
			if (targetIndex != null) {
				where = 'after';
				elementIndex = that.set.index(this.element);
				o.lastOverlap = that.set[targetIndex];
				if (elementIndex > targetIndex || that.set[targetIndex] == this.element) {
					targetIndex --;
				}
				if (targetIndex < 0) {
					targetIndex = 0;
					where = 'before';
				}
				if (o.animated) {
					toMoveIndex = targetIndex;
					if (o.lastIndex > targetIndex) {
						toMoveIndex = o.lastIndex ;
					}
					if (o.movedElement && o.movedElement[0] == that.set[toMoveIndex]) {
						o.movedElement
							.stopAll()
							.css({
								top: 0,
								left: 0
							});
					}
					o.movedElement = $(that.set[toMoveIndex]);
					oldPos = {
						top: o.movedElement[0].offsetTop,
						left: o.movedElement[0].offsetLeft
					};
				}
				$(that.set[targetIndex])[where](this.element);
				
				if (o.animated) {
					o.movedElement.css({
						top: oldPos.top - o.movedElement[0].offsetTop + 'px',
						left: oldPos.left - o.movedElement[0].offsetLeft + 'px'
					}).animate({
						top: 0,
						left: 0
					}, 500);
					o.lastIndex = targetIndex;
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
