$.toasterLite = function(settings) {
    settings = $.extend({
        timeout: 3000,
        title: '',
        text: '',
        animationSpeed: 500,
        location: 'bl'
    }, settings);
    
    var html = '<div class="ui-toasterLite ui-resizable"><div calss="ui-toasterLite-container">';
    if(!!settings.title) {
        html += '<div class="ui-toasterLite-titlebar"><span class="ui-toasterLite-title">'+ settings.title +'</span></div>';
    }
    html += '<div class="ui-toasterLite-content">'+ settings.text +'</div></div>'+
    '<div class="ui-toasterLite-n ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-s ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-e ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-w ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-ne ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-se ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-sw ui-toasterLite-corner"/>'+
    '<div class="ui-toasterLite-nw ui-toasterLite-corner"/>'+
    '</div>';
    html = $(html);
    
    $toasters = $('body > .ui-toasterLite');
    if ($toasters.length) $toasters.after(html[0]);
    else $('body').append(html);
    
    window.setTimeout(function() { html.slideUp(settings.animationSpeed, function(){ html.remove(); }); }, settings.timeout);
}
