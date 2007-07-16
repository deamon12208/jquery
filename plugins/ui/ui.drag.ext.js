(function($) {

	$.ui.plugin("draggable", "stop", "effect", function() {
	
		if(this.options.effect[1]) {
			if(this.helper != this.element) {
				this.options.beQuietAtEnd = true;
				switch(this.options.effect[1]) {
					case 'fade':
						$(this.helper).fadeOut(300, function() { $(this).remove(); });
						break;
					default:
						$(this.helper).remove();
						break;	
				}
				
			}
		}
		
	});
	
	$.ui.plugin("draggable", "start", "effect", function() {
	
		if(this.options.effect[0]) {

			switch(this.options.effect[0]) {
				case 'fade':
					$(this.helper).hide().fadeIn(300);
					break;
			}

		}
		
	});

//----------------------------------------------------------------

	$.ui.plugin("draggable", "start", "zIndex", function() {
		if($(this.helper).css("zIndex")) this.options.ozIndex = $(this.helper).css("zIndex");
		$(this.helper).css('zIndex', this.options.zIndex);
	});
	
	$.ui.plugin("draggable", "stop", "zIndex", function() {
		if(this.options.ozIndex)
			$(this.helper).css('zIndex', this.options.ozIndex);
	});
	
//----------------------------------------------------------------

	$.ui.plugin("draggable", "start", "opacity", function() {
		if($(this.helper).css("opacity")) this.options.oopacity = $(this.helper).css("opacity");
		$(this.helper).css('opacity', this.options.opacity);
	});
	
	$.ui.plugin("draggable", "stop", "opacity", function() {
		if(this.options.oopacity)
			$(this.helper).css('opacity', this.options.oopacity);
	});
	
//----------------------------------------------------------------

	$.ui.plugin("draggable", "stop", "revert", function() {
	
		var rpos = { left: 0, top: 0 };
		var o = this.options;
		o.beQuietAtEnd = true;
		if(this.helper != this.element) {
			
			rpos = $(this.sorthelper || this.element).offset({ border: false });

			var nl = rpos.left-o.po.left-o.margins.left;
			var nt = rpos.top-o.po.top-o.margins.top;

		} else {
			var nl = o.curOffset.left - (o.po ? o.po.left : 0);
			var nt = o.curOffset.top - (o.po ? o.po.top : 0);
		}
		
		var self = this;

		$(this.helper).animate({
			left: nl,
			top: nt
		}, 500, function() {
			
			if(o.wasPositioned)
				$(self.element).css('position', o.wasPositioned);
				
			if(o.onStop) o.onStop.apply(self, [self.element, self.helper, self.pos, [o.curOffset.left - o.po.left,o.curOffset.top - o.po.top],self]);
			
			//Using setTimeout because of strange flickering in Firefox
			if(self.helper != self.element) window.setTimeout(function() { $(self.helper).remove(); }, 0);
			
		});
		
	});
	
//----------------------------------------------------------------

	$.ui.plugin("draggable", "start", "iframeFix", function() {

		if(!this.slowMode) { // Make clones on top of iframes (only if we are not in slowMode)
			if(this.options.iframeFix.constructor == Array) {
				for(var i=0;i<this.options.iframeFix.length;i++) {
					var curOffset = $(this.options.iframeFix[i]).offset({ border: false });
					$("<div class='DragDropIframeFix' style='background: #fff;'></div>").css("width", $(this.options.iframeFix[i])[0].offsetWidth+"px").css("height", $(this.options.iframeFix[i])[0].offsetHeight+"px").css("position", "absolute").css("opacity", "0.001").css("z-index", "1000").css("top", curOffset.top+"px").css("left", curOffset.left+"px").appendTo("body");
				}		
			} else {
				$("iframe").each(function() {					
					var curOffset = $(this).offset({ border: false });
					$("<div class='DragDropIframeFix' style='background: #fff;'></div>").css("width", this.offsetWidth+"px").css("height", this.offsetHeight+"px").css("position", "absolute").css("opacity", "0.001").css("z-index", "1000").css("top", curOffset.top+"px").css("left", curOffset.left+"px").appendTo("body");
				});							
			}		
		}

	});
	
	$.ui.plugin("draggable","stop", "iframeFix", function() {
		if(this.options.iframeFix) $("div.DragDropIframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers	
	});
	
//----------------------------------------------------------------

	$.ui.plugin("draggable", "start", "containment", function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.element.parentNode;

		if(o.cursorAtIgnore) { //Get the containment
			if(o.containment.left == undefined) {
				
				if(o.containment.constructor != Array) {
				
					if(o.containment == 'document') {
						o.containment = [
							0-o.margins.left,
							0-o.margins.top,
							$(document).width()-o.margins.right,
							($(document).height() || document.body.parentNode.scrollHeight)-o.margins.bottom
						];
					} else { //I'm a node, so compute top/left/right/bottom
						
						var conEl = $(o.containment)[0];
						var conOffset = $(o.containment).offset({ border: false });
		
						o.containment = [
							conOffset.left-o.margins.left,
							conOffset.top-o.margins.top,
							conOffset.left+(conEl.offsetWidth || conEl.scrollWidth)-o.margins.right,
							conOffset.top+(conEl.offsetHeight || conEl.scrollHeight)-o.margins.bottom
						];
					
					}
				
				}
				
			}
		}

	});
	
	$.ui.plugin("draggable", "drag", "containment", function() {
		
		var o = this.options;
		if(o.cursorAtIgnore) {
			
			if(o.containment.constructor == Array) {
				
				if((this.pos[0] < o.containment[0]-o.po.left)) this.pos[0] = o.containment[0]-o.po.left;
				if((this.pos[1] < o.containment[1]-o.po.top)) this.pos[1] = o.containment[1]-o.po.top;
				if(this.pos[0]+$(this.helper)[0].offsetWidth > o.containment[2]-o.po.left) this.pos[0] = o.containment[2]-o.po.left-$(this.helper)[0].offsetWidth;
				if(this.pos[1]+$(this.helper)[0].offsetHeight > o.containment[3]-o.po.top) this.pos[1] = o.containment[3]-o.po.top-$(this.helper)[0].offsetHeight;
				
			} else {

				if(o.containment.left && (this.pos[0] < o.containment.left)) this.pos[0] = o.containment.left;
				if(o.containment.top && (this.pos[1] < o.containment.top)) this.pos[1] = o.containment.top;

				var p = $(o.pp);
				var h = $(this.helper);
				if(o.containment.right && this.pos[0]+h[0].offsetWidth > p[0].offsetWidth-o.containment.right) this.pos[0] = (p[0].offsetWidth-o.containment.right)-h[0].offsetWidth;
				if(o.containment.bottom && this.pos[1]+h[0].offsetHeight > p[0].offsetHeight-o.containment.bottom) this.pos[1] = (p[0].offsetHeight-o.containment.bottom)-h[0].offsetHeight;
				
			}
			
		}
		
	});
	
//----------------------------------------------------------------

	$.ui.plugin("draggable", "drag", "grid", function() {

		var o = this.options;
		if(o.cursorAtIgnore) {
			this.pos[0] = o.curOffset.left + o.margins.left - o.po.left + Math.round((this.pos[0] - o.curOffset.left - o.margins.left + o.po.left) / o.grid[0]) * o.grid[0];
			this.pos[1] = o.curOffset.top + o.margins.top - o.po.top + Math.round((this.pos[1] - o.curOffset.top - o.margins.top + o.po.top) / o.grid[1]) * o.grid[1];
		}

	});

//----------------------------------------------------------------

	$.ui.plugin("draggable", "drag", "axis", function(d) {
		
		var o = this.options;
		if(o.constraint) o.axis = o.constraint; //Legacy check
		if(o.cursorAtIgnore) {
			switch(o.axis) {
				case "x":
					this.pos[1] = o.curOffset.top - o.margins.top - o.po.top; break;
				case "y":
					this.pos[0] = o.curOffset.left - o.margins.left - o.po.left; break;
			}
		}
		
	});

//----------------------------------------------------------------

	$.ui.plugin("draggable", "drag", "scroll", function() {
		
		var o = this.options;
		o.scrollSensitivity	= o.scrollSensitivity != undefined ? o.scrollSensitivity : 20;
		o.scrollSpeed		= o.scrollSpeed != undefined ? o.scrollSpeed : 20;

		if(o.pp && o.ppOverflow) { // If we have a positioned parent, we only scroll in this one
			// TODO: Extremely strange issues are waiting here..handle with care
		} else {
			if((this.rpos[1] - $(window).height()) - $(document).scrollTop() > -o.scrollSensitivity) window.scrollBy(0,o.scrollSpeed);
			if(this.rpos[1] - $(document).scrollTop() < o.scrollSensitivity) window.scrollBy(0,-o.scrollSpeed);
			if((this.rpos[0] - $(window).width()) - $(document).scrollLeft() > -o.scrollSensitivity) window.scrollBy(o.scrollSpeed,0);
			if(this.rpos[0] - $(document).scrollLeft() < o.scrollSensitivity) window.scrollBy(-o.scrollSpeed,0);
		}
		
	});

//----------------------------------------------------------------

	$.ui.plugin("draggable", "drag", "wrapHelper", function() {

		var o = this.options;
		if(!o.cursorAtIgnore) {

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

			this.pos[0] -= ((this.rpos[0]-o.cursorAt.left - wx + this.helper.offsetWidth+o.margins.right) - sx > 0 || (this.rpos[0]-o.cursorAt.left+o.margins.left) - sx < 0) ? (this.helper.offsetWidth+o.margins.left+o.margins.right - o.cursorAt.left * 2) : 0;
			
			this.pos[1] -= ((this.rpos[1]-o.cursorAt.top - wy + this.helper.offsetHeight+o.margins.bottom) - sy > 0 || (this.rpos[1]-o.cursorAt.top+o.margins.top) - sy < 0) ? (this.helper.offsetHeight+o.margins.top+o.margins.bottom - o.cursorAt.top * 2) : 0;

		}

	});

})(jQuery);

