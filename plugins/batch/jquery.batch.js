/* Copyright (c) 2007 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate$
 * $Rev$
 *
 * Version: @VERSION
 */
(function($){

$.fn.batch = function(method) {
	var args = $.makeArray(arguments).slice(1);
	return this.map(function() {
		var $this = $(this);
		return $this[method].apply($this, args);
	});
};

$.each( "attr css offset width height html text val".split(" "), function(index, method) {
	$.fn[method+"s"] = function() {
		return this.batch.apply( this, [method].concat( $.makeArray(arguments) ) );
	};
});

})(jQuery);