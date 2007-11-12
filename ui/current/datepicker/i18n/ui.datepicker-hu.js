/* Hungarian initialisation for the jQuery UI date picker plugin. */
/* Written by Istvan Karaszi (jquerycalendar@spam.raszi.hu). */
$(document).ready(function(){
	$.datepicker.regional['hu'] = {clearText: 'törlés', closeText: 'bezárás',
		prevText: '&laquo;&nbsp;vissza', nextText: 'előre&nbsp;&raquo;', 
		currentText: 'ma', weekHeader: 'Hé', 
		dayNamesMin: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
		dayNamesShort: ['Vas', 'Hét', 'Ked', 'Sze', 'Csü', 'Pén', 'Szo'],
		dayNames: ['Vasámap', 'Hétfö', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'],
		monthNamesShort: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún',
		'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'],
		monthNames: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június',
		'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
		dateFormat: 'yy-mm-dd', firstDay: 1};
	$.datepicker.setDefaults($.datepicker.regional['hu']);
});
