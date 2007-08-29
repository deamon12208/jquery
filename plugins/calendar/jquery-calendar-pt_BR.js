/* Brazilian initialisation for the jQuery calendar extension. */
/* Written by Leonildo Costa Silva (leocsilva@gmail.com). */
$(document).ready(function(){
	popUpCal.regional['pt_BR'] = {clearText: 'Limpar', closeText: 'Fechar', 
		prevText: '&lt;Anterior', nextText: 'Pr&oacute;ximo&gt;', currentText: 'Hoje',
		dayNames: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
		'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']};
	popUpCal.setDefaults(popUpCal.regional['pt_BR']);
});