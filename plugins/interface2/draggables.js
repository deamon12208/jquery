
(function($) {
	$.fn.draggable = function(options) {
		options = $.extend({
			drag: function(e) {
				var position, delta;
				if (options.cursorAt) {
					position = {
						x: $.DDM.pointer.x + options.cursorAt.x,
						y: $.DDM.pointer.y + options.cursorAt.y
					}
				} else {
					delta = {
						x: $.DDM.pointer.x - this.DB.pointer.x ,
						y: $.DDM.pointer.y - this.DB.pointer.y
					}
					if (this.DB.grid) {
						delta = this.DB.applyGrid(delta);
					}
					position = {
						x: this.DB.offset.x + delta.x,
						y: this.DB.offset.y + delta.y
					};
				}
				if (this.DB.dragModifier) {
					position = this.DB.dragModifier(position);
				}
				this.DB.onDrag.apply(this.DB.draggedEls, [this.DB.proxy||this.DB.draggedEls, position]);
				$(this.DB.proxy||this.DB.draggedEls).css({
					left: position.x + 'px',
					top: position.y + 'px'
				});
				return false;
			},
			beforeStartDrag: function() {
				this.DB.position = $.iUtil.getPosition(this.DB.draggedEls);
				this.DB.size = $.iUtil.getSize(this.DB.draggedEls);
				this.DB.offset = {
					x: this.DB.draggedEls.offsetLeft,
					y: this.DB.draggedEls.offsetTop
				};
				var el = this.DB.proxy||this.DB.draggedEls;
				if (options.zIndex) {
					this.DB.oldZIndex = $.attr(el, 'zIndex');
					el.style.zIndex = 'number' == typeof options.zIndex ? options.zIndex : 1999;
				}
				el.style.display = 'block';
			},
			startDrag: function() {
				this.DB.onStart.apply(this.DB.draggedEls, [this.DB.proxy||this.DB.draggedEls]);
				return false;
			},
			getPointer: function(e){
				return {
					x : this.DB.axis === 'y' ? this.DB.pointer.x : e.pageX,
					y : this.DB.axis === 'x' ? this.DB.pointer.y : e.pageY
				};
			},
			stopDrag: function() {
				var handledByUser = this.DB.onStop.apply(
					this.DB.draggedEls,
					[
						this.DB.proxy||this.DB.draggedEls,
						this.DB.revert ?
							this.DB.offset :
							(
								this.DB.proxy ?
									{x:this.DB.proxy.offsetLeft,y:this.DB.proxy.offsetTop}
									:
									{x:this.DB.draggedEls.offsetLeft, y:this.DB.draggedEls.offsetTop}
							)
					]);
				if (handledByUser === false) {
					if (this.DB.revert) {
						$(this.DB.draggedEls).css({
							left: this.DB.offset.x + 'px',
							top: this.DB.offset.y + 'px'
						});
					}
					if(this.DB.proxy) {
						$(this.DB.draggedEls).css({
							left: this.DB.proxy.offsetLeft + 'px',
							top: this.DB.proxy.offsetTop + 'px'
						});
						$(this.DB.proxy).remove();
					}
				}
				if (options.zIndex) {
					this.DB.draggedEls.style.zIndex = this.DB.oldZIndex;
				}
				return false;
			},
			getDraggedEls: function(el) {
				var del = el.DB.toDrag||el,
					isAllowed = true;
				if ('function' == typeof options.dragPrevention) {
					isAllowed = options.dragPreventionOn.apply(del,[$.DDM.currentTarget]);
				} else if ('string' == typeof options.dragPrevention) {
					var chunks = options.dragPrevention.toUpperCase().split(',');
					jQuery.each(
						chunks,
						function() {
							if ($.DDM.currentTarget.nodeName == this){
								isAllowed=false
							}
						}
					);
				}
				if (isAllowed == true) {
					if(options.ghostly) {
						el.DB.proxy = $(del).clone(true).insertAfter(del)[0];
					} else if (options.helper) {
						el.DB.proxy = $(options.helper.apply(del)).insertAfter(del)[0];
					}
					if (el.DB.proxy) {
						$(el.DB.proxy).css({
							top: $.curCSS(del, 'top'),
							left: $.curCSS(del, 'left'),
							display: 'none'
						});
					}
					return del;
				}
				return;
			},
			applyGrid: function(delta) {
				return {
					x: parseInt((delta.x + (this.grid.x* delta.x/Math.abs(delta.x))/2)/this.grid.x, 10) * this.grid.x,
					y: parseInt((delta.y + (this.grid.y* delta.y/Math.abs(delta.y))/2)/this.grid.y, 10) * this.grid.y
				};
			},
			onStart: function(){return false;},
			onStop: function(){return false;},
			onDrag: function(){return false;}
		}, options||{});
		
		return this.each(function(){
			var toDrag = this;
			var el = $(this);
			if (options.handle) {
				el = $(options.handle, this);
				if (el.size() == 0 )
					el = this;
			}
			el.each(function(){
				if (!this.DB) {
					$.DDM.drag(this, options);
					if (options.handle) this.DB.toDrag = toDrag;
				}
			});
		});
	};
 })(jQuery);