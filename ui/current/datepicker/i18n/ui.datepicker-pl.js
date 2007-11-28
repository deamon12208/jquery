/* Polish initialisation for the jQuery UI date picker plugin. */
/* Written by Jacek Wysocki (jacek.wysocki@gmail.com). */
$(document).ready(function(){
	$.datepicker.regional['pl'] = {clearText: 'Czyść', clearStatus: '',
		closeText: 'Zamknij', closeStatus: '',
		prevText: '&lt;Poprzedni', prevStatus: '',
		nextText: 'Następny&gt;', nextStatus: '',
		currentText: 'Teraz', currentStatus: '',
		monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
		'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
		monthNamesShort: ['Sty','Lut','Mar','Kwi','Maj','Cze',
		'Lip','Sie','Wrz','Paź','Lis','Gru'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Ty', weekStatus: '',
		dayNames: ['Niedziela','Poniedzialek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
		dayNamesShort: ['Nie','Pon','Wto','Śro','Czw','Pią','Sob'],
		dayNamesMin: ['Nie','Pn','Wt','Śr','Czw','Pt','So'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd/mm/yy', firstDay: 0, 
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['pl']);
});
