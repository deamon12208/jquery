(function($) {

	//If the UI scope is not available, add it
	$.ui = $.ui || {};
	
	$.fn.shadow = function(options) {
		
		options = options || {};
		options.offset = options.offset ? Math.round(options.offset/2) : 0;
		
		return this.each(function() {
			
			var cur = $(this);
			
			//Wrap the original element with a shadow element
			cur.wrap("<div class='ui-shadow'></div>");
			var shadow = $(this.parentNode);
			
			//Append smooth corners
			$('<div class="ui-shadow-ne"></div>').css("width", 6+(options.offset*2)).appendTo(shadow);
			$('<div class="ui-shadow-sw"></div>').css("height", 6+(options.offset*2)).appendTo(shadow);
			
			//Copy the original z-index and position to the clone
			shadow.css({
				position: cur.css("position") != "static" ? cur.css("position") : "relative",
				zIndex: cur.css("zIndex"),
				left: cur.css("left"),
				top: cur.css("top"),
				right: cur.css("right"),
				bottom: cur.css("bottom"),
				width: cur.outerWidth()+options.offset,
				height: cur.outerHeight()+options.offset,
				marginLeft: cur.css("marginLeft"),
				marginRight: cur.css("marginRight"),
				marginBottom: cur.css("marginBottom"),
				marginTop: cur.css("marginTop")
			});
			
			//Remove these values from the inner node
			cur.css({
				position: "relative",
				left: -6-options.offset,
				top: -6-options.offset,
				right: 0,
				bottom: 0,
				marginLeft: 0,
				marginRight: 0,
				marginBottom: 0,
				marginTop: 0
			});
				
		});
	};
	

})($);