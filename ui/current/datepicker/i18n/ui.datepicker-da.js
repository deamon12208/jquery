/* Danish initialisation for the jQuery UI date picker plugin. */
/* Written by Jan Christensen ( deletestuff@gmail.com). */
$(document).ready(function(){
    $.datepicker.regional['da'] = {clearText: 'Nulstil', clearStatus: '',
		closeText: 'Luk', closeStatus: '',
        prevText: '&laquo;Tilbage', prevStatus: '',
		nextText: 'Frem&raquo;', nextStatus: '',
		currentText: 'Idag', currentStatus: '',
        monthNames: ['Januar','Februar','Marts','April','Maj','Juni', 
        'Juli','August','September','Oktober','November','December'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun', 
        'Jul','Aug','Sep','Okt','Nov','Dec'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Ve', weekStatus: '',
		dayNames: ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
		dayNamesShort: ['Søn','Man','Tir','Ons','Tor','Fre','Lør'],
		dayNamesMin: ['Sø','Ma','Ti','On','To','Fr','Lø'],
		dayStatus: 'DD', dateStatus: 'D, M d',
        dateFormat: 'dd-mm-yy', firstDay: 0, 
		initStatus: '', isRTL: false};
    $.datepicker.setDefaults($.datepicker.regional['da']); 
});
