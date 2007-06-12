/* Beta 0.2  Send comments to jakecigar@gmail.com */

// span wraps a textNode into a normal jQuery span node
jQuery.fn.span = function() {return this.wrap('<span/>').parent()};

jQuery.fn.match = function(re) {
	var texts=[];
	this.textNodes(true).each(function(){
		var res,val = this.nodeValue;
		var ranges=[0];
		while (res = re.exec(val)){
			var lastMatch = res[0];
			ranges.push(res.index,res.index+res[0].length);
			if (!re.global) break
		};
		ranges.push(val.length)
		if (ranges.length>2){
			if (val == lastMatch)
				texts.push(this);
			else{
				var tpn = this.parentNode;
				for (var i=0;i<ranges.length -1;i++){
					var t = document.createTextNode(val.substring(ranges[i],ranges[i+1]));
					tpn.insertBefore(t,this);
					if (i % 2)texts.push(t)
				};
				tpn.removeChild(this)
			}
		}
	});
	return this.pushStack( texts );
};

jQuery.fn.split = function(re) {
	var texts=[];
	var re = re || $.browser.opera ? /(\W+)/ :  /\b/ ;
	this.each(function(){
		var tpn = this.parentNode;
		var splits = this.nodeValue.split(re);
		for (var i=0;i<splits.length;i++){
			var t = document.createTextNode(splits[i]);
			tpn.insertBefore(t,this);
			texts.push(t)
		};
		tpn.removeChild(this)
	});
	return this.pushStack( texts );
};

jQuery.fn.replace  = function(re,f) {
	var texts=[], tNodes=false;
	this.each(function(){
		var $this = jQuery(this);
		if (this.nodeType == 3){
			tNodes=true;
			texts.push(this.parentNode.insertBefore(document.createTextNode(this.nodeValue.replace(re,f)),this));
			this.parentNode.removeChild(this)
		}else
			texts.push($this.textNodes(true).replace(re,f).end().end())
	});
	return this.pushStack(tNodes ? texts : this)
};

jQuery.fn.textNode = function(s) {return jQuery(document.createTextNode(s))};
jQuery.fn.textNodes = function(deep) {
	var texts=[];
	this.each(function(){
		var children =this.childNodes;
		for (var i = 0; i < children.length; i++){
			var child = children[i];
			if (child.nodeType == 3) 
				texts.push(child);
			else if (deep && child.nodeType == 1)
				Array.prototype.push.apply(texts,jQuery(child).textNodes(deep,true));
		}
	});
	return arguments[1] ? texts : this.pushStack(texts);
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