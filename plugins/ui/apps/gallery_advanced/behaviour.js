$(document).ready(function(){

	overlay.container = $("div.gallery div.overlay");

	//Flipping images in albums
	$("div.thumb").bind("mousemove", function(e) {
	
		if(!this.offset) this.offset = $(this).offset({ border: false });
		
		//Determine mouse position and stripe length
		var p = e.clientX-this.offset.left;
		if(p == 0) return; else p--;
		var length = (this.getAttribute("stripelength"));
		
		//Change background position
		var left = Math.floor((p/80) * length) * 80;
		$(this).css("background-position", (-left)+"px 0px");
	
	});

	//Click event for overlay
	$('div.gallery div.overlay').bind("click", function(e) {
		if(e.target.nodeName.toLowerCase() != "img") { $(this).hide(); return;}
		if(e.target.className == "next") overlay.next();
		if(e.target.className == "prev") overlay.prev();
	});
	
	$('div.gallery div.right img')
		.bind("click", function() {
			overlay.prepare(this); //Fill the overlay and bind events
		})
		.hover(function() {
			
			$(this).addClass("hover");
			
			var offset = $(this).position();
			offset.top = offset.top + this.parentNode.scrollTop;
			var node = $(this).clone()
				.addClass("bigthumb")
				.css({ left: offset.left, top: offset.top, position: "absolute", zIndex: 4 })
				.appendTo(this.parentNode);
			
			var modifier = 1.3;
			var animation = { height: this.offsetHeight*modifier, width: this.offsetWidth*modifier };
			var owidth = (this.offsetWidth+10);
			
			if((offset.left- (owidth*(modifier-1))/2) > 0)
				animation.left = offset.left - (owidth*(modifier-1))/2;
			
			if((offset.left- (owidth*(modifier-1))/2 + owidth*modifier) > this.parentNode.offsetWidth)
				animation.left = offset.left - (owidth*(modifier-1));
			
			if((offset.top- (this.offsetHeight*(modifier-1))/2) > 0)
				animation.top = offset.top - (this.offsetHeight*(modifier-1))/2;
			
			if((offset.top- (this.offsetHeight*(modifier-1))/2 + this.offsetHeight*modifier) > this.parentNode.scrollHeight)
				animation.top = offset.top - (this.offsetHeight*(modifier-1));
			
			node.animate(animation, 500); //Let's use a very fast animation here
			$(this).css("opacity", 0);
			
		}, function() {
			$(this).removeClass("hover");
			$("img.bigthumb").remove();
			$(this).css("opacity", 1);
		})
		.draggable({
			appendTo: "body",
			helper: function() { return $("<div class='draggable'></div>").append($(this).clone().css("opacity", 1))[0]; },
			cursorAt: { top: 10, left: 10 },
			opacity: 0.8
		});
	
	
	//Make albums pseudo-droppable
	$("ul.items a").droppable({
		accept: ".thumb",
		tolerance: "pointer",
		hoverClass: "over"
	});

	//Slider for thumbnails
	var slider = new $.ui.slider($('div.gallery div.slider')[0], { maxValue: 240, startValue: 70, slide: function(e,ui) {
		var rule = getStyleRule("div.gallery div.right img.thumb");
		rule.style.width = (30+ui.value)+"px";
		rule.style.height = ((30+ui.value)*0.75)+"px";
	}});
	
	//Slider supports mousewheel, too!
	$("div.gallery div.slider").mousewheel(function(event, delta) {
		var rule = getStyleRule("div.gallery div.right img.thumb");
		if (delta > 0)
			slider.moveTo(slider.interaction.curValue+10,null,true);
		else if (delta < 0)
			slider.moveTo(slider.interaction.curValue-10,null,true);
	});
	
	//Show first album
	$("div.right:first").show();
	lastContainer = $("div.right:first")[0];
	
	//Fix pngs
	$('#logo, div.handle').ifixpng();

});


function getStyleRule(rule) {
	var rs = document.styleSheets[1].cssRules || document.styleSheets[1].rules;
	for(var i=0;i<rs.length;i++) {
		if(rs[i].selectorText.toLowerCase() == rule.toLowerCase()) return rs[i];	
	}
	return null;
}

var lastContainer = null;
function showContainer(c,e) {
	overlay.container.hide();
	$(lastContainer).fadeOut(300);
	$(c).fadeIn(300); lastContainer = c;
	$("#heading").html(e);
}

