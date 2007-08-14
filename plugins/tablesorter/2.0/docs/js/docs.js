/* Stop IE flicker */
if ($.browser.msie == true) document.execCommand('BackgroundImageCache', false, true);
ChiliBook.recipeFolder     = "js/chili/";
ChiliBook.stylesheetFolder = "js/chili/"
$(function() {
	$("pre.javascript").chili();
	$("pre.html").chili();
	$("pre.css").chili();
	$("a.external").each(function() {this.target = '_new'});	
});