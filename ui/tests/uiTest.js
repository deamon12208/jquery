
function uiTest(testSet) {
	deserializeTests(testSet, $('#tests'), "");
}

$(function() {

	$('body').append('<div id="blackhole"/>');
	$('#blackhole').css({width: 0, height: 0, overflow: 'hidden'});
	$('body').append('<dl id="tests"/>');

});

	function deserializeTests( jsObj, dl, path ) {
		$.each( jsObj, function(name, value) {
			if ( typeof value == 'object' ) {
				dl.append('<dt>' + ((name.length) ? name : '[default]') + '</dt>');
				var dd = $( document.createElement( 'dd' ) ).appendTo( dl );
				var newDl = $( document.createElement( 'dl' ) ).appendTo( dd );
				deserializeTests( value, newDl, path + name + '-' );
			} else {
				dl.append('<dt>' + ((name.length) ? path + name : '[default]') + '</dt>');
				var dd = $( document.createElement( 'dd' ) ).appendTo( dl );
				var link = $( document.createElement( 'a' ) ).appendTo( dd );
				link
					.attr( 'href', '#' )
					.text( value )
					.click(function() {
						$( '#foo-container' ).remove();
						$( '#foo' ).remove();
						$( '#blackhole' ).append( '<div id="foo"/>' );
						$( '#foo' )
							.html( '<pre><code>' + value + '</code></pre>' )
							.prepend( '<div>' + path + ((name.length) ? name : '[default]') + '</div><hr>' );
						$( this ).after( '<div id="foo-container"/' );
						$( '#foo-container' ).append( $( '#foo' ) );
						try {
							eval( value );
						} catch ( err ) {
							var errDl = $(document.createElement('dl')).insertAfter(link);
							$.each(err, function(name, value) {
								errDl.append('<dt>' + name + '</dt>');
								errDl.append('<dd><pre><code>' + value + '</code></pre></dd>');
							});
							link.after('<div class="error">' + err + '</div>');
						} finally {
							return false;
						}
					});
			}
		});
	}
