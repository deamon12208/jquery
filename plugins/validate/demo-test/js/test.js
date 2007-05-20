test("rule: digit", function() {
	var rule = $.validator.methods.digits;
	var element = $("#firstname")[0];
	ok( rule("123", element), "Valid digits" );
	ok(!rule("123.000", element), "Invalid digits" );
	ok(!rule("123.000,00", element), "Invalid digits" );
	ok(!rule("123.0.0,0", element), "Invalid digits" );
	ok(!rule("x123", element), "Invalid digits" );
	ok(!rule("100.100,0,0", element), "Invalid digits" );
});

test("rule: url", function() {
	var rule = $.validator.methods.url;
	var element = $("#firstname")[0];
	ok( rule("http://bassistance.de/jquery/plugin.php?bla=blu", element), "Valid url" );
	ok( rule("https://bassistance.de/jquery/plugin.php?bla=blu", element), "Valid url" );
	ok( rule("ftp://bassistance.de/jquery/plugin.php?bla=blu", element), "Valid url" );
	ok( rule("http://bassistance", element), "Valid url" );
	ok(!rule("http://bassistance.", element), "Invalid url" );
	ok(!rule("bassistance.de", element), "Invalid url" );
});

test("rule: email", function() {
	var rule = $.validator.methods.email;
	var element = $("#firstname")[0];
	ok( rule("name@domain.tld", element), "Valid email" );
	ok( rule("name@domain.tl", element), "Valid email" );
	ok( rule("n@d.tld", element), "Valid email" );
	ok(!rule("name", element), "Invalid email" );
	ok(!rule("name@", element), "Invalid email" );
	ok(!rule("name@domain", element), "Invalid email" );
	ok(!rule("name@domain.t", element), "Invalid email" );
	ok(!rule("name@domain.tldef", element), "Invalid email" );
});

test("rule: number", function() {
	var rule = $.validator.methods.number;
	var element = $("#firstname")[0];
	ok( rule("123", element), "Valid number" );
	ok( rule("-123", element), "Valid number" );
	ok( rule("123,000", element), "Valid number" );
	ok( rule("-123,000", element), "Valid number" );
	ok( rule("123,000.00", element), "Valid number" );
	ok( rule("-123,000.00", element), "Valid number" );
	ok(!rule("123.000,00", element), "Invalid number" );
	ok(!rule("123.0.0,0", element), "Invalid number" );
	ok(!rule("x123", element), "Invalid number" );
	ok(!rule("100.100,0,0", element), "Invalid number" );
});

test("rule: numberDE", function() {
	var rule = $.validator.methods.numberDE;
	var element = $("#firstname")[0];
	ok( rule("123", element), "Valid numberDE" );
	ok( rule("-123", element), "Valid numberDE" );
	ok( rule("123.000", element), "Valid numberDE" );
	ok( rule("-123.000", element), "Valid numberDE" );
	ok( rule("123.000,00", element), "Valid numberDE" );
	ok( rule("-123.000,00", element), "Valid numberDE" );
	ok(!rule("123,000.00", element), "Invalid numberDE" );
	ok(!rule("123,0,0.0", element), "Invalid numberDE" );
	ok(!rule("x123", element), "Invalid numberDE" );
	ok(!rule("100,100.0.0", element), "Invalid numberDE" );
});

test("rule: date", function() {
	var rule = $.validator.methods.date;
	var element = $("#firstname")[0];
	ok( rule("06/06/1990", element), "Valid date" );
	ok( rule("6/6/06", element), "Valid date" );
	ok(!rule("1990x-06-06", element), "Invalid date" );
});

test("rule: dateISO", function() {
	var rule = $.validator.methods.dateISO;
	var element = $("#firstname")[0];
	ok( rule("1990-06-06", element), "Valid date" );
	ok( rule("1990/06/06", element), "Valid date" );
	ok( rule("1990-6-6", element), "Valid date" );
	ok( rule("1990/6/6", element), "Valid date" );
	ok(!rule("1990-106-06", element), "Invalid date" );
	ok(!rule("190-06-06", element), "Invalid date" );
});

test("rule: dateDE", function() {
	var rule = $.validator.methods.dateDE;
	var element = $("#firstname")[0];
	ok( rule("03.06.1984", element), "Valid dateDE" );
	ok( rule("3.6.84", element), "Valid dateDE" );
	ok(!rule("6-6-06", element), "Invalid dateDE" );
	ok(!rule("1990-06-06", element), "Invalid dateDE" );
	ok(!rule("06/06/1990", element), "Invalid dateDE" );
	ok(!rule("6/6/06", element), "Invalid dateDE" );
});

test("rule: required", function() {
	var rule = $.validator.methods.required;
		e = $('#text1, #hidden2, #select1, #select2');
	ok( rule(e[0].value, e[0]), "Valid text input" );
	ok(!rule(e[1].value, e[1]), "Invalid text input" );
	ok(!rule(e[2].value, e[2]), "Invalid select" );
	ok( rule(e[3].value, e[3]), "Valid select" );
	
	e = $('#area1, #area2, #pw1, #pw2');
	ok( rule(e[0].value, e[0]), "Valid textarea" );
	ok(!rule(e[1].value, e[1]), "Invalid textarea" );
	ok( rule(e[2].value, e[2]), "Valid password input" );
	ok(!rule(e[3].value, e[3]), "Invalid password input" );
	
	e = $('#radio1, #radio2, #radio3');
	ok(!rule(e[0].value, e[0]), "Invalid radio" );
	ok( rule(e[1].value, e[1]), "Valid radio" );
	ok( rule(e[2].value, e[2]), "Valid radio" );
	
	e = $('#check1, #check2');
	ok( rule(e[0].value, e[0]), "Valid checkbox" );
	ok(!rule(e[1].value, e[1]), "Invalid checkbox" );
	
	e = $('#select1, #select2, #select3, #select4');
	ok(!rule(e[0].value, e[0]), "Invalid select" );
	ok( rule(e[1].value, e[1]), "Valid select" );
	ok( rule(e[2].value, e[2]), "Valid select" );
	ok( rule(e[3].value, e[3]), "Valid select" );
});

test("rule: required with dependencies", function() {
	var rule = $.validator.methods.required;
    	e = $('#hidden2, #select1, #area2, #radio1, #check2');
	ok( rule(e[0].value, e[0], "asffsaa"), "Valid text input due to depencie not met" );
	ok(!rule(e[0].value, e[0], "input"), "Invalid text input" );
	ok( rule(e[0].value, e[0], function() { return false; }), "Valid text input due to depencie not met" );
	ok(!rule(e[0].value, e[0], function() { return true; }), "Invalid text input" );
	ok( rule(e[1].value, e[1], "asfsfa"), "Valid select due to dependency not met" );
	ok(!rule(e[1].value, e[1], "input"), "Invalid select" );
	ok( rule(e[2].value, e[2], "asfsafsfa"), "Valid textarea due to dependency not met" );
	ok(!rule(e[2].value, e[2], "input"), "Invalid textarea" );
	ok( rule(e[3].value, e[3], "asfsafsfa"), "Valid radio due to dependency not met" );
	ok(!rule(e[3].value, e[3], "input"), "Invalid radio" );
	ok( rule(e[4].value, e[4], "asfsafsfa"), "Valid checkbox due to dependency not met" );
	ok(!rule(e[4].value, e[4], "input"), "Invalid checkbox" );
});

test("rule: minLength", function() {
	var rule = $.validator.methods.minLength,
		param = 2,
		e = $('#text1, #text2, #text3');
	ok( rule(e[0].value, e[0], param), "Valid text input" );
	ok(!rule(e[1].value, e[1], param), "Invalid text input" );
	ok( rule(e[2].value, e[2], param), "Valid text input" );
	
	e = $('#check1, #check2, #check3');
	ok(!rule(e[0].value, e[0], param), "Valid checkbox" );
	ok( rule(e[1].value, e[1], param), "Valid checkbox" );
	ok( rule(e[2].value, e[2], param), "Invalid checkbox" );
	
	e = $('#select1, #select2, #select3, #select4, #select5');
	ok(rule(e[0].value, e[0], param), "Valid select" );
	ok(!rule(e[1].value, e[1], param), "Invalid select" );
	ok( rule(e[2].value, e[2], param), "Valid select" );
	ok( rule(e[3].value, e[3], param), "Valid select" );
	ok( rule(e[3].value, e[3], param), "Valid select" );
});

test("rule: maxLength", function() {
	var rule = $.validator.methods.maxLength,
		param = 4,
		e = $('#text1, #text2, #text3');
	ok( rule(e[0].value, e[0], param), "Valid text input" );
	ok( rule(e[1].value, e[1], param), "Valid text input" );
	ok(!rule(e[2].value, e[2], param), "Invalid text input" );
	
	e = $('#check1, #check2, #check3');
	ok( rule(e[0].value, e[0], param), "Valid checkbox" );
	ok( rule(e[1].value, e[1], param), "Invalid checkbox" );
	ok(!rule(e[2].value, e[2], param), "Invalid checkbox" );
	
	e = $('#select1, #select2, #select3, #select4');
	ok( rule(e[0].value, e[0], param), "Valid select" );
	ok( rule(e[1].value, e[1], param), "Valid select" );
	ok( rule(e[2].value, e[2], param), "Valid select" );
	ok(!rule(e[3].value, e[3], param), "Invalid select" );
});

test("rule: rangeLength", function() {
	var rule = $.validator.methods.rangeLength,
		param = [2, 4],
		e = $('#text1, #text2, #text3');
	ok( rule(e[0].value, e[0], param), "Valid text input" );
	ok(!rule(e[1].value, e[1], param), "Invalid text input" );
	ok(!rule(e[2].value, e[2], param), "Invalid text input" );
});

test("rule: minValue", function() {
	var rule = $.validator.methods.minValue,
		param = 8,
		e = $('#value1, #value2, #value3');
	ok(!rule(e[0].value, e[0], param), "Invalid text input" );
	ok( rule(e[1].value, e[1], param), "Valid text input" );
	ok( rule(e[2].value, e[2], param), "Valid text input" );
});

test("rule: maxValue", function() {
	var rule = $.validator.methods.maxValue,
		param = 12,
		e = $('#value1, #value2, #value3');
	ok( rule(e[0].value, e[0], param), "Valid text input" );
	ok( rule(e[1].value, e[1], param), "Valid text input" );
	ok(!rule(e[2].value, e[2], param), "Invalid text input" );
});

test("rule: rangeValue", function() {
	var rule = $.validator.methods.rangeValue,
		param = [4,12],
		e = $('#value1, #value2, #value3');
	ok(!rule(e[0].value, e[0], param), "Invalid text input" );
	ok( rule(e[1].value, e[1], param), "Valid text input" );
	ok(!rule(e[2].value, e[2], param), "Invalid text input" );
});

test("rule: equalTo", function() {
	var rule = $.validator.methods.equalTo,
		e = $('#text1, #text2');
	ok( rule("Test", e[0], "#text1"), "Text input" );
	ok( rule("T", e[1], "#text2"), "Another one" );
});


test("method default messages", function() {
	var m = $.validator.methods;
	$.each(m, function(key) {
		ok( jQuery.validator.messages[key], key + " has a default message." );
	});
});

test("$.validator.addMethod", function() {
	expect( 3 );
	$.validator.addMethod("hi", function(value) {
		return value == "hi";
	}, "hi me too");
	var rule = $.validator.methods.hi;
		e = $('#text1')[0];
	ok( !rule(e.value, e), "Invalid" );
	e.value = "hi";
	ok( rule(e.value, e), "Invalid" );
	ok( jQuery.validator.messages.hi == "hi me too", "Check custom message" );
});

test("validator.form(): simple", function() {
	expect( 2 );
	var form = $('#testForm1')[0];
	var v = $(form).validate();
	ok( !v.form(), 'Invalid form' );
	$('#firstname').val("hi");
	$('#lastname').val("hi");
	ok( v.form(), 'Valid form' );
});

test("validator.form(): checkboxes: min/required", function() {
	expect( 3 );
	var form = $('#testForm6')[0];
	var v = $(form).validate();
	ok( !v.form(), 'Invalid form' );
	$('#form6check1').attr("checked", true);
	ok( !v.form(), 'Invalid form' );
	$('#form6check2').attr("checked", true);
	ok( v.form(), 'Valid form' );
});
test("validator.form(): selects: min/required", function() {
	expect( 3 );
	var form = $('#testForm7')[0];
	var v = $(form).validate();
	ok( !v.form(), 'Invalid form' );
	$("#optionxa").attr("selected", true);
	ok( !v.form(), 'Invalid form' );
	$("#optionxb").attr("selected", true);
	ok( v.form(), 'Valid form' );
});

test("validator.form(): with equalTo", function() {
	expect( 2 );
	var form = $('#testForm5')[0];
	var v = $(form).validate();
	ok( !v.form(), 'Invalid form' );
	$('#x1, #x2').val("hi");
	ok( v.form(), 'Valid form' );
});

test("validator.check(): simple", function() {
	expect( 3 );
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate();
	ok( v.errorList.length == 0, 'No errors yet' );
	v.check(element);
	ok( v.errorList.length == 1, 'error exists' );
	v.errorList = [];
	$('#firstname').val("hi");
	v.check(element);
	ok( !v.errorList.length == 1, 'No more errors' );
});

test("validator.hide(): input", function() {
	expect( 3 );
	var errorLabel = $('#errorFirstname');
	var element = $('#firstname')[0];
	element.value ="bla";
	var v = $('#testForm1').validate();
	errorLabel.show();
	ok( errorLabel.is(":visible"), "Error label visible before validation" );
	ok( v.element(element) );
	ok( errorLabel.is(":hidden"), "Error label not visible after validation" );
});

test("validator.hide(): radio", function() {
	expect( 2 );
	var errorLabel = $('#agreeLabel');
	var element = $('#agb')[0];
	element.checked = true;
	var v = $('#testForm2').validate({ errorClass: "xerror" });
	errorLabel.show();
	ok( errorLabel.is(":visible"), "Error label visible after validation" );
	v.element(element);
	ok( errorLabel.is(":hidden"), "Error label not visible after hiding it" );
});

test("validator.hide(): errorWrapper", function() {
	expect(2);
	var errorLabel = $('#errorWrapper');
	var element = $('#meal')[0];
	element.selectedIndex = 1;
	
	errorLabel.show();
	ok( errorLabel.is(":visible"), "Error label visible after validation" );
	var v = $('#testForm3').validate({ wrapper: "li", errorLabelContainer: $("#errorContainer") });
	v.element(element);
	ok( errorLabel.is(":hidden"), "Error label not visible after hiding it" );
});

test("validator.hide(): container", function() {
	expect(3);
	var errorLabel = $('#errorContainer');
	var element = $('#testForm3')[0];
	ok( errorLabel.is(":hidden"), "Error label not visible at start" );
	var v = $('#testForm3').validate({ errorWrapper: "li", errorContainer: $("#errorContainer") });
	v.form();
	ok( errorLabel.is(":visible"), "Error label visible after validation" );
	$('#meal')[0].selectedIndex = 1;
	v.form();
	ok( errorLabel.is(":hidden"), "Error label not visible after hiding it" );
});

test("validator.valid()", function() {
	expect(4);
	var errorList = [{name:"meal",message:"foo", element:$("#meal")[0]}];
	var v = $('#testForm3').validate();
	ok( v.valid(), "No errors, must be valid" );
	v.errorList = errorList;
	ok( !v.valid(), "One error, must be invalid" );
	v = $('#testForm3').validate({ submitHandler: function() {
		ok( false, "Submit handler was called" );
	}});
	ok( v.valid(), "No errors, must be valid and returning true, even with the submit handler" );
	v.errorList = errorList;
	ok( !v.valid(), "One error, must be invalid, no call to submit handler" );
});

test("validator.showErrors()", function() {
	expect( 4 );
	var errorLabel = $('#errorFirstname').hide();
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate();
	ok( errorLabel.is(":hidden") );
	equals( 0, $("label.error[@for=lastname]").size() );
	v.showErrors({"firstname": "required", "lastname": "bla"});
	equals( true, errorLabel.is(":visible") );
	equals( true, $("label.error[@for=lastname]").is(":visible") );
});

test("validator.showErrors() - external messages", function() {
	expect( 4 );
	$.validator.addMethod("foo", function() { return false; });
	$.validator.addMethod("bar", function() { return false; });
	equals( 0, $("#testForm4 label.error[@for=f1]").size() );
	equals( 0, $("#testForm4 label.error[@for=f2]").size() );
	var form = $('#testForm4')[0];
	var v = $(form).validate({
		messages: {
			f1: "Please!",
			f2: "Wohoo!"
		}
	});
	v.form();
	equals( "Please!", $("#testForm4 label.error[@for=f1]").text() );
	equals( "Wohoo!", $("#testForm4 label.error[@for=f2]").text() );
});

test("validator.showErrors() - custom handler", function() {
	expect(3);
	var v = $('#testForm1').validate({
		showErrors: function(errors, validator) {
			equals( v, validator );
			equals( "buga", errors.firstname );
			equals( "buga", errors.lastname );
		}
	});
	v.form();
});


test("validator.rules() - internal - input", function() {
	expect(4);
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate();
	var rule = v.rules(element);
	equals( "required", rule[0].method );
	equals( true, rule[0].parameters );
	equals( "minLength", rule[1].method );
	equals( 2, rule[1].parameters );
});

test("validator.rules() - internal - select", function() {
	expect(2);
	var element = $('#meal')[0];
	var v = $('#testForm3').validate();
	var rule = v.rules(element);
	// fails in opera, bug is reported
	equals( "required", rule[0].method );
	ok( rule[0].parameters );
});

test("validator.rules() - external", function() {
	expect( 4 );
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate({
		rules: {
			firstname: {date: true, min: 5}
		}
	});
	var rule = v.rules(element);
	equals( "date", rule[0].method );
	ok( rule[0].parameters );
	equals( "min", rule[1].method );
	equals( 5, rule[1].parameters );
});

test("validator.rules() - external - complete form", function() {
	expect(1);
	$.validator.addMethod("verifyTest", function() {
		ok( true, "method executed" );
		return true;
	});
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate({
		rules: {
			firstname: {verifyTest: true}
		}
	});
	v.form();
});

test("validator.rules() - internal - input", function() {
	expect(7);
	var element = $('#form8input')[0];
	var v = $('#testForm8').validate();
	var rule = v.rules(element);
	equals( "required", rule[0].method );
	equals( true, rule[0].parameters );
	equals( "number", rule[1].method );
	equals( true, rule[1].parameters );
	equals( "rangeLength", rule[2].method );
	equals( 2, rule[2].parameters[0] );
	equals( 8, rule[2].parameters[1] );
});

test("validator.formatAndAdd", function() {
	expect(4);
	var v = $("#form").validate();
	var fakeElement = { form: { id: "foo" }, name: "bar" };
	jQuery.validator.messages.test1 = "Please enter a value no longer then {0} characters.";
	jQuery.validator.messages.test2 = "Please enter a value between {0} and {1}.";
	v.formatAndAdd({method: "test1", parameters: 2}, fakeElement)
	equals( "Please enter a value no longer then 2 characters.", v.errorList[0].message );
	equals( "bar", v.errorList[0].element.name );
	
	v.formatAndAdd({method: "test2", parameters:[2,4]}, fakeElement)
	equals( "Please enter a value between 2 and 4.", v.errorList[1].message );
	
	v.formatAndAdd({method: "test2", parameters:[0,4]}, fakeElement)
	equals( "Please enter a value between 0 and 4.", v.errorList[2].message );
});

test("error containers, simple", function() {
	expect(12);
	var container = $("#simplecontainer");
	var v = $("#form").validate({
		errorLabelContainer: container
	});
	
	v.prepareForm();
	ok( v.valid(), "form is valid" );
	equals( 0, container.find("label").length, "There should be no error labels" );
	
	v.prepareForm();
	v.errorList = [{message:"bar", element: {name:"foo"}}, {message: "necessary", element: {name:"required"}}];
	ok( !v.valid(), "form is not valid after adding errors manually" );
	equals( 2, container.find("label").length, "There should be two error labels" );
	ok( container.is(":visible"), "Check that the container is visible" );
	container.find("label").each(function() {
		ok( $(this).is(":visible"), "Check that each label is visible" );
	});
	
	v.prepareForm();
	ok( v.valid(), "form is not valid after adding errors manually" );
	equals( 2, container.find("label").length, "There should still be two error labels" );
	ok( container.is(":hidden"), "Check that the container is hidden" );
	container.find("label").each(function() {
		ok( $(this).is(":hidden"), "Check that each label is hidden" );
	});
});

test("error containers, with labelcontainer", function() {
	expect(28);
	var container = $("#container"),
		labelcontainer = $("#labelcontainer");
	var v = $("#form").validate({
		errorContainer: container,
		errorLabelContainer: labelcontainer,
		wrapper: "li"
	});
	
	v.prepareForm();
	ok( v.valid(), "form is valid" );
	equals( 0, container.find("label").length, "There should be no error labels in the container" );
	equals( 0, labelcontainer.find("label").length, "There should be no error labels in the labelcontainer" );
	equals( 0, labelcontainer.find("li").length, "There should be no lis labels in the labelcontainer" );
	
	v.prepareForm();
	v.errorList = [{message:"bar", element: {name:"foo"}}, {name: "required", message: "necessary", element: {name:"required"}}];
	ok( !v.valid(), "form is not valid after adding errors manually" );
	equals( 0, container.find("label").length, "There should be no error label in the container" );
	equals( 2, labelcontainer.find("label").length, "There should be two error labels in the labelcontainer" );
	equals( 2, labelcontainer.find("li").length, "There should be two error lis in the labelcontainer" );
	ok( container.is(":visible"), "Check that the container is visible" );
	ok( labelcontainer.is(":visible"), "Check that the labelcontainer is visible" );
	labelcontainer.find("label").each(function() {
		ok( $(this).is(":visible"), "Check that each label is visible" );
		equals( "li", $(this).parent()[0].tagName.toLowerCase(), "Check that each label is wrapped in an li" );
		ok( $(this).parent("li").is(":visible"), "Check that each parent li is visible" );
	});
	
	
	v.prepareForm();
	ok( v.valid(), "form is not valid after adding errors manually" );
	equals( 0, container.find("label").length, "There should be no error label in the container" );
	equals( 2, labelcontainer.find("label").length, "There should be two error labels in the labelcontainer" );
	equals( 2, labelcontainer.find("li").length, "There should be two error lis in the labelcontainer" );
	ok( container.is(":hidden"), "Check that the container is hidden" );
	ok( labelcontainer.is(":hidden"), "Check that the labelcontainer is hidden" );
	labelcontainer.find("label").each(function() {
		ok( $(this).is(":hidden"), "Check that each label is visible" );
		equals( "li", $(this).parent()[0].tagName.toLowerCase(), "Check that each label is wrapped in an li" );
		ok( $(this).parent("li").is(":hidden"), "Check that each parent li is visible" );
	});
});

test("focusInvalid()", function() {
	expect(1);
	var inputs = $("#testForm1 input").focus(function() {
		equals( inputs[0], this, "focused first element" );
	});
	var v = $("#testForm1").validate();
	v.form();
	// have to explicitly show input elements with error class, they are hidden by testsuite styles
	inputs.show();
	v.focusInvalid();
});

test("findLastActive()", function() {
	expect(3);
	var v = $("#testForm1").validate();
	ok( !v.findLastActive() );
	v.form();
	v.focusInvalid();
	ok( !v.findLastActive() );
	try {
		var lastInput = $("#testForm1 input:last").focus()[0];
		v.focusInvalid();
		equals( lastInput, v.findLastActive() );
	} catch(e) {
		ok( true, "Ignore in IE" );
	}
});

test("refresh() & validating multiple checkboxes with 'required'", function() {
	expect(3);
	var checkboxes = $("#form input[@name=check3]").attr("checked", false);
	equals(5, checkboxes.size());
	var v = $("#form").validate({
		rules: {
			check3: "required"
		}
	});
	v.form();
	equals(1, v.errorList.length);
	checkboxes.filter(":last").attr("checked", true);
	v.form();
	equals(0, v.errorList.length);
});

test("idOrName()", function() {
	expect(4);
	var v = $("#testForm1").validate();
	equals( "form8input", v.idOrName( $("#form8input")[0] ) );
	equals( "check", v.idOrName( $("#form6check1")[0] ) );
	equals( "agree", v.idOrName( $("#agb")[0] ) );
	equals( "button", v.idOrName( $("#form :button")[0] ) );
	
});

test("success option", function() {
	expect(7);
	equals( "", $("#firstname").val() );
	var v = $("#testForm1").validate({
		success: "valid"
	});
	var label = $("#testForm1 label");
	ok( label.is(".error") );
	ok( !label.is(".valid") );
	v.form();
	ok( label.is(".error") );
	ok( !label.is(".valid") );
	$("#firstname").val("hi");
	v.form();
	ok( label.is(".error") );
	ok( label.is(".valid") );
});

test("success option2", function() {
	expect(5);
	equals( "", $("#firstname").val() );
	var v = $("#testForm1").validate({
		success: "valid"
	});
	var label = $("#testForm1 label");
	ok( label.is(".error") );
	ok( !label.is(".valid") );
	$("#firstname").val("hi");
	v.form();
	ok( label.is(".error") );
	ok( label.is(".valid") );
});

test("success option3", function() {
	expect(5);
	equals( "", $("#firstname").val() );
	$("#errorFirstname").remove();
	var v = $("#testForm1").validate({
		success: "valid"
	});
	equals( 0, $("#testForm1 label").size() );
	$("#firstname").val("hi");
	v.form();
	var labels = $("#testForm1 label");
	equals( 2, labels.size() );
	ok( labels.eq(0).is(".valid") );
	ok( !labels.eq(1).is(".valid") );
});