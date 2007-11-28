/* German initialisation for the jQuery UI date picker plugin. */
/* Written by Milian Wolff (mail@milianw.de). */
$(document).ready(function(){
	$.datepicker.regional['de'] = {clearText: 'Löschen', clearStatus: '',
		closeText: 'Schließen', closeStatus: '',
		prevText: '&lt;Zurück', prevStatus: '',
		nextText: 'Vor&gt;', nextStatus: '',
		currentText: 'Heute', currentStatus: '',
		monthNames: ['Januar','Februar','März','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'],
		monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun',
		'Jul','Aug','Sep','Okt','Nov','Dez'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Wo', weekStatus: '',
		dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
		dayNamesShort: ['Son','Mon','Die','Mit','Don','Fre','Sam'],
		dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd.mm.yy', firstDay: 0, 
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['de']);
});