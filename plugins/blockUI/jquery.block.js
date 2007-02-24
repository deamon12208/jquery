/*
 * jQuery blockUI plugin
 * Version 0.94 (02/24/2007)
 * @requires jQuery v1.1.1
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
 (function($) {
/**
 * blockUI provides a mechanism for blocking user interaction with a page.  This can be
 * a very effective way to simulate synchronous behavior during ajax operations without
 * locking the browser.  It will prevent user operations for the current page while it is
 * active.  blockUI accepts the following two optional arguments:
 *
 *   (String|Element|jQuery) message: The message to be displayed while the UI is blocked. The message argument
 *              can be a plain text string, like "Processing...", an HTML string like,
 *              "<h1><img src="busy.gif" /> Please wait...</h1>", a DOM element, or a jQuery object.
 *              The default message is "<h1>Please wait...</h1>"
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
 *  The default blocking message is "<h1>Please wait...</h1>" but this can be overridden
 *  by assigning a value to $.blockUI.defaultMessage in your own code.  For example:
 *
 *  $.blockUI.defaultMessage = "<h1>Bitte Wartezeit</h1>";
 *
 *
 * IMPORTANT NOTE ON STYLES AND POSITIONING:
 * ----------------------------------------
 * The default styling of the blocking message includes the following:
 *
 *    top:50%;left:50%;width:250px;margin:-50px 0 0 -125px
 *
 * These styles work well for common messages like "Please wait".  If you require different positioning
 * or if you're using long messages, or message elements with a height significantly greater than
 * 100px please use the css argument to provide the necessary styles for your message.
 *
 * In addition to the positioning styles mentioned above, the following styles are also
 * applied by default:
 *
 *     padding:0;text-align:center;background-color:#fff;border:3px solid #aaa
 *
 * The css argument can be used to override any of these styles.
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
    // check to see if we were only passed the css object (a literal)
    if (msg && typeof msg == 'object' && !msg.jquery && !msg.nodeType) {
        css = msg;
        msg = null;
    }
    msg = msg ? (msg.nodeType ? $(msg) : msg) : null;
    $.blockUI.impl.show(1, msg || $.blockUI.defaultMessage, css || {});
};

// override this in your code to change the default message
$.blockUI.defaultMessage = '<h1>Please wait...</h1>';

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
    if ($.blockUI.impl.blockSet) $.blockUI.impl.show(0);
};

$.blockUI.impl = {
    visible: 0, blockSet: 0, msgDiv: 0,
    op8: window.opera && window.opera.version() < 9,
    show: function(s,msg,css) {
        if (!this.blockSet) this.init();
        if (s) {
            this.msgDiv.empty().append(msg).css(css);
            if (msg.jquery) msg.show();
            setTimeout(this.focus, 100);
        }
        s ? this.blockSet.show() : this.blockSet.hide();
        this.visible = s
        this.bind(s);
    },
    focus: function() {
        var v = $(':input:visible', $.blockUI.impl.msgDiv)[0];
        if (v) v.focus();
    },
    init: function() {
        var ie6 = $.browser.msie && typeof XMLHttpRequest == 'function';
        var f = $('<iframe style="z-index:1000;background-color:#fff;border:none"></iframe>');
        if (ie6) f.attr('src','javascript:false;document.write(\'\');');
        var w = $('<div style="z-index:2000;cursor:wait"></div>');
        var m = $('<div id="blockUI" style="z-index:3000;cursor:wait;padding:0;position:fixed;top:50%;left:50%;width:250px;margin:-50px 0 0 -125px;text-align:center;background-color:#fff;border:3px solid #aaa"></div>');
        this.msgDiv = m;
        $([f[0],w[0]]).css({position:'fixed',width:'100%',height:'100%',top:'0',left:'0'});
        var noalpha = this.op8 || ($.browser.mozilla && /Linux/.test(navigator.platform));
        noalpha ? f.css('width','0') : f.css('opacity','0.6');
        this.blockSet = $([f[0],w[0],m[0]]).appendTo('body');
        if (ie6) {
            // stretch content area if it's short
            if (jQuery.boxModel && document.body.offsetHeight < document.documentElement.clientHeight)
                $('html,body').css('height','100%');
            // simulate fixed position
            $.each([f,w,m], function(i) {
                var s = this[0].style;
                s.position = 'absolute';
                if (i < 2)
                    s.setExpression('height','document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight + "px"');
                else {
                    s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
                    s.marginTop = 0;
                }
            });
        }
    },
    // event handler to suppress keyboard/mouse events when blocking
    handler: function(e) {
        // always allow tab
        if (e.keyCode && e.keyCode == 9) return true;
        // if blocking entire page, only allow events in the message area
        if ($.blockUI.impl.visible)
            return $(e.target).parents('#blockUI').length > 0;
        // otherwise, allow event if it's not within a blocked element
        return $(e.target).parents().children('iframe.block').length == 0;
    },
    // bind/unbind the handler
    bind: function(b, $e) {
        $e = $e ? $e.find('a,:input') : $();
        jQuery.each(['mousedown','mouseup','keydown','keypress','keyup','click'], function(i,o) {
            $e[b?'bind':'unbind'](o, $.blockUI.impl.handler);
        });
    }
};


/**
 * Blocks user interaction with the selected elements using an iframe.  Most of
 * this logic comes from Brandon Aaron's bgiframe plugin.  Thanks, Brandon!
 *
 * @example
 * $('div.special').block();
 * @desc prevent user interaction with all div elements with the 'special' class.
 *
 * @example
 * $('div.special').block( {
 *     opacity: .4,
 *     zIndex: 1000
 * });
 * @desc prevent user interaction with all div elements with the 'special' class
 * and use custom opacity and zIndex values for the blocking iframe.
 *
 * @example
 * $('div.special').unblock();
 * @desc unblock all div elements with the 'special' class.
 *
 * @type jQuery
 * @param Object options (valid options: opacity and zIndex)
 * @cat Plugins/blockUI
 */
