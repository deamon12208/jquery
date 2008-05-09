/*! Copyright (c) 2007 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate$
 * $Rev$
 *
 * Version: 1.0
 */
(function($){

$.fn.batch = function(method) {
	var args = $.makeArray(arguments).slice(1);
	return this.map(function() {
		var $this = $(this);
		return $this[method].apply($this, args);
	});
};

$.batch = {
	version: "1.0",
	registerPlugin: function() {
		$.each( arguments, function( index, plugin ) {
			var method = plugin.constructor == Array && plugin[0] || plugin,
				newMethod = plugin.constructor == Array && plugin[1] || plugin+"s";
			if ( $.fn[ method ] && !$.fn[ newMethod ] )
				$.fn[ newMethod ] = function() {
					return this.batch.apply( this, [ method ].concat( $.makeArray(arguments) ) );
				};
		});
	}
};

$.batch.registerPlugin( 'attr', ['css','styles'], 'offset', 'width', 'height', 'html', 'text', 'val' );

})(jQuery);