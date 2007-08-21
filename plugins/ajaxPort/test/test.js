test("basics", function() {
	expect(1);
	stop();
	for(var i=0; i < 3; i++) {
		$.ajax({
			port: "test",
			url: "test.php",
			data: { x: i },
			success: function(response) {
				equals( 2, response );
				start();
			}
		});
	}
});
