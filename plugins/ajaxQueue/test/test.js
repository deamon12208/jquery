test("mode: abort", function() {
	expect(1);
	stop();
	for(var i=0; i < 3; i++) {
		$.ajax({
			mode: "abort",
			url: "test.php",
			data: { x: i },
			success: function(response) {
				equals( 2, response );
				start();
			}
		});
	}
});

test("mode: abort, with ports", function() {
	expect(2);
	stop();
	var test = 0;
	for(var i=0; i < 3; i++) { (function() {
		var x = i;
		$.ajax({
			port: "test" + (i % 2),
			mode: "abort",
			url: "test.php",
			data: { x: i },
			success: function(response) {
				equals( x, response );
				test += +response;
				if ( test == 3 )
					start();
			}
		});
	})()}
});

test("mode: queue", function() {
	expect(3);
	stop();
	var test = 0;
	for(var i=0; i < 3; i++) {
		$.ajax({
			mode: "queue",
			url: "test.php",
			data: { x: i },
			success: function(response) {
				equals( response, test++);
				if(response == 2)
					start();
			}
		});
	}
});

test("mode: sync", function() {
	expect(4);
	stop();
	var test = 0;
	for(var i=0; i < 3; i++) {
		var request = $.ajax({
			mode: "sync",
			url: "test.php",
			data: { x: i },
			async: i != 0,
			success: function(response) {
				equals( response, test++);
				if(response == 2)
					start();
			}
		});
	}
	equals( 0, test );
});