var inlineRange = null;
var inlineFrom = null;
var inlineTo = null;

$(document).ready(function () {
	$('#alt').attr({ 'disabled':'disabled' });
	tabs.init();
	// Restore default language after loading French localisation
	popUpCal.setDefaults(popUpCal.regional['']);
	// Set calendar global defaults - invoke via focus and image button
	popUpCal.setDefaults({autoPopUp: 'both', buttonImageOnly: true,
		buttonImage: 'img/calendar.gif', buttonText: 'Calendar'});
	// Defaults
	$('#defaultFocus').calendar({autoPopUp: 'focus'});
	// Invocation
	$('#invokeFocus').calendar({autoPopUp: 'focus', yearRange: '-5:+5'});
	$('#invokeButton').calendar({autoPopUp: 'button', buttonImageOnly: false,
		buttonImage: '', buttonText: '...', yearRange: '-7:+7'});
	$('.invokeBoth').calendar(); // Also Keystrokes
	$('#enableFocus').toggle(
		function () { this.value = 'Enable'; return popUpCal.disableFor($('#invokeFocus')); },
		function () { this.value = 'Disable'; return popUpCal.enableFor($('#invokeFocus')); });
	$('#enableButton').toggle(
		function () { this.value = 'Enable'; return popUpCal.disableFor($('#invokeButton')); },
		function () { this.value = 'Disable'; return popUpCal.enableFor($('#invokeButton')); });
	$('#enableBoth').toggle(
		function () { this.value = 'Enable'; return popUpCal.disableFor($('.invokeBoth')[0]); },
		function () { this.value = 'Disable'; return popUpCal.enableFor($('.invokeBoth')[0]); });
	// Restricting
	$('#restrictControls').calendar({firstDay: 1, changeFirstDay: false,
		changeMonth: false, changeYear: false});
	$('#restrictDates').calendar({minDate: new Date(2005, 1 - 1, 26),
		maxDate: new Date(2007, 1 - 1, 26)});
	// Customise
	$('#noWeekends').calendar({customDate: popUpCal.noWeekends});
	$('#nationalDays').calendar({customDate: nationalDays});
	// Localisation
	$('#isoFormat').calendar({dateFormat: 'YMD-'});
	$('#frenchCalendar').calendar(popUpCal.regional['fr']);
	// Date range
	$('.calendarRange').calendar({fieldSettings: customRange});
	// Miscellaneous
	$('#addSettings').calendar({closeAtTop: false,
		showOtherMonths: true, onSelect: alertDate});
	$('#reconfigureCal').calendar();
	$('.inlineConfig').calendar();
	// Inline
	$('.calendarInline').calendar({onSelect: updateInlineRange});
	inlineRange = $('#inlineRange');
	inlineFrom = $('#inlineFrom');
	inlineTo = $('#inlineTo');
	updateInlineRange();
	// Stylesheets
	$('#altStyle').calendar();
	$('#button1').click(function() { 
		popUpCal.showFor($('#invokeFocus')[0]);
	});
	$('#button2').click(function() { 
		popUpCal.dialogCalendar($('#invokeDialog').val(),
		setDateFromDialog, {prompt: 'Choose a date', speed: ''});
	});
	$('#button3').click(function() { 
		popUpCal.dialogCalendar($('#altDialog').val(),
		setAltDateFromDialog, {prompt: 'Choose a date', speed: ''});
	});

});

function setSpeed(select) {
	popUpCal.reconfigureFor($('#reconfigureCal')[0],
		{speed: select.options[select.selectedIndex].value});
}

function setDateFromDialog(date) {
	$('#invokeDialog').val(date);
}

function setAltDateFromDialog(date) {
	$('#altDialog').val(date);
}

var natDays = [[1, 26, 'au'], [2, 6, 'nz'], [3, 17, 'ie'], [4, 27, 'za'], [5, 25, 'ar'], [6, 6, 'se'],
	[7, 4, 'us'], [8, 17, 'id'], [9, 7, 'br'], [10, 1, 'cn'], [11, 22, 'lb'], [12, 12, 'ke']];
function nationalDays(date) {
	for (i = 0; i < natDays.length; i++) {
		if (date.getMonth() == natDays[i][0] - 1 && date.getDate() == natDays[i][1]) {
			return [false, natDays[i][2] + '_day'];
		}
	}
	return [true, ''];
}

function customRange(input) {
	return {minDate: (input.id == 'dTo' ? getDate($('#dFrom').val()) : null),
		maxDate: (input.id == 'dFrom' ? getDate($('#dTo').val()) : null)};
}

function getDate(value) {
	fields = value.split('/');
	return (fields.length < 3 ? null :
		new Date(parseInt(fields[2], 10), parseInt(fields[1], 10) - 1, parseInt(fields[0], 10)));
}

function alertDate(date) {
	alert('The date is ' + date);
}

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function showDay(input) {
	var date = getDate(input.value);
	$('#inlineDay').empty().html(date ? days[date.getDay()] : 'blank');
}

function updateInlineRange() {
	var dateFrom = popUpCal.getDateFor(inlineFrom[0]);
	var dateTo = popUpCal.getDateFor(inlineTo[0]);
	inlineRange.val(formatDate(dateFrom) + ' to ' + formatDate(dateTo));
	popUpCal.reconfigureFor(inlineFrom[0], {maxDate: dateTo});
	popUpCal.reconfigureFor(inlineTo[0], {minDate: dateFrom});
}

function formatDate(date) {
	var day = date.getDate();
	var month = date.getMonth() + 1;
	return (day < 10 ? '0' : '') + day + '/' +
		(month < 10 ? '0' : '') + month + '/' + date.getFullYear();
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
				$("div[@class^=tab_group]:visible").slideUp("fast", function() { 
					$("#" + tabs.IDs[i]).slideDown();
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
				$("div[@class^=tab_group]:visible").slideUp("fast", function() { 
					if (tabs.IDs.length > (i+1) ) {
						$("#" + tabs.IDs[i+1]).slideDown();
						$('.over').removeClass('over');
						$("ul[@id^=tab_menu] a:eq(" + (i+1) + ")").addClass('over');
					} else {
						$("#" + tabs.IDs[0]).slideDown();
						$('.over').removeClass('over');
						$("ul[@id^=tab_menu] a:eq(0)").addClass('over');
					}
				});
				return false;
			});
		});
	}
}