var overlay = {
	container: null,
	speed: 500,
	isRunning: false,
	prepare: function(cur) {

		overlay.container.empty().css("opacity", 0.01).show();
		var cw = 729, ch = 545;
	
		//Append header
		$("<div class='head'>go back</div>").bind("click", function() { overlay.container.hide(); }).appendTo(overlay.container);
	
		//Determine next/prev pictures
		var next = ($(cur).next().not(".bigthumb").length) ? $(cur).next()[0]: false;
		var prev = ($(cur).prev().not(".bigthumb").length) ? $(cur).prev()[0]: false;
		
		//Clone the picture (full-sized)
		var img = $("<img class='cur' src='"+cur.src+"' />").attr("src", cur.getAttribute('path')).appendTo("div.gallery div.overlay");
		
		//We cannot display it at full width and height
		$(img).css("width", cw - 220);

		overlay.width = cw - 220;
		overlay.height = $(img).height();
	
		//Position the picture in the middle
		var pos_x = (cw / 2) - ( $(img)[0].offsetWidth / 2 );
		$(img).css({ left: pos_x, top: (ch / 2) - ( $(img)[0].offsetHeight / 2 ) });

		//Create the left hand image
		var img_left = $("<img class='prev' path='"+(prev ? prev.getAttribute('path') : cur.getAttribute('path'))+"' src='"+(prev ? prev.src : cur.src)+"' style='width: 50px;' />").appendTo(overlay.container);
		img_left.css({ left: (pos_x / 2) - ( 50 / 2 ), top: (ch / 2) - ( img_left[0].offsetHeight / 2 ) });
		if(!prev) img_left.css("visibility", "hidden"); else img_left[0].src = prev.getAttribute('path'); //Hide this one if it's only a filler, otherwise lazy load the pic

		//Create the right hand image
		var img_right = $("<img class='next' path='"+(next ? next.getAttribute('path') : cur.getAttribute('path'))+"' src='"+(next ? next.src : cur.src)+"' style='width: 50px;' />").appendTo(overlay.container);
		$(img_right).css({ left: (pos_x+$(img)[0].offsetWidth) + (pos_x / 2) - ( 50 / 2 ), top: (ch / 2) - ( $(img_right)[0].offsetHeight / 2 ) });
		if(!next) img_right.css("visibility", "hidden"); else img_right[0].src = next.getAttribute('path'); //Hide this one if it's only a filler, otherwise lazy load the pic
	
		//This is the transition from thumb to coverflow view
		var pos = $(cur).position();
		pos.top = pos.top + $(cur).parent()[0].scrollTop;

		var cur_clone = $(cur)
			.clone()
			.appendTo($(cur).parent())
			.css(pos)
			.css({ position: "absolute", opacity: 1, visibility: "visible", padding: "5px", marginLeft: "0", marginTop: "0" })
			.animate({ top: (ch / 2) + $(cur).parent()[0].scrollTop - ( $(img)[0].offsetHeight / 2 ), left: pos_x, width: img.width(), height: img.height() }, 500, function() {
				overlay.container.animate({ opacity: 1 },500, function() {
					$("img.clone").remove();
					$("img.thumb").css("visibility", "visible");
				});
			})
			.addClass('clone');
	
	},
	next: function() {
		
		if(overlay.isRunning) return;
		overlay.isRunning = true;
		
		var cur = $("img.cur", overlay.container);
		var next = $("img.next", overlay.container);
		var prev = $("img.prev", overlay.container);
		
		var curLeft = parseInt(cur.css("left"));
		var curNextPosition = [parseInt(next.css("left")),parseInt(next.css("top"))];
		
		//Make the current one small and move it to the 'prev' position
		cur.animate({
			width: 50,
			left: parseInt(prev.css("left")),
			top: parseInt(prev.css("top"))
		}, overlay.speed, function() { window.setTimeout(function() { overlay.isRunning = false; },50); $(this).removeClass("cur").addClass("prev"); });
		
		//Make the previous one vanish (if there is a previous)..
		if(prev.length)
			prev.animate({ width: 0, padding: 0, top: parseInt(prev.css("top")) + (prev[0].offsetHeight / 2) }, overlay.speed, function() {$(this).remove();});
		
		//..and the next one big
		next.animate({ width: overlay.width, top: parseInt(cur.css("top")), left: curLeft }, overlay.speed, function() { $(this).removeClass("next").addClass("cur");  });
		
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
			visibility: upcoming.length ? "visible": "hidden"
		});
		
		if(upcoming.length)
			img_right.animate({ width: 50, top: curNextPosition[1], left: curNextPosition[0] }, overlay.speed, function() { this.src = upcoming[0].getAttribute("path"); });	
		
	},
	prev: function() {
		
		if(overlay.isRunning) return;
		overlay.isRunning = true;
		
		var cur = $("img.cur", overlay.container);
		var next = $("img.next", overlay.container);
		var prev = $("img.prev", overlay.container);
		
		var curLeft = parseInt(cur.css("left"));
		var curPrevPosition = [parseInt(prev.css("left")),parseInt(prev.css("top"))];
		
		//Make the current one small and move it to the 'next' position
		cur.animate({
			width: 50,
			left: parseInt(next.css("left")),
			top: parseInt(next.css("top"))
		}, overlay.speed, function() { window.setTimeout(function() { overlay.isRunning = false; },50); $(this).removeClass("cur").addClass("next"); });
	
		//Make the next one vanish (if there is a previous)..
		if(next.length) {
			next.animate({
				width: 0, padding: 0,
				top: parseInt(next.css("top")) + (next[0].offsetHeight / 2),
				left: parseInt(next.css("left")) + next[0].offsetWidth
			}, overlay.speed, function() { $(this).remove(); });
		}
			
		//..and the previous one big
		prev.animate({ width: overlay.width, top: parseInt(cur.css("top")), left: curLeft }, overlay.speed, function() { $(this).removeClass("prev").addClass("cur");  });
	
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
			visibility: upcoming.length ? "visible": "hidden"
		});
		
		if(upcoming.length)
			img_left.animate({ width: 50, top: curPrevPosition[1] }, overlay.speed, function() { this.src = upcoming[0].getAttribute("path"); });	
	
	}	
}