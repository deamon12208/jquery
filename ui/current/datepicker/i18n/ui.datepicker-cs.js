/* Czech initialisation for the jQuery UI date picker plugin. */
/* Written by Tomas Muller (tomas@tomas-muller.net). */
$(document).ready(function(){
	$.datepicker.regional['cs'] = {clearText: 'Smazat', clearStatus: '',
		closeText: 'Zavøít',  closeStatus: '',
		prevText: '&lt;Døíve', prevStatus: '',
		nextText: 'Pozdìji&gt;', nextStatus: '',
		currentText: 'Nyní', currentStatus: '',
		monthNames: ['Leden','Únor','Bøezen','Duben','Kvìten','Èerven',
		'Èervenec','Srpen','Záøí','Øíjen','Listopad','Prosinec'],
		monthNamesShort: ['Led','Úno','Bøe','Dub','Kvì','Èer',
		'Èer','Srp','Záø','Øíj','Lis','Pro'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Tý', weekStatus: '',
		dayNames: ['Neděle','Pondělí','Úterý','Středa','Ètvrtek','Pátek','Sobota'],
		dayNamesShort: ['Ned','Pon','Úte','Stř','Ètv','Pát','Sob'],
		dayNamesMin: ['Ne','Po','Út','St','Èt','Pá','So'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd.mm.yy', firstDay: 0, 
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['cs']);
});
