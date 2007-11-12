/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Andrew Stromnov (stromnov@gmail.com). */
$(document).ready(function(){
	$.datepicker.regional['ru'] = {clearText: 'Очистить', closeText: 'Закрыть',
		prevText: '&lt;Пред', nextText: 'След&gt;', 
		currentText: 'Сегодня', weekHeader: 'Не', 
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		dayNamesShort: ['вос','пон','вто','сре','чет','пят','суб'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
		'Июл','Авг','Сен','Окт','Ноя','Дек'],
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		dateFormat: 'dd.mm.yy', firstDay: 1};
	$.datepicker.setDefaults($.datepicker.regional['ru']);
});