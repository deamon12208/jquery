/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

Ext.form.TextField=function(_1){Ext.form.TextField.superclass.constructor.call(this,_1);};Ext.extend(Ext.form.TextField,Ext.form.Field,{initEvents:function(){Ext.form.TextField.superclass.initEvents.call(this);this.el.on(this.validationEvent,this.validate,this,{buffer:this.validationDelay});if(this.selectOnFocus){this.el.on("focus",function(){try{this.dom.select();}catch(e){}});}},validateValue:function(_2){if(_2.length<1){if(this.allowBlank){this.clearInvalid();return true;}else{this.markInvalid(this.blankText);return false;}}if(_2.length<this.minLength){this.markInvalid(String.format(this.minLengthText,this.minLength));return false;}if(_2.length>this.maxLength){this.markInvalid(String.format(this.maxLengthText,this.maxLength));return false;}if(typeof this.validator=="function"){var _3=this.validator(_2);if(_3!==true){this.markInvalid(_3);return false;}}if(this.regex&&!this.regex.test(_2)){this.markInvalid(this.regexText);return false;}return true;},allowBlank:true,minLength:0,maxLength:Number.MAX_VALUE,minLengthText:"The minimum length for this field is {0}",maxLengthText:"The maximum length for this field is {0}",selectOnFocus:false,blankText:"This field is required",validator:null,regex:null,regexText:""});
