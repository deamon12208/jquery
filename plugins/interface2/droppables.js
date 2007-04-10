
(function($) {
	$.fn.droppable = function(options) {
		options = $.extend({
			valid: {
				fit : function (el, dragged)
				{
					return 	el.position.x <= dragged.x && 
							(el.position.x + el.size.wb) >= (dragged.x + dragged.w) &&
							el.position.y <= dragged.y && 
							(el.position.y + el.size.hb) >= (dragged.y + dragged.h) ? true :false;
				},
				intersect : function (el, dragged)
				{
					return 	! ( el.position.x > (dragged.x + dragged.w)
							|| (el.position.x + el.size.wb) < dragged.x 
							|| el.position.y > (dragged.y + dragged.h) 
							|| (el.position.y + el.size.hb) < dragged.y
							) ? true :false;
				},
				pointer : function (el, dragged)
				{
					return	el.position.x < $.DDM.pointer.x
							&& (el.position.x + el.size.wb) > $.DDM.pointer.x 
							&& el.position.y < $.DDM.pointer.y 
							&& (el.position.y + el.size.hb) > $.DDM.pointer.y
							? true :false;
				}
			},
			isTarget: function() {
				return $($.DDM.dragged).is(options.accept);
			},
			onActivate: function() {
				this.DrB.position = $.iUtil.getPosition(this);
				this.DrB.size = $.iUtil.getSize(this);
				if (options.activeClass) {
					$(this).addClass(options.activeClass);
				}
				this.DrB.isMouseOver = false;
				if ($.DDM.dragged.DB.cursorAt) {
					$(this).bind('mouseover', $.markDroppablesOver);
					$(this).bind('mouseout', $.markDroppablesOut);
				}
			},
			onDeactivate: function() {
				if (options.activeClass) {
					$(this).removeClass(options.activeClass);
				}
				if (this.DrB.isOver && options.hoverClass) {
					if (options.onDrop) {
						options.onDrop.apply(this, [$.DDM.dragged])
					}
					this.DrB.isOver = false;
					$(this).removeClass(options.hoverClass);
				}
				if ($.DDM.dragged.DB.cursorAt) {
					$(this).bind('mouseover', $.markDroppablesOver);
					$(this).bind('mouseout', $.markDroppablesOut);
				}
				this.DrB.isMouseOver = false;
			},
			checkTarget: function() {
				if (!$.DDM.dragged.DB.cursorAt) {
					var dragged = {
						x: $.DDM.dragged.DB.position.x + $.DDM.pointer.x - $.DDM.dragged.DB.pointer.x,
						y: $.DDM.dragged.DB.position.y + $.DDM.pointer.y - $.DDM.dragged.DB.pointer.y,
						w: $.DDM.dragged.DB.size.wb,
						h: $.DDM.dragged.DB.size.hb
					}
				}
				if (($.DDM.dragged.DB.cursorAt && this.DrB.isMouseOver == true) || this.DrB.valid[this.DrB.tolerance](this.DrB, dragged)) {
					if (!this.DrB.isOver && options.hoverClass) {
						this.DrB.isOver = true;
						$(this).addClass(options.hoverClass);
						if (options.onHover) {
							options.onHover.apply(this, [$.DDM.dragged])
						}
					}
				} else if (this.DrB.isOver && options.hoverClass) {
					this.DrB.isOver = false;
					$(this).removeClass(options.hoverClass);
					if (options.onOut) {
						options.onOut.apply(this, [$.DDM.dragged])
					}
				}
			}
		}, options||{});
		
		return this.each(function(){
			$.DDM.drop(this, options);
		});
	};
	$.markDroppablesOver = function(e) {
		this.DrB.isMouseOver = true;
	};
	$.markDroppablesOut = function(e) {
		this.DrB.isMouseOver = false;
	};
 })(jQuery);