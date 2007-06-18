/*
 * Provides the old-school option zIndex, as known from scriptaculous, Interface and many others
 * zIndex: int
 */
$.ui.plugin("draggable","start", function(h, p, op, cla) {
	if(cla.options.zIndex)
		$(h).css('zIndex', cla.options.zIndex);
});

/*
 * Provides the revert option
 * revert: true
 */
$.ui.plugin("draggable","stop", function(h, p, op, cla) {

	if(cla.options.revert) {
		h.keepMe = true;
		$(h).animate({left: op[0], top: op[1]}, 500, function(){$(this).remove()});	
	}
	
});

/*
 * Provides the iframeFix option
 * iframeFix: true | NodeSet
 */
$.ui.plugin("draggable","start", function(h, p, op, cla) {

	if(!cla.slowMode && cla.options.iframeFix) { // Make clones on top of iframes (only if we are not in slowMode)
		if(o.iframeFix.constructor == Array) {
			for(var i=0;i<o.iframeFix.length;i++) {
				var curOffset = $(o.iframeFix[i]).offset({ border: false });
				$("<div class='DragDropIframeFix' style='background: #fff;'></div>").css("width", $(o.iframeFix[i])[0].offsetWidth+"px").css("height", $(o.iframeFix[i])[0].offsetHeight+"px").css("position", "absolute").css("opacity", "0.001").css("z-index", "1000").css("top", curOffset.top+"px").css("left", curOffset.left+"px").appendTo("body");
			}		
		} else {
			$("iframe").each(function() {					
				var curOffset = $(this).offset({ border: false });
				$("<div class='DragDropIframeFix' style='background: #fff;'></div>").css("width", this.offsetWidth+"px").css("height", this.offsetHeight+"px").css("position", "absolute").css("opacity", "0.001").css("z-index", "1000").css("top", curOffset.top+"px").css("left", curOffset.left+"px").appendTo("body");
			});							
		}		
	}
	
});

$.ui.plugin("draggable","stop", function(h, p, op, cla) {
	if(cla.options.iframeFix) $("div.DragDropIframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers	
});


/*
 * Provides the containment option
 * containment: 'document' || node
 */
$.ui.plugin("draggable","start", function(h, p, op, cla) {

	var o = cla.options;
	if(o.containment == 'parent') o.containment = this.parentNode;
	
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

$.ui.plugin("draggable","drag", function(h, p, op, cla) {
	
	var o = cla.options;
	if(o.containment && o.cursorAtIgnore) { // Stick to a defined containment. Cannot be used with cursorAt.
		if((o.nl < o.containment.left-o.po.left)) o.nl = o.containment.left-o.po.left;
		if((o.nt < o.containment.top-o.po.top)) o.nt = o.containment.top-o.po.top;
		if(o.nl+$(cla.helper)[0].offsetWidth > o.containment.right-o.po.left) o.nl = o.containment.right-o.po.left-$(cla.helper)[0].offsetWidth;
		if(o.nt+$(cla.helper)[0].offsetHeight > o.containment.bottom-o.po.top) o.nt = o.containment.bottom-o.po.top-$(cla.helper)[0].offsetHeight;
	}
	
});

/*
 * Provides the grid option
 * grid: [int,int]
 */
$.ui.plugin("draggable","drag", function(h, p, op, cla) {
	
	var o = cla.options;
	if(o.grid && o.cursorAtIgnore) { //Let's use the grid if we have one. Cannot be used with cursorAt.
		o.nl = o.curOffset.left + o.margins.left - o.po.left + Math.round((o.nl - o.curOffset.left - o.margins.left + o.po.left) / o.grid[0]) * o.grid[0];
		o.nt = o.curOffset.top + o.margins.top - o.po.top + Math.round((o.nt - o.curOffset.top - o.margins.top + o.po.top) / o.grid[1]) * o.grid[1];
	}
	
});

/*
 * Provides the axis option
 * axis: 'y' | 'x'
 */
$.ui.plugin("draggable","drag", function(h, p, op, cla) {
	
	var o = cla.options;
	if(o.axis && o.cursorAtIgnore) { // If we have a axis, use it. Cannot be used with cursorAt.
		switch(o.axis) {
			case "y":
				o.nt = o.curOffset.top - o.margins.top - o.po.top; break;
			case "x":
				o.nl = o.curOffset.left - o.margins.left - o.po.left; break;
		}
	}
	
});

/*
 * Provides the auto-scrolling option
 * scroll: int
 */
$.ui.plugin("draggable","drag", function(h, p, op, cla) {
	
	var o = cla.options;
	o.scroll = o.scroll != undefined ? o.scroll : 20;
	if(o.scroll) { // Auto scrolling
		if(o.pp && o.ppOverflow) { // If we have a positioned parent, we only scroll in this one
			// TODO: Extremely strange issues are waiting here..handle with care
		} else {
			if((cla.realPosition[1] - $(window).height()) - $(document).scrollTop() > -10) window.scrollBy(0,o.scroll);
			if(cla.realPosition[1] - $(document).scrollTop() < 10) window.scrollBy(0,-o.scroll);
			if((cla.realPosition[0] - $(window).width()) - $(document).scrollLeft() > -10) window.scrollBy(o.scroll,0);
			if(cla.realPosition[0] - $(document).scrollLeft() < 10) window.scrollBy(-o.scroll,0);
		}
	}
	
});

/*
 * Provides the wrap helper option
 * wrapHelper: Boolean
 */
$.ui.plugin("draggable","drag", function(h, p, op, cla) {
	
	var o = cla.options;
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
		
		o.nl -= ((cla.realPosition[0]-o.cursorAt.left - wx + cla.helper.offsetWidth+o.margins.right) - sx > 0 || (cla.realPosition[0]-o.cursorAt.left+o.margins.left) - sx < 0) ? (cla.helper.offsetWidth+o.margins.left+o.margins.right - o.cursorAt.left * 2) : 0;
		
		o.nt -= ((cla.realPosition[1]-o.cursorAt.top - wy + cla.helper.offsetHeight+o.margins.bottom) - sy > 0 || (cla.realPosition[1]-o.cursorAt.top+o.margins.top) - sy < 0) ? (cla.helper.offsetHeight+o.margins.top+o.margins.bottom - o.cursorAt.top * 2) : 0;
		
	}
	
});