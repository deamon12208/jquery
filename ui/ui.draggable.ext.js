/*
 * 'this' -> original element
 * 1. argument: browser event
 * 2.argument: ui object
 */

(function($) {

	$.ui.plugin.add("draggable", "cursor", {
		start: function(e,ui) {
			var t = $('body');
			if (t.css("cursor")) ui.options._cursor = t.css("cursor");
			t.css("cursor", ui.options.cursor);
		},
		stop: function(e,ui) {
			if (ui.options._cursor) $('body').css("cursor", ui.options._cursor);
		}
	});

	$.ui.plugin.add("draggable", "zIndex", {
		start: function(e,ui) {
			var t = $(ui.helper);
			if(t.css("zIndex")) ui.options._zIndex = t.css("zIndex");
			t.css('zIndex', ui.options.zIndex);
		},
		stop: function(e,ui) {
			if(ui.options._zIndex) $(ui.helper).css('zIndex', ui.options._zIndex);
		}
	});

	$.ui.plugin.add("draggable", "opacity", {
		start: function(e,ui) {
			var t = $(ui.helper);
			if(t.css("opacity")) ui.options._opacity = t.css("opacity");
			t.css('opacity', ui.options.opacity);
		},
		stop: function(e,ui) {
			if(ui.options._opacity) $(ui.helper).css('opacity', ui.options._opacity);
		}
	});


	$.ui.plugin.add("draggable", "revert", {
		stop: function(e,ui) {
			var self = ui.instance;
			self.cancelHelperRemoval = true;
			$(ui.helper).animate({ left: self.originalPosition.left, top: self.originalPosition.top }, parseInt(ui.options.revert, 10) || 500, function() {
				if(ui.options.helper != 'original') self.helper.remove();
				self.clear();
			});
		}
	});

	$.ui.plugin.add("draggable", "iframeFix", {
		start: function(e,ui) {

			var o = ui.options;
			if(ui.instance.slowMode) return; // Make clones on top of iframes (only if we are not in slowMode)
			
			if(o.iframeFix.constructor == Array) {
				for(var i=0;i<o.iframeFix.length;i++) {
					var co = $(o.iframeFix[i]).offset({ border: false });
					$("<div class='DragDropIframeFix' style='background: #fff;'></div>").css("width", $(o.iframeFix[i])[0].offsetWidth+"px").css("height", $(o.iframeFix[i])[0].offsetHeight+"px").css("position", "absolute").css("opacity", "0.001").css("z-index", "1000").css("top", co.top+"px").css("left", co.left+"px").appendTo("body");
				}		
			} else {
				$("iframe").each(function() {					
					var co = $(this).offset({ border: false });
					$("<div class='DragDropIframeFix' style='background: #fff;'></div>").css("width", this.offsetWidth+"px").css("height", this.offsetHeight+"px").css("position", "absolute").css("opacity", "0.001").css("z-index", "1000").css("top", co.top+"px").css("left", co.left+"px").appendTo("body");
				});							
			}

		},
		stop: function(e,ui) {
			if(ui.options.iframeFix) $("div.DragDropIframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers	
		}
	});
	
	$.ui.plugin.add("draggable", "containment", {
		start: function(e,ui) {

			var o = ui.options;
			if((o.containment.left != undefined || o.containment.constructor == Array) && !o._containment) return;
			if(!o._containment) o._containment = o.containment;

			if(o._containment == 'parent') o._containment = this[0].parentNode;
			if(o._containment == 'document') {
				o.containment = [
					0,
					0,
					$(document).width(),
					($(document).height() || document.body.parentNode.scrollHeight)
				];
			} else { //I'm a node, so compute top/left/right/bottom

				var ce = $(o._containment)[0];
				var co = $(o._containment).offset();

				o.containment = [
					co.left,
					co.top,
					co.left+(ce.offsetWidth || ce.scrollWidth),
					co.top+(ce.offsetHeight || ce.scrollHeight)
				];
			}

		},
		drag: function(e,ui) {

			var o = ui.options;
			var h = ui.helper;
			var c = o.containment;
			var self = ui.instance;
			
			if(c.constructor == Array) {
				if((ui.absolutePosition.left < c[0])) self.position.left = c[0] - (self.offset.left - self.clickOffset.left);
				if((ui.absolutePosition.top < c[1])) self.position.top = c[1] - (self.offset.top - self.clickOffset.top);
				if(ui.absolutePosition.left - c[2] + self.helperProportions.width >= 0) self.position.left = c[2] - (self.offset.left - self.clickOffset.left) - self.helperProportions.width;
				if(ui.absolutePosition.top - c[3] + self.helperProportions.height >= 0) self.position.top = c[3] - (self.offset.top - self.clickOffset.top) - self.helperProportions.height;
			} else {
				if((ui.position.left < c.left)) self.position.left = c.left;
				if((ui.position.top < c.top)) self.position.top = c.top;
				if(ui.position.left - self.offsetParent.innerWidth() + self.helperProportions.width + c.right + (parseInt(self.offsetParent.css("borderLeftWidth"), 10) || 0) + (parseInt(self.offsetParent.css("borderRightWidth"), 10) || 0) >= 0) self.position.left = self.offsetParent.innerWidth() - self.helperProportions.width - c.right - (parseInt(self.offsetParent.css("borderLeftWidth"), 10) || 0) - (parseInt(self.offsetParent.css("borderRightWidth"), 10) || 0);
				if(ui.position.top - self.offsetParent.innerHeight() + self.helperProportions.height + c.bottom + (parseInt(self.offsetParent.css("borderTopWidth"), 10) || 0) + (parseInt(self.offsetParent.css("borderBottomWidth"), 10) || 0) >= 0) self.position.top = self.offsetParent.innerHeight() - self.helperProportions.height - c.bottom - (parseInt(self.offsetParent.css("borderTopWidth"), 10) || 0) - (parseInt(self.offsetParent.css("borderBottomWidth"), 10) || 0);
			}

		}
	});

	$.ui.plugin.add("draggable", "grid", {
		drag: function(e,ui) {
			var o = ui.options;
			ui.instance.position.left = ui.instance.originalPosition.left + Math.round((e.pageX - ui.instance._pageX) / o.grid[0]) * o.grid[0];
			ui.instance.position.top = ui.instance.originalPosition.top + Math.round((e.pageY - ui.instance._pageY) / o.grid[1]) * o.grid[1];
		}
	});

	$.ui.plugin.add("draggable", "axis", {
		drag: function(e,ui) {
			var o = ui.options;
			if(o.constraint) o.axis = o.constraint; //Legacy check
			o.axis == 'x' ? ui.instance.position.top = ui.instance.originalPosition.top : ui.instance.position.left = ui.instance.originalPosition.left;
		}
	});


/*** THE FOLLOWING TWO PLUGINS ARE NOT WORKING AT THIS POINT! ***/


	$.ui.plugin.add("draggable", "scroll", function(e,ui) {
		drag: function(e,ui) {

			var o = ui.options;
			o.scrollSensitivity	= o.scrollSensitivity || 20;
			o.scrollSpeed		= o.scrollSpeed || 20;

			if(o.pp && o.ppOverflow) { // If we have a positioned parent, we only scroll in this one
				// TODO: Extremely strange issues are waiting here..handle with care
			} else {
				if((ui.draggable.rpos[1] - $(window).height()) - $(document).scrollTop() > -o.scrollSensitivity) window.scrollBy(0,o.scrollSpeed);
				if(ui.draggable.rpos[1] - $(document).scrollTop() < o.scrollSensitivity) window.scrollBy(0,-o.scrollSpeed);
				if((ui.draggable.rpos[0] - $(window).width()) - $(document).scrollLeft() > -o.scrollSensitivity) window.scrollBy(o.scrollSpeed,0);
				if(ui.draggable.rpos[0] - $(document).scrollLeft() < o.scrollSensitivity) window.scrollBy(-o.scrollSpeed,0);
			}

		}
	});

	$.ui.plugin.add("draggable", "drag", "wrapHelper", {
		drag: function(e,ui) {

			var o = ui.options;
			if(o.cursorAtIgnore) return;
			var t = ui.helper;

			if(!o.pp || !o.ppOverflow) {
				var wx = $(window).width() - ($.browser.mozilla ? 20 : 0);
				var sx = $(document).scrollLeft();

				var wy = $(window).height();
				var sy = $(document).scrollTop();	
			} else {
				var wx = o.pp.offsetWidth + o.po.left - 20;
				var sx = o.pp.scrollLeft;

				var wy = o.pp.offsetHeight + o.po.top - 20;
				var sy = o.pp.scrollTop;						
			}

			ui.draggable.pos[0] -= ((ui.draggable.rpos[0]-o.cursorAt.left - wx + t.offsetWidth+o.margins.right) - sx > 0 || (ui.draggable.rpos[0]-o.cursorAt.left+o.margins.left) - sx < 0) ? (t.offsetWidth+o.margins.left+o.margins.right - o.cursorAt.left * 2) : 0;
			ui.draggable.pos[1] -= ((ui.draggable.rpos[1]-o.cursorAt.top - wy + t.offsetHeight+o.margins.bottom) - sy > 0 || (ui.draggable.rpos[1]-o.cursorAt.top+o.margins.top) - sy < 0) ? (t.offsetHeight+o.margins.top+o.margins.bottom - o.cursorAt.top * 2) : 0;

		}
	});

})(jQuery);

