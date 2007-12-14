module("batch");

test("batch", function() {
	isSet( $('input[value=Test]').attrs('value'), ["Test", "Test"], "$('input[value=Test]').attrs('value')" );
	isSet( $('input[value=Test]').attrs('value', function(){ return 'Updated'; }).attrs('value'), ["Updated", "Updated"], "$('input[value=Test]').attrs('value', function(){ return 'Updated'; })" );
});