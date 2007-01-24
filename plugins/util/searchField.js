/**
 * Clear the help text in a search field when focused,
 * a restore it on blur if nothing was entered.
 *
 * @example $('#quicksearch').searchField();
 * @before <input id="quicksearch" value="Enter search here" name="quicksearch" />
 *
 * @name searchField
 * @type jQuery
 * @cat Plugins/Utilities
 * @author Jörn Zaefferer (http://bassistance.de)
 */
$.fn.searchField = function() {
	return this.focus(function() {
		if( this.value == this.defaultValue ) {
			this.value = "";
		}
	}).blur(function() {
		if( !this.value.length ) {
			this.value = this.defaultValue;
		}
	});
};