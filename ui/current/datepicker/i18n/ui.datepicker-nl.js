/* Dutch (UTF-8) initialisation for the jQuery UI date picker plugin. */
$(document).ready(function(){
	$.datepicker.regional['nl'] = {clearText: 'Wissen', closeText: 'Sluiten',
		prevText: '&lt;Terug', nextText: 'Volgende&gt;',
		currentText: 'Vandaag', weekHeader: 'Wk',
		dayNamesMin: ['Zo','Ma','Di','Wo','Do','Vr','Za'],
		dayNamesShort: ['Zon','Maa','Din','Woe','Don','Vri','Zat'],
		dayNames: ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'],
		monthNamesShort: ['Jan','Feb','Maa','Apr','Mei','Jun',
		'Jul','Aug','Sep','Okt','Nov','Dec'],
		monthNames: ['Januari','Februari','Maart','April','Mei','Juni',
		'Juli','Augustus','September','Oktober','November','December'],
		dateFormat: 'dd.mm.yy', firstDay: 0};
	$.datepicker.setDefaults($.datepicker.regional['nl']);
});