
(function($) {
	$.fn.slider = function(options) {
		options = $.extend({
			keyup: function(e) {
				if (/^35$|36$|38$|39$|40$|37$/.test(e.keyCode)) {
					this.DB.draggedEls = this.DB.thumbs.get(0);
					this.DB.getOffset.apply(this);
					var position = {x: this.DB.offset.x, y: this.DB.offset.y};
					switch(e.keyCode) {
						//end
						case 35:
							if (this.DB.axis != 'y') {
								position.x = this.DB.limitOffset.x + this.DB.limitOffset.w;
							}
							if (this.DB.axis != 'x') {
								position.y = this.DB.limitOffset.y + this.DB.limitOffset.h;
							}
							break;
						//home
						case 36:
							if (this.DB.axis != 'y') {
								position.x = this.DB.limitOffset.x;
							}
							if (this.DB.axis != 'x') {
								position.y = this.DB.limitOffset.y;
							}
							break;
						//up
						case 38:
							if (this.DB.axis != 'x') {
								position.y = Math.max(this.DB.limitOffset.y,
												this.DB.ticks && ( this.DB.ticksOn || e.ctrlKey||e.shiftKey||e.altKey) ?
												(parseInt(position.y/this.DB.grid.y,10) - 1) * this.DB.grid.y
												:  position.y - 1);
							}
							break;
						//down
						case 40:
							if (this.DB.axis != 'x') {
								position.y = Math.min(this.DB.limitOffset.y + this.DB.limitOffset.h,
												this.DB.ticks && ( this.DB.ticksOn || e.ctrlKey||e.shiftKey||e.altKey) ?
												(parseInt(position.y/this.DB.grid.y,10) + 1) * this.DB.grid.y
												:  position.y + 1);
							}
							break;
						//left
						case 37:
							if (this.DB.axis != 'y') {
								position.x = Math.max(this.DB.limitOffset.x,
												this.DB.ticks && ( this.DB.ticksOn || e.ctrlKey||e.shiftKey||e.altKey) ?
												(parseInt(position.x/this.DB.grid.x,10) - 1) * this.DB.grid.x
												:  position.x - 1);
							}
							break;
						//right
						case 39:
							if (this.DB.axis != 'y') {
								position.x = Math.min(this.DB.limitOffset.x + this.DB.limitOffset.w,
												this.DB.ticks && ( this.DB.ticksOn || e.ctrlKey||e.shiftKey||e.altKey) ?
												(parseInt(position.x/this.DB.grid.x,10) + 1) * this.DB.grid.x
												:  position.x + 1);
							}
							break;
					}
					this.DB.moveThumb.apply(this, [e,position]);
					return false;
				}
			},
			moveThumb: function(e, position) {
				//apply grid
				if (this.DB.grid && (this.DB.ticksOn || (e && (e.ctrlKey||e.shiftKey||e.altKey)))) {
					position = this.DB.applyGrid(position);
				}
				$(this.DB.draggedEls).css({
					left: position.x + 'px',
					top: position.y + 'px'
				});
				var xproc = parseInt((position.x/this.DB.maximum.w)*100, 10)||0;
				var yproc = parseInt((position.y/this.DB.maximum.h)*100, 10)||0;
				
				this.DB.onSlide.apply(
					this,
					[
						this.DB.draggedEls,
						xproc,
						yproc
					]
				);
			},
			getOffset : function() {
				this.DB.position = $.iUtil.getPosition(this.DB.draggedEls);
				this.DB.size = $.iUtil.getSize(this.DB.draggedEls);
				this.DB.offset = {
					x: this.DB.draggedEls.offsetLeft,
					y: this.DB.draggedEls.offsetTop
				};
				this.DB.maximum = {
					w: $.iUtil.getInnerWidth(this) - this.DB.size.wb,
					h: $.iUtil.getInnerHeight(this) - this.DB.size.hb
				};
				/*if (this.DB.ticks) {
					this.DB.grid = {
						x: this.DB.maximum.w/this.DB.ticks,
						y: this.DB.maximum.h/this.DB.ticks
					};
					this.DB.maximum.w = parseInt(Math.floor(this.DB.maximum.w/this.DB.grid.x)*this.DB.grid.x, 10);
					this.DB.maximum.h = parseInt(Math.floor(this.DB.maximum.h/this.DB.ticks)*this.DB.ticks, 10);
				}*/
				this.DB.limitOffset = {
					x: 0,
					y: 0,
					w: this.DB.maximum.w,
					h: this.DB.maximum.h
				};
				if (this.DB.zIndex) {
					this.DB.oldZIndex = $.curCSS(this.DB.draggedEls, 'zIndex');
					this.DB.draggedEls.style.zIndex = this.DB.zIndex;
				}
				if (this.DB.restricted) {
					nextThumb = this.DB.thumbs.get(this.DB.currentThumb + 1);
					if (nextThumb) {
						if (this.DB.axis != 'y') {
							this.DB.limitOffset.w = nextThumb.offsetLeft;
						}
						if (this.DB.axis != 'x') {
							this.DB.limitOffset.h = nextThumb.offsetTop;
						}
					}
					prevThumb = this.DB.thumbs.get(this.DB.currentThumb - 1);
					if (prevThumb) {
						if (this.DB.axis != 'y') {
							this.DB.limitOffset.x = prevThumb.offsetLeft;
							this.DB.limitOffset.w -= this.DB.limitOffset.x;
						}
						if (this.DB.axis != 'x') {
							this.DB.limitOffset.y = prevThumb.offsetTop;
							this.DB.limitOffset.h -= this.DB.limitOffset.y;
						}
					}
				}
			},
			beforeStartDrag: function() {
				this.DB.getOffset.apply(this);
				this.DB.onStart.apply(this, [this.DB.draggedEls]);
				if (this.DB.clickOnSlider == true) {
					if (this.DB.axis != 'y') {
						this.DB.offset.x += $.DDM.pointer.x - this.DB.position.x - this.DB.size.wb/2;
						this.DB.pointer.x = $.DDM.pointer.x;
					}
					if (this.DB.axis != 'x') {
						this.DB.offset.y += $.DDM.pointer.y - this.DB.position.y - this.DB.size.hb/2;
						this.DB.pointer.y = $.DDM.pointer.y;
					}
					this.DB.drag.apply(this);
				}
			},
			startDrag: function(){return true},
			getDelta: function(el, delta) {
				return {
					x: Math.max(
						el.DB.limitOffset.x,
						Math.min(
							el.DB.offset.x + delta.x,
							el.DB.limitOffset.x + el.DB.limitOffset.w
						)) - el.DB.offset.x,
					y: Math.max(
						el.DB.limitOffset.y,
						Math.min(
							el.DB.offset.y + delta.y,
							el.DB.limitOffset.y + el.DB.limitOffset.h
						))-el.DB.offset.y
				};
			},
			drag: function(e) {
				var position, delta;
				delta = {
					x: $.DDM.pointer.x - this.DB.pointer.x,
					y: $.DDM.pointer.y - this.DB.pointer.y
				};
				delta = this.DB.getDelta(this, delta);
				position = {
					x: this.DB.offset.x + delta.x,
					y: this.DB.offset.y + delta.y
				};
				this.DB.moveThumb.apply(this, [e, position]);
			},
			
			stopDrag: function() {
				var el = this;
				this.DB.currentThumb = false;
				this.DB.clickOnSlider = false;
				if (this.DB.zIndex) {
					this.DB.draggedEls.style.zIndex = this.DB.oldZIndex;
				}
				
				var thumbOffset = {
					x: this.DB.draggedEls.offsetLeft,
					y: this.DB.draggedEls.offsetTop
				};
				var xproc = parseInt((thumbOffset.x/this.DB.maximum.w)*100, 10)||0;
				var yproc = parseInt((thumbOffset.y/this.DB.maximum.h)*100, 10)||0;
				
				this.DB.onStop.apply(
					this,
					[
						this.DB.draggedEls,
						xproc,
						yproc
					]
				);
				if (this.DB.offset.x != thumbOffset.x || this.DB.offset.y != thumbOffset.y) {
					this.DB.onChange.apply(
						this,
						[
							this.DB.draggedEls,
							xproc,
							yproc
						]
					);
				}
			},
			
			getDraggedEls: function(el) {
				var thumbNr = -1;
				if ($.DDM.currentTarget == el) {
					thumbNr = 0;
					el.DB.clickOnSlider = true;
				} else {
					thumbNr = el.DB.thumbs.index($.DDM.currentTarget);
				}
				if (thumbNr != -1) {
					el.DB.currentThumb = thumbNr;
					if (this.focus) this.focus();
					return el.DB.thumbs.get(thumbNr);
				}
				return;
			},
			//apply grid to current position
			applyGrid: function(delta) {
				return {
					x: (parseInt((delta.x + (this.grid.x* delta.x/Math.abs(delta.x))/2)/this.grid.x, 10)||0) * this.grid.x,
					y: (parseInt((delta.y + (this.grid.y* delta.y/Math.abs(delta.y))/2)/this.grid.y, 10)||0) * this.grid.y
				};
			},
			restricted: false,
			ticks: false,
			ticksOn: false,
			preventionTimeout: false,
			//get pointer (overides the default fonction because of the axis option)
			getPointer: function(e){
				return {
					x : this.DB.axis === 'y' ? this.DB.pointer.x : e.pageX,
					y : this.DB.axis === 'x' ? this.DB.pointer.y : e.pageY
				};
			},
			onStart: function(){return false;},
			onStop: function(){return false;},
			onSlide: function(){return false;},
			onChange: function(){return false;}
		}, options||{});
		
		return this.each(function(){
			options.thumbs = $(options.thumbs, this);
			curPosition = $.curCSS(this, 'position');
			if (curPosition != 'absolute' && curPosition != 'relative') {
				this.style.position = 'relative';
			}
			if (!this.DB || options.thumbs.size() == 0) {
				if (options.ticks) {
					options.grid = {
						x: parseInt($.iUtil.getInnerWidth(this)/options.ticks, 10),
						y: parseInt($.iUtil.getInnerHeight(this)/options.ticks, 10)
					};
				}
				$.DDM.drag(this, options);
				if (options.values) {
					$(this).sliderValues(options.values);
				}
				var tabindex = $(this).attr('tabindex');
				if (!tabindex) {
					$(this).attr('tabindex', 0);
				}
				$(this).bind('keydown', this.DB.keyup);
			}
		});
	};
	$.fn.sliderValues = function(values) {
		if (values) {
			return this.each(function(){
				var el = this;
				if (el.DB && el.DB.thumbs) {
					el.DB.maximum = {
						w: $.iUtil.getInnerWidth(el),
						h: $.iUtil.getInnerHeight(el)
					};
					el.DB.thumbs.each(function(nr){
						if (values[nr]) {
							newPos = {
								x: el.DB.axis != 'y' ? parseInt((el.DB.maximum.w - this.offsetWidth) * values[nr].x / 100, 10) : 0,
								y: el.DB.axis != 'x' ? parseInt((el.DB.maximum.h - this.offsetHeight) * values[nr].y / 100, 10) : 0
							};
							if (el.DB.ticks) {
								if (values[nr].xtick) {
									newPos.x = ((el.DB.maximum.w - this.offsetWidth)/el.DB.ticks) * Math.min(el.DB.ticks, values[nr].xtick-1);
								}
								if (values[nr].ytick) {
									newPos.y = ((el.DB.maximum.h - this.offsetHeight)/el.DB.ticks) * Math.min(el.DB.ticks, values[nr].ytick-1);
								}
							}
							if (el.DB.grid) {
								newPos = el.DB.applyGrid(newPos);
							}
							$(this).css({
								left: newPos.x + 'px',
								top: newPos.y + 'px'
							});
						}
					});
				}
			});
		} else {
			var el = this.get(0);
			var values = [];
			if (el.DB && el.DB.thumbs) {
				el.DB.maximum = {
					w: $.iUtil.getInnerWidth(el),
					h: $.iUtil.getInnerHeight(el)
				};
				el.DB.thumbs.each(function(nr){
					values[values.length] = {
						x: parseInt((this.offsetLeft / el.DB.maximum.w) * 100, 10)||0,
						y: parseInt((this.offsetTop / el.DB.maximum.h) * 100, 10)||0
					};
				});
			}
			return values;
		};
	};
	$.fn.sliderTicksOn = function() {
		return this.each(function(){
			if (this.DB && this.DB.thumbs && this.DB.ticks) {
				this.DB.ticksOn = true;
			}
		});
	};
	$.fn.sliderTicksOff = function() {
		return this.each(function(){
			if (this.DB && this.DB.thumbs && this.DB.ticks) {
				this.DB.ticksOn = false;
			}
		});
	};
	$.fn.sliderTicksToggle = function() {
		return this.each(function(){
			if (this.DB && this.DB.thumbs && this.DB.ticks) {
				this.DB.ticksOn = !this.DB.ticksOn;
			}
		});
	};
})(jQuery);