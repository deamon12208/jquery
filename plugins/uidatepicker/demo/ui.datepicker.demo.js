// Initialise the date picker demonstrations
$(document).ready(function () {
	// initialize tab interface
	tabs.init();
	// replace script tags with HTML code
	$(".demojs").each(function () {
		$(this).before( '<div><a class="togglecode" href="#">Show Code Example</a><br /><pre style="display:none; padding-top:0 !important;"><code>' + $(this).html() + "</code></pre></div>" );
		eval( $(this).html() );
	});
	$("a.togglecode")
		.click(function() { return false })
		.mouseover(function() {
			$(this).next().next().fadeIn('fast')
			$(this).next().remove()
			$(this).remove()
		})
	// Localization
	if ($.browser.safari) {
		$('#language,#l10nDatepicker').attr({ disabled: 'disabled' });
	} else {
		$('#language').change(localise);
		$('#l10nDatepicker').datepicker();
		localise();
	}
	// Stylesheets
	$('#altStyle').datepicker({buttonImage: 'img/calendar2.gif'});
	$('#button3').click(function() { 
		$.datepicker.dialogDatepicker($('#altDialog').val(),
		setAltDateFromDialog, {prompt: 'Choose a date', speed: ''});
	});
});

// Load and apply a localisation package for the date picker
function localise() {
	var language = $('#language').val();
	$.localise('i18n/ui.datepicker', {language: language});
	$.datepicker.reconfigureFor('#l10nDatepicker', $.datepicker.regional[language]).
		setDefaults($.datepicker.regional['']); // Reset for general usage
}

// Create a Date from a string value
function getDate(value) {
	fields = value.split('/');
	return (fields.length < 3 ? null :
		new Date(parseInt(fields[2], 10), parseInt(fields[1], 10) - 1, parseInt(fields[0], 10)));
}

// Demonstrate a callback from inline configuration
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function showDay(input) {
	var date = getDate(input.value);
	$('#inlineDay').empty().html(date ? days[date.getDay()] : 'blank');
}

// Format a date for display
function formatDate(date) {
	var day = date.getDate();
	var month = date.getMonth() + 1;
	return (day < 10 ? '0' : '') + day + '/' +
		(month < 10 ? '0' : '') + month + '/' + date.getFullYear();
}

// Display a date selected in a "dialog"
function setAltDateFromDialog(date) {
	$('#altDialog').val(date);
}

// Custom Tabs written by Marc Grabanski
var tabs = 
{
	init : function () 
	{
		// Setup tabs
		var nextHTML = '<div class="nextFeature"><a href="#">Continue to next section &gt;&gt;</a></div>';
		//var backHTML
		$("div[@class^=tab_group]").hide().append(nextHTML);
		var tabCount = $("ul[@id^=tab_menu] a").size();
		
		// Get all of the IDs from the hrefs
		tabs.IDs = [];
		for (var i=0;i<tabCount;i++) {
			tabs.IDs[i] = $("ul[@id^=tab_menu] a:eq(" + i + ")").attr("href").replace("#","");
		}
		
		// Set starting content
		var url = window.location.href;
		var loc = url.indexOf("#");
		var tabID = url.substr(loc+1);
		if (loc > -1) {
			$("#" + tabID).show();
			for (var i=0; i<tabs.IDs.length;i++) {
				if (tabs.IDs[i] == tabID) {
					$("ul[@id^=tab_menu] a:eq(" + i + ")").addClass('over');
				}
			}
		} else {
			$("div[@class^=tab_group]:first").show().id;
			$("ul[@id^=tab_menu] a:eq(0)").addClass('over');
		}

		// Slide visible up and clicked one down
		$("ul[@id^=tab_menu] a").each(function(i){
			$(this).click(function () {
				$('.over').removeClass('over');
				$(this).addClass('over');
				$("div[@class^=tab_group]:visible").fadeOut("fast", function() { 
					$("#" + tabs.IDs[i]).fadeIn();
				});
				tabs.stylesheet = (tabs.IDs[i] == 'styles') ? 'alt' : 'default';
				$('link').each(function() {
					this.disabled = (this.title != '' && this.title != tabs.stylesheet);
				});
				return false;
			});
		});
		
		$("div[@class^=tab_group] .nextFeature a").each(function(i){
			$(this).click(function() { 
				$("div[@class^=tab_group]:visible").fadeOut("fast", function() { 
					if (tabs.IDs.length > (i+1) ) {
						$("#" + tabs.IDs[i+1]).fadeIn();
						$('.over').removeClass('over');
						$("ul[@id^=tab_menu] a:eq(" + (i+1) + ")").addClass('over');
					} else {
						$("#" + tabs.IDs[0]).fadeIn();
						$('.over').removeClass('over');
						$("ul[@id^=tab_menu] a:eq(0)").addClass('over');
					}
				});
				return false;
			});
		});
	}
}
