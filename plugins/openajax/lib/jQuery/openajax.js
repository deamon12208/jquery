/*
 * Adds OpenAjax Alliance Support to jQuery
 *
 * Include this plugin in a page to hook jQuery into the OpenAjax platform.
 * For example:
 *   <script src="jquery.js"></script>
 *   <script src="openajax.js"></script>
 */

if ( typeof OpenAjax != "undefined" ) {
	OpenAjax.registerLibrary("jQuery", "http://jquery.com/", "1.1");
	OpenAjax.registerGlobals("jQuery", ["jQuery"]);
}