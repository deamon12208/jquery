$.ui.plugin("draggable","stop", function(h, p, op, cla) {

	if(cla.options.revert) {
		h.keepMe = true;
		$(h).animate({left: op[0], top: op[1]}, 500, function(){$(this).remove()});	
	}
	
});


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

$.ui.plugin("draggable","start", function(h, p, op, cla) {
	if(cla.options.iframeFix) $("div.DragDropIframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers	
});