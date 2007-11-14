/* Danish initialisation for the jQuery UI date picker plugin. */
/* Written by Jan Christensen ( deletestuff@gmail.com). */
$(document).ready(function(){
    $.datepicker.regional['da'] = {clearText: 'Nulstil', closeText: 'Luk',
        prevText: '&laquo;Tilbage', nextText: 'Frem&raquo;',
		currentText: 'Idag', weekHeader: 'Ve',
		dayNamesMin: ['Sø','Ma','Ti','On','To','Fr','Lø'],
		dayNamesShort: ['Søn','Man','Tir','Ons','Tor','Fre','Lør'],
		dayNames: ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun', 
        'Jul','Aug','Sep','Okt','Nov','Dec'],
        monthNames: ['Januar','Februar','Marts','April','Maj','Juni', 
        'Juli','August','September','Oktober','November','December'],
        dateFormat: 'dd-mm-yy', firstDay: 0};
    $.datepicker.setDefaults($.datepicker.regional['da']); 
});