$.fn.block = function(options) {
    options = jQuery.extend({ opacity: .6, zIndex: 1000 }, options || {});
	var f = '<iframe class="block" tabindex="-1" style="display:block;position:absolute;'
                +'background-color:#fff;border:none;z-index:'+options.zIndex+';';
	if ($.browser.msie)
		f += 'filter:Alpha(Opacity=\'' + options.opacity * 100 + '\'); '
			+'top: expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)  || 0) * -1) + \'px\'); '
			+'left:expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth) || 0) * -1) + \'px\'); '
			+'width:expression(this.parentNode.offsetWidth + \'px\'); '
			+'height:expression(this.parentNode.offsetHeight + \'px\')" '
            +'src="javascript:document.write(\'\');" /></iframe>';
	else
		f += 'width:100%;height:100%;top:0;left:0;opacity:' + options.opacity + '"/></iframe>';
    $.blockUI.impl.bind(1,this);
	return this.each(function() {
		if ($('iframe.block', this).length > 0) return;
		if ($.css(this,'position') == 'static')
			this.style.position = 'relative';
        var $f = $(f).prependTo(this);
        if ($.blockUI.impl.op8) $.fn.block.simAlpha(true,$f,this);
	});
};

$.fn.unblock = function() {
    $.blockUI.impl.bind(0,this);
	return this.each(function() {
		$('iframe.block', this).remove();
        if ($.blockUI.impl.op8) $.fn.block.simAlpha(false,0,this);
	});
};

$.fn.block.simAlpha = function(dis,$f,el) {
    if ($f) $f.css('width','0');
    $(':input', el).each(function() {
        dis = dis || !!this.$orig_disabled;
        if (dis) this.$orig_disabled = this.disabled;
        this.disabled = dis;
    });
};

})(jQuery);
