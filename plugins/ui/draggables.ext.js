/*
 * Provides the effect option
 * effect: array
 */
$.ui.plugin("draggable","stop", function() {

	if(this.options.effect && this.options.effect[1]) {
		if(this.helper != this.element) {
			this.helper.keepMe = true;
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

/*
 * Provides the effect option
 * effect: array
 */
$.ui.plugin("draggable","start", function() {

	if(this.options.effect && this.options.effect[0]) {

		switch(this.options.effect[0]) {
			case 'fade':
				$(this.helper).hide().fadeIn(300);
				break;
		}

	}
	
});

/*
 * Provides the old-school option zIndex, as known from scriptaculous, Interface and many others
 * zIndex: int
 */
$.ui.plugin("draggable","start", function() {
	if(this.options.zIndex) {
		if($(this.helper).css("zIndex")) this.options.ozIndex = $(this.helper).css("zIndex");
		$(this.helper).css('zIndex', this.options.zIndex);
	}
});

$.ui.plugin("draggable","stop", function() {
	if(this.options.ozIndex)
		$(this.helper).css('zIndex', this.options.ozIndex);
});

/*
 * Provides the revert option
 * revert: true
 */
$.ui.plugin("draggable","stop", function() {

	if(this.options.revert) {
		
		
		if(this.helper != this.element) this.helper.keepMe = true;
		var self = this;
		$(this.helper).animate({
			left: this.opos[0]-this.options.cursorAt.left,
			top: this.opos[1]-this.options.cursorAt.top
		}, 500, function() {
			if(self.helper != self.element) $(self.helper).remove();
		});
	}
	
});

/*
 * Provides the iframeFix option
 * iframeFix: true | NodeSet
 */
$.ui.plugin("draggable","start", function() {

	if(!this.slowMode && this.options.iframeFix) { // Make clones on top of iframes (only if we are not in slowMode)
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

$.ui.plugin("draggable","stop", function() {
	if(this.options.iframeFix) $("div.DragDropIframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers	
});


/*
 * Provides the containment option
 * containment: 'document' || node
 */
$.ui.plugin("draggable","start", function() {

	var o = this.options;
	if(o.containment == 'parent') o.containment = this.element.parentNode;
	
	if(o.containment && o.cursorAtIgnore) { //Get the containment
		if(o.containment.left == undefined) {
			
			if(o.containment == 'document') {
				o.containment = {
					top: 0-o.margins.top,
					left: 0-o.margins.left,
					right: $(document).width()-o.margins.right,
					bottom: ($(document).height() || document.body.parentNode.scrollHeight)-o.margins.bottom
				}	
			} else { //I'm a node, so compute top/left/right/bottom
				
				var conEl = $(o.containment)[0];
				var conOffset = $(o.containment).offset({ border: false });

				o.containment = {
					top: conOffset.top-o.margins.top,
					left: conOffset.left-o.margins.left,
					right: conOffset.left+(conEl.offsetWidth || conEl.scrollWidth)-o.margins.right,
					bottom: conOffset.top+(conEl.offsetHeight || conEl.scrollHeight)-o.margins.bottom
				}	
			
			}
			
		}
	}
	
});

$.ui.plugin("draggable","drag", function() {
	
	var o = this.options;
	if(o.containment && o.cursorAtIgnore) { // Stick to a defined containment. Cannot be used with cursorAt.
		if((this.pos[0] < o.containment.left-o.po.left)) this.pos[0] = o.containment.left-o.po.left;
		if((this.pos[1] < o.containment.top-o.po.top)) this.pos[1] = o.containment.top-o.po.top;
		if(this.pos[0]+$(this.helper)[0].offsetWidth > o.containment.right-o.po.left) this.pos[0] = o.containment.right-o.po.left-$(this.helper)[0].offsetWidth;
		if(this.pos[1]+$(this.helper)[0].offsetHeight > o.containment.bottom-o.po.top) this.pos[1] = o.containment.bottom-o.po.top-$(this.helper)[0].offsetHeight;
	}
	
});

/*
 * Provides the grid option
 * grid: [int,int]
 */
$.ui.plugin("draggable","drag", function() {
	
	var o = this.options;
	if(o.grid && o.cursorAtIgnore) { //Let's use the grid if we have one. Cannot be used with cursorAt.
		this.pos[0] = o.curOffset.left + o.margins.left - o.po.left + Math.round((this.pos[0] - o.curOffset.left - o.margins.left + o.po.left) / o.grid[0]) * o.grid[0];
		this.pos[1] = o.curOffset.top + o.margins.top - o.po.top + Math.round((this.pos[1] - o.curOffset.top - o.margins.top + o.po.top) / o.grid[1]) * o.grid[1];
	}
	
});

/*
 * Provides the axis option
 * axis: 'y' | 'x'
 */
$.ui.plugin("draggable","drag", function() {
	
	var o = this.options;
	if(o.axis && o.cursorAtIgnore) { // If we have a axis, use it. Cannot be used with cursorAt.
		switch(o.axis) {
			case "y":
				this.pos[1] = o.curOffset.top - o.margins.top - o.po.top; break;
			case "x":
				this.pos[0] = o.curOffset.left - o.margins.left - o.po.left; break;
		}
	}
	
});

/*
 * Provides the auto-scrolling option
 * scroll: int
 */
$.ui.plugin("draggable","drag", function() {
	
	var o = this.options;
	o.scroll = o.scroll != undefined ? o.scroll : 20;
	if(o.scroll) { // Auto scrolling
		if(o.pp && o.ppOverflow) { // If we have a positioned parent, we only scroll in this one
			// TODO: Extremely strange issues are waiting here..handle with care
		} else {
			if((this.rpos[1] - $(window).height()) - $(document).scrollTop() > -10) window.scrollBy(0,o.scroll);
			if(this.rpos[1] - $(document).scrollTop() < 10) window.scrollBy(0,-o.scroll);
			if((this.rpos[0] - $(window).width()) - $(document).scrollLeft() > -10) window.scrollBy(o.scroll,0);
			if(this.rpos[0] - $(document).scrollLeft() < 10) window.scrollBy(-o.scroll,0);
		}
	}
	
});

/*
 * Provides the wrap helper option
 * wrapHelper: Boolean
 */
$.ui.plugin("draggable","drag", function() {
	
	var o = this.options;
	/* If wrapHelper is set to true (and we have a defined cursorAt),
	 * wrap the helper when coming to a side of the screen.
	 */
	if(o.wrapHelper && !o.cursorAtIgnore) {
		
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