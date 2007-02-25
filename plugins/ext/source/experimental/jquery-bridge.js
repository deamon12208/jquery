/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

if(typeof jQuery == "undefined"){
    throw "Unable to load Ext, jQuery not found.";
}

(function(){

function translatePoints(el, xy){
    var e = Ext.fly(el);
    var p = e.getStyle('position');
    if(p == "static") {
        e.position("relative");
        p = "relative";
    }

    var o = jQuery(el).offset({scroll:true}), x = o.left,  y = o.top;

    var l = parseInt(e.getStyle('left'), 10);
    var t = parseInt(e.getStyle('top'), 10);

    if(isNaN(l)){
        l = (p == "relative") ? 0 : e.dom.offsetLeft;
    }
    if(isNaN(t)){
        t = (p == "relative") ? 0 : e.dom.offsetTop;
    }

    return {left: (xy[0] - x + l), top: (xy[1] - y + t)};
}

Ext.lib.Dom = {
    getViewWidth : function(full){
        return full ? jQuery(document).width() : jQuery(window).width();
    },

    getViewHeight : function(full){
        return full ? jQuery(document).height() : jQuery(window).height();
    },

    isAncestor : function(p, c){
        p = Ext.getDom(p);
        c = Ext.getDom(c);
        if (!p || !c) {return false;}

        if(p.contains && !Ext.isSafari) {
            return p.contains(c);
        }else if(p.compareDocumentPosition) {
            return !!(p.compareDocumentPosition(c) & 16);
        }else{
            var parent = c.parentNode;
            while (parent) {
                if (parent == p) {
                    return true;
                }
                else if (!parent.tagName || parent.tagName.toUpperCase() == "HTML") {
                    return false;
                }
                parent = parent.parentNode;
            }
            return false;
        }
    },

    getRegion : function(el){
        return Ext.lib.Region.getRegion(el);
    },

    getY : function(el){
        return jQuery(el).offset({scroll:true}).top;
    },

    getX : function(el){
        return jQuery(el).offset({scroll:true}).left;
    },

    getXY : function(el){
        var o = jQuery(el).offset();
        return [o.left,  o.top];
    },

    setXY : function(el, xy, noretry){
        el = Ext.getDom(el);
        var pts = translatePoints(el, xy);
        if(xy[0] !== false){
            el.style.left = pts.left + "px";
        }
        if(xy[1] !== false){
            el.style.top = pts.top + "px";
        }
        //if(!noretry){
        //    this.setXY(el, xy, true);
        //}
    },

    setX : function(el, x){
        this.setXY(el, [x, false]);
    },

    setY : function(el, y){
        this.setXY(el, [false, y]);
    }
};

Ext.lib.Event = {
    getPageX : function(e){
        e = e.browserEvent || e;
        return e.pageX;
    },

    getPageY : function(e){
        e = e.browserEvent || e;
        return e.pageY;
    },

    getXY : function(e){
        e = e.browserEvent || e;
        return [e.pageX, e.pageY];
    },

    getTarget : function(e){
        return e.target;
    },

    // all Ext events will go through event manager which provides scoping
    on : function(el, eventName, fn, scope, override){
        jQuery(el).bind(eventName, fn);
    },

    un : function(el, eventName, fn){
        jQuery(el).unbind(eventName, fn);
    },

    purgeElement : function(el){
        jQuery(el).unbind();
    },

    preventDefault : function(e){
        e.preventDefault();
    },

    stopPropagation : function(e){
        e.stopPropagation();
    },

    stopEvent : function(e){
        e.preventDefault();
        e.stopPropagation();
    },

    onAvailable : function(id, fn, scope){
        var start = new Date();
        var f = function(){
            if(start.getElapsed() > 10000){
                clearInterval(iid);
            }
            var el = document.getElementById(id);
            if(el){
                clearInterval(iid);
                fn.call(scope||window, el);
            }
        };
        var iid = setInterval(f, 50);
    },
    
    resolveTextNode: function(node) {
        if (node && 3 == node.nodeType) {
            return node.parentNode;
        } else {
            return node;
        }
    },

    getRelatedTarget: function(ev) {
        ev = ev.browserEvent || ev;
        var t = ev.relatedTarget;
        if (!t) {
            if (ev.type == "mouseout") {
                t = ev.toElement;
            } else if (ev.type == "mouseover") {
                t = ev.fromElement;
            }
        }

        return this.resolveTextNode(t);
    }
};

Ext.lib.Ajax = function(){
    var createComplete = function(cb){
         return function(xhr, status){
            if((status == 'error' || status == 'timeout') && cb.failure){
                cb.failure.call(cb.scope||window, {
                    responseText: xhr.responseText,
                    responseXML : xhr.responseXML,
                    argument: cb.argument
                });
            }else{
                cb.success.call(cb.scope||window, {
                    responseText: xhr.responseText,
                    responseXML : xhr.responseXML,
                    argument: cb.argument
                });
            }
         };
    };
    return {
        request : function(method, uri, cb, data){
            jQuery.ajax({
                type: method,
                url: uri,
                data: data,
                timeout: cb.timeout,
                complete: createComplete(cb)
            });
        },

        formRequest : function(form, uri, cb, data, isUpload, sslUri){
            jQuery.ajax({
                type: method,
                url: uri,
                data: jQuery(form).formSerialize(),
                timeout: cb.timeout,
                complete: createComplete(cb)
            });
        },

        isCallInProgress : function(trans){
            return false;
        },

        abort : function(trans){
            return false;
        }
    };
}();

Ext.lib.Region = function(t, r, b, l) {
    this.top = t;
    this[1] = t;
    this.right = r;
    this.bottom = b;
    this.left = l;
    this[0] = l;
};

Ext.lib.Region.prototype = {
    contains : function(region) {
        return ( region.left   >= this.left   &&
                 region.right  <= this.right  &&
                 region.top    >= this.top    &&
                 region.bottom <= this.bottom    );

    },

    getArea : function() {
        return ( (this.bottom - this.top) * (this.right - this.left) );
    },

    intersect : function(region) {
        var t = Math.max( this.top,    region.top    );
        var r = Math.min( this.right,  region.right  );
        var b = Math.min( this.bottom, region.bottom );
        var l = Math.max( this.left,   region.left   );

        if (b >= t && r >= l) {
            return new Ext.lib.Region(t, r, b, l);
        } else {
            return null;
        }
    },
    union : function(region) {
        var t = Math.min( this.top,    region.top    );
        var r = Math.max( this.right,  region.right  );
        var b = Math.max( this.bottom, region.bottom );
        var l = Math.min( this.left,   region.left   );

        return new Ext.lib.Region(t, r, b, l);
    },

    adjust : function(t, l, b, r){
        this.top += t;
        this.left += l;
        this.right += r;
        this.bottom += b;
        return this;
    }
};

Ext.lib.Region.getRegion = function(el) {
    var p = Ext.lib.Dom.getXY(el);

    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];

    return new Ext.lib.Region(t, r, b, l);
};

Ext.lib.Point = function(x, y) {
   if (x instanceof Array) {
      y = x[1];
      x = x[0];
   }
    this.x = this.right = this.left = this[0] = x;
    this.y = this.top = this.bottom = this[1] = y;
};

Ext.lib.Point.prototype = new Ext.lib.Region();

Ext.lib.Anim = function(){
    var createAnim = function(cb, scope){
        var animated = true;
        return {
            stop : function(skipToLast){
                // do nothing
            },

            isAnimated : function(){
                return animated;
            },

            proxyCallback : function(){
                animated = false;
                Ext.callback(cb, scope);
            }
        };
    };
    return {
        scroll : function(el, args, duration, easing, cb, scope){
            // scroll anim not supported so just scroll immediately
            var anim = createAnim(cb, scope);
            el = Ext.getDom(el);
            el.scrollLeft = args.to[0];
            el.scrollTop = args.to[1];
            anim.proxyCallback();
            return anim;
        },

        motion : function(el, args, duration, easing, cb, scope){
            this.run(el, args, duration, easing, cb, scope);
        },

        color : function(el, args, duration, easing, cb, scope){
            // color anim not supported, so execute callback immediately
            var anim = createAnim(cb, scope);
            anim.proxyCallback();
            return anim;
        },

        run : function(el, args, duration, easing, cb, scope, type){
            var anim = createAnim(cb, scope);
            var o = {};
            for(var k in args){
                switch(k){
                    case 'width':
                        o.width = args.width.to;
                    break;
                    case 'height':
                        o.height = args.height.to;
                    break;
                    case 'opacity':
                        o.opacity = args.opacity.to;
                    break;
                    case 'points':
                        var by, pts;
                        if(by = args.points.by){
                            var xy = Ext.lib.Dom.getXY(el);
                            pts = translatePoints(el, [xy[0]+by[0], xy[1]+by[1]]);
                        }else{
                            pts = translatePoints(el, args.points.to);
                        }
                        o.left = pts.left;
                        o.top = pts.top;
                        var e = Ext.fly(el);
                        if(!parseInt(e.getStyle('left'), 10)){
                            e.setLeft(0);
                        }
                        if(!parseInt(e.getStyle('top'), 10)){
                            e.setTop(0);
                        }
                    break;
                }
            }
            // TODO: find out about easing plug in?
            jQuery(el).animate(o, duration*1000, undefined, anim.proxyCallback);
            return anim;
        }
    };
}();

// prevent IE leaks
if(Ext.isIE){
    jQuery(window).unload(function(){
        var p = Function.prototype;
        delete p.createSequence;
        delete p.defer;
        delete p.createDelegate;
        delete p.createCallback;
        delete p.createInterceptor;
    });
}
})();