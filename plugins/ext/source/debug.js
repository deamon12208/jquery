/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

/*
 * These functions are only included in -debug files
 *
*/
/**
 * Debugging function. Prints all arguments to a resizable, movable, scrolling region without
 * the need to include separate js or css. Double click it to hide it.
 * @param {Mixed} arg1
 * @param {Mixed} arg2
 * @param {Mixed} etc
 * @method print
 */
Ext.print = function(arg1, arg2, etc){
    if(!Ext._console){
        var cs = Ext.DomHelper.insertBefore(document.body.firstChild,
        {tag: "div",style:"width:250px;height:350px;overflow:auto;border:3px solid #c3daf9;" +
                "background:#fff;position:absolute;right:5px;top:5px;" +
                "font-size:11px;z-index:15005;padding:5px;"}, true);
        if(Ext.Resizable){
            var rz = new Ext.Resizable(cs, {
                transparent:true,
                handles: "all",
                pinned:true,
                adjustments: [0,0],
                wrap:true,
                draggable: Ext.dd.DD ? true : false
            });
            rz.proxy.applyStyles("border:3px solid #93aac9;background:#c3daf9;position:absolute;visibility:hidden;z-index:50001;");
            rz.proxy.setOpacity(.3);
        }
        cs.on("dblclick", cs.hide);
        Ext._console = cs;
    }
    var m = "";
    for(var i = 0, len = arguments.length; i < len; i++) {
    	m += (i == 0 ? "" : ", ") + arguments[i];
    }
    var d = Ext._console.dom;
    Ext.DomHelper.insertHtml("afterBegin", d, '<pre style="white-space:pre-wrap"><xmp>' + m + "</xmp></pre>" + '<hr noshade style="color:#eeeeee;" size="1">');
    d.scrollTop = 0;
    Ext._console.show();
};

/**
 * Applies the passed C#/DomHelper style format (e.g. "The variable {0} is equal to {1}") before calling {@link Ext#print}
 * @param {String} format
 * @param {Mixed} arg1
 * @param {Mixed} arg2
 * @param {Mixed} etc
 * @method printf
 */
Ext.printf = function(format, arg1, arg2, etc){
    Ext.print(String.format.apply(String, arguments));
};

/**
 * Dumps an object to Ext.print
 * @param {Object} o
 * @method dump
 */
Ext.dump = function(o){
    if(!o){
        Ext.print("null");
    }else if(typeof o != "object"){
        Ext.print(o);
    }else{
        var b = ["{\n"];
        for(var key in o){
            var to = typeof o[key];
            if(to != "function" && to != "object"){
                b.push(String.format("  {0}: {1},\n", key, Ext.util.Format.ellipsis(String(o[key]).replace(/(\n|\r)/g, ""), 40)));
            }
        }
        var s = b.join("");
        if(s.length > 3){
            s = s.substr(0, s.length-2);
        }
        Ext.print(s + "\n}");
    }
};

Ext._timers = {};
/**
 * Starts a timer.
 * @param {String} name (optional)
 * @method timer
 */
Ext.timer = function(name){
    name = name || "def";
    Ext._timers[name] = new Date().getTime();
};

/**
 * Ends a timer, returns the results (formatted "{1} ms") and optionally prints them to Ext.print()
 * @param {String} name (optional)
 * @param {Boolean} printResults (optional) false to stop printing the results to Ext.print
 * @method timerEnd
 */
Ext.timerEnd = function(name, printResults){
    var t = new Date().getTime();
    name = name || "def";
    var v = String.format("{0} ms", t-Ext._timers[name]);
    Ext._timers[name] = new Date().getTime();
    if(printResults !== false){
        Ext.print(name == "def" ? v : name + ": " + v);
    }
    return v;
};