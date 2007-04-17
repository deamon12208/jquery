
(function($) {
	$.fn.sortable = function(options) {
		dragOptions = $.extend({
			startDrag : function() {
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
					this.DB.changed = false;
					this.DB.cusorOffset = {
						x: $.DDM.pointer.x - this.DB.position.x,
						y: $.DDM.pointer.y - this.DB.position.y
					};
					this.DB.onStart.apply(this.DB.draggedEls, [this.DB.proxy||this.DB.draggedEls, $.DDM.dragged.DB.targets]);
					return false;
				},
			stopDrag : function() {
				$(this.DB.draggedEls).css({
					top: 0,
					left: 0
				});
				if (this.DB.changed == true) {
					this.DB.changed = false;
					this.DB.lastSortable.DrB.onUpdate.apply(this.DB.lastSortable,[this]);
				}
			},
			drag : function() {
				var el = $.DDM.dragged.DB.lastSortable, after, before, position = false, overlaped = false;
				if (el && $.DDM.dragged.DB.overSortable) {
					var scrollT = el.scrollTop;
					el.DrB.subjects.each(function(nr){
						if (el.DrB.positions[nr] && overlaped === false) {
							var overlap = ($.DDM.pointer.y - el.DrB.positions[nr].y + scrollT - $.DDM.dragged.DB.cusorOffset.y) / el.DrB.positions[nr].h;
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
							$.DDM.dragged.DB.changed = true;
							$.DDM.dragged.DB.position = $.iUtil.getPosition($.DDM.dragged.DB.draggedEls);
							$.DDM.dragged.DB.pointer = $.DDM.dragged.DB.position;
							$.DDM.dragged.DB.pointer.x += $.DDM.dragged.DB.cusorOffset.x;
							$.DDM.dragged.DB.pointer.y += $.DDM.dragged.DB.cusorOffset.y;
							$.DDM.dragged.DB.beforeDrag.apply($.DDM.dragged);
							el.DrB.onChange.apply(el,[this]);
						}
					}
				}
			},
			preventionTimeout : 0
		},options||{});
		
		
		dropOptions = $.extend({
			beforeHover : function() {
				if ($.DDM.dragged.DB.lastSortable != this) {
					$.DDM.dragged.DB.changed = true;
					$.DDM.dragged.DB.lastSortable = this;
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
					this.DrB.size = $.iUtil.getSize(this);
					$.DDM.dragged.DB.pointer = $.DDM.dragged.DB.position;
					$.DDM.dragged.DB.pointer.x += $.DDM.dragged.DB.cusorOffset.x;
					$.DDM.dragged.DB.pointer.y += $.DDM.dragged.DB.cusorOffset.y;
					el.DrB.onChange.apply(el,[$.DDM.dragged]);
				}
				$.DDM.dragged.DB.overSortable = true;
			},
			beforeOut : function() {
				$.DDM.dragged.DB.overSortable = false;
			},
			onChange : function(){},
			onUpdate : function(){},
			sortable: true,
			attribute: 'id'
		},options||{});
		this
				.droppable(dropOptions)
				.find(options.accept)
				.draggable(dragOptions)
				.end()
				.each(function(){
					var curPos = $.curCSS(this,'position');
					if (curPos != 'absolute' && curPos != 'relative') {
						this.style.position = 'relative';
					}
				});
	};
	$.fn.sortableSerialize = function(attr, strip) {
		var hash = {};
		if (!strip)
			strip = '';
		this.each(function(){
			if (this.DrB && this.DrB.sortable) {
				var cur = [];
				var attrVal = $(this).attr(attr);
				$(this.DrB.accept, this).each(function(nr){
					var attrItem = $(this).attr(attr);
					if (strip)
						attrItem = attrItem.replace(strip, '');
					cur.push([attrVal, '[', (nr+1) , ']', '=', attrItem].join(''));
				});
				hash[attrVal] = cur.join('&');
			}
		});
		return hash.length == 1 ? hash[0] : hash;
	};
 })(jQuery);