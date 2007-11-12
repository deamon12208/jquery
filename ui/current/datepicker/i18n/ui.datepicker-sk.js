/* Slovak initialisation for the jQuery UI date picker plugin. */
/* Written by Vojtech Rinik (vojto@hmm.sk). */
$(document).ready(function(){
	$.datepicker.regional['sk'] = {clearText: 'Zmazať', closeText: 'Zavrieť', 
		prevText: '&lt;Predchádzajúci', nextText: 'Nasledujúci&gt;', 
		currentText: 'Dnes', weekHeader: 'Ty', 
		dayNamesMin: ['Ne','Po','Ut','St','Št','Pia','So'],
		dayNamesShort: ['Ned','Pon','Uto','Str','Štv','Pia','Sob'],
		dayNames: ['Nedel\'a','Pondelok','Utorok','Streda','Štvrtok','Piatok','Sobota'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Máj','Jún',
		'Júl','Aug','Sep','Okt','Nov','Dec'],
		monthNames: ['Január','Február','Marec','Apríl','Máj','Jún',
		'Júl','August','September','Október','November','December'],
		dateFormat: 'dd.mm.yy', firstDay: 0};
	$.datepicker.setDefaults($.datepicker.regional['sk']);
});
