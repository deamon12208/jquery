/* Inicialització en català per a l'extenció 'calendar' per jQuery. */
/* Writers: (joan.leon@gmail.com). */
$(document).ready(function(){
	$.datepicker.regional['ca'] = {clearText: 'Netejar', closeText: 'Tancar',
		prevText: '&lt;Ant', nextText: 'Seg&gt;',
		currentText: 'Avui', weekHeader: 'Sm',
		dayNamesMin: ['Dg','Dl','Dt','Dc','Dj','Dv','Ds'],
		dayNamesShort: ['Dug','Dln','Dmt','Dmc','Djs','Dvn','Dsb'],
		dayNames: ['Diumenge','Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte'],
		monthNamesShort: ['Gen','Feb','Mar','Abr','Mai','Jun',
		'Jul','Ago','Set','Oct','Nov','Dec'],
		monthNames: ['Gener','Febrer','Mar&ccedil;','Abril','Maig','Juny',
		'Juliol','Agost','Setembre','Octubre','Novembre','Decembre'],
		dateFormat: 'mm/dd/yy', firstDay: 0};
	$.datepicker.setDefaults($.datepicker.regional['ca']);
});