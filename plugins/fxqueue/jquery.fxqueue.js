/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net || brandon.aaron@gmail.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: TOTALLY ALPHA
 *
 * $LastChangedDate$
 * $Rev$
 */

(function($){

/**
 * Call just like Animate except all params are required.
 *
 * @name fxqueue
 */
$.fn.fxqueue = function(prop, speed, easing, callback) {
	return this.each(function() {
		var fn = function() { $.fxqueue.next(); if (callback) callback(); }
		$.fxqueue.queue.push([this, prop, speed, easing, fn]);
		$.fxqueue.play();
	});
};

$.fxqueue = {
	queue: [],
	current: 0,
	next: function() {
		if (!$.fxqueue.queue[$.fxqueue.current]) return;
		var $this = $( $.fxqueue.queue[$.fxqueue.current].shift() ),
		    args = $.fxqueue.queue[$.fxqueue.current];
		$.fn.animate.apply($this, args);
		$.fxqueue.current++;
	},
	play: function() {
		if ($.fxqueue.playing) return;
		else $.fxqueue.playing = true;
		$.fxqueue.next();
	}
};
	
})(jQuery);