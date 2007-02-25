/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

if(typeof YAHOO == "undefined"){
    throw "Unable to load Ext, core YUI utilities (yahoo, dom, event) not found.";
}

(function(){
var E = YAHOO.util.Event;
var D = YAHOO.util.Dom;
var CN = YAHOO.util.Connect;    

var ES = YAHOO.util.Easing;
var A = YAHOO.util.Anim;

Ext.lib.Dom = {
    getViewWidth : function(full){
        return full ? D.getDocumentWidth() : D.getViewportWidth();
    },

    getViewHeight : function(full){
        return full ? D.getDocumentHeight() : D.getViewportHeight();
    },

    isAncestor : function(haystack, needle){
        return D.isAncestor(haystack, needle);
    },

    getRegion : function(el){
        return D.getRegion(el);
    },

    getY : function(el){
        return D.getY(el);
    },

    getX : function(el){
        return D.getX(el);
    },

    getXY : function(el){
        return D.getXY(el);
    },

    setXY : function(el, xy){
        D.setXY(el, xy);
    },

    setX : function(el, x){
        D.setX(el, x);
    },

    setY : function(el, y){
        D.setY(el, y);
    }
};

Ext.lib.Event = {
    getPageX : function(e){
        return E.getPageX(e.browserEvent || e);
    },

    getPageY : function(e){
        return E.getPageY(e.browserEvent || e);
    },

    getXY : function(e){
        return E.getXY(e.browserEvent || e);
    },

    getTarget : function(e){
        return E.getTarget(e.browserEvent || e);
    },

    getRelatedTarget : function(e){
        return E.getRelatedTarget(e.browserEvent || e);
    },

    on : function(el, eventName, fn, scope, override){
        E.on(el, eventName, fn, scope, override);
    },

    un : function(el, eventName, fn){
        E.removeListener(el, eventName, fn);
    },

    purgeElement : function(el){
        E.purgeElement(el);
    },

    preventDefault : function(e){
        E.preventDefault(e.browserEvent || e);
    },

    stopPropagation : function(e){
        E.stopPropagation(e.browserEvent || e);
    },

    stopEvent : function(e){
        E.stopEvent(e.browserEvent || e);
    },

    onAvailable : function(el, fn, scope, override){
        return E.onAvailable(el, fn, scope, override);
    }
};

Ext.lib.Ajax = {
    request : function(method, uri, cb, data){
        return CN.asyncRequest(method, uri, cb, data);
    },

    formRequest : function(form, uri, cb, data, isUpload, sslUri){
        CN.setForm(form, isUpload, sslUri);
        return CN.asyncRequest('POST', uri, cb, data);
    },

    isCallInProgress : function(trans){
        return CN.isCallInProgress(trans);
    },

    abort : function(trans){
        return CN.abort(trans);
    }
};

Ext.lib.Region = YAHOO.util.Region;
Ext.lib.Point = YAHOO.util.Point;


Ext.lib.Anim = {
    scroll : function(el, args, duration, easing, cb, scope){
        this.run(el, args, duration, easing, cb, scope, YAHOO.util.Scroll);
    },

    motion : function(el, args, duration, easing, cb, scope){
        this.run(el, args, duration, easing, cb, scope, YAHOO.util.Motion);
    },

    color : function(el, args, duration, easing, cb, scope){
        this.run(el, args, duration, easing, cb, scope, YAHOO.util.ColorAnim);
    },

    run : function(el, args, duration, easing, cb, scope, type){
        type = type || YAHOO.util.Anim;
        if(typeof easing == "string"){
            easing = YAHOO.util.Easing[easing];
        }
        var anim = new type(el, args, duration, easing);
        anim.animateX(function(){
            Ext.callback(cb, scope);
        });
        return anim;
    }
};

// prevent IE leaks
if(Ext.isIE){
    YAHOO.util.Event.on(window, "unload", function(){
        var p = Function.prototype;
        delete p.createSequence;
        delete p.defer;
        delete p.createDelegate;
        delete p.createCallback;
        delete p.createInterceptor;
    });
}

// various overrides

// add ability for callbacks with animations
if(YAHOO.util.Anim){
    YAHOO.util.Anim.prototype.animateX = function(callback, scope){
        var f = function(){
            this.onComplete.unsubscribe(f);
            if(typeof callback == "function"){
                callback.call(scope || this, this);
            }
        };
        this.onComplete.subscribe(f, this, true);
        this.animate();
    };
}

if(YAHOO.util.DragDrop && Ext.dd.DragDrop){
    YAHOO.util.DragDrop.defaultPadding = Ext.dd.DragDrop.defaultPadding;
    YAHOO.util.DragDrop.constrainTo = Ext.dd.DragDrop.constrainTo;
}

// various Safari fixes, opera fix
if(Ext.isSafari || Ext.isOpera){// modified getXY which has the fix for Safari bug. Changes are preceded with **
    YAHOO.util.Dom.getXY = function(el) {
        var isIE = Ext.isIE,  isSafari = Ext.isSafari, Y = YAHOO.util;

        var f = function(el) {

        // has to be part of document to have pageXY
            if (el.parentNode === null || el.offsetParent === null ||
                    this.getStyle(el, "display") == "none") {
                return false;
            }



            var parentNode = null;
            var pos = [];
            var box;

            if (el.getBoundingClientRect) { // IE
                box = el.getBoundingClientRect();
                var doc = document;
                if ( !this.inDocument(el) && parent.document != document) {// might be in a frame, need to get its scroll
                    doc = parent.document;

                    if ( !this.isAncestor(doc.documentElement, el) ) {
                        return false;
                    }

                }

                var scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
                var scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);

                return [box.left + scrollLeft, box.top + scrollTop];
            } else { // safari, opera, & gecko
                pos = [el.offsetLeft, el.offsetTop];
                parentNode = el.offsetParent;
                var hasAbsolute = false; // ** flag if a parent is positioned

                if (parentNode != el) {
                    while (parentNode) {
                        pos[0] += parentNode.offsetLeft;
                        pos[1] += parentNode.offsetTop;
                        // ** only check if needed
                        if(isSafari && !hasAbsolute && this.getStyle(parentNode, "position") == "absolute" ){
                            hasAbsolute = true;
                        }
                        parentNode = parentNode.offsetParent;
                    }
                }
                // ** safari doubles in some cases, use flag from offsetParent's as well
                if (isSafari && (hasAbsolute || this.getStyle(el, "position") == "absolute")) {
                    pos[0] -= document.body.offsetLeft;
                    pos[1] -= document.body.offsetTop;
                }
            }

            if (el.parentNode) { parentNode = el.parentNode; }
            else { parentNode = null; }

            while (parentNode && parentNode.tagName.toUpperCase() != "BODY" && parentNode.tagName.toUpperCase() != "HTML")
            { // account for any scrolled ancestors
                // ** opera TR has bad scroll values, so filter them jvs
                if (Y.Dom.getStyle(parentNode, "display") != "inline" && parentNode.tagName.toUpperCase() != "TR") { // work around opera inline scrollLeft/Top bug
                    pos[0] -= parentNode.scrollLeft;
                    pos[1] -= parentNode.scrollTop;
                }

                if (parentNode.parentNode) {
                    parentNode = parentNode.parentNode;
                } else { parentNode = null; }
            }


            return pos;
        };

        return Y.Dom.batch(el, f, Y.Dom, true);
    };


    // workaround for Safari anim duration speed problems
    if(YAHOO.util.AnimMgr){
        YAHOO.util.AnimMgr.fps = 1000;
    }
}

YAHOO.util.Region.prototype.adjust = function(t, l, b, r){
    this.top += t;
    this.left += l;
    this.right += r;
    this.bottom += b;
    return this;
};
})();