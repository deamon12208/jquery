$.fn.triggerKeydown = function(keyCode) {
	return this.trigger("keydown", [$.event.fix({event:"keydown", keyCode: keyCode, target: this[0]})]);
}

function assertChange(stepping, start, result, action) {
	return function() {
		expect(1);
		var slider = $("#slider3").slider({
			stepping: stepping,
			startValue: start,
			change: function(e, ui) {
				equals(ui.value, result, "changed to " + ui.value);
			}
		});
		action.apply(slider);
	}
}

module("single handle")

test("change one step via keydown", assertChange(1, undefined, 1, function() {
	this.find("a").triggerKeydown("39");
}))
test("change - 10 steps via keydown", assertChange(10, 20, 10, function() {
	this.find("a").triggerKeydown("37");
}))
test("change +10 steps via keydown", assertChange(10, 20, 30, function() {
	this.find("a").triggerKeydown("39");
}))

test("moveTo, absolute value", assertChange(1, 1, 10, function() {
	this.slider("moveTo", 10);
}))

test("moveTo, absolute value as string", assertChange(1, 1, 10, function() {
	this.slider("moveTo", "10");
}))

test("moveTo, absolute value, below min", assertChange(1, 1, 0, function() {
	this.slider("moveTo", -10);
}))

test("moveTo, relative positive value", assertChange(1, 1, 11, function() {
	this.slider("moveTo", "+=10");
}))

test("moveTo, relative positive value, above max", assertChange(1, 10, 100, function() {
	this.slider("moveTo", "+=200");
}))

test("moveTo, relative negative value", assertChange(1, 20, 10, function() {
	this.slider("moveTo", "-=10");
}))

test("options update min/max", function() {
	//expect(1);
	var slider = $("#slider3").slider({
		stepping: 1,
		startValue: 1,
		minValue: 0,
		maxValue: 100,
		change: function(e, ui) {
			//equals(ui.value, result, "changed to " + ui.value);
		}
	});
	slider.slider("moveTo", "-=10");
	equals(slider.slider("value"), 0);
	slider.data("minValue.slider", -10);
	slider.slider("moveTo", "-=20");
	equals(slider.slider("value"), -10);
})

test("destroy and recreate", function() {
	var slider = $("#slider3").slider();
	slider.slider("moveTo", "+=20");
	equals(slider.slider("value"), 20);
	slider.slider("destroy");
	try {
		slider.slider("moveTo", "+=30");
		ok(false, "must throw error when destroyed");
	} catch(e) {
		ok(true, "can't move a destroyed slider");
	}
	slider.slider().slider("moveTo", "30");
	
	equals(Math.round(slider.slider("value")), 30);
	
})