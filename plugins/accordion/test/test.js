jQuery.Accordion.defaults.animated = false;

// TODO refactor to define a single assertion method that checks the accordion state, eg. 0, 1, 0 expects the second part to be open, others closed

test("basics", function() {
	$('#list1').Accordion();
	ok( $('#list1 h3:last').is(':visible'), 'Last h3 inside accordion must be hidden' );
	ok( $('#list1 p:last').is(':hidden'), 'Last p inside accordion must be hidden' );
});

test("options: active, numeric", function() {
	$('#list1').Accordion({
		active: 1
	});
	ok( $('#list1 p:first').is(':hidden'), 'First p inside accordion must be hidden, second was activated' );
	ok( $('#list1 p:eq(1)').is(':visible'), 'Second p inside accordion must be visible, was activated' );
});

test("activate, numeric", function() {
	$('#list1').Accordion().activate(2);
	ok( $('#list1 p:first').is(':hidden') );
	ok( $('#list1 p:last').is(':visible') );
});