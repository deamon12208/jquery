/*
 * 'this' -> original element
 * 1. argument: browser event
 * 2.argument: ui object
 */

(function($) {

	$.ui.plugin.add("sortable", "cursor", {
		start: function(e,ui) {
			var t = $('body');
			if (t.css("cursor")) ui.options._cursor = t.css("cursor");
			t.css("cursor", ui.options.cursor);
		},
		stop: function(e,ui) {
			if (ui.options._cursor) $('body').css("cursor", ui.options._cursor);
		}
	});

	$.ui.plugin.add("sortable", "zIndex", {
		start: function(e,ui) {
			var t = ui.helper;
			if(t.css("zIndex")) ui.options._zIndex = t.css("zIndex");
			t.css('zIndex', ui.options.zIndex);
		},
		stop: function(e,ui) {
			if(ui.options._zIndex) $(ui.helper).css('zIndex', ui.options._zIndex);
		}
	});

	$.ui.plugin.add("sortable", "opacity", {
		start: function(e,ui) {
			var t = ui.helper;
			if(t.css("opacity")) ui.options._opacity = t.css("opacity");
			t.css('opacity', ui.options.opacity);
		},
		stop: function(e,ui) {
			if(ui.options._opacity) $(ui.helper).css('opacity', ui.options._opacity);
		}
	});


	$.ui.plugin.add("sortable", "revert", {
		stop: function(e,ui) {
			var self = ui.instance;
			self.cancelHelperRemoval = true;
			var cur = self.currentItem.offset();
			if(ui.instance.options.zIndex) ui.helper.css('zIndex', ui.instance.options.zIndex); //Do the zIndex again because it already was resetted by the plugin above on stop

			//Also animate the placeholder if we have one
			if(ui.instance.placeholder) ui.instance.placeholder.animate({ opacity: 'hide' }, parseInt(ui.options.revert, 10) || 500);
			
			ui.helper.animate({
				left: cur.left - self.offsetParentOffset.left - (parseInt(self.currentItem.css('marginLeft')) || 0),
				top: cur.top - self.offsetParentOffset.top - (parseInt(self.currentItem.css('marginTop')) || 0)
			}, parseInt(ui.options.revert, 10) || 500, function() {
				self.currentItem.css('visibility', 'visible');
				window.setTimeout(function() {
					if(self.placeholder) self.placeholder.remove();
					self.helper.remove();
					if(ui.options._zIndex) ui.helper.css('zIndex', ui.options._zIndex);
				}, 50);
			});
		}
	});

	
	$.ui.plugin.add("sortable", "containment", {
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
		sort: function(e,ui) {

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

	$.ui.plugin.add("sortable", "axis", {
		sort: function(e,ui) {
			var o = ui.options;
			if(o.constraint) o.axis = o.constraint; //Legacy check
			o.axis == 'x' ? ui.instance.position.top = ui.instance.originalPosition.top : ui.instance.position.left = ui.instance.originalPosition.left;
		}
	});


})(jQuery);

