$(function() {
    // initialize the tabs
   // var tab = location.hash == '#options-object' ? 2 : 1;
    var main = $('#main').tabs();
    //$('#samples').tabs( { selectedClass: 'sample-tab-selected', bookmarkable: false });

});

// helper
function objToString(o) {
    var s = '{\n';
    for (var p in o)
        s += '    ' + p + ': ' + o[p] + '\n';
    return s + '}';
}

// helper
function elementToString(n, useRefs) {
    var attr = "", nest = "", a = n.attributes;
    for (var i=0; a && i < a.length; i++)
        attr += ' ' + a[i].nodeName + '="' + a[i].nodeValue + '"';

    if (n.hasChildNodes == false)
        return "<" + n.nodeName + "\/>";

    for (var i=0; i < n.childNodes.length; i++) {
        var c = n.childNodes.item(i);
        if (c.nodeType == 1)       nest += elementToString(c);
        else if (c.nodeType == 2)  attr += " " + c.nodeName + "=\"" + c.nodeValue + "\" ";
        else if (c.nodeType == 3)  nest += c.nodeValue;
    }
    var s = "<" + n.nodeName + attr + ">" + nest + "<\/" + n.nodeName + ">";
    return useRefs ? s.replace(/</g,'&lt;').replace(/>/g,'&gt;') : s;
};
