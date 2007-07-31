var defaultMinDate = null;
var defaultMaxDate = null;

function setOptions(select) {
	popUpCal.hideCalendar();
	// Set defaults
	popUpCal.clearText = 'Clear';
	popUpCal.closeText = 'Close';
	popUpCal.prevText = '&lt; Prev';
	popUpCal.nextText = 'Next &gt;';
	popUpCal.currentText = 'Current';
	popUpCal.dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
	popUpCal.monthNames = ['January','February','March','April','May','June',
		'July','August','September','October','November','December'];
	popUpCal.dateFormat = 'DMY/';
	popUpCal.showOtherMonths = false;
	popUpCal.minDate = defaultMinDate = null;
	popUpCal.maxDate = defaultMaxDate = null;
	popUpCal.changeMonth = true;
	popUpCal.changeYear = true;
	popUpCal.firstDay = 0;
	popUpCal.changeFirstDay = true;
	popUpCal.closeAtTop = true;
	popUpCal.hideIfNoPrevNext = true;
	popUpCal.customDate = null;
	popUpCal.enableFor($('.calendarRange'));
	// Set selected options
	option = select.options[select.selectedIndex].value;
	setActiveStyleSheet('default');
	switch (option) {
		case '1':  
			popUpCal.minDate = defaultMinDate = new Date(2005, 1 - 1, 26);
			popUpCal.maxDate = defaultMaxDate = new Date(2007, 1 - 1, 26);
			popUpCal.hideIfNoPrevNext = false;
			popUpCal.disableFor($('.calendarRange'));
			break;
		case '2':
			popUpCal.firstDay = 1;
			popUpCal.changeFirstDay = false;
			break;
		case '3':
			popUpCal.changeMonth = false;
			popUpCal.changeYear = false;
			break;
		case '4':
			popUpCal.dateFormat = 'MDY/';
			break;
		case '5':
			popUpCal.showOtherMonths = true;
			break;
		case '6':
			popUpCal.closeAtTop = false;
			break;
		case '7':
			popUpCal.customDate = popUpCal.noWeekends;
			break;
		case '8':
			popUpCal.customDate = nationalDays;
			break;
		case '9':
			popUpCal.clearText = 'Enlevez';
			popUpCal.closeText = 'Fermez';
			popUpCal.prevText = '&lt;Préc';
			popUpCal.nextText = 'Proch&gt;';
			popUpCal.currentText = 'En cours';
			popUpCal.dayNames = ['Di','Lu','Ma','Me','Je','Ve','Sa'];
			popUpCal.monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin',
				'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
			break;
		case '10':
			setActiveStyleSheet('alt');
			break;
	}
	$('.calendarFocus').val('');
	$('.calendarButton').val('');
	$('.calendarBoth').val('');
	$('.calendarRange').val('');
	$('#more div').hide();
	$('#more' + option).show();
}

function setSpeed(select) {
	popUpCal.speed = select.options[select.selectedIndex].value;
}

natDays = [[1, 26, 'au'], [2, 6, 'nz'], [3, 17, 'ie'], [4, 27, 'za'], [5, 25, 'ar'], [6, 6, 'se'],
	[7, 4, 'us'], [8, 17, 'id'], [9, 7, 'br'], [10, 1, 'cn'], [11, 22, 'lb'], [12, 12, 'ke']];
function nationalDays(date) {
	for (i = 0; i < natDays.length; i++) {
		if (date.getMonth() == natDays[i][0] - 1 && date.getDate() == natDays[i][1]) {
			return [false, natDays[i][2] + '_day'];
		}
	}
	return [true, ''];
}

function customSettings(input) {
	range = (input.className == 'calendarFocus' ? 5 : 
		(input.className == 'calendarButton' ? 7 : 10));
	return {yearRange: '-' + range + ':+' + range, 
		minDate: (input.id == 'dTo' ? getDate($('#dFrom')) : defaultMinDate), 
		maxDate: (input.id == 'dFrom' ? getDate($('#dTo')) : defaultMaxDate)};
}

function getDate(input) {
	fields = input.val().split('/');
	if (fields.length == 3) {
		return new Date(parseInt(fields[2]), parseInt(fields[1]) - 1, parseInt(fields[0]));
	} else {
		return null;
	}
}

function getPopUpDate() {
	popUpCal.showStandalone($('#popUpDate').val(), 'Choose a date', setPopUpDate);
}

function setPopUpDate() {
	$('#popUpDate').val(popUpCal.date);
}

$(document).ready(function () {
	$('#more div').hide();
	$('#more0').show();
	popUpCal.fieldSettings = customSettings;
	$('.calendarFocus').calendar({appendText: ' (default dd/mm/yyyy)'});
	$('.calendarButton').calendar({appendText: ' ', autoPopUp: 'button'});
	$('.calendarBoth').calendar({autoPopUp: 'both', buttonImageOnly: true, 
		buttonImage: 'img/calendar.gif', buttonText: 'Calendar'});
	$('.calendarRange').calendar(); // Same as above
	$('#enableFocus').toggle(
		function () { this.value = 'Enable'; return popUpCal.disableFor($('.calendarFocus')); }, 
		function () { this.value = 'Disable'; return popUpCal.enableFor($('.calendarFocus')); });
	$('#enableButton').toggle(
		function () { this.value = 'Enable'; return popUpCal.disableFor($('.calendarButton')); }, 
		function () { this.value = 'Disable'; return popUpCal.enableFor($('.calendarButton')); });
	$('#enableBoth').toggle(
		function () { this.value = 'Enable'; return popUpCal.disableFor($('.calendarBoth')); }, 
		function () { this.value = 'Disable'; return popUpCal.enableFor($('.calendarBoth')); });
});

function setActiveStyleSheet(title) {
  var i, a, main;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      a.disabled = true;
      if(a.getAttribute("title") == title) a.disabled = false;
    }
  }
}