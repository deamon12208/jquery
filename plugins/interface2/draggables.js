
(function($) {
	$.fn.draggable = function(options) {
		options = $.extend({
			drag: function(e) {
				var position, delta;
				if (options.cursorAt) {
					position = {
						x: $.DDM.pointer.x + this.DB.extraOffset.x,
						y: $.DDM.pointer.y + this.DB.extraOffset.y
					}
				} else {
					delta = {
						x: $.DDM.pointer.x - this.DB.pointer.x ,
						y: $.DDM.pointer.y - this.DB.pointer.y
					}
					if (this.DB.grid) {
						delta = this.DB.applyGrid(delta);
					}
					if (this.DB.limitOffset) {
						delta = {
							x: Math.max(
								this.DB.limitOffset.x,
								Math.min(
									this.DB.position.x + delta.x,
									this.DB.limitOffset.x + this.DB.limitOffset.w - this.DB.size.wb
								)) - this.DB.position.x,
							y: Math.max(
								this.DB.limitOffset.y,
								Math.min(
									this.DB.position.y + delta.y,
									this.DB.limitOffset.y + this.DB.limitOffset.h - this.DB.size.hb
								))-this.DB.position.y
						};
						
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
				if (this.DB.cursorAt) {
					this.DB.extraOffset = {
						x: this.DB.cursorAt.left ?
							(this.DB.cursorAt.left * (-1))
							: this.DB.cursorAt.right ?
								(- this.DB.size.wb + this.DB.cursorAt.right)
								: 0,
						y: this.DB.cursorAt.top ?
							(this.DB.cursorAt.top * (-1))
							: this.DB.cursorAt.bottom ?
								(- this.DB.size.hb + this.DB.cursorAt.bottom)
								: 0
					};
				}
				if (this.DB.containment) {
					if (this.DB.containment.parentNode) {
						this.DB.limitOffset = $.extend(
							$.iUtil.getPosition(this.DB.containment),
							$.iUtil.getSize(this.DB.containment)
						);
						this.DB.limitOffset.h = this.DB.limitOffset.hb;
						this.DB.limitOffset.w = this.DB.limitOffset.wb;
					} else if(this.DB.containment === 'document') {
						var clientScroll = $.iUtil.getScroll();
						this.DB.limitOffset = {
							x: 0,
							y: 0,
							h: Math.max(clientScroll.h,clientScroll.ih),
							w: Math.max(clientScroll.w,clientScroll.iw)
						};
					} else if(this.DB.containment === 'viewport') {
						var clientScroll = $.iUtil.getScroll();
						this.DB.limitOffset = {
							x: clientScroll.l,
							y: clientScroll.t,
							h: Math.min(clientScroll.h,clientScroll.ih),
							w: Math.min(clientScroll.w,clientScroll.iw)
						};
					} else {
						this.DB.limitOffset = this.DB.containment;
					}
				}
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
					if(options.ghostly || options.helper === 'clone') {
						if (options.helper == 'clone') {
							options.ghostly = true;
						}
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
			if (options.preventionDistance) {
				options.snap = options.preventionDistance;
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