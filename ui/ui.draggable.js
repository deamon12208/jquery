/*
 * jQuery UI Draggable
 *
 * Copyright (c) 2008 Paul Bakaus
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *   ui.base.js
 *
 * Revision: $Id$
 */

;(function($) {
	
	$.widget("ui", "draggable", {
		init: function() {
			
			//Initialize needed constants
			var self = this, o = this.options;

			//Initialize mouse events for interaction
			this.element.mouseInteraction({
				executor: this,
				delay: o.delay,
				distance: o.distance,
				dragPrevention: o.cancel,
				start: this.start,
				stop: this.stop,
				drag: this.drag,
				condition: function(e) {
					var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
					if(!handle) $(this.options.handle, this.element).each(function() { if(this == e.target) handle = true; });
					return !(e.target.className.indexOf("ui-resizable-handle") != -1 || this.options.disabled) && handle;
				}
			});
			
			//Position the node
			if(o.helper == 'original' && !(/(relative|absolute|fixed)/).test(this.element.css('position')))
				this.element.css('position', 'relative');
			
		},
		start: function(e) {

			var o = this.options;
			if($.ui.ddmanager) $.ui.ddmanager.current = this;
			
			//Create and append the visible helper
			this.helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [e])) : (o.helper == 'clone' ? this.element.clone() : this.element);
			if(!this.helper.parents('body').length) this.helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));
			if(!this.helper.css("position") || this.helper.css("position") == "static") this.helper.css("position", "absolute");

			/*
			 * - Position generation -
			 * This block generates everything position related - it's the core of draggables.
			 */			
			
			this.cssPosition = this.helper.css("position");													//Store the helper's css position
			this.offset = this.element.offset();															//The element's absolute position on the page
			this.offset = {																					//Substract the margins from the element's absolute offset
				top: this.offset.top - parseInt(this.element.css("marginTop") || 0,10),
				left: this.offset.left - parseInt(this.element.css("marginLeft") || 0,10)
			};
			
			this.offset.click = {																			//Where the click happened, relative to the element
				left: e.pageX - this.offset.left,
				top: e.pageY - this.offset.top
			};
			
			this.offsetParent = this.helper.offsetParent(); var po = this.offsetParent.offset();			//Get the offsetParent and cache its position
			this.offset.parent = {																			//Store its position plus border
				top: po.top + parseInt(this.offsetParent.css("borderTopWidth") || 0,10),
				left: po.left + parseInt(this.offsetParent.css("borderLeftWidth") || 0,10)
			};
			
			var p = this.element.position();																//This is a relative to absolute position minus the actual position calculation - only used for relative positioned helpers
			this.offset.relative = this.cssPosition == "relative" ? {
				top: p.top - parseInt(this.helper.css("top") || 0,10) + this.offsetParent[0].scrollTop,
				left: p.left - parseInt(this.helper.css("left") || 0,10) + this.offsetParent[0].scrollLeft
			} : { top: 0, left: 0 };
			
			this.originalPosition = this.generatePosition(e);												//Generate the original position
			this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() };//Cache the helper size

			if(o.cursorAt) {
				if(o.cursorAt.left != undefined) this.offset.click.left = o.cursorAt.left;
				if(o.cursorAt.right != undefined) this.offset.click.left = this.helperProportions.width - o.cursorAt.right;
				if(o.cursorAt.top != undefined) this.offset.click.top = o.cursorAt.top;
				if(o.cursorAt.bottom != undefined) this.offset.click.top = this.helperProportions.height - o.cursorAt.bottom;
			}


			/*
			 * - Position constraining -
			 * Here we prepare position constraining like grid and containment.
			 */	
			
			if(o.containment) {
				if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
				if(o.containment == 'document') this.containment = [0,0,$(document).width(), ($(document).height() || document.body.parentNode.scrollHeight)];
				if(!(/^(document|window|parent)$/).test(o.containment)) {
					var ce = $(o.containment)[0];
					var co = $(o.containment).offset();

					this.containment = [
						co.left + parseInt($(ce).css("borderLeftWidth"),10) - this.offset.relative.left - this.offset.parent.left,
						co.top + parseInt($(ce).css("borderTopWidth"),10) - this.offset.relative.top - this.offset.parent.top,
						co.left+Math.max(ce.scrollWidth,ce.offsetWidth) - parseInt($(ce).css("borderLeftWidth"),10) - this.offset.relative.left - this.offset.parent.left - this.helperProportions.width - parseInt(this.element.css("marginLeft") || 0,10) - parseInt(this.element.css("marginRight") || 0,10),
						co.top+Math.max(ce.scrollHeight,ce.offsetHeight) - parseInt($(ce).css("borderTopWidth"),10) - this.offset.relative.top - this.offset.parent.top - this.helperProportions.height - parseInt(this.element.css("marginTop") || 0,10) - parseInt(this.element.css("marginTop") || 0,10)
					];
				}
			}


			//Call plugins and callbacks
			this.propagate("start", e);

			this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() };//Recache the helper size
			if ($.ui.ddmanager && !o.dropBehaviour) $.ui.ddmanager.prepareOffsets(this, e);

			return false;

		},
		generatePosition: function(e) {
			
			var o = this.options;
			var position = {
				top: (
					e.pageY																	// The absolute mouse position
					- this.offset.click.top													// Click offset (relative to the element)
					- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
					- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
					+ (this.cssPosition == "fixed" ? 0 : this.offsetParent[0].scrollTop)	// The offsetParent's scroll position, not if the element is fixed
				),
				left: (
					e.pageX																	// The absolute mouse position
					- this.offset.click.left												// Click offset (relative to the element)
					- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
					- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
					+ (this.cssPosition == "fixed" ? 0 : this.offsetParent[0].scrollLeft)	// The offsetParent's scroll position, not if the element is fixed
				)
			};
			
			if(!this.originalPosition) return position;										//If we are not dragging yet, we won't check for options
			
			
			/*
			 * - Position constraining -
			 * Constrain the position to a mix of grid, containment.
			 */
			if(this.containment) {
				if(position.left  < this.containment[0]) position.left = this.containment[0];
				if(position.top < this.containment[1]) position.top = this.containment[1];
				if(position.left > this.containment[2]) position.left = this.containment[2];
				if(position.top > this.containment[3]) position.top = this.containment[3];
			}
			 
			if(o.grid) {
				var top = this.originalPosition.top + Math.round((position.top - this.originalPosition.top) / o.grid[1]) * o.grid[1];
				position.top = this.containment ? (!(top < this.containment[1] || top > this.containment[3]) ? top : (!(top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPosition.left + Math.round((position.left - this.originalPosition.left) / o.grid[0]) * o.grid[0];
				position.left = this.containment ? (!(left < this.containment[0] || left > this.containment[2]) ? left : (!(left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}
			
			return position;
		},
		drag: function(e) {

			//Compute the helpers position
			this.position = this.generatePosition(e);

			//Call plugins and callbacks and use the resulting position if something is returned		
			this.position = this.propagate("drag", e) || this.position;
			
			if(!this.options.axis || this.options.axis == "x") this.helper[0].style.left = this.position.left+'px';
			if(!this.options.axis || this.options.axis == "y") this.helper[0].style.top = this.position.top+'px';
			if($.ui.ddmanager) $.ui.ddmanager.drag(this, e);
			return false;

		},
		stop: function(e) {
			
			//If we are using droppables, inform the manager about the drop
			if ($.ui.ddmanager && !this.options.dropBehaviour)
				$.ui.ddmanager.drop(this, e);
				
			if(this.options.revert) {
				var self = this;
				$(this.helper).animate(this.originalPosition, parseInt(this.options.revert, 10) || 500, function() {
					self.propagate("stop", e);
					self.clear();
				});
			} else {
				this.propagate("stop", e);
				this.clear();
			}

			return false;
			
		},
		clear: function() {
			if(this.options.helper != 'original') this.helper.remove();
			if($.ui.ddmanager) $.ui.ddmanager.current = null;
			this.helper = null;
		},
		
		// From now on bulk stuff - mainly helpers
		plugins: {},
		ui: function(e) {
			return {
				helper: this.helper,
				position: this.position,
				options: this.options			
			};
		},
		propagate: function(n,e) {
			$.ui.plugin.call(this, n, [e, this.ui()]);
			return this.element.triggerHandler(n == "drag" ? n : "drag"+n, [e, this.ui()], this.options[n]);
		},
		destroy: function() {
			if(!this.element.data('draggable')) return;
			this.element.removeData("draggable").unbind(".draggable").removeMouseInteraction();
		},
		enable: function() {
			this.options.disabled = false;
		},
		disable: function() {
			this.options.disabled = true;
		}
	});
	
	$.ui.draggable.defaults = {
		helper: "original",
		appendTo: "parent",
		cancel: ['input','textarea','button','select','option'],
		distance: 1,
		delay: 0
	};
	
	
	$.ui.plugin.add("draggable", "cursor", {
		start: function(e, ui) {
			var t = $('body');
			if (t.css("cursor")) ui.options._cursor = t.css("cursor");
			t.css("cursor", ui.options.cursor);
		},
		stop: function(e, ui) {
			if (ui.options._cursor) $('body').css("cursor", ui.options._cursor);
		}
	});

	$.ui.plugin.add("draggable", "zIndex", {
		start: function(e, ui) {
			var t = $(ui.helper);
			if(t.css("zIndex")) ui.options._zIndex = t.css("zIndex");
			t.css('zIndex', ui.options.zIndex);
		},
		stop: function(e, ui) {
			if(ui.options._zIndex) $(ui.helper).css('zIndex', ui.options._zIndex);
		}
	});

	$.ui.plugin.add("draggable", "opacity", {
		start: function(e, ui) {
			var t = $(ui.helper);
			if(t.css("opacity")) ui.options._opacity = t.css("opacity");
			t.css('opacity', ui.options.opacity);
		},
		stop: function(e, ui) {
			if(ui.options._opacity) $(ui.helper).css('opacity', ui.options._opacity);
		}
	});
	
	$.ui.plugin.add("draggable", "iframeFix", {
		start: function(e, ui) {
			$(ui.options.iframeFix === true ? "iframe" : ui.options.iframeFix).each(function() {					
				$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
				.css({
					width: this.offsetWidth+"px", height: this.offsetHeight+"px",
					position: "absolute", opacity: "0.001", zIndex: 1000
				})
				.css($(this).offset())
				.appendTo("body");
			});
		},
		stop: function(e, ui) {
			$("div.DragDropIframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers	
		}
	});
	
	$.ui.plugin.add("draggable", "scroll", {
		start: function(e, ui) {
			var o = ui.options;
			var i = $(this).data("draggable");
			o.scrollSensitivity	= o.scrollSensitivity || 20;
			o.scrollSpeed		= o.scrollSpeed || 20;

			i.overflowY = function(el) {
				do { if(/auto|scroll/.test(el.css('overflow')) || (/auto|scroll/).test(el.css('overflow-y'))) return el; el = el.parent(); } while (el[0].parentNode);
				return $(document);
			}(this);
			i.overflowX = function(el) {
				do { if(/auto|scroll/.test(el.css('overflow')) || (/auto|scroll/).test(el.css('overflow-x'))) return el; el = el.parent(); } while (el[0].parentNode);
				return $(document);
			}(this);
			
			if(i.overflowY[0] != document && i.overflowY[0].tagName != 'HTML') i.overflowYOffset = i.overflowY.offset();
			if(i.overflowX[0] != document && i.overflowX[0].tagName != 'HTML') i.overflowXOffset = i.overflowX.offset();
			
		},
		drag: function(e, ui) {
			
			var o = ui.options;
			var i = $(this).data("draggable");

			if(i.overflowY[0] != document && i.overflowY[0].tagName != 'HTML') {

				if((i.overflowYOffset.top + i.overflowY[0].offsetHeight) - e.pageY < o.scrollSensitivity)
					i.overflowY[0].scrollTop = i.overflowY[0].scrollTop + o.scrollSpeed;
	
				if(e.pageY - i.overflowYOffset.top < o.scrollSensitivity)
					i.overflowY[0].scrollTop = i.overflowY[0].scrollTop - o.scrollSpeed;
								
			} else {
				
				if(e.pageY - $(document).scrollTop() < o.scrollSensitivity)
					$(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				if($(window).height() - (e.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					$(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
					
			}
			
			if(i.overflowX[0] != document && i.overflowX[0].tagName != 'HTML') {

				if((i.overflowXOffset.left + i.overflowX[0].offsetWidth) - e.pageX < o.scrollSensitivity)
					i.overflowX[0].scrollLeft = i.overflowX[0].scrollLeft + o.scrollSpeed;
	
				if(e.pageX - i.overflowXOffset.left < o.scrollSensitivity)
					i.overflowX[0].scrollLeft = i.overflowX[0].scrollLeft - o.scrollSpeed;
			
			} else {
				
				if(e.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					$(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				if($(window).width() - (e.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					$(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
					
			}

		}
	});
	
})(jQuery);