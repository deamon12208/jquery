/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 */

// old school cookie functions grabbed off the web
var Cookies = {};
Cookies.set = function(name, value){
     var argv = arguments;
     var argc = arguments.length;
     var expires = (argc > 2) ? argv[2] : null;
     var path = (argc > 3) ? argv[3] : '/';
     var domain = (argc > 4) ? argv[4] : null;
     var secure = (argc > 5) ? argv[5] : false;
     document.cookie = name + "=" + escape (value) +
       ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
       ((path == null) ? "" : ("; path=" + path)) +
       ((domain == null) ? "" : ("; domain=" + domain)) +
       ((secure == true) ? "; secure" : "");
};

Cookies.get = function(name){
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	var j = 0;
	while(i < clen){
		j = i + alen;
		if (document.cookie.substring(i, j) == arg)
			return Cookies.getCookieVal(j);
		i = document.cookie.indexOf(" ", i) + 1;
		if(i == 0)
			break;
	}
	return null;
};

Cookies.clear = function(name) {
  if(Cookies.get(name)){
    document.cookie = name + "=" +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
};

Cookies.getCookieVal = function(offset){
   var endstr = document.cookie.indexOf(";", offset);
   if(endstr == -1){
       endstr = document.cookie.length;
   }
   return unescape(document.cookie.substring(offset, endstr));
};

if(Cookies.get('extlib') == 'jquery'){
    document.write([
       '<script type="text/javascript" src="../../jquery.js"></scri','pt>',
       '<script type="text/javascript" src="../jquery-plugins.js"></scr','ipt>',
       '<script type="text/javascript" src="../../ext-jquery-adapter.js"></scr','ipt>'].join(''));
}else{
    document.write([
       '<script type="text/javascript" src="../../yui-utilities.js"></scr','ipt>',
       '<script type="text/javascript" src="../../ext-yui-adapter.js"></scr','ipt>'].join(''));
}
var xtheme = Cookies.get('exttheme');
if(xtheme && xtheme != 'default'){
    document.write('<link rel="stylesheet" type="text/css" href="../../resources/css/ytheme-'+xtheme+'.css" />');
}