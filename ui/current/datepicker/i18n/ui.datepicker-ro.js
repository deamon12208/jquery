/* Romanian initialisation for the jQuery UI date picker plugin. */
/* Written by Edmond L. (ll_edmond@walla.com). */
$(document).ready(function(){
	$.datepicker.regional['ro'] = {clearText: 'sterge', clearStatus: '',
		closeText: 'inchide', closeStatus: '',
		prevText: '&laquo;&nbsp;inapoi', prevStatus: '',
		nextText: 'inainte&nbsp;&raquo;', nextStatus: '',
		currentText: 'Azi', currentStatus: '',
		monthNames: ['Januarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Junie',
		'Julie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Sm', weekStatus: '',
		dayNames: ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sâmbata'],
		dayNamesShort: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
		dayNamesMin: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'yy-mm-dd', firstDay: 1, 
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['ro']);
});
