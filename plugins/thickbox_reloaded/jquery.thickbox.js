/**
 * Thickbox Reloaded - jQuery plugin
 *
 * Copyright (c) 2007 Klaus Hartl
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */

(function($) { // simulate block scope

    $.browser.msie6 = $.browser.msie6 || $.browser.msie && typeof XMLHttpRequest == 'function';

    $.extend({
        thickbox: new function() {

            /* private */

            // thickbox types
            TB_TYPE = {
                AJAX: 'ajax',
                CONFIRM: 'confirm',
                EXTERNAL: 'external',
                IMAGE: 'image',
                INLINE: 'inline'
            };

            // thickbox ids
            TB_ID = {
                DIM: 'tb-dim',
                LOADING: 'tb-loading',
                MODAL: 'tb-modal',
                TITLE: 'tb-title',
                CLOSE: 'tb-close',
                CONTENT: 'tb-content',
                CAPTION: 'tb-caption',
                BROWSE: 'tb-browse',
                NEXT: 'tb-next',
                PREV: 'tb-prev'
            };

            // building blocks
            var dim, loading, modal, content, close;

            // store request to be able to abort it
            var request;

            // default values
            var defaultValues = {
                top: '',
                left: '',
                width: 300,
                height: 340,
                animate: null,
                i18n: {
                    close: { text: 'Close', title: 'Close this window' },
                    count: { text: 'Image #{image} / #{count}' },
                    next: { text: 'Next', title: 'Show next image' },
                    prev: { text: 'Previous', title: 'Show previous image' },
                    confirm: { what: 'Are you sure?', confirm: 'Yes', cancel: 'No' }
                }
            };

            // setup Thickbox
            function setup(type, builder) {

                // get or create elements
                dim = $('#' + TB_ID.DIM);
                dim = dim.size() && dim || $('<div id="' + TB_ID.DIM + '">' + ($.browser.msie6 ? '<iframe src="about:blank" frameborder="0"></iframe>' : '') + '</div>').appendTo(document.body).hide();

                $('iframe', dim).bind('focus', hide);

                loading = $('#' + TB_ID.LOADING);
                loading = loading.size() && loading || $('<div id="' + TB_ID.LOADING + '"></div>').appendTo(document.body);

                modal = $('#' + TB_ID.MODAL);
                modal = modal.size() && modal || $('<div id="' + TB_ID.MODAL + '"></div>').append('<b class="tl"></b><b class="tr"></b><b class="br"></b><b class="bl"></b>').appendTo(document.body);

                // set type class
                modal.attr('class', 'tb-' + type);

                content = $('#' + TB_ID.CONTENT);
                content = content.size() && content || $('<div id="' + TB_ID.CONTENT + '"></div>').appendTo(modal);

                // close button
                close = $('#' + TB_ID.CLOSE);
                close = close.size() && close || $('<div id="' + TB_ID.CLOSE + '"><a href="#" title="' + defaultValues.i18n.close.title + '">' + defaultValues.i18n.close.text + '</a></div>').appendTo(modal);
                $('a', close).bind('click', hide);

                // reveal stuff
                dim.unbind('click').one('click', hide); // unbind should be unnecessary - WTF?
                if (dim.is(':visible')) {
                    loading.show();
                    builder(); // build specific type
                } else {
                    //dim.fadeIn('fast', function() {
                        dim.show();
                        loading.show();
                        builder(); // build specific type
                    //});
                }
                // attach keyboard event handler
                $(document).bind('keydown', keydown).bind('keypress', blockKeys);
                $(window).bind('scroll', blockScroll);
            }

            // show and positioning
            function show(width, height, top, left, animate, callback) {
                loading.hide();
                var css = {width: width + 'px', height: height + 'px'}, noUnit = /^\d+$/;
                if (!top) {
                    css['top'] = '';
                    if (!$.browser.msie6) { // take away IE6
                        css['margin-top'] = -parseInt(height / 2) + 'px';
                    } else { // set dynamic property for IE6 to emulate fixed positioning
                        dim[0].style.setExpression('height', 'document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight + "px"');
                        loading[0].style.setExpression('marginTop', '0 - parseInt(this.offsetHeight / 2) + (document.documentElement && document.documentElement.scrollTop || document.body.scrollTop) + "px"');
                        modal[0].style.setExpression('marginTop', '0 - parseInt(this.offsetHeight / 2) + (document.documentElement && document.documentElement.scrollTop || document.body.scrollTop) + "px"');

                        // TODO: remove expression or attach once ?!
                    }
                } else {
                    css['top'] = top + ((top + '').match(noUnit) ? 'px' : '');
                    css['margin-top'] = '';
                }
                if (!left) {
                    css['left'] = '';
                    css['margin-left'] = -parseInt(width / 2) + 'px'; // TODO prevent modal window being pushed out of viewport, onresize as well
                } else {
                    css['left'] = left + ((left + '').match(noUnit) ? 'px' : '');
                    css['margin-left'] = '';
                }
                animate ? modal.css(css).animate(animate.animation, animate.speed) : modal.css(css).show();
                typeof callback == 'function' && callback(modal[0]);
            }

            // remove everything
            function hide(callback) {

                if (request) {
                    request.abort();
                    request = null;
                }

                // hide stuff
                loading.hide();
                modal.hide()
                dim.hide();
                content.empty();
                typeof callback == 'function' && callback();

                // remove keyboard event handler
                $(document).unbind('keydown', keydown).unbind('keypress', blockKeys);
                $(window).unbind('scroll', blockScroll);
                return false;
            }

            // helper
            function blockKeys(e) {
                var allowed = $('a, button, input, select, textarea', modal);
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

            function buildTitle(title) {
                if (title) {
                    content.prepend('<h2 id="' + TB_ID.TITLE + '">' + title + '</h2>');
                }
            }

            /* public */

            // set default values
            this.defaults = function(override) {
                for (var p in defaultValues.i18n) {
                    override.i18n[p] = $.extend(defaultValues.i18n[p], override.i18n[p]);
                }
                defaultValues = $.extend(defaultValues, override);
            };

            // render Thickbox
            this.render = function(settings, callback) {

                // initialize extra settings
                settings = $.extend({
                    top: defaultValues.top,
                    left: defaultValues.left,
                    width: defaultValues.width,
                    height: defaultValues.height,
                    /* onConfirm: null, remember for documentation */
                    /* animate: defaultValues.animate, remember for documentation, example {animation: { opacity: 'show' }, speed: 1000} */
                    slideshow: false // TODO implement
                }, settings);

                return this.each(function() {

                    // Opera 9 incorrectly includes port in hostname property, thus it needs to be removed
                    // Safari 2 reports '#' for an undefined hash, thus it needs to be sanitized as well
                    // Safari 2 reports '0' for an undefined port, thus needing to use parseInt
                    var $$ = $(this), hostname = this.hostname && this.hostname.replace(/:\d*$/, ''), port = parseInt(this.port) || 80, hash = this.hash && this.hash.replace('#', '') || '';
                    var isLink = $$.is('a') && this.href;
                    var isImage = isLink && this.href.match(/\.(bmp|gif|jpe?g|png)/gi);
                    var isInline = !!hash;
                    var isAjax = hostname == location.hostname && port == (location.port || 80) && !isInline;
                    var isExternal = isLink && (hostname != location.hostname || port != (location.port || 80));
                    var isForm = $$.is('form');
                    var type = isImage && TB_TYPE.IMAGE || isInline && TB_TYPE.INLINE || isAjax && TB_TYPE.AJAX || isExternal && TB_TYPE.EXTERNAL || isForm && TB_TYPE.CONFIRM;

                    // switch type of Thickbox to be bound to element
                    var builder;
                    switch (type) {
                        case TB_TYPE.IMAGE:
                            builder = function() {
                                var title = $$.attr('title') || '', rel = $$.attr('rel');

                                // if an image group is given
                                if (rel) {

                                    // find the anchors that are part of the the group
                                    var group = $('a[@rel="' + rel + '"]');

                                    // previous/next handler
                                    var buildShowFunc = function(el) {
                                        return function() {
                                            unbindPager();
                                            modal.hide()
                                            content.empty();
                                            $(el).trigger('click');
                                            return false;
                                        };
                                    };

                                    var i = group.index($$[0]);

                                    var next = '<strong id="' + TB_ID.NEXT + '"><a href="#" title="' + defaultValues.i18n.next.title + '">' + defaultValues.i18n.next.text + '</a></strong>';
                                    var showNext = buildShowFunc(group[i + 1] || group[0]);

                                    var prev = '<strong id="' + TB_ID.PREV + '"><a href="#" title="' + defaultValues.i18n.prev.title + '">' + defaultValues.i18n.prev.text + '</a></strong>';
                                    var showPrev = buildShowFunc(group[i - 1] || group[group.size() - 1]);

                                    var count = '<em>' + defaultValues.i18n.count.text.replace(/#\{image\}/, i + 1).replace(/#\{count\}/, group.size()) + '</em>';

                                    // additional key handler
                                    var pager = function(e) {
                                        var key = e.which || e.keyCode || -1;
                                        switch (key) {
                                            case 27:
                                                $(document).unbind(e); // remove this event handler
                                                break;
                                            case 37: // TODO 188?
                                                showPrev();
                                                break;
                                            case 39: // TODO 190?
                                                showNext();
                                                break;
                                        }
                                    };
                                    $(document).bind('keydown', pager);

                                    var unbindPager = function() {
                                        $(document).unbind('keydown', pager);
                                    };
                                    dim.one('click', unbindPager);
                                    $('a', close).one('click', unbindPager);

                                }

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

                                    buildTitle(title);
                                    $('<img src="' +  $$.attr('href') + '" alt="Image" width="' + imgWidth + '" height="' + imgHeight + '" title="' + title + '" />').appendTo(content);
                                    $(['<p id="' + TB_ID.BROWSE + '">', prev, next, count, '</p>'].join('')).appendTo(content);
                                    $('#' + TB_ID.NEXT + ' a').bind('click', showNext);
                                    $('#' + TB_ID.PREV + ' a').bind('click', showPrev);

                                    show(imgWidth + 38, imgHeight + 100, settings.top, settings.left, settings.animate, callback);
                                };

                                // initiate img loading
                                img.src = $$.attr('href');
                            };
                            break;
                        case TB_TYPE.INLINE:
                            var inlineContent = $($$[0].hash); // preserve content via closure
                            builder = function() {
                                buildTitle($$.attr('title'));
                                inlineContent.css('display', 'block').appendTo(content); // in case inline content itself is hidden and not its parent element, WTF: show() fails in Opera
                                show(settings.width, settings.height, settings.top, settings.left, settings.animate, callback);
                            };
                            break;
                        case TB_TYPE.AJAX:
                            builder = function() {
                                buildTitle($$.attr('title'));
                                request = $.ajax({
                                    url: $$.attr('href'),
                                    dataType: 'html',
                                    success: function(r) {
                                        content.append(r);
                                        show(settings.width, settings.height, settings.top, settings.left, settings.animate, callback);
                                    }
                                });
                            };
                            break;
                        case TB_TYPE.EXTERNAL:
                            builder = function() {
                                buildTitle($$.attr('title'));
                                $('<iframe id="' + TB_ID.CONTENT + '" src="' +  $$.attr('href') + '" frameborder="0"></iframe>').appendTo(content);
                                show(settings.width, settings.height, settings.top, settings.left, settings.animate, callback);
                            };
                            break;
                        case TB_TYPE.CONFIRM:
                            builder = function() {
                                buildTitle($('*[@type="submit"][@title]', $$).attr('title') || defaultValues.i18n.confirm.what);
                                $('<a id="tb-confirm" href="#">' + defaultValues.i18n.confirm.confirm + '</a>').appendTo(content).click(function() {
                                    // pass confirm as callback to hide
                                    hide(settings.onConfirm || function() {
                                        $$[0].submit();
                                    });
                                    return false;
                                });
                                $('<a id="tb-cancel" href="#">' + defaultValues.i18n.confirm.cancel + '</a> ').appendTo(content).click(function() {
                                    hide();
                                    return false;
                                });
                                // If height is still the default value, change it here...
                                show(settings.width, (settings.height == defaultValues.height ? 90 : settings.height), settings.top, settings.left, settings.animate, callback);
                            };
                            break;
                        default:
                            alert('You can apply a Thickbox to links and forms only.');
                    }

                    // bind event
                    if (builder) {
                        $$.bind((type == TB_TYPE.CONFIRM ? 'submit' : 'click'), function() {
                            setup(type, builder);
                            this.blur(); // remove focus from active element
                            return false;
                        });
                    }

                });
            };

        }
    });

    $.fn.extend({
        thickbox: $.thickbox.render
    });

})(jQuery);