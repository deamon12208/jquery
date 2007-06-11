/* Beta 0.1  Send comments to jakecigar@gmail.com */

// span wraps a textNode into a normal jQuery span node
jQuery.fn.span = function() {return this.wrap('<span/>').parent()};


jQuery.fn.split = function(re) {
	var text=[];
	var re = re || $.browser.opera ? /(\W+)/ :  /\b/ ;
	this.each(function(){
		var tpn = this.parentNode;
		var splits = this.nodeValue.split(re);
		for (var i=0;i<splits.length;i++){
			var t = document.createTextNode(splits[i]);
			tpn.insertBefore(t,this);
			text.push(t)
		};
		tpn.removeChild(this)
	});
	return this.pushStack( text );
};

jQuery.fn.replace  = function(re,f) {
	var text=[], tNodes=false;
	this.each(function(){
		var $this = jQuery(this);
		if (this.nodeType == 3){
			tNodes=true;
			text.push(this.parentNode.insertBefore(document.createTextNode(this.nodeValue.replace(re,f)),this));
			this.parentNode.removeChild(this)
		}else
			text.push($this.textNodes(true).replace(re,f).end().end())
	});
	return this.pushStack(tNodes ? text : this)
};

jQuery.fn.textNode = function(s) {return jQuery(document.createTextNode(s))};
jQuery.fn.textNodes = function(deep) {
	var text=[];
	this.each(function(){
		var children =this.childNodes;
		for (var i = 0; i < children.length; i++){
			var child = children[i];
			if (child.nodeType == 3) 
				text.push(child);
			else if (deep && child.nodeType == 1)
				Array.prototype.push.apply(text,jQuery(child).textNodes(deep,true));
		}
	});
	return arguments[1] ? text : this.pushStack(text);
};

jQuery.fn.maketags = function(hash,tag,attr) {
	this.textNodes(true).split().each(function(){
		if (this.nodeValue in hash)
			$(this).wrap(tag).parent().attr(attr,hash[this.nodeValue])
	});
	return this;
};
jQuery.fn.acronyms = function(hash) { return this.maketags(hash,'<acronym/>','title')};
jQuery.fn.links = function(hash) { return this.maketags(hash,'<a/>','href')};
jQuery.fn.classes = function(hash) { return this.maketags(hash,'<span/>','class')};

jQuery.fn.hook = function(hash,className) {
	this.textNodes(true).split().each(function(){
		if (this.nodeValue in hash)
			$(this).wrap('<span class="'+(className||'hooked')+'"/>')
	});
	return this;
};