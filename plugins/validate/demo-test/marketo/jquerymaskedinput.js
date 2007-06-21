/*
 * Copyright (c) 2007 Josh Bush (digitalbush.com)
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE. 
 */
 
/*
 * Version: Beta 1
 * Release: 2007-03-28
 */ 
(function($) {
	//Helper Functions for Caret positioning
	getCaretPosition=function(ctl){
		var res = {begin: 0, end: 0 };
		if (ctl.setSelectionRange){
			res.begin = ctl.selectionStart;
			res.end = ctl.selectionEnd;
		}else if (document.selection && document.selection.createRange){
			var range = document.selection.createRange();
			var rTemp = range.duplicate();
			res.begin = 0 - rTemp.moveStart('character', -100000);
			res.end = res.begin + range.text.length;
		}
		return res;
	}

	setCaretPosition=function(ctl, pos){
		if(ctl.setSelectionRange){
			ctl.focus();
			ctl.setSelectionRange(pos,pos);
		}else if (ctl.createTextRange){
			var range = ctl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}
	
	//Main Method
	$.fn.maskedinput = function(mask,placeholder) {		
		if(!placeholder)
			placeholder="_";

		//Helper function for regex building
		function getRegexForPosition(pos){
			switch(mask.charAt(pos)){
				case '9':	return "[0-9]";			
				case'a':	return "[A-Za-z]";
				case '*':	return "[A-Za-z0-9]";
				default:	return null;
			}
		}
			
		//Build Regex for format validation
		//This Regex could be seriously optimized
		var reString="^";	
		for(var i=0;i<mask.length;i++)
			reString+=(getRegexForPosition(i) || ("\\"+mask.charAt(i)));					
		reString+="$";
		var re = new RegExp(reString);


		return this.each(
			function(){		
				var input=$(this);
				var buffer=new Array(mask.length);
				var locked=new Array(mask.length);		

				//Build buffer layour from mask
				for(var i=0;i<mask.length;i++){
					if(mask.charAt(i)!='9' && mask.charAt(i)!='a' && mask.charAt(i)!='*'){
						buffer[i]=mask.charAt(i);
						locked[i]=true;
					}else{
						buffer[i]=placeholder;
						locked[i]=false;
					}					
				}

				input.focus(function(){
					checkVal();
					setCaretPosition(this,0);		
				});

				input.blur(checkVal);
				
				//Paste events for IE and Mozilla thanks to Kristinn Sigmundsson
				if ($.browser.msie) {
					this.onpaste= function(){setTimeout(checkVal,0);};
				}else if ($.browser.mozilla)
					this.addEventListener('input',checkVal,false);
				
				var ignore=false;  //Variable for ignoring control keys
				input.keydown(function(e){
					var pos=getCaretPosition(this);					
					if((pos.begin-pos.end)!=0){//delete selection before proceeding
						for(var i=pos.begin;i<=pos.end;i++){
							if(!locked[i])
								buffer[i]=placeholder;
						}						
					}					
					var k = e.keyCode;
					//backspace and delete get special treatment
					if(k==8){//backspace										
						while(pos.begin-->0){
							if(!locked[pos.begin]){
								buffer[pos.begin]=placeholder;
								writeBuffer();
								setCaretPosition(this,pos.begin);
								return false;
							}
						}					
					}else if(k==46){//delete						
						for(var i=pos.begin;i<=pos.end;i++){
							if(!locked[i])
								buffer[i]=placeholder;
						}						
						writeBuffer();
						setCaretPosition(this,pos.begin);
						return false;
					}
			        ignore=(k < 16 || (k > 16 && k < 32) || (k > 32 && k < 41));					
				});

				input.keypress(function(e){					
					if(ignore){
						ignore=false;
						return;
					}
					e=e||window.event;
					var k=e.charCode||e.keyCode||e.which;

					var pos=getCaretPosition(this);					
					var caretPos=pos.begin;	
					
					if(e.ctrlKey || e.altKey){//Ignore
						return true;
					}else if ((k>=41 && k<=122) ||k==32 || k>186){//typeable characters
						while(pos.begin<mask.length){	
							var reString=getRegexForPosition(pos.begin);
							var match;
							if(reString){
								var reChar=new RegExp(reString);
								match=String.fromCharCode(k).match(reChar);
							}else{//we're on a mask char, go forward and try again
								pos.begin+=1;
								pos.end=pos.begin;
								caretPos+=1;
								continue;
							}

							if(match)
								buffer[pos.begin]=String.fromCharCode(k);
							else
								return false;//reject char

							while(++caretPos<mask.length){//seek forward to next typable position
								if(!locked[caretPos]){							
									break;
								}
							}
							break;
						}
					}else 
						return false;					

					writeBuffer();
					setCaretPosition(this,caretPos);
					return false;				
				});

				function writeBuffer(){
					var s="";
					for(var i=0;i<mask.length;i++)
						s+=buffer[i];
					input.val(s);
				}
				
				function checkVal(){
					if(!input.val().match(re)){
						//try to place charcters where they belong
						var test=input.val();
						var pos=0;
						for(var i=0;i<mask.length;i++){
							if(!locked[i]){
								while(pos++<test.length){
									//Regex Test each char here.
									var reChar=new RegExp(getRegexForPosition(i));
									if(test.charAt(pos-1).match(reChar)){
										buffer[i]=test.charAt(pos-1);
										break;
									}									
								}
							}
						}
						writeBuffer();
						if(!input.val().match(re)){
							input.val("");
							for(var i=0;i<mask.length;i++){
								if(!locked[i])
									buffer[i]=placeholder;
							}
						}
					}					
				}
			}
		);
	};
})(jQuery);