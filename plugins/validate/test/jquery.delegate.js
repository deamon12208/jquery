// provides a cross-browser focusin event
// IE has native support, in other browsers, capture a focus event (doesn't bubble)

// provides delegate(type, delegate, handler) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jQuery-object for event.target 
;(function($) {
	$.extend($.event.special, {
		focusin: {
			setup: function() {
				if ($.browser.msie)
					return false;
				this.addEventListener("focus", $.event.special.focusin.handler, true);
			},
			teardown: function() {
				if ($.browser.msie)
					return false;
				this.removeEventListener("focus", $.event.special.focusin.handler, true);
			},
			handler: function(event) {
				var args = Array.prototype.slice.call( arguments, 1 );
				args.unshift($.extend($.event.fix(event), { type: "focusin" }));
				return $.event.handle.apply(this, args);
			}
		}
	});
	$.extend($.fn, {
		delegate: function(type, delegate, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	})
})(jQuery);
