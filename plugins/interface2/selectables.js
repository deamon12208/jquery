
(function($) {
	$.fn.selectable = function(options) {
		options = $.extend({
			beforeStartDrag: function(e) {
				this.DB.rubberband = $('<div style="position: absolute; overflow: hidden" />').addClass(this.DB.rubberbandClass).appendTo(this);
				this.DB.rubberbandExtra = {
					w : $.iUtil.getExtraWidth (this.DB.rubberband[0]),
					h : $.iUtil.getExtraHeight (this.DB.rubberband[0])
				};
				this.DB.position = $.iUtil.getPosition(this);
				this.DB.size = $.iUtil.getSize(this);
				this.DB.size.iw = $.iUtil.getInnerWidth(this, true);
				this.DB.size.ih = $.iUtil.getInnerHeight(this, true);
				this.DB.scroll = {
					t: this.scrollTop,
					l: this.scrollLeft
				};
				this.DB.max = {
					t: this.DB.position.y - this.DB.pointer.y - this.DB.scroll.t,
					l: this.DB.position.x - this.DB.pointer.x - this.DB.scroll.l
				}
				this.DB.max.b = this.DB.max.t + this.DB.size.ih - this.DB.rubberbandExtra.h;
				this.DB.max.r = this.DB.max.l + this.DB.size.iw - this.DB.rubberbandExtra.w;
				this.DB.rubberband.css({
					top: -this.DB.max.t + 'px',
					left: -this.DB.max.l + 'px',
					width: 0,
					height: 0,
					opacity: this.DB.rubberbandOpacity
				});
				this.DB.onStart.apply(this);
				this.DB.drag.apply(this, [e]);
			},
			drag: function(e) {
				var el = this;
				elScroll = {
					t: el.scrollTop,
					l: el.scrollLeft
				};
				var height = Math.min(
								Math.max(
									$.DDM.pointer.y - el.DB.pointer.y - el.DB.scroll.t + elScroll.t,
									el.DB.max.t
								),
								el.DB.max.b
							);
				var width = Math.min(
								Math.max(
									$.DDM.pointer.x - el.DB.pointer.x - el.DB.scroll.l + elScroll.l,
									el.DB.max.l
								),
								el.DB.max.r
							);
				var x = Math.max(
							-el.DB.max.l + Math.min(width, 0),
							0
						);
				var y = Math.max(
							-el.DB.max.t + Math.min(height, 0),
							0
						);
				width = Math.abs(width);
				height = Math.abs(height);
				el.DB.rubberband.css({
					height: height + 'px',
					width: width + 'px',
					top: y + 'px',
					left: x + 'px'
				});
				el.DB.subjects.each(function(){
					top = this.offsetTop;
					left = this.offsetLeft;
					if (
						! ( left > x + width
						|| left + this.offsetWidth < x
						|| top > y + height
						|| top + this.offsetHeight < y
						)
					)
					{
						if (($.DDM.ctrlKey || $.DDM.shiftKey || $.DDM.altKey) && this.wasSelectedItem) {
							$(this).removeClass(el.DB.selectedClass);
						} else {
							$(this).addClass(el.DB.selectedClass);
						}
					} else {
						if (($.DDM.ctrlKey || $.DDM.shiftKey || $.DDM.altKey) && this.wasSelectedItem) {
							$(this).addClass(el.DB.selectedClass);
						} else {
							$(this).removeClass(el.DB.selectedClass);
						}
					}
				});
				return false;
			},
			stopDrag: function(e) {
				this.DB.rubberband.remove();
				this.DB.rubberband = false;
				this.DB.selected = this.DB.subjects.filter('.' + this.DB.selectedClass);
				this.DB.onSelect.apply(this, [this.DB.selected]);
				this.DB.onStop.apply(this);
				return false;
			},
			getDraggedEls: function(el, e) {
				var targetEl = $.DDM.currentTarget;
				while (targetEl && targetEl != el ) {
					if ($(targetEl).is(el.DB.subject)) {
						break;
					}
					targetEl = targetEl.parentNode;
				}
				if (targetEl != el && el.DB.onSelected.apply(this)) {
					return false;
				} else {
					if (el.DB.selected && el.DB.selected.size() > 0 && !$.DDM.ctrlKey && !$.DDM.shiftKey && !$.DDM.altKey) {
						el.DB.selected.removeClass(el.DB.selectedClass);
						el.DB.onDeselect.apply(el);
					}
					el.DB.selected = null;
				}
				el.DB.subjects = $(el.DB.subject, el).each(function() {
					this.wasSelectedItem = $(this).is('.' + el.DB.selectedClass);
				});
				return el;
			},
			preventionTimeout: 1,
			onStart: function() {return false;},
			onStop: function() {return false;},
			onSelect: function() {return false;},
			onDeselect: function() {return false;},
			onSelected: function() {return false;},
			selected: false
		}, options||{});
		
		return this.each(function(){
			if (!this.DB) {
				curPosition = $.curCSS(this, 'position');
				if (curPosition != 'absolute' && curPosition != 'relative') {
					this.style.position = 'relative';
				}
				$.DDM.drag(this, options);
			}
		});
	};
})(jQuery);