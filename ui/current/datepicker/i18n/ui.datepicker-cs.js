/* Czech initialisation for the jQuery UI date picker plugin. */
/* Written by Tomas Muller (tomas@tomas-muller.net). */
$(document).ready(function(){
	$.datepicker.regional['cs'] = {clearText: 'Smazat', closeText: 'Zavøít', 
		prevText: '&lt;Døíve', nextText: 'Pozdìji&gt;',
		currentText: 'Nyní', weekHeader: 'Tý',
		dayNamesMin: ['Ne','Po','Út','St','Èt','Pá','So'],
		dayNamesShort: ['Ned','Pon','Úte','Stř','Ètv','Pát','Sob'],
		dayNames: ['Neděle','Pondělí','Úterý','Středa','Ètvrtek','Pátek','Sobota'],
		monthNamesShort: ['Led','Úno','Bøe','Dub','Kvì','Èer',
		'Èer','Srp','Záø','Øíj','Lis','Pro'],
		monthNames: ['Leden','Únor','Bøezen','Duben','Kvìten','Èerven',
		'Èervenec','Srpen','Záøí','Øíjen','Listopad','Prosinec'],
		dateFormat: 'dd.mm.yy', firstDay: 0};
	$.datepicker.setDefaults($.datepicker.regional['cs']);
});
