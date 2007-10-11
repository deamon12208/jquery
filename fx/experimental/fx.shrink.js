(function($) {

	//Store some stuff for easy reference later on
	var restoreThis = [
		"width", "height", "fontSize", "left", "top",
		"borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth",
		"paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
		"marginTop", "marginLeft", "marginBottom", "marginRight"
	];
	
	$.fn.grow = function(speed, easing, callback) {
		this.each(function() {

			var el = $(this); if(!$.data(this, 'fx.storage.width')) return;
			
			//Grow the children
			$('*', el).each(function() {
				
				var ani = {};
				if($.data(this, 'fx.storage.width')) ani["width"] = $.data(this, 'fx.storage.width');
				if($.data(this, 'fx.storage.height')) ani["height"] = $.data(this, 'fx.storage.height');
				
				if(!ani["width"] && !ani["height"]) return;
				$(this).animate(ani, speed, easing, function() { $.fx.restore($(this), ["overflow"]); });
				
			});

			//Grow the parent
			el.animate($.fx.restore(el, restoreThis, true), speed, easing, function() {
				$.fx.restore(el, ["overflow"]);
				if(callback) callback.apply(this, arguments);
			});

		});
	}
	
	$.fn.shrink = function(speed, easing, callback) {
		
		this.each(function() {
	
			var el = $(this); $.fx.relativize(el);

			//Shrink the children	
			$('*', el).each(function() {
				var cur = $(this); if(cur.css("width") == "auto" || cur.css("height") == "auto") return; //Don't continue if 'auto' sized element
				$.fx.save(cur, ["width", "height", "overflow"]);				
				$(this).css("overflow", "hidden").animate({ width: 0, height: 0 }, speed, easing);
			});
			

			//Save values to restore them later again
			$.fx.save(el, restoreThis.concat(["overflow"]));
			
			//Shrink the parent
			el.css("overflow", "hidden").animate({
				fontSize: 0, width: 0, height: 0, left: '+='+(el.width() / 2), top: '+='+(el.height() / 2),
				borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0,
				paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0,
				marginTop: 0, marginLeft: 0, marginBottom: 0, marginRight: 0
			}, speed, easing, callback);	
			
		});
		
	}
	
})(jQuery);