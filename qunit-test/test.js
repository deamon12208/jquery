test("module without setup/teardown (default)", function() {
	expect(1);
	ok(true);
});

module("setup/teardown test", {
	setup: function() {
		ok(true);
	},
	teardown: function() {
		ok(true);
	}
});

test("module with setup/teardown", function() {
	expect(3);
	ok(true);
})

module("setup/teardown test 2");

test("module without setup/teardown", function() {
	expect(1);
	ok(true);
});
