(function($) {

	/*
	 * Private methods (local scope)
	 */

	$.fx = $.fx || {}; //Add the 'fx' scope
	
	var save = function(el,props) { //function to save and store css properties
		var obj = {}; for(var i in props) obj[i] = el.css(i); return obj;
	};
	
	var queue = {
		add: function(el,obj) {
			if(!$.data(el, 'fx.queue')) $.data(el, 'fx.queue', []); //Add effect queue
			$.data(el, 'fx.queue').push(obj);
		},
		getLast: function(el) {
			return $.data(el, 'fx.queue').length ? $.data(el, 'fx.queue')[$.data(el, 'fx.queue').length-1] : null;
		},
		removeLast: function(el) {
			return $.data(el, 'fx.queue').pop();
		},
		isEmpty: function(el) {
			if(!$.data(el, 'fx.queue')) return true;
			return !$.data(el, 'fx.queue').length;
		}	
	}

	/*
	 * Public methods (jQuery FX scope)
	 */

	$.extend($.fx, {
		findSides: function(el) { //Very nifty function (especially for IE!)
			return [ !!parseInt(el.css("left")) ? "left" : "right", !!parseInt(el.css("top")) ? "top" : "bottom" ];
		},
		undo: function(el, callback) { //The nifty undo function (for modules that use it)
	
			if(queue.isEmpty(el)) return;
			var cur = $(el);
			var set = queue.getLast(el); //Get the last happened animation
	
			set.undo.apply(el, [function() {
				if(callback) callback.apply(this, arguments);
				queue.removeLast(el);
			}]);
			
		},
		animate: function(el, set) { //Our own more abstract animation method
	
				var cur = $(el); cur.stop(); //TODO: Stop to end
				if(cur.css("position") == "static" || cur.css("position") == '') cur.css("position", "relative");
	
				//If we can undo, save it to queue
				if(set.undo && !set.noqueue)
					queue.add(el, { undo: set.undo, speed: set.speed, easing: set.easing });
	
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