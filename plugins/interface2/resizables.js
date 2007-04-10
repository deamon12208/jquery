(function($) {
	$.fn.resizable = function(options) {
		options = $.extend({
			getDraggedEls: function(el) {
				if ($.DDM.currentTarget.resizeDirection) {
					return $.DDM.currentTarget;
				}
				if (!el.DB.dragHandle) {
					return;
				}
				var isDragHandle = false;
				el.DB.dragHandle.each(function(){
					if (this == $.DDM.currentTarget) {
						isDragHandle = true;
						return false;
					}
				});
				if (isDragHandle) {
					return el;
				}
				return;
			},
			beforeStartDrag: function() {
				var direction = this.DB.draggedEls.resizeDirection;
				this.DB.size = $.iUtil.getSize(this);
				if (direction) {
					this.DB.position = {
						x: parseInt($.curCSS(this, 'left'),10)||0,
						y: parseInt($.curCSS(this, 'top'),10)||0
					};
					this.DB.onStart.apply(this, [this.DB.draggedEls]);
				} else {
					this.DB.position = $.iUtil.getPosition(this);
					this.DB.offset = {
						x: this.offsetLeft,
						y: this.offsetTop
					};
					this.DB.onDragStart.apply(this);
				}
			},
			beforeStopDrag: function() {
				var direction = this.DB.draggedEls.resizeDirection;
				if (direction) {
					this.DB.onStop.apply(this, [this.DB.draggedEls]);
				} else {
					this.DB.onDragStop.apply(this);
				}
			},
			drag: function(e) {
				var position,
					size,
					els,
					direction = this.DB.draggedEls.resizeDirection,
					delta = {
						x: $.DDM.pointer.x - this.DB.pointer.x ,
						y: $.DDM.pointer.y - this.DB.pointer.y
					};
				if (direction){
					size = {w:this.DB.size.w, h:this.DB.size.h};
					position = {x:this.DB.position.x,y:this.DB.position.y};
					switch(direction){
						case 'e':
							size.w += delta.x;
							size.w = Math.min(Math.min(this.DB.maxRight - position.x, this.DB.maxWidth), Math.max(this.DB.minWidth, size.w));
							break;
						case 'se':
							size.w += delta.x;
							size.w = Math.min(Math.min(this.DB.maxRight - position.x, this.DB.maxWidth), Math.max(this.DB.minWidth, size.w));
							size.h += delta.y;
							size.h = Math.min(Math.min(this.DB.maxBottom-position.y, this.DB.maxHeight), Math.max(this.DB.minHeight, size.h));
							break;
						case 's':
							size.h += delta.y;
							size.h = Math.min(Math.min(this.DB.maxBottom-position.y, this.DB.maxHeight), Math.max(this.DB.minHeight, size.h));
							break;
						case 'sw':
							size.h += delta.y;
							size.h = Math.min(Math.min(this.DB.maxBottom-position.y, this.DB.maxHeight), Math.max(this.DB.minHeight, size.h));
							delta.x = this.DB.constrain(
								delta.x,
								size.w,
								this.DB.minWidth,
								Math.min(size.w + position.x - this.DB.minLeft,this.DB.maxWidth)
							);
							position.x += delta.x;
							size.w -= delta.x;
							break;
						case 'w':
							delta.x = this.DB.constrain(
								delta.x,
								size.w,
								this.DB.minWidth,
								Math.min(size.w + position.x - this.DB.minLeft,this.DB.maxWidth)
							);
							position.x += delta.x;
							size.w -= delta.x;
							break;
						case 'n':
							delta.y = this.DB.constrain(delta.y, size.h, this.DB.minHeight, Math.min(this.DB.maxHeight,size.h+position.y - this.DB.minTop));
							position.y += delta.y;
							size.h -= delta.y;
							break;
						case 'nw':
							delta.x = this.DB.constrain(
								delta.x,
								size.w,
								this.DB.minWidth,
								Math.min(size.w + position.x - this.DB.minLeft,this.DB.maxWidth)
							);
							position.x += delta.x;
							size.w -= delta.x;
							delta.y = this.DB.constrain(delta.y, size.h, this.DB.minHeight, Math.min(this.DB.maxHeight,size.h+position.y - this.DB.minTop));
							position.y += delta.y;
							size.h -= delta.y;
							break;
						case 'ne':
							delta.y = this.DB.constrain(delta.y, size.h, this.DB.minHeight, Math.min(this.DB.maxHeight,size.h+position.y - this.DB.minTop));
							position.y += delta.y;
							size.h -= delta.y;
							size.w += delta.x;
							size.w = Math.min(Math.min(this.DB.maxRight - position.x, this.DB.maxWidth), Math.max(this.DB.minWidth, size.w));
							break;
					}
					if (this.DB.preserveRatio) {
						switch(direction) {
							case 'se':
							case 'e':
								size.h = this.DB.size.h * (size.w/this.DB.size.w);
								size.h = Math.min(Math.max(this.DB.minHeight, size.h), Math.min(this.DB.maxBottom-position.y, this.DB.maxHeight));
								size.w = this.DB.size.w * (size.h/this.DB.size.h);
							   break;
							case 's':
								size.w = this.DB.size.w * (size.h/this.DB.size.h);
								size.w = Math.min(Math.max(this.DB.minWidth, size.w), Math.min(this.DB.maxRight - position.x, this.DB.maxWidth));
								size.h = this.DB.size.h * (size.w/this.DB.size.w);
								break;
							case 'ne':
							case 'n':
								var oldh = size.h;
								size.w = this.DB.size.w * (size.h/this.DB.size.h);
								size.w = Math.min(Math.max(this.DB.minWidth, size.w), Math.min(this.DB.maxRight - position.x, this.DB.maxWidth));
								size.h = this.DB.size.h * (size.w/this.DB.size.w);
								position.y += oldh - size.h;
								break;
							case 'sw':
							case 'w':
								size.h = this.DB.size.h * (size.w/this.DB.size.w);
								size.h = Math.min(Math.max(this.DB.minHeight, size.h),Math.min(this.DB.maxBottom-position.y, this.DB.maxHeight));
								var oldw = size.w;
								size.w = this.DB.size.w * (size.h/this.DB.size.h);
								position.x += oldw - size.w;
								break;
							case 'nw':
								var oldw = size.w;
								var oldh = size.h;
								size.h = this.DB.size.h * (size.w/this.DB.size.w);
								size.h = Math.min(Math.max(this.DB.minHeight, size.h), Math.min(position.y+oldh - this.DB.minTop, this.DB.maxHeight));
								size.w = this.DB.size.w * (size.h/this.DB.size.h);
								position.y += oldh - size.h;
								position.x += oldw - size.w;
							   break;
						}
					}
					els = this.style;
					els.left = position.x + 'px';
					els.top = position.y + 'px';
					els.width = size.w + 'px';
					els.height = size.h + 'px';
					this.DB.onResize.apply(this, [size, position]);
				} else {
					position = {
						x: Math.max(
							Math.min(
								this.DB.offset.x + delta.x,
								this.DB.maxRight - this.DB.size.wb
							),
							this.DB.minLeft
						),
						y: Math.max(
							Math.min(
								this.DB.offset.y + delta.y,
								this.DB.maxBottom - this.DB.size.hb
							),
							this.DB.minTop
						)
					};
					var els = this.DB.draggedEls.style;
					els.left = position.x + 'px';
					els.top = position.y + 'px';
					this.DB.onDrag.apply(this,[position.x, position.y]);
				}
				return false;
			},
			constrain : function(e, cur, mn, mx){
				if(cur - e < mn){
					e = cur - mn;
				}else if(cur - e > mx){
					e = cur - mx; 
				}
				return e;
			},
			onStopDrag: function(e){this.DB.onDragStop.apply(this)},
			onDragStart: function(){return false},
			onDrag: function(){return false},
			onDragStop: function(){return false},
			onStart: function(){return false},
			onResize: function(){return false},
			onStop: function(){return false},
			ratio: false,
			minWidth: 10,
			minHeight: 10,
			maxWidth: 1600,
			maxHeight: 1600,
			minTop: 0,
			minLeft: 0,
			maxRight: 1600,
			maxBottom: 1600
		}, options||{});
		
		return this.each(function(){
			if (!this.DB) {
				$.DDM.drag(this, options);
				for (var i in options.handles) {
					$(options.handles[i]).each(function(){
						this.resizeDirection = i;
					});
				}
				if (options.dragHandle) {
					this.DB.dragHandle = $(options.dragHandle);
				}
			}
		});
	};
 })(jQuery);