/* Chinese initialisation for the jQuery calendar extension. */
/* Written by Cloudream (cloudream@gmail.com). */
$(document).ready(function(){
	popUpCal.regional['zh-cn'] = {clearText: 'æ¸…é™¤', closeText: 'å…³é—­',
		prevText: '<ä¸Šæœˆ', nextText: 'ä¸‹æœˆ>', currentText: 'ä»Šå¤©',
		dayNames: ['æ—¥','ä¸€','äºŒ','ä¸‰','å››','äº”','å…­'],
		monthNames: ['ä¸€æœˆ','äºŒæœˆ','ä¸‰æœˆ','å››æœˆ','äº”æœˆ','å…­æœˆ',
		'ä¸ƒæœˆ','å…«æœˆ','ä¹æœˆ','åæœˆ','åä¸€æœˆ','åäºŒæœˆ'],
		dateFormat: 'YMD-', firstDay: 1};
	popUpCal.setDefaults(popUpCal.regional['zh-cn']);
});
