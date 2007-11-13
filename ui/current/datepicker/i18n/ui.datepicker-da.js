/* Danish initialisation for the jQuery UI date picker plugin. */
/* Written by Jan Christensen ( deletestuff@gmail.com). */
$(document).ready(function(){
    $.datepicker.regional['da'] = {clearText: 'Nulstil', closeText: 'Luk',
        prevText: '&laquo;Tilbage', nextText: 'Frem&raquo;', currentText: 'Idag', 
        weekHeader: 'Ve', dayNames: ['Sø','Ma','Ti','On','To','Fr','Lø'],
        monthNames: ['Januar','Februar','Marts','April','Maj','Juni', 
        'Juli','August','September','Oktober','November','December'],
        dateFormat: 'DMY-', firstDay: 0};
    $.datepicker.setDefaults($.datepicker.regional['da']); 
});
