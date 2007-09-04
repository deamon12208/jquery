/* Romanian initialisation for the jQuery calendar extension. */
/* Written by Edmond L. (ll_edmond@walla.com). */
$(document).ready(function(){
	popUpCal.regional['ro'] = {
		clearText: 'sterge | ',
		closeText: 'inchide',
		prevText: '&laquo;&nbsp;inapoi | ',
		nextText: ' | inainte&nbsp;&raquo;',
		currentText: 'Azi',

		firstDay: 1,
		dayNames: [
			'D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'
		],
		monthNames: [
			'Januarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Junie',
			'Julie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
		],

		dateFormat: 'YMD-'
	};

	popUpCal.setDefaults(popUpCal.regional['ro']);
});
