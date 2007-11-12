/* German initialisation for the jQuery UI date picker plugin. */
/* Written by Milian Wolff (mail@milianw.de). */
$(document).ready(function(){
	$.datepicker.regional['de'] = {clearText: 'Löschen', closeText: 'Schließen',
		prevText: '&lt;Zurück', nextText: 'Vor&gt;', 
		currentText: 'Heute', weekHeader: 'Wo', 
		dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		dayNamesShort: ['Son','Mon','Die','Mit','Don','Fre','Sam'],
		dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
		monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun',
		'Jul','Aug','Sep','Okt','Nov','Dez'],
		monthNames: ['Januar','Februar','März','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'],
		dateFormat: 'dd.mm.yy', firstDay: 0};
	$.datepicker.setDefaults($.datepicker.regional['de']);
});