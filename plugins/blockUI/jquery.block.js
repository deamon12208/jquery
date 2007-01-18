/*
 * jQuery blockUI plugin
 * Version 0.7 (01/17/2007)
 * @requires jQuery v1.0
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
 (function($) {
/**
 * blockUI provides a way to effectively simulate synchronous behavior during ajax operations 
 * without locking the browser.  It will prevent user operations for the current page while it is
 * active.  blockUI accepts the following two optional arguments:
 *
 *   (String|Element|jQuery) message: The message to be displayed while the UI is blocked. The message argument
 *              can be a plain text string, like "Processing...", an HTML string like,
 *              "<h1><img src="busy.gif" /> Please wait...</h1>", a DOM element, or a jQuery object.
 *
 *   (Object) css:  Object which contains css values to override the default styles of
 *              the message.  Use this argument if you wish to override the default 
 *              styles.  The css Object should be in a format suitable for the jQuery.css
 *              function.  For example:
 *              $.blockUI({
 *                    backgroundColor: '#ff8',
 *                    border: '5px solid #f00,
 *                    fontWeight: 'bold'
 *              });
 *
 * @example
 * $.blockUI();
 * @desc prevent user interaction with the page (and show the default message of 'Please wait...')
 *
 * @example
 * $.blockUI( { backgroundColor: '#f00', color: '#fff'} );
 * @desc prevent user interaction and override the default styles of the message to use a white on red color scheme
 *
 * @example
 * $.blockUI('Processing...');
 * @desc prevent user interaction and display the message "Processing..." instead of the default message
 *
 * @name blockUI
 * @type jQuery
 * @param String|jQuery|Element message Message to display while the UI is blocked
 * @param Object css Style object to control look of the message
 * @cat Plugins/blockUI
 * @see unblockUI
 */
$.blockUI = function(msg, css) {
    if (msg && typeof msg == 'object' && !msg.jquery && !msg.nodeType) {
        css = msg;
        msg = null;
    }
    msg = msg ? (msg.nodeType ? $(msg) : msg) : '<h1>Please wait...</h1>';
    impl.init(msg, css || {});
}; 
  
/**
 * unblockUI removes the UI block that was put in place by blockUI
 *
 * @example
 * $.unblockUI();
 * @desc Unblocks the UI
 *
 * @name unblockUI
 * @type jQuery
 * @cat Plugins/blockUI
 * @see blockUI
 */
$.unblockUI = function(options) {
    if (impl.g) impl.show(0);
};

var impl = {
    vis: 0, g: 0, m: 0,
    ie6: $.browser.msie && typeof XMLHttpRequest == 'function',
    noalpha: (window.opera && window.opera.version() < 9) || ($.browser.mozilla && /Linux/.test(navigator.platform)),
    show: function(s) { s ? this.g.show() : this.g.hide(); this.vis = s },
    init: function(msg, css) {
        if (impl.g) {
            m.empty().append(msg).css(css);
            if (msg.jquery) msg.show();
            return this.show(1);
        }
        $('html,body').css('height','100%');
        var h = function() { return !impl.vis };
        $().bind('keypress',h).bind('keydown',h).bind('mousedown',h);

        var f = $('<iframe style="z-index:1000;background-color:#fff;border:none"></iframe>');
        var w = $('<div style="z-index:2000;cursor:wait"></div>');
            m = $('<div id="blockUI" style="z-index:3000;cursor:wait;padding:0;position:fixed;top:50%;left:50%;width:250px;margin:-50px 0 0 -125px;text-align:center;background-color:#fff;border:3px solid #aaa"></div>');
        $([f[0],w[0]]).css({position:'fixed',width:'100%',height:'100%',top:'0',left:'0'});
        this.g  = $([f[0],w[0],m[0]]).appendTo('body');
        m.append(msg).css(css);
        if (msg.jquery) msg.show();
        
        this.noalpha ? f.css('width','0') : f.css('opacity','0.6');

        if (this.ie6) {
            $.each([f,w,m], function(i) {
                var s = this[0].style;
                s.position = 'absolute';
                if (i < 2)
                    s.setExpression('height',
                        'document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight + "px"');
                else {
                    s.setExpression('top',
                        '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
                    s.marginTop = 0;
                }
            });
        }
    }
};

})(jQuery);