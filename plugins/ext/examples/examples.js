/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 */

// common library select
document.write('<link rel="stylesheet" type="text/css" href="../lib.css" /><div id="lib-bar" class="x-layout-panel-hd"><div id="lib-bar-inner"> \
    <span>Theme:</span>&#160;&#160;<select id="exttheme"><option value="default">Ext Blue</option><option value="gray">Gray Theme</option><option value="aero">Aero Glass Theme</option><option value="vista">Vista Dark Theme</option></select> \
    | <span>Library:</span>&#160;&#160;<select id="extlib"><option value="yahoo">Yahoo! UI</option><option value="jquery">jQuery</option></select> \
</div></div>');

Ext.example = function(){
    var msgCt;

    function createBox(t, s){
        return ['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
    }
    return {
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            msgCt.alignTo(document, 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {html:createBox(title, s)}, true);
            m.slideIn('t').pause(1).ghost("t", {remove:true});
        },

        init : function(){
            var s = Ext.get('extlib'), t = Ext.get('exttheme');
            var lib = Cookies.get('extlib'), theme = Cookies.get('exttheme');
            if(lib){
                s.dom.value = lib;
            }
            if(theme){
                t.dom.value = theme;
            }
            s.on('change', function(){
                Cookies.set('extlib', s.getValue());
                window.location.reload();
            });

            t.on('change', function(){
                Cookies.set('exttheme', t.getValue());
                window.location.reload();
            });
        }
    };
}();

Ext.onReady(Ext.example.init, Ext.example);