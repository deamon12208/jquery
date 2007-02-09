/**
 * Thickbox 3 - jQuery plugin
 *
 * Copyright (c) 2007 Cody Lindley, Jörn Zaefferer, Klaus Hartl (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

(function($) { // simulate block scope

    $.browser.msie6 = $.browser.msie6 || $.browser.msie && typeof XMLHttpRequest == 'function';

    $.extend({
        thickbox: function(type, settings) {

            // setup
            var BACKGROUND_ID = 'tb-background';
            var LOADING_ID = 'tb-loading';
            var WINDOW_ID = 'tb-window';
            var jq;
            jq = $('#' + BACKGROUND_ID);
            var background = jq.size() && jq || $('<div id="' + BACKGROUND_ID + '">' + ($.browser.msie6 ? '<iframe src="javascript:;"></iframe>' : '') + '</div>').appendTo(document.body);
            jq = $('#' + LOADING_ID);
            var loading = jq.size() && jq || $('<div id="' + LOADING_ID + '"></div>').appendTo(document.body);
            jq = $('#' + WINDOW_ID);
            var window = jq.size() && jq || $('<div id="' + WINDOW_ID + '" class="' + type + '"></div>').appendTo(document.body);

            switch (type) {
                case 'confirm':
                    window.append('<h2>' + settings.confirmTitle + '</h2>');
                    var p = $('<p></p>').appendTo(window);
                    $('<a id="tb-confirm" href="#">' + settings.confirmYes + '</a><span> | </span>').appendTo(p).click(function() {
                        hide(settings.onConfirm); // pass onConfirm as callback to hide
                        return false;
                    });
                    $('<a id="tb-cancel" href="#">' + settings.confirmNo + '</a> ').appendTo(p).click(function() {
                        hide();
                        return false;
                    });
                    break;
            }

            function block(e) {
                var allowed = $('*', window);
                for (var i = 0, k = allowed.length; i < k; i++) {
                    if (allowed[i] == e.target) {
                        return true;
                    }
                }
                return false;
            }

            function keydown(e) {
                var key = e.which || e.keyCode || null;
                if (key && key == 27) {
                    hide();
                } else {
                    block(e);
                }
            }

            // show everything
            function show() {
                // reveal stuff
                background.bind('click', hide).fadeIn('fast', function() {
                    loading.show();
                    window.show();
                    if (typeof settings.onShow == 'function') {
                        settings.onShow();
                    }
                });
                // attach keyboard event handler
                $(document).bind('keydown', keydown).bind('keypress', block);
            }

            // remove everything
            function hide(callback) {
                // hide stuff
                loading.hide();
                window.fadeOut('fast', function() {
                    window.empty();
                });
                background.unbind('click').fadeOut('fast', typeof callback == 'function' ? callback : function() { });
                // remove keyboard event handler
                $(document).unbind('keydown', keydown).unbind('keypress', block);
            }

            show();

        }
    });

    $.fn.thickbox = function(settings) {

        // initialize settings
        settings = $.extend({
            width: '',
            height: '',
            onShow: null,
            onConfirm: null,
            confirmTitle: 'Are you sure?',
            confirmYes: 'Yes',
            confirmNo: 'No'
        }, settings);

        return this.each(function() {
            var jqEl = $(this);
            var isForm = jqEl.is('form');
            var type;
            if (isForm) {
                type = 'confirm';
            }
            // bind event
            jqEl.bind((isForm ? 'submit' : 'click'), function(e) {
                $.thickbox(type, settings);
                // TODO:
                // pass in callback for confirm
                // pass in type: confirm | image | content | ajax
                // depends on:
                //     confirm: this.is('form')
                //     image: $('img', this).size() == 1
                //     content: this.hash
                //     ajax: this.href ... (?)
                this.blur(); // remove focus from active element
                return false;
            });


        })


    };

})(jQuery);