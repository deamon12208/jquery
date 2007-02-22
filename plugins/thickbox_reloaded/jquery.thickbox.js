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

        thickbox: new function() {

            // needful things
            var IMAGE = 'image', INLINE = 'inline', AJAX = 'ajax', EXTERNAL = 'external', CONFIRM = 'confirm'; // Thickbox type constants
            var DIM_ID = 'tb-dim', LOADING_ID = 'tb-loading', MODAL_ID = 'tb-modal'; // Ids
            var dim, loading, modal;

            // setup Thickbox
            function setup(type, settings, builder, destroyer) {
                // get or create elements
                var jq;
                jq = $('#' + DIM_ID);
                dim = jq.size() && jq || $('<div id="' + DIM_ID + '">' + ($.browser.msie6 ? '<iframe src="javascript:;"></iframe>' : '') + '</div>').appendTo(document.body);
                jq = $('#' + LOADING_ID);
                loading = jq.size() && jq || $('<div id="' + LOADING_ID + '"></div>').appendTo(document.body);
                jq = $('#' + MODAL_ID);
                modal = jq.size() && jq || $('<div id="' + MODAL_ID + '"></div>').appendTo(document.body);
                modal.attr({'class': type});
                // reveal stuff
                dim
                    .bind('click', function() {
                        hide(settings.onHide, destroyer);
                    })
                    .fadeIn('fast', function() {
                        loading.show();
                        builder(); // build specific type
                    });
                // attach keyboard event handler
                $(document).bind('keydown', keydown).bind('keypress', blockKeys);
                $(window).bind('scroll', blockScroll);
            }

            // remove everything
            function hide(callback, destroyer) {
                // hide stuff
                loading.hide();
                modal.fadeOut('fast', function() {
                    modal.empty();
                    if (typeof destroyer == 'function') {
                        destroyer();
                    }
                });
                dim.unbind('click').fadeOut('fast', typeof callback == 'function' ? callback : function() {});
                // remove keyboard event handler
                $(document).unbind('keydown', keydown).unbind('keypress', blockKeys);
                $(window).unbind('scroll', blockScroll);
            }

            // helper
            function blockKeys(e) {
                var allowed = $('a, input, select, textarea', modal);
                for (var i = 0, k = allowed.length; i < k; i++) {
                    if (allowed[i] == e.target) {
                        return true;
                    }
                }
                return false;
            }
            function blockScroll() {
                return false;
            }
            function keydown(e) {
                var key = e.which || e.keyCode || null;
                if (key && key == 27) {
                    hide();
                } else {
                    blockKeys(e);
                }
            }

            // public
            this.render = function(settings) {

                // initialize settings
                settings = $.extend({
                    /*top: null,
                    left: null,
                    width: null,
                    height: null,
                    onShow: null,
                    onHide: null,
                    onConfirm: null,
                    slideshow: null,*/
                    confirmTitle: 'Are you sure?',
                    confirmYes: 'Yes',
                    confirmNo: 'No'
                }, settings);

                return this.each(function() {
                    var $$ = $(this);
                    var isLink = $$.is('a') && $$.attr('href');
                    var isImage = isLink && false; // TODO this.href == 'image'
                    var isInline = !!this.hash;
                    var isAjax = this.hostname == location.hostname && !isInline;
                    var isExternal = isLink && this.hostname != location.hostname;
                    var isForm = $$.is('form');
                    var type = isImage && IMAGE || isInline && INLINE || isAjax && AJAX || isExternal && EXTERNAL || isForm && CONFIRM;
                    //console.log('isImage: ' + isImage + '; isInline: ' + isInline + '; isAjax: ' + isAjax + '; isExternal: ' + isExternal + '; isForm: ' + isForm + '; ');

                    // switch type of Thickbox to be bound to element
                    var builder, destroyer;
                    switch (type) {
                        case IMAGE:
                            builder = function() {
                                // TODO
                            };
                            break;
                        case INLINE:
                            var content = $($$[0].hash);
                            builder = function() {
                                content.appendTo(modal);
                                // TODO refactor common
                                modal.show();
                                if (typeof settings.onShow == 'function') {
                                    settings.onShow();
                                }
                            };
                            destroyer = function() {
                                content.appendTo(content.parent());
                            };
                            break;
                        case AJAX:
                            builder = function() {
                                modal.load($$.attr('href'), function() {
                                    // TODO refactor common
                                    modal.show();
                                    if (typeof settings.onShow == 'function') {
                                        settings.onShow();
                                    }
                                });
                            };
                            break;
                        case EXTERNAL:
                            builder = function() {
                                modal.append('<iframe src="' +  $$.attr('href') + '" frameborder="0"></iframe>');
                                // TODO refactor common
                                modal.show();
                                if (typeof settings.onShow == 'function') {
                                    settings.onShow();
                                }
                            };
                            break;
                        case CONFIRM:
                            builder = function() {
                                modal.append('<h2>' + settings.confirmTitle + '</h2>');
                                var p = $('<p></p>').appendTo(modal);
                                $('<a id="tb-confirm" href="#">' + settings.confirmYes + '</a><span> | </span>').appendTo(p).click(function() {
                                    // pass confirm as callback to hide
                                    hide(settings.onConfirm || function() {
                                        $$[0].submit();
                                    });
                                    return false;
                                });
                                $('<a id="tb-cancel" href="#">' + settings.confirmNo + '</a> ').appendTo(p).click(function() {
                                    hide();
                                    return false;
                                });
                                // TODO refactor common
                                modal.show();
                                if (typeof settings.onShow == 'function') {
                                    settings.onShow();
                                }
                            };
                            break;
                        default:
                            builder = function() {
                                alert('You can only apply a Thickbox to links and forms.'); // Show this in Thickbox maybe? ;-)
                            };
                    }

                    // bind event
                    $$.bind((isForm ? 'submit' : 'click'), function() {
                        setup(type, settings, builder, destroyer);

                        // TODO:
                        // types: image | inline | ajax | iframe
                        // depends on:
                        //     confirm: this is form
                        //     image: this.href is image
                        //     content: this.hash
                        //     ajax: this.href is internal and not image
                        //     iframe: this.href is external and not image

                        this.blur(); // remove focus from active element
                        return false;
                    });

                });
            };

        }
    });

    $.fn.extend({
        thickbox: $.thickbox.render
    });

})(jQuery);