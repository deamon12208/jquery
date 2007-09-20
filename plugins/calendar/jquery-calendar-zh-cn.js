/* Chinese initialisation for the jQuery calendar extension. */
/* Written by Cloudream (cloudream@gmail.com). */
$(document).ready(function(){
	popUpCal.regional['zh-cn'] = {clearText: 'Çå³ý', closeText: '¹Ø±Õ',
		prevText: '&lt;ÉÏÔÂ', nextText: 'ÏÂÔÂ&gt;', currentText: '½ñÌì',
		dayNames: ['ÈÕ','Ò»','¶þ','Èý','ËÄ','Îå','Áù'],
		monthNames: ['Ò»ÔÂ','¶þÔÂ','ÈýÔÂ','ËÄÔÂ','ÎåÔÂ','ÁùÔÂ',
		'ÆßÔÂ','°ËÔÂ','¾ÅÔÂ','Ê®ÔÂ','Ê®Ò»ÔÂ','Ê®¶þÔÂ'],
		dateFormat: 'YMD-'};
	popUpCal.setDefaults(popUpCal.regional['zh-cn']);
});
