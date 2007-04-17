
(function($) {
	$.fn.sortable = function(options) {
		options.startDrag = function() {
				if (this.DB.proxy) {
					var parOff = $.iUtil.getPosition(this.offsetParent);
					this.DB.offset = {
						x : this.DB.position.x - parOff.x,
						y : this.DB.position.y - parOff.y
					};
					$(this.DB.proxy).css({
						position: 'absolute',
						left: this.DB.offset.x + 'px',
						top: this.DB.offset.y + 'px',
						display: ''
					});
				}
				this.DB.cusorOffset = {
					x: $.DDM.pointer.x - this.DB.position.x,
					y: $.DDM.pointer.y - this.DB.position.y
				};
				this.DB.onStart.apply(this.DB.draggedEls, [this.DB.proxy||this.DB.draggedEls, $.DDM.dragged.DB.targets]);
				return false;
			},
		options.stopDrag = function() {
			$(this.DB.draggedEls).css({
				top: 0,
				left: 0
			});
		};
		options.drag = function() {
			var el = $.DDM.dragged.DB.lastSortable, after, before, position = false, overlaped = false;
			if (el && $.DDM.dragged.DB.overSortable) {
				el.DrB.subjects.each(function(nr){
					if (el.DrB.positions[nr] && overlaped === false) {
						var overlap = ($.DDM.pointer.y - el.DrB.positions[nr].y) / el.DrB.positions[nr].h;
						if (overlap >= 0 && overlap <= 1) {
							overlaped = true;
							if (overlap > 0.5) {
								after = this;
							} else {
								before = this;
							}
						}
					}
				});
				if (after || before) {
					if (after && after.nextSibling != $.DDM.dragged.DB.draggedEls) {
						$(after).after($.DDM.dragged);
						position = true;
					} else if (before && before.previousSibling != $.DDM.dragged.DB.draggedEls) {
						$(before).before($.DDM.dragged);
						position = true;
					}
					if (position) {
						$($.DDM.dragged.DB.draggedEls).css({
							top: 0,
							left: 0
						});
						$.DDM.dragged.DB.position = $.iUtil.getPosition($.DDM.dragged.DB.draggedEls);
						$.DDM.dragged.DB.pointer = $.DDM.dragged.DB.position;
						$.DDM.dragged.DB.pointer.x += $.DDM.dragged.DB.cusorOffset.x;
						$.DDM.dragged.DB.pointer.y += $.DDM.dragged.DB.cusorOffset.y;
						$.DDM.dragged.DB.beforeDrag.apply($.DDM.dragged);
					}
				}
			}
		};
		options.preventionTimeout = 0;
		options.onHover = function() {
			$.DDM.dragged.DB.lastSortable = this;
			$.DDM.dragged.DB.overSortable = true;
			var el = this;		
			$(el).append($.DDM.dragged.DB.draggedEls);
			$($.DDM.dragged.DB.draggedEls).css({
				top: 0,
				left: 0
			});
			el.DrB.positions = [];
			el.DrB.subjects = $(el.DrB.accept, el).each(function(nr){
				if (this != $.DDM.dragged.DB.draggedEls && this != $.DDM.dragged.DB.proxy) {
					el.DrB.positions[nr] = {
						x: this.offsetLeft + el.DrB.position.x,
						y: this.offsetTop + el.DrB.position.y,
						w: this.offsetWidth,
						h: this.offsetHeight
					};
				}
			});
			$.DDM.dragged.DB.position = $.iUtil.getPosition($.DDM.dragged.DB.draggedEls);
			if ($.DDM.dragged.DB.proxy) {
				$.DDM.dragged.DB.offset = {
					x : $.DDM.dragged.DB.position.x - el.DrB.position.x,
					y : $.DDM.dragged.DB.position.y - el.DrB.position.y
				};
				$($.DDM.dragged.DB.proxy).css({
					position: 'absolute',
					left: $.DDM.dragged.DB.offset.x + 'px',
					top: $.DDM.dragged.DB.offset.y + 'px',
					display: ''
				});
			} else {
			}
			$.DDM.dragged.DB.pointer = $.DDM.dragged.DB.position;
			$.DDM.dragged.DB.pointer.x += $.DDM.dragged.DB.cusorOffset.x;
			$.DDM.dragged.DB.pointer.y += $.DDM.dragged.DB.cusorOffset.y;
		};
		options.onOut = function() {
			$.DDM.dragged.DB.overSortable = false;
		};
		this
				.droppable(options)
				.find(options.accept)
				.draggable(options)
				.end()
				.each(function(){
					var curPos = $.curCSS(this,'position');
					if (curPos != 'absolute' && curPos != 'relative') {
						this.style.position = 'relative';
					}
				});
	};
 })(jQuery);