/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

Ext.form.TextField = function(config){
    Ext.form.TextField.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.TextField, Ext.form.Field,  {
    initEvents : function(){
        Ext.form.TextField.superclass.initEvents.call(this);
        this.el.on(this.validationEvent, this.validate, this, {buffer: this.validationDelay});
        if(this.selectOnFocus){
            this.el.on("focus", function(){
                try{
                    this.dom.select();
                }catch(e){}
            });
        }
    },

    validateValue : function(value){
        if(value.length < 1){ // if it's blank
             if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
        if(value.length < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(value.length > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        if(this.regex && !this.regex.test(value)){
            this.markInvalid(this.regexText);
            return false;
        }
        return true;
    },
    
    allowBlank : true,
    minLength : 0,
    maxLength : Number.MAX_VALUE,
    minLengthText : "The minimum length for this field is {0}",
    maxLengthText : "The maximum length for this field is {0}",
    selectOnFocus : false,
    blankText : "This field is required",
    validator : null,
    regex : null,
    regexText : ""
});