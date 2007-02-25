/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

Ext.Editor = function(field, config){
    Ext.Editor.superclass.constructor.call(this, config);
    this.field = field;
    this.addEvents({
        "beforestartedit" : true,
        "startedit" : true,
        "beforecomplete" : true,
        "complete" : true,
        "specialkey" : true
    });
};

Ext.extend(Ext.Editor, Ext.Component, {
    value : "",
    alignment: "c-c?",
    shadow : "frame",
    updateEl : false,
    onRender : function(ct){
        this.el = new Ext.Layer({
            shadow: this.shadow,
            cls: "xeditor",
            parentEl : ct,
            shim : this.shim,
            shadowOffset:3
        });
        this.el.setStyle("overflow", Ext.isGecko ? "auto" : "hidden");
        this.field.render(this.el);
        this.field.show();
        this.field.on("blur", this.onBlur, this);
        this.relayEvents(this.field,  ["specialkey"]);
        if(this.field.grow){
            this.field.on("autosize", this.el.sync,  this.el, {delay:1});
        }
    },

    startEdit : function(el, value){
        if(this.editing){
            this.completeEdit();
        }
        this.boundEl = Ext.get(el);
        var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
        if(this.fireEvent("beforestartedit", this, this.boundEl, v) === false){
            return;
        }
        if(!this.rendered){
            this.render(this.parentEl || document.body);
        }
        this.startValue = v;
        this.field.setValue(v);
        if(this.autoSize){
            var sz = this.boundEl.getSize();
            switch(this.autoSize){
                case "width":
                this.field.setSize(sz.width,  "");
                break;
                case "height":
                this.field.setSize("",  sz.height);
                break;
                default:
                this.field.setSize(sz.width,  sz.height);
            }
        }
        this.el.alignTo(this.boundEl, this.alignment);
        this.editing = true;
        if(Ext.QuickTips){
            Ext.QuickTips.disable();
        }
        this.show();
    },

    realign : function(){
        this.el.alignTo(this.boundEl, this.alignment);
    },

    completeEdit : function(remainVisible){
        var v = this.getValue();
        if(this.revertInvalid !== false && !this.field.isValid()){
            v = this.startValue;
            this.cancelEdit(true);
        }
        if(v == this.startValue && this.ignoreNoChange){
            this.editing = false;
            this.hide();
        }
        if(this.fireEvent("beforecomplete", this, v, this.startValue) !== false){
            this.editing = false;
            if(this.updateEl && this.boundEl){
                this.boundEl.update(v);
            }
            if(remainVisible !== true){
                this.hide();
            }
            this.fireEvent("complete", this, v, this.startValue);
        }
    },

    onShow : function(){
        this.el.show();
        if(this.hideEl !== false){
            this.boundEl.hide();
        }
        this.field.show();
        this.field.focus();
        this.fireEvent("startedit", this.boundEl, this.startValue);
    },

    cancelEdit : function(remainVisible){
        this.setValue(this.startValue);
        if(remainVisible !== true){
            this.hide();
        }
    },

    onBlur : function(){
        if(this.allowBlur !== true && this.editing){
            this.completeEdit();
        }
    },

    onHide : function(){
        if(this.editing){
            this.completeEdit();
            return;
        }
        this.field.blur();
        this.el.hide();
        if(this.hideEl !== false){
            this.boundEl.show();
        }
        if(Ext.QuickTips){
            Ext.QuickTips.enable();
        }
    },

    setValue : function(v){
        this.field.setValue(v);
    },

    getValue : function(){
        return this.field.getValue();
    }
});