/* Hebrew initialisation for the UI Datepicker extension. */
/* Written by Amir Hardon (ahardon at gmail dot com). */
jQuery(function($){
	$.datepicker.regional['he'] = {clearText: 'נקה', closeText: 'סגור',
		prevText: '&lt;קודם', nextText: 'הבא&gt;', currentText: 'היום',
		dayNames: ['א\'','ב\'','ג\'','ד\'','ה\'','ו\'','שבת'],
		monthNames: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני',
		'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']};
	$.datepicker.setDefaults($.datepicker.regional['he']);
});

