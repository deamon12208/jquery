var DEBUG = true;
(function($) { // main code
	$(function(){ // ready code
		if (!("console" in window) || !("firebug" in console)){
			if (DEBUG)
				$('<div id="DEBUG" style ="position: fixed;left: 0px;height: 100px;overflow: auto;bottom: 0px;z-index: 1000;width: 100%;border-top: 5px solid #0000FF"><ol></ol></div>')
				.attr('title','Shift Click to hide')
				.click(function(e){$(this).height( e.shiftKey ?0 : 100)})
				.appendTo(document.body);
/*
			window.console = {};
			$.each(("log,debug,info,warn,error,assert,dir,dirxml,group,groupEnd,time,timeEnd,count,trace,profile,profileEnd".split(/,/)), function(i,o){
				window.console[o] = $.fn.debug
			})
*/
		}
	});
	$.debug = function(msg){ $('#DEBUG ol').append( '<li>' + msg + '</li>' )};
	$.fn.debug = function(message) {
		if (DEBUG) {
			$.log.apply(this,[(message || 'debug') + ':',this]);
			$("#DEBUG").each(function() {this.scrollTop = this.scrollHeight})
		}
		return this
	};
	$.log =$.fn.log = function() {
		if(DEBUG )
			if("console" in window && 'firebug' in console)
				console.debug.apply('',arguments);
			else
				$.debug($.map(arguments,function(o,i){
					return jsO(o,true)
				}).join(' '));
		return this
	};
	$.fn.xhtml = function () {return $.xhtml(this[0])};
	$.xhtml = function(obj) { // dump the dom back to xhtml text
		if (!obj) return "(null)";
		var res = "";
		var tag = obj.nodeName.toLowerCase();
		var tagShow = tag.charAt(0) != "#";
		if (tagShow) res += '<' + tag;
		if (obj.attributes) 
			res += $.map(obj.attributes,function(attr){
				if (attr.specified && attr.name.charAt(0) != '$') 
					return ' '+attr.name.toLowerCase() + '="' + attr.value + '"'
			}).join('');
		if (tagShow && obj.nodeValue == null && !obj.hasChildNodes())
			return res+" />";
		if (tagShow) res+= ">";
		if (obj.nodeType == 8)
			res += "<!-- " + obj.nodeValue + " -->";
			 if (obj.nodeValue != null)
			res +=  obj.nodeValue;
		if (obj.hasChildNodes && obj.hasChildNodes())
			res += $.map(obj.childNodes,function(child){return $.xhtml(child)}).join('');
		if (tagShow)  res += '</' + tag + '>';
		return res
	};
	var abbr = function(o,bare){
		var s = o.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
		if (bare) 
			return s;
		if (s.length>8)
			return "'" + s.substr(0,8).replace("'","\\'") + "…'";
		return  '"' + s.replace('"','\\"') + '"'
	};
	var tiv = function(obj,title) {
		var $obj = $(obj);
		var res = $obj[0].tagName.toLowerCase();
		if ($obj.attr('id')) res+="#" + $obj.attr('id').bold();
		if ($obj.is(":input")) res+= " " +abbr($obj.val(),true).italics();
		if ($obj.attr('className')) res+="." + $obj.attr('className').fontcolor('red');
		return "<span title='" + title + "'>" +res + "</span>"
	};
	var jsO = function(obj,bare) {
		if (typeof obj != "object") 
			return bare || typeof obj != "string" ? obj : '"' + obj.toString().replace('"','\\"') + '"';
		if (obj.nodeName)
			return $.xhtml(obj).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
		if (obj.jquery )
			return "[" + $.map(obj,function(o){return tiv(o,jsO(o,false)).fontcolor('blue')}).join(',') + ']';
		if (obj.constructor == Array)
			return "[" + $.map(obj,function(o){return jsO(o,false)}).join(',') + ']';
		var res = [];
		$.each(obj,function(i,o){res.push(i + ":" + jsO(o,false))});
		return '{' + res.join(',') + '}'
	}
}(jQuery));
