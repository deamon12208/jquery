/* Polish initialisation for the jQuery UI date picker plugin. */
/* Written by Jacek Wysocki (jacek.wysocki@gmail.com). */
$(document).ready(function(){
	$.datepicker.regional['pl'] = {clearText: 'Czyść', closeText: 'Zamknij',
		prevText: '&lt;Poprzedni', nextText: 'Następny&gt;',
		currentText: 'Teraz', weekHeader: 'Ty',
		dayNamesMin: ['Nie','Pn','Wt','Śr','Czw','Pt','So'],
		dayNamesShort: ['Nie','Pon','Wto','Śro','Czw','Pią','Sob'],
		dayNames: ['Niedziela','Poniedzialek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
		monthNamesShort: ['Sty','Lut','Mar','Kwi','Maj','Cze',
		'Lip','Sie','Wrz','Paź','Lis','Gru'],
		monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
		'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
		dateFormat: 'dd/mm/yy', firstDay: 0};
	$.datepicker.setDefaults($.datepicker.regional['pl']);
});
