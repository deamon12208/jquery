/* Romanian initialisation for the jQuery UI date picker plugin. */
/* Written by Edmond L. (ll_edmond@walla.com). */
$(document).ready(function(){
	$.datepicker.regional['ro'] = {clearText: 'sterge', closeText: 'inchide',
		prevText: '&laquo;&nbsp;inapoi', nextText: 'inainte&nbsp;&raquo;',
		currentText: 'Azi', weekHeader: 'Sm',
		dayNamesMin: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
		dayNamesShort: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
		dayNames: ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sâmbata'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'],
		monthNames: ['Januarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Junie',
		'Julie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
		dateFormat: 'yy-mm-dd', firstDay: 1};
	$.datepicker.setDefaults($.datepicker.regional['ro']);
});
