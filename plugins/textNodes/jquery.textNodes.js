/* Alpha test code, test before using. send comments to jakecigar@gmail.com */
jQuery.fn.span = function() {return this.wrap('<span/>').parent()};
jQuery.fn.split = function(re) {
	var text=[];
	var re = re || $.browser.opera ? /(\s+)/ :  /\b/ ;
	this.each(function(){
		var tnp = this.parentNode;
		var splits = this.nodeValue.split(re);
		for (var i=0;i<splits.length;i++){
			var t = document.createTextNode(splits[i]);
			tnp.insertBefore(t,this);
			text.push(t)
		};
		tnp.removeChild(this)
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
		}else{
			text.push($this.textNodes(true).replace(re,f).end().end())
		//	text.push($this.text($this.text().replace(re,f)))
		}
	});
	return this.pushStack(tNodes ? text : this)
};
jQuery.fn.textNodes = function(deep,dontPushStack) {
	var text=[];
	this.each(function(){
		var children =this.childNodes;
		for (var i = 0; i < children.length; i++){
			var child = children[i];
			if (child.nodeType == 3) 
				text.push(child);
			else if (deep && child.nodeType == 1){
				var kids = jQuery(child).textNodes(deep,true);
				Array.prototype.push.apply(text,kids);
			}
		}
	});
	return dontPushStack ? text : this.pushStack(text);
};
