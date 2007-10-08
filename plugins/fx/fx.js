(function($) {

	$.fx = $.fx || {}; //Add the 'fx' scope

	/*
	 * Public methods (jQuery FX scope)
	 */

	$.extend($.fx, {
		findSides: function(el) { //Very nifty function (especially for IE!)
			return [ !!parseInt(el.css("left")) ? "left" : "right", !!parseInt(el.css("top")) ? "top" : "bottom" ];
		},
		animate: function(el, set) { //Our own more abstract animation method
	
				var cur = $(el); cur.stop(); //TODO: Stop to end
				if(cur.css("position") == "static" || cur.css("position") == '') cur.css("position", "relative");
	
				//Animate
				cur.animate(set.animation, set.speed, set.easing, function() {
					cur.css(set.after);
					if(set.callback) set.callback.apply(this, arguments);
				});
	
		}
	});
	
	//Extend the show/hide method of jQuery
	$.fn.extend({
		_show: $.fn.show,
		_hide: $.fn.hide,
		show: function(obj,speed,callback){
			return typeof obj == 'string' || typeof obj == 'undefined' ?
				this._show(obj, speed) :
				$.fx[obj.method].apply(this, ['show',obj,speed,callback]);
		},
		
		hide: function(obj,speed,callback){
			return typeof obj == 'string' || typeof obj == 'undefined' ?
				this._show(obj, speed) :
				$.fx[obj.method].apply(this, ['hide',obj,speed,callback]);
		}
	});
	
})(jQuery);