/* Brazilian initialisation for the jQuery UI date picker plugin. */
/* Written by Leonildo Costa Silva (leocsilva@gmail.com). */
$(document).ready(function(){
	$.datepicker.regional['pt-BR'] = {clearText: 'Limpar', closeText: 'Fechar', 
		prevText: '&lt;Anterior', nextText: 'Pr&oacute;ximo&gt;',
		currentText: 'Hoje', weekHeader: 'Sm',
		dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
		'Jul','Ago','Set','Out','Nov','Dez'],
		monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
		'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		dateFormat: 'dd/mm/yy', firstDay: 0};
	$.datepicker.setDefaults($.datepicker.regional['pt-BR']);
});