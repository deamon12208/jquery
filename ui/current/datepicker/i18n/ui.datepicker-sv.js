/* Swedish initialisation for the jQuery UI date picker plugin. */
/* Written by Anders Ekdahl ( anders@nomadiz.se). */
$(document).ready(function(){
    $.datepicker.regional['sv'] = {clearText: 'Rensa', closeText: 'Stäng',
        prevText: '&laquo;Förra', nextText: 'Nästa&raquo;', 
		currentText: 'Idag', weekHeader: 'Ve', 
		dayNamesMin: ['Sö','Må','Ti','On','To','Fr','Lö'],
		dayNamesShort: ['Sön','Mån','Tis','Ons','Tor','Fre','Lör'],
		dayNames: ['Söndag','Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun', 
        'Jul','Aug','Sep','Okt','Nov','Dec'],
        monthNames: ['Januari','Februari','Mars','April','Maj','Juni', 
        'Juli','Augusti','September','Oktober','November','December'],
        dateFormat: 'yy-mm-dd', firstDay: 0};
    $.datepicker.setDefaults($.datepicker.regional['sv']); 
});
