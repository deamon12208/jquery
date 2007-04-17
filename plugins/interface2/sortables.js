
(function($) {
	$.fn.sortable = function(options) {
		dragOptions = $.extend({
			startDrag : function() {
					if (this.DB.proxy) {
						this.DB.ghost = this.DB.proxy;
						this.DB.proxy = false;
						$(this.DB.ghost).css({
							position: 'absolute',
							left: this.offsetLeft + 'px',
							top: this.offsetTop + 'px',
							display: '',
							backgroundColor: '#09f'
						});
					}
					this.DB.changed = false;
					this.DB.cusorOffset = {
						x: $.DDM.pointer.x - this.DB.position.x,
						y: $.DDM.pointer.y - this.DB.position.y
					};
					this.DB.onStart.apply(this, [this, $.DDM.dragged.DB.targets]);
					return false;
				},
			stopDrag : function() {
				$(this.DB.draggedEls).css({
					top: 0,
					left: 0
				});
				if (this.DB.ghost) {
					$(this.DB.ghost).remove();
					this.DB.ghost = false;
					this.DB.proxy = true;
				}
				if (this.DB.changed == true) {
					this.DB.changed = false;
					this.DB.lastSortable.DrB.onUpdate.apply(this.DB.lastSortable,[this]);
				}
			},
			drag : function() {
				var dragged = $.DDM.dragged;
				var el = dragged.DB.lastSortable, after, before, position = false, overlaped = false;
				if (el && dragged.DB.overSortable) {
					var scrollT = el.scrollTop;
					el.DrB.subjects.each(function(nr){
						if (el.DrB.positions[nr] && overlaped === false) {
							var overlap = ($.DDM.pointer.y - el.DrB.positions[nr].y + scrollT - dragged.DB.cusorOffset.y) / el.DrB.positions[nr].h;
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
						if (after && after.nextSibling != dragged.DB.draggedEls) {
							$(after).after(dragged);
							position = true;
						} else if (before && before.previousSibling != dragged.DB.draggedEls) {
							$(before).before(dragged);
							position = true;
						}
						if (position) {
							$(dragged).css({
								top: 0,
								left: 0
							});
							if (dragged.DB.ghost) {
								$(dragged.DB.ghost).css({
									left: dragged.offsetLeft + 'px',
									top: dragged.offsetTop + 'px'
								});
							}
							dragged.DB.changed = true;
							dragged.DB.position = $.iUtil.getPosition(dragged.DB.draggedEls);
							dragged.DB.pointer = dragged.DB.position;
							dragged.DB.pointer.x += dragged.DB.cusorOffset.x;
							dragged.DB.pointer.y += dragged.DB.cusorOffset.y;
							dragged.DB.beforeDrag.apply(dragged);
							el.DrB.onChange.apply(el,[this]);
						}
					}
				}
			},
			preventionTimeout : 0
		},options||{});
		
		
		dropOptions = $.extend({
			beforeHover : function() {
				var dragged = $.DDM.dragged;
				var el = this;
				if ($.DDM.dragged.DB.lastSortable !=el) {
					dragged.DB.changed = true;
					dragged.DB.lastSortable = this;
					$(el).append(dragged);
					$(dragged.DB.draggedEls).css({
						top: 0,
						left: 0
					});
					if (dragged.DB.ghost) {
						$(dragged).after(dragged.DB.ghost);
						$(dragged.DB.ghost).css({
							left: dragged.offsetLeft + 'px',
							top: dragged.offsetTop + 'px'
						});
					}
					el.DrB.size.wb = el.offsetWidth;
					el.DrB.size.hb = el.offsetHeight;
					el.DrB.positions = [];
					el.DrB.subjects = $(el.DrB.accept, el).each(function(nr){
						if (this != dragged.DB.draggedEls && this != dragged.DB.proxy) {
							el.DrB.positions[nr] = {
								x: this.offsetLeft + el.DrB.position.x,
								y: this.offsetTop + el.DrB.position.y,
								w: this.offsetWidth,
								h: this.offsetHeight
							};
						}
					});
					dragged.DB.position = $.iUtil.getPosition(dragged.DB.draggedEls);
					dragged.DB.pointer = dragged.DB.position;
					dragged.DB.pointer.x += dragged.DB.cusorOffset.x;
					dragged.DB.pointer.y += dragged.DB.cusorOffset.y;
					el.DrB.onChange.apply(el,[dragged]);
				}
				dragged.DB.overSortable = true;
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