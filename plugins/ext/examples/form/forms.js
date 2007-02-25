/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 */

Ext.onReady(function(){
    /*
    var menu = new Ext.menu.Menu('mainMenu');
    menu.add(
        new Ext.menu.CheckItem({text: 'Default to Today'}),
        {text: 'Some Other Item'},
        '-', {
            text: 'Choose a Date',
            cls: 'calendar',
            menu: new Ext.menu.DateMenu()
        }
    );

    var tb = new Ext.Toolbar('toolbar');
    tb.add({text:'Show Menu', menu: menu});
    */

    var text = new Ext.form.TextArea({
        allowBlank:false,
        disabled:false,
        grow: true
    });

    var editor = new Ext.Editor(text, {
        updateEl : true,
        shadow: true,
        allowBlur: true
    });

    Ext.get('edit-link').on('click', function(e){
        e.stopEvent();
        editor.startEdit(this);
    });
    
    var tf = new Ext.form.TextField({allowBlank:false, disabled:true, hidden:true});
    tf.render('container');

    var s = new Ext.form.Field({autoCreate: {tag: 'select', children: [
            {tag: 'option', value:'in', html: 'Slide In'},
            {tag: 'option', value:'out', html: 'Slide Out'}
            ]}});
    s.render('container');

    var d = new Ext.form.DateField({disabledDays:[0,6]});
    d.render('container');

    var n = new Ext.form.TextField();
    n.render('container');

    var b = new Ext.Button('container', {text: 'Slide', handler: function(){
        var ct = Ext.get('container');
        //ct.hide();
        ct.move('left', 100, {remove:true});//.slideOut('r');
        return;

        ct[s.getValue() == 'out' ? 'slideOut' : 'slideIn'](n.getValue(), {
            callback: function(){ct.show.defer(1000, ct);}
        });
    }});



});