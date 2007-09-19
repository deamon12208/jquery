(function($) {

	$.ui = $.ui || {};
	$.ui.effects = {};
	$.fn.effect = function(fx,o) {
		if($.ui.effects[fx])
			this.each(function() { $.ui.effects[fx].apply(this, [o]); });
	}

	$.ui.effects['transfer'] = function(o) {
		
		var target = $(o.target);
		var self = this;
		var dir = o.direction ? o.direction : 'to';
		
		if(dir == 'to') {
			var opos = $(this).offset({ border: false, margin: false });
			var npos = target.offset({ border: false, margin: true });
		} else {
			var npos = $(this).offset({ border: false, margin: false });
			var opos = target.offset({ border: false, margin: true });
		}
		
		var el = $(this).clone().appendTo('body').css({
			position: 'absolute',
			top: opos.top+'px',
			left: opos.left+'px'	
		});
		
		if(dir == 'from') {
			el.css({ height: target[0].offsetHeight+'px', width: target[0].offsetWidth+'px' });
		}
		
		el.animate({
			top: npos.top,
			left: npos.left,
			height: dir == 'to' ? target[0].offsetHeight : $(self)[0].offsetHeight,
			width: 	dir == 'to' ? target[0].offsetWidth : $(self)[0].offsetWidth
		}, o.duration ? o.duration : 500, function() {
				$(this).remove();
				if(o.onFinish) o.onFinish.call(self);
		});
	
		if(o.hideOriginals) $(this).css("visibility", "hidden");
	};

	$.ui.effects['shrink'] = function(o) {
		o = o || {};
		var duration = o.duration || 500;
		var $self = $(this);

		//var newTop = offset.top + $self.height()/2;
		//var newLeft = offset.left + $self.width()/2;
		var $clone;
		if($self.css('position') != 'absolute') {
			var offset = $self.offset();
			$clone = $self.clone().css({visibility: 'hidden'});
			$clone.insertAfter($self);
			$self.css({
				position: 'absolute',
				top: offset.top-parseInt($self.css('marginTop')),
				left: offset.left-parseInt($self.css('marginLeft'))
			});
		}
		$self.animate({
			top: '+=' + $self.height()/2,
			left: '+=' + $self.width()/2,
			width: 0,
			height: 0
		}, duration, function() {
			$self.hide();
			if($clone) {
				$clone.remove();
			}
			if($.isFunction(o.onFinish)) {
				o.onFinish.call($self);
			}
		}).children().animate({width: 0, height: 0}, duration);
	};

})(jQuery);
