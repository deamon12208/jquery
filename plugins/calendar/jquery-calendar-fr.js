/* French initialisation for the jQuery calendar extension. */
/* Written by Keith Wood (kbwood@iprimus.com.au). */
$(document).ready(function(){
	popUpCal.regional['fr'] = {clearText: 'Enlevez', closeText: 'Fermez', 
		prevText: '&lt;Préc', nextText: 'Proch&gt;', currentText: 'En cours',
		dayNames: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
		monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin',
		'Juillet','Août','Septembre','Octobre','Novembre','Décembre']};
	popUpCal.setDefaults(popUpCal.regional['fr']);
});