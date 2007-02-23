/**
 * Thickbox 3 - jQuery plugin
 *
 * Copyright (c) 2007 Cody Lindley, Jšrn Zaefferer, Klaus Hartl (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

(function($) { // simulate block scope

    $.browser.msie6 = $.browser.msie6 || $.browser.msie && typeof XMLHttpRequest == 'function';

    $.extend({
        thickbox: new function() {

            /* private */

            // needful things
            var IMAGE = 'image', INLINE = 'inline', AJAX = 'ajax', EXTERNAL = 'external', CONFIRM = 'confirm'; // Thickbox type constants
            var DIM_ID = 'tb-dim', LOADING_ID = 'tb-loading', MODAL_ID = 'tb-modal'; // Ids
            var dim, loading, modal;

            // default values
            var defaultValues = {
                top: '',
                left: '',
                width: 300,
                height: 400,
                confirmTitle: 'Are you sure?',
                confirmYes: 'Yes',
                confirmNo: 'No'
            };

            // setup Thickbox
            function setup(type, settings, builder) {
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
                        hide();
                    })
                    .fadeIn('fast', function() {
                        loading.show();
                        builder(); // build specific type
                    });
                // attach keyboard event handler
                $(document).bind('keydown', keydown).bind('keypress', blockKeys);
                $(window).bind('scroll', blockScroll);
            }

            // show and positioning
            function show(width, height, top, left) {
                loading.hide();
                var css = {width: width + 'px', height: height + 'px'}, noUnit = /^\d+$/;
                if (!top) {
                    if (!$.browser.msie6) { // take away IE6
                        css['top'] = '';
                        css['margin-top'] = '-' + parseInt(height / 2) + 'px';
                    } else {
                        // TODO set expression here for IE6
                    }
                } else {
                    css['top'] = top + (top.match(noUnit) ? 'px' : '');
                    css['margin-top'] = '';
                }
                if (!left) {
                    css['left'] = '';
                    css['margin-left'] = '-' + parseInt(width / 2) + 'px';
                } else {
                    css['left'] = left + (left.match(noUnit) ? 'px' : '');
                    css['margin-left'] = '';
                }
                modal.show().css(css); // TODO use modal.animate and allow custom animations
            }

            // remove everything
            function hide(callback) {
                // hide stuff
                loading.hide();
                modal.fadeOut('fast', function() {
                    modal.empty();
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

            /* public */

            // set default values
            this.defaults = function(override) {
                defaultValues = $.extend(defaultValues, override);
            };

            // render Thickbox
            this.render = function(settings) {

                // initialize extra settings
                settings = $.extend({
                    top: defaultValues.top,
                    left: defaultValues.left,
                    width: defaultValues.width,
                    height: defaultValues.height,
                    /*onConfirm: null,
                    slideshow: null, TODO option for slideshow? */
                    confirmTitle: defaultValues.confirmTitle,
                    confirmYes: defaultValues.confirmYes,
                    confirmNo: defaultValues.confirmNo
                }, settings);

                return this.each(function() {
                    var $$ = $(this);
                    var isLink = $$.is('a') && this.href;
                    var isImage = isLink && this.href.match(/\.(bmp|gif|jpe?g|png)/gi);
                    var isInline = !!this.hash;
                    var isAjax = this.hostname == location.hostname && !isInline;
                    var isExternal = isLink && this.hostname != location.hostname;
                    var isForm = $$.is('form');
                    var type = isImage && IMAGE || isInline && INLINE || isAjax && AJAX || isExternal && EXTERNAL || isForm && CONFIRM;

                    // switch type of Thickbox to be bound to element
                    var builder;
                    switch (type) {
                        case IMAGE:
                            builder = function() {
                                // preload image and trigger Thickbox rendering when loading is completed
                                var img = new Image();
                                img.onload = function() {
                                    img.onload = null;

                                    // resize too large image
                                    var subtraction = 150;
                                    var viewportWidth = (self.innerWidth || $.boxModel && document.documentElement.clientWidth || document.body.clientWidth) - subtraction;
                                    var viewportHeight = (self.innerHeight || $.boxModel && document.documentElement.clientHeight || document.body.clientHeight) - subtraction;
                                    var imgWidth = img.width;
                                    var imgHeight = img.height;
                                    if (imgWidth > viewportWidth) {
                                        imgHeight = imgHeight * viewportWidth / imgWidth;
                                        imgWidth = viewportWidth;
                                        if (imgHeight > viewportHeight) {
                                            imgWidth = imgWidth * viewportHeight / imgHeight;
                                            imgHeight = viewportHeight;
                                        }
                                    } else if (imgHeight > viewportHeight) {
                                        imgWidth = imgWidth * viewportHeight / imgHeight;
                                        imgHeight = viewportHeight;
                                        if (imgWidth > viewportWidth) {
                                            imgHeight = imgHeight * viewportWidth / imgWidth;
                                            imgWidth = viewportWidth;
                                        }
                                    }
                                    imgWidth= parseInt(imgWidth);
                                    imgHeight = parseInt(imgHeight);

                                    modal.append('<img src="' +  $$.attr('href') + '" alt="TODO" width="' + imgWidth + '" height="' + imgHeight + '" />');
                                    show(imgWidth + 30, imgHeight + 60, settings.top, settings.left);
                                };
                                img.src = $$.attr('href');
                            };
                            break;
                        case INLINE:
                            var content = $($$[0].hash); // preserve content via closure
                            builder = function() {
                                content.appendTo(modal);
                                show(settings.width, settings.height, settings.top, settings.left);
                            };
                            break;
                        case AJAX:
                            builder = function() {
                                modal.load($$.attr('href'), function() {
                                    show(settings.width, settings.height, settings.top, settings.left);
                                });
                            };
                            break;
                        case EXTERNAL:
                            builder = function() {
                                modal.html('<iframe src="' +  $$.attr('href') + '" frameborder="0"></iframe>');
                                show(settings.width, settings.height, settings.top, settings.left);
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
                                show(settings.width, settings.height, settings.top, settings.left);
                            };
                            break;
                        default:
                            builder = function() {
                                alert('You can only apply a Thickbox to links and forms.'); // TODO Show this in Thickbox maybe? ;-)
                            };
                    }

                    // bind event
                    $$.bind((isForm ? 'submit' : 'click'), function() {
                        setup(type, settings, builder);
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