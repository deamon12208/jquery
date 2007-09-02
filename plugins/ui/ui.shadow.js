(function($) {

	//If the UI scope is not available, add it
	$.ui = $.ui || {};
	
	$.fn.shadow = function(options) {
		
		options = options || {};
		options.offset = options.offset ? options.offset : 0;
		options.opacity = options.opacity ? options.opacity : 0.2;
		
		return this.each(function() {
			
			var cur = $(this);
			
			//Wrap the original element with a shadow element
			cur.wrap("<div class='ui-shadow'></div>");
			var shadow = $(this.parentNode);
			
			//Figure the base height and width
			var baseWidth = cur.outerWidth();
			var baseHeight = cur.outerHeight();
			
			//Append smooth corners
			$('<div class="ui-shadow-color ui-shadow-layer-1"></div>').css({ opacity: options.opacity-0.05, left: 5+options.offset, top: 5+options.offset, width: baseWidth+1, height: baseHeight+1 }).appendTo(shadow);
			$('<div class="ui-shadow-color ui-shadow-layer-2"></div>').css({ opacity: options.opacity-0.1, left: 7+options.offset, top: 7+options.offset, width: baseWidth, height: baseHeight-3 }).appendTo(shadow);
			$('<div class="ui-shadow-color ui-shadow-layer-3"></div>').css({ opacity: options.opacity-0.1, left: 7+options.offset, top: 7+options.offset, width: baseWidth-3, height: baseHeight }).appendTo(shadow);
			$('<div class="ui-shadow-color ui-shadow-layer-4"></div>').css({ opacity: options.opacity, left: 6+options.offset, top: 6+options.offset, width: baseWidth-1, height: baseHeight-1 }).appendTo(shadow);
			
			//If we have a color, use it
			if(options.color)
				$("div.ui-shadow-color", shadow).css("background-color", options.color);
			
			//Copy the original z-index and position to the clone
			shadow.css({
				position: cur.css("position") != "static" ? cur.css("position") : "relative",
				zIndex: cur.css("zIndex"),
				left: cur.css("left"),
				top: cur.css("top"),
				right: cur.css("right"),
				bottom: cur.css("bottom"),
				width: baseWidth,
				height: baseHeight,
				marginLeft: cur.css("marginLeft"),
				marginRight: cur.css("marginRight"),
				marginBottom: cur.css("marginBottom"),
				marginTop: cur.css("marginTop")
			});


			if(cur.css("left") != "auto") shadow.css({ left: cur.css("left") });
			if(cur.css("right") != "auto") shadow.css({ right: cur.css("right") });
			if(cur.css("top") != "auto") shadow.css({ top: cur.css("top") });
			if(cur.css("bottom") != "auto") shadow.css({ bottom: cur.css("bottom") });
			
			//Remove these values from the inner node
			cur.css({
				position: "absolute",
				left: 0,
				top: 0,
				marginLeft: 0,
				marginRight: 0,
				marginBottom: 0,
				marginTop: 0,
				zIndex: 1
			});
				
		});
	};
	

})($);