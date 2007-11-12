/* French initialisation for the jQuery UI date picker plugin. */
/* Written by Keith Wood (kbwood@iprimus.com.au). */
$(document).ready(function(){
	$.datepicker.regional['fr'] = {clearText: 'Effacer', closeText: 'Fermer', 
		prevText: '&lt;Préc', nextText: 'Proch&gt;',
		currentText: 'En cours', weekHeader: 'Sm',
		dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
		dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
		dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
		monthNamesShort: ['Jan','Fév','Mar','Avr','Mai','Jun',
		'Jul','Aoû','Sep','Oct','Nov','Déc'],
		monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin',
		'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
		dateFormat: 'dd/mm/yy', firstDay: 0};
	$.datepicker.setDefaults($.datepicker.regional['fr']);
});