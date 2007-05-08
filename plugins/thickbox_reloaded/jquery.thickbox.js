/**
 * Thickbox Reloaded (Thickbox 3) - jQuery plugin
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
            var DIM_ID = 'tb-dim', LOADING_ID = 'tb-loading', MODAL_ID = 'tb-modal', TITLE_BAR_ID = 'tb-title-bar', CONTENT_ID = 'tb-content', CAPTION_ID = 'tb-caption', BROWSE_ID = 'tb-browse', NEXT_ID = 'tb-next', PREV_ID = 'tb-prev'; // Ids
            var dim, loading, modal;

            // default values
            var defaultValues = {
                top: '',
                left: '',
                width: 300,
                height: 340,
                animate: null,
                i18n: {
                    close: { text: 'Close', title: 'Close this window' },
                    count: { text: 'Image #{image} of #{count}' },
                    next: { text: 'Next', title: 'Show next image' },
                    prev: { text: 'Previous', title: 'Show previous image' },
                    confirm: { what: 'Are you sure?', confirm: 'Yes', cancel: 'No' }
                }
            };

            // setup Thickbox
            function setup(type, builder) {
                // get or create elements
                var jq;
                jq = $('#' + DIM_ID);
                dim = jq.size() && jq || $('<div id="' + DIM_ID + '">' + ($.browser.msie6 ? '<iframe src="about:blank" frameborder="0"></iframe>' : '') + '</div>').appendTo(document.body).hide();
                jq = $('#' + LOADING_ID);
                loading = jq.size() && jq || $('<div id="' + LOADING_ID + '"></div>').appendTo(document.body);
                jq = $('#' + MODAL_ID);
                modal = jq.size() && jq || $('<div id="' + MODAL_ID + '"></div>').appendTo(document.body);
                modal.append('<b class="tl"></b><b class="tr"></b><b class="br"></b><b class="bl"></b>');
                modal.attr({'class': type});
                $('<div id="' + TITLE_BAR_ID + '"><a href="#" title="' + defaultValues.i18n.close.title + '">' + defaultValues.i18n.close.text + '</a></div>').appendTo(modal).find('a').bind('click', hide);
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
                // hide stuff
                loading.hide();

                /*modal.fadeOut('fast', function() {
                    modal.empty();
                });*/

                modal.hide().empty();

                //lets IE bork opacity on second opening
                //dim.fadeOut('fast', typeof callback == 'function' ? callback : function() {});

                dim.hide();
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
                    $('#' + TITLE_BAR_ID).prepend('<h2>' + title + '</h2>');
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
                                var caption = $$.attr('title'), rel = $$.attr('rel');

                                // if an image group is given
                                if (rel) {

                                    function buildShowFunc(el) {
                                        return function() {
                                            unbindPager();
                                            modal.fadeOut('fast', function() {
                                                modal.empty();
                                                $(el).trigger('click');
                                            });
                                            return false;
                                        };
                                    }

                                    // find the anchors that are part of the the group
                                    var group = $('a[@rel="' + rel + '"]').get(), count = '', next = '', prev = '', showNext = function() {}, showPrev = function() {};

                                    // loop through the anchors, looking for ourself, saving information about previous and next image
                                    for (var i = 0, k = group.length; i < k; i++) {
                                        if (group[i] == $$[0]) { // look for ourself
                                            count = defaultValues.i18n.count.text.replace(/#\{image\}/, i + 1);
                                            count = count.replace(/#\{count\}/, k);
                                            if (group[i + 1]) { // if there is a next image
                                                next = '<strong id="' + NEXT_ID + '"><a href="#" title="' + defaultValues.i18n.next.title + '">' + defaultValues.i18n.next.text + '</a></strong>';
                                                showNext = buildShowFunc(group[i + 1]);
                                            }
                                            if (group[i - 1]) { // if there is a previous image
                                                prev = '<strong id="' + PREV_ID + '"><a href="#" title="' + defaultValues.i18n.prev.title + '">' + defaultValues.i18n.prev.text + '</a></strong>';
                                                showPrev = buildShowFunc(group[i - 1]);
                                            }
                                            break; // stop searching
                                        }
                                    }

                                    // add additional key handler
                                    var pager = function(e) {
                                        var key = e.which || e.keyCode || null;
                                        if (typeof key == 'number') {
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
                                        }
                                    };
                                    var unbindPager = function() {
                                        $(document).unbind('keydown', pager);
                                    };
                                    $(document).bind('keydown', pager);
                                    dim.one('click', unbindPager);
                                    $('#' + TITLE_BAR_ID + ' a').bind('click', unbindPager);

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

                                    $('<img src="' +  $$.attr('href') + '" alt="Image" width="' + imgWidth + '" height="' + imgHeight + '" title="' + caption + '" />').appendTo(modal);
                                    if (caption || count) {
                                        var html = [];
                                        if (caption) {
                                            html.push('<p id="' + CAPTION_ID + '">', caption, '</p>');
                                        }
                                        if (count) {
                                            html.push('<p id="' + BROWSE_ID + '">', count, prev, next, '</p>');
                                        }
                                        $(html.join('')).appendTo(modal);
                                        $('#' + NEXT_ID + ' a').bind('click', showNext);
                                        $('#' + PREV_ID + ' a').bind('click', showPrev);
                                    }
                                    show(imgWidth + 30, imgHeight + 60, settings.top, settings.left, settings.animate, callback);
                                };
                                img.src = $$.attr('href');
                            };
                            break;
                        case INLINE:
                            var content = $($$[0].hash); // preserve content via closure
                            builder = function() {
                                buildTitle($$.attr('title'));
                                $('<div id="' + CONTENT_ID + '"></div>').append(content).appendTo(modal);
                                content.css('display', 'block'); // in case itself is hidden and not its parent element, WTF: show() fails in Opera
                                show(settings.width, settings.height, settings.top, settings.left, settings.animate, callback);
                            };
                            break;
                        case AJAX:
                            builder = function() {
                                buildTitle($$.attr('title'));
                                $('<div id="' + CONTENT_ID + '"></div>').appendTo(modal).load($$.attr('href'), function() {
                                    show(settings.width, settings.height, settings.top, settings.left, settings.animate, callback);
                                });
                            };
                            break;
                        case EXTERNAL:
                            builder = function() {
                                buildTitle($$.attr('title'));
                                $('<iframe id="' + CONTENT_ID + '" src="' +  $$.attr('href') + '" frameborder="0"></iframe>').appendTo(modal);
                                show(settings.width, settings.height, settings.top, settings.left, settings.animate, callback);
                            };
                            break;
                        case CONFIRM:
                            builder = function() {
                                buildTitle($('*[@type="submit"][@title]', $$).attr('title') || defaultValues.i18n.confirm.what);
                                var p = $('<p id="' + CONTENT_ID + '"></p>').appendTo(modal);
                                $('<a id="tb-confirm" href="#">' + defaultValues.i18n.confirm.confirm + '</a>').appendTo(p).click(function() {
                                    // pass confirm as callback to hide
                                    hide(settings.onConfirm || function() {
                                        $$[0].submit();
                                    });
                                    return false;
                                });
                                $('<a id="tb-cancel" href="#">' + defaultValues.i18n.confirm.cancel + '</a> ').appendTo(p).click(function() {
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
                        $$.bind((type == CONFIRM ? 'submit' : 'click'), function() {
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