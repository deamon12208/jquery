module("batch");

test("batch", function() {
	$.each( ['attr', 'styles', 'offset', 'width', 'height', 'html', 'text', 'val'], function(index, name) {
		ok( $.fn[name], "Make sure " + name + " exists" );
	});
});
test("attrs", function() {
	isSet( $('input[value=Test]').attrs('value'), ["Test", "Test"], "$('input[value=Test]').attrs('value')" );
	isSet( $('input[value=Test]').attrs('value', function(){ return 'Updated'; }).attrs('value'), ["Updated", "Updated"], "$('input[value=Test]').attrs('value', function(){ return 'Updated'; })" );
});