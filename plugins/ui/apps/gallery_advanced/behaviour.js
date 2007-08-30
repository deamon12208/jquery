
function getStyleRule(rule) {
	var rs = document.styleSheets[1].cssRules || document.styleSheets[1].rules;
	for(var i=0;i<rs.length;i++) {
		if(rs[i].selectorText.toLowerCase() == rule.toLowerCase()) return rs[i];	
	}
	return null;
}

var overlay = {
	speed: 500,
	prepare: function(cur) {
	
		$("div.gallery div.overlay").empty().show();
		
		var next = ($(cur).next().not(".bigthumb").length) ? $(cur).next()[0]: false;
		var prev = ($(cur).prev().not(".bigthumb").length) ? $(cur).prev()[0]: false;
		
		var img = $("<img class='cur' src='"+cur.src+"' />").appendTo("div.gallery div.overlay");
		var pos_x = ($("div.gallery div.overlay")[0].offsetWidth / 2) - ( $(img)[0].offsetWidth / 2 );
		$(img).css({
			left: pos_x,
			top: ($("div.gallery div.overlay")[0].offsetHeight / 2) - ( $(img)[0].offsetHeight / 2 )
		});
		
		
		var img_left = $("<img class='prev' src='"+(prev ? prev.src : cur.src)+"' style='width: 50px;' />").appendTo("div.gallery div.overlay");
		$(img_left).css({ left: (pos_x / 2) - ( 50 / 2 ), top: ($("div.gallery div.overlay")[0].offsetHeight / 2) - ( $(img_left)[0].offsetHeight / 2 ) });
		if(!prev) $(img_left).css("visibility", "hidden");

		var img_right = $("<img class='next' src='"+(next ? next.src : cur.src)+"' style='width: 50px;' />").appendTo("div.gallery div.overlay");
		$(img_right).css({ left: (pos_x+$(img)[0].offsetWidth) + (pos_x / 2) - ( 50 / 2 ), top: ($("div.gallery div.overlay")[0].offsetHeight / 2) - ( $(img_right)[0].offsetHeight / 2 ) });
		if(!next) $(img_right).css("visibility", "hidden");

	
	},
	next: function() {
		
		var cur = $("div.gallery div.overlay img.cur");
		var next = $("div.gallery div.overlay img.next");
		var prev = $("div.gallery div.overlay img.prev");
		
		var curLeft = parseInt(cur.css("left"));
		var curNextPosition = [parseInt(next.css("left")),parseInt(next.css("top"))];
		
		//Make the current one small and move it to the 'prev' position
		cur.animate({
			width: 50,
			left: parseInt(prev.css("left")),
			top: parseInt(prev.css("top"))
		}, overlay.speed, function() { $(this).removeClass("cur").addClass("prev"); });
		
		//Make the previous one vanish (if there is a previous)..
		if(prev.length) {
			prev.animate({
				width: 0,
				padding: 0,
				top: parseInt(prev.css("top")) + (prev[0].offsetHeight / 2)
			}, overlay.speed, function() { $(this).remove(); });
		}
		
		//..and the next one big
		next.animate({
			width: 250, //Hardcoded! Only for the demo!
			top: parseInt(cur.css("top")),
			left: curLeft
		}, overlay.speed, function() { $(this).removeClass("next").addClass("cur");  });
		
		//and finally, add a new 'next' picture if one exists
		var path = (next[0].src.split("/"));
		var strippedsrc = path[path.length-1];
		var upcoming = $("div.gallery div.right:visible img[@src*="+strippedsrc+"]").next().not(".bigthumb");
		
		var img_right = $("<img class='next' src='"+(upcoming.length ? upcoming[0].src : cur[0].src)+"' style='width: 50px; visibility: hidden;' />").appendTo("div.gallery div.overlay");
		var img_right_height = img_right[0].offsetHeight;
		
		img_right.css({
			left: curNextPosition[0]+(upcoming.length ? 50 : 0),
			top: curNextPosition[1]+(upcoming.length ? img_right_height/2 : 0),
			width: upcoming.length ? 1 : 50,
			visibility: upcoming.length ? "visible": "hidden" });
		
		if(upcoming.length) {
			img_right.animate({
				width: 50,
				top: curNextPosition[1],
				left: curNextPosition[0]
			}, overlay.speed);
		}	
		
	},
	prev: function() {
		
		var cur = $("div.gallery div.overlay img.cur");
		var next = $("div.gallery div.overlay img.next");
		var prev = $("div.gallery div.overlay img.prev");
		
		var curLeft = parseInt(cur.css("left"));
		var curPrevPosition = [parseInt(prev.css("left")),parseInt(prev.css("top"))];
		
		//Make the current one small and move it to the 'next' position
		cur.animate({
			width: 50,
			left: parseInt(next.css("left")),
			top: parseInt(next.css("top"))
		}, overlay.speed, function() { $(this).removeClass("cur").addClass("next"); });
	
		//Make the next one vanish (if there is a previous)..
		if(next.length) {
			next.animate({
				width: 0,
				padding: 0,
				top: parseInt(next.css("top")) + (next[0].offsetHeight / 2),
				left: parseInt(next.css("left")) + next[0].offsetWidth
			}, overlay.speed, function() { $(this).remove(); });
		}
			
		//..and the previous one big
		prev.animate({
			width: 250, //Hardcoded! Only for the demo!
			top: parseInt(cur.css("top")),
			left: curLeft
		}, overlay.speed, function() { $(this).removeClass("prev").addClass("cur");  });
	
		//and finally, add a new 'prev' picture if one exists
		var path = (prev[0].src.split("/"));
		var strippedsrc = path[path.length-1];
		var upcoming = $("div.gallery div.right:visible img[@src*="+strippedsrc+"]").prev().not(".bigthumb");
		
		var img_left = $("<img class='prev' src='"+(upcoming.length ? upcoming[0].src : cur[0].src)+"' style='width: 50px; visibility: hidden;' />").appendTo("div.gallery div.overlay");
		var img_left_height = img_left[0].offsetHeight;
		
		img_left.css({
			left: curPrevPosition[0],
			top: curPrevPosition[1]+ (upcoming.length ? img_left_height/2 : 0),
			width: upcoming.length ? 1 : 50,
			visibility: upcoming.length ? "visible": "hidden" });
		
		if(upcoming.length) {
			img_left.animate({
				width: 50,
				top: curPrevPosition[1]
			}, overlay.speed);
		}	
	
	}	
}




$(document).ready(function(){

	/*
	 * The three
	 */
	if(!$.browser.msie) $("div.gallery ul.tree").tree();
	
	/*
	 * Replace this with real tabs.
	 */
	$('div.gallery ul.tabs li a').bind("click", function() {
		
		$("div.gallery div.overlay").hide();
		
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
		header: '.head',
		fillSpace: true
	});

	/*
	 * Resizable
	 */
	 $('div.container').resizable({
	 	minHeight: 250,
	 	minWidth: 500,
	 	proxy: $.browser.msie ? "resizeproxy": false
	 });	


	 
	$('div.gallery div.overlay').bind("click", function(e) {
		
		if(e.target.nodeName.toLowerCase() != "img") {
			$(this).hide(); return;
		}
		
		if(e.target.className == "next") overlay.next();
		if(e.target.className == "prev") overlay.prev();
		
	});
	
	$('div.gallery div.right img')
		.bind("click", function() {
			
			//Fill the overlay and bind events
			overlay.prepare(this);
				
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
	/*
	 * Draggables
	 */	
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