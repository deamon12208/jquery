/* Inicialització en català per a l'extenció 'calendar' per jQuery. */
/* Writers: (joan.leon@gmail.com). */
$(document).ready(function(){
	popUpCal.regional['ca'] = {clearText: 'Netejar', closeText: 'Tancar',
		prevText: '&lt;Ant', nextText: 'Seg&gt;', currentText: 'Avui',
		dayNames: ['Dg','Dl','Dt','Dc','Dj','Dv','Ds'],
		monthNames: ['Gener','Febrer','Mar&ccedil;','Abril','Maig','Juny',
		'Juliol','Agost','Setembre','Octubre','Novembre','Decembre']};
	popUpCal.setDefaults(popUpCal.regional['ca']);
});