
function getStyleRule(rule) {
	var rs = document.styleSheets[1].cssRules || document.styleSheets[1].rules;
	for(var i=0;i<rs.length;i++) {
		if(rs[i].selectorText.toLowerCase() == rule.toLowerCase()) return rs[i];	
	}
	return null;
}


$(document).ready(function(){

	$("div.gallery ul.tree").tree();
	
	/*
	 * Replace this with real tabs.
	 */
	$('div.gallery ul.tabs li a').bind("click", function() {
		
		$(this).parent().parent().find("li").removeClass("active");
		$(this).parent().addClass("active");
		
		$("div.right").hide();
		$(this.hash).show();
		return false;
	
	});

	/*
	 * Accordion
	 */
	$('div.gallery ul.menue').accordion({
		active: true,
		header: '.head',
		alwaysOpen: true,
		navigation: false,
		autoheight: true
	});

	/*
	 * Resizable
	 */
	 $('div.container').resizable({
	 	minHeight: 250,
	 	minWidth: 500,
	 	proxy: $.browser.msie ? "resizeproxy": false
	 });	

	/*
	 * Draggables
	 */	
	 
	$('div.gallery div.overlay').bind("click", function() {
		$(this).hide();
	});
	
	$('div.gallery div.right img')
		.bind("click", function() {
			
			$("div.gallery div.overlay img")[0].src = this.src;
			$("div.gallery div.overlay").show();
		
		})
		.hover(function() {
			
			$(this).addClass("hover");
			
			var offset = $(this).position();
			var node = $(this).clone()
				.addClass("bigthumb")
				.css({ left: offset.left, top: offset.top, position: "absolute", zIndex: 4 })
				.appendTo(this.parentNode);
			
			var animation = { height: this.offsetHeight*1.5, width: this.offsetWidth*1.5 };
			
			if((offset.left- (this.offsetWidth*0.5)/2) > 0)
				animation.left = offset.left - (this.offsetWidth*0.5)/2;
			
			if((offset.left- (this.offsetWidth*0.5)/2 + this.offsetWidth*1.5) > this.parentNode.offsetWidth)
				animation.left = offset.left - (this.offsetWidth*0.5);
			
			if((offset.top- (this.offsetHeight*0.5)/2) > 0)
				animation.top = offset.top - (this.offsetHeight*0.5)/2;
			
			if((offset.top- (this.offsetHeight*0.5)/2 + this.offsetHeight*1.5) > this.parentNode.offsetHeight)
				animation.top = offset.top - (this.offsetHeight*0.5);
			
			node.animate(animation, 100); //Let's use a very fast animation here
			$(this).css("opacity", 0);
			
		}, function() {
			$(this).removeClass("hover");
			$("img.bigthumb").remove();
			$(this).css("opacity", 1);
		})
		.draggable({
			appendTo: "body",
			helper: function() {
				return $("<div class='draggable'></div>").append($(this).clone().css("opacity", 1))[0];
			},
			cursorAt: { top: 10, left: 10 },
			opacity: 0.8
		});
	
	$('div.container').draggable({ handle: "div.top" });
		
		
	/*
	 * Droppables
	 */
	var timeout = null;
	$("ul.menue a.head").droppable({
		accept: ".thumb",
		tolerance: "pointer",
		hoverClass: "over",
		over: function() {
			var self = this;
			timeout = setTimeout(function() { window.setTimeout(function() { $.ui.ddmanager.prepareOffsets(); },600); $("ul.menue").activate(self); }, 500);
		},
		out: function() {
			if(timeout) clearTimeout(timeout);
		}
	});
	
	$("ul.menue ul a").droppable({
		accept: ".thumb",
		tolerance: "pointer",
		hoverClass: "over"
	});

	/*
	 * Slider
	 */
	var slider = new $.ui.slider($('div.gallery div.slider')[0], { maxValue: 240, startValue: 105, slide: function(e,ui) {
		var rule = getStyleRule("div.gallery div.right img.thumb");
		rule.style.width = (30+ui.value)+"px";
	}});
		
	$("div.gallery div.slider").mousewheel(function(event, delta) {
		
		var rule = getStyleRule("div.gallery div.right img.thumb");

		if (delta > 0)
			slider.goto(slider.interaction.curValue+10,null,true);
		else if (delta < 0)
			slider.goto(slider.interaction.curValue-10,null,true);
	});


});