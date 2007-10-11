(function($) {

	//Store some stuff for easy reference later on
	var restoreThis = [
		"width", "height", "fontSize", "left", "top",
		"borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth",
		"paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
		"marginTop", "marginLeft", "marginBottom", "marginRight"
	];
	
	$.fx.scale = function(type, set, speed, callback) {

		this.each(function() {

			var el = $(this); $.fx.relativize(el);
			$.fx.save(el, restoreThis.concat(["overflow"])); //Save values to restore them later again

			if(type == "show") {

				//Grow the children
				$('*', el).each(function() {
					var cur = $(this); if(cur.css("width") == "auto" || cur.css("height") == "auto") return; //Don't continue if 'auto' sized element
					$.fx.save(cur, ["width", "height", "overflow"]);  //Store data
					$(this).css({ overflow: 'hidden', width: 0, height: 0 }).animate($.fx.restore(cur, ["width", "height"], true), speed, set.easing, function() { $.fx.restore($(this), ["overflow"]); });
				});
	
				//Grow the parent
				el.css({
					fontSize: 0, width: 0, height: 0, left: (parseInt(el.css("left")) || 0)+(el.width() / 2), top: (parseInt(el.css("top")) || 0)+(el.height() / 2),
					borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0,
					paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0,
					marginTop: 0, marginLeft: 0, marginBottom: 0, marginRight: 0
				});
				
				el.css("overflow", "hidden").animate($.fx.restore(el, restoreThis, true), speed, set.easing, function() {
					$.fx.restore(el, ["overflow"]);
					if(callback) callback.apply(this, arguments);
				});

			} else {

				//Shrink the children	
				$('*', el).each(function() {
					var cur = $(this); if(cur.css("width") == "auto" || cur.css("height") == "auto") return; //Don't continue if 'auto' sized element
					$.fx.save(cur, ["width", "height", "overflow"]);				
					$(this).css("overflow", "hidden").animate({ width: 0, height: 0 }, speed, set.easing, function() { $.fx.restore($(this), ["width", "height", "overflow"]); });
				});

				//Shrink the parent
				el.css("overflow", "hidden").animate({
					fontSize: 0, width: 0, height: 0, left: '+='+(el.width() / 2), top: '+='+(el.height() / 2),
					borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0,
					paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0,
					marginTop: 0, marginLeft: 0, marginBottom: 0, marginRight: 0
				}, speed, set.easing, function() {
					el.hide(); $.fx.restore(el, restoreThis.concat(["overflow"])); //Hide and restore properties
					if(callback) callback.apply(this, arguments);
				});

			}

		});

	}

})(jQuery);