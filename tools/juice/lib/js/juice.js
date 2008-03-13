$(document).ready(function() {
	$("p.blue, p.red, p.grey, p.green, div.blue, div.red, div.grey, div.green, div.link").corner();
	$("#instruction_field").html($("#instruction").html());
	
	
	if($("#expectation").html()) {
		$("#expectation_field").html($("#expectation").html());
		$("#bottombar div.bg").animate({ top: "0px" }, 500);
	}
});


function register() {
	$("div.exchange div.out").animate({ left: "-=600", opacity: 0 }, 500);
	$("div.exchange div.in").animate({ left: "-=600", opacity: 1 }, 500);
	$("#registerlink").fadeOut(500, function() {
		$('input[name=email_register]').focus();
	});
}

function submit_register() {
	var fm = $('form[name=register]'), data = fm.serialize();
	$.post('action/register/save.php', data);
}

function login() {
	$("#loginstatus").animate({ top: 26 }, 500);
	$("#loginbar").animate({ top: 0 }, 500);
	$("#username")[0].focus();
}

function signout() {
	if (confirm('Are you sure?'))
		document.location.href = 'action/login/off.php';
}

function submit(id) {
	if($.browser.mozilla) var browser = "Mozilla";
	if($.browser.msie) var browser = "Internet Explorer";
	if($.browser.safari) var browser = "Safari";
	if($.browser.opera) var browser = "Opera";
	
	$.get("action/statistics/save.php", { result: id, engine: browser, version: $.browser.version, platform: navigator.platform }, function(data){
		//do something
	});
}