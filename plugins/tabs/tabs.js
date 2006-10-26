/*
 * Tabs - jQuery plugin for accessible, unobtrusive tabs http://stilbuero.de/tabs/
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * v2.0
 */

// internal helper
jQuery.tabs = new function() {
    this.trigger = function(arg, context) {
        var argType = typeof arg;
        if (argType == 'string') { // id of associated container has been passed
            jQuery(hash).parent('div').find('>ul>li>a[@href$=' + hash + ']').click();
        } else if (argType == 'undefined' || argType == 'number') { // index of tab has been passed
            var tabIndex = arg && arg > 0 && arg - 1 || 0; // falls back to index 0
            jQuery('>ul>li>a', context).eq(tabIndex).click();
        }
    };
};

jQuery.fn.tabs = function(initial, settings) {

    // settings
    if (typeof initial == 'object') settings = initial; // no initial tab given but a settings object
    settings = jQuery.extend({
        initial: (initial && typeof initial == 'number' && initial > 0) ? --initial : 0,
        fxFade: null,
        fxSlide: null,
        fxShow: null,
        fxHide: null,
        fxSpeed: 'normal',
        fxShowSpeed: null,
        fxHideSpeed: null,
        fxAutoheight: false,
        callback: null,
        selectedTabClass: 'selected',
        hiddenTabContainerClass: 'tabs-hide',
        tabSelector: '>div'
    }, settings || {});

    // regex to find hash in url
    var re = /([_\-\w]+$)/i;

    // observer to fix back button
    //if (jQuery.history) jQuery.history.observe();

    // helper to prevent scroll to fragment
    function _unFocus() {
        scrollTo(0, 0);
    }

    // initialize tabs
    return this.each(function() {
        // retrieve active tab from hash in url
        if (location.hash) {
            var hashId = location.hash.replace('#', '');
            jQuery('>ul:eq(0)>li>a', this).each(function(i) {
                if (re.exec(this.href)[1] == hashId) {
                    settings.initial = i;
                    if (jQuery.browser.msie) setTimeout(_unFocus, 150); // be nice to IE
                    _unFocus();
                    if (jQuery.browser.opera) setTimeout(_unFocus, 100); // be nice to Opera
                }
            });
        }
        if (settings.fxAutoheight) {
            var divs = jQuery(settings.tabSelector, this);
            var heights = [];
            divs.each(function(i) {
                heights.push( this.offsetHeight );
                if (settings.initial != i) jQuery(this).addClass(settings.hiddenTabContainerClass);
            });
            heights.sort(function(a, b) {
                return b - a;
            });
            divs.each(function() {
                jQuery(this).css({minHeight: heights[0] + 'px'});
                if (jQuery.browser.msie && typeof XMLHttpRequest == 'function') jQuery(this).css({height: heights[0] + 'px'});
            });
        } else {
            jQuery(settings.tabSelector, this).not(':eq(' + settings.initial + ')').addClass(settings.hiddenTabContainerClass);
        }
        jQuery('>ul>li:eq(' + settings.initial + ')', this).addClass(settings.selectedTabClass);
        var container = this;
        jQuery('>ul>li>a', this).click(function(e) {
            // id to be shown
            var tabToShowHash = '#' + re.exec(this.href)[1];
            // update observer TODO: find another way to add event...
            //if (jQuery.history) jQuery.history.setHash(tabToShowHash, e);
            // save scrollbar position
            var scrollX = window.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft || 0;
            var scrollY = window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (!jQuery(this.parentNode).is('.' + settings.selectedTabClass)) {
                var tabToShow = jQuery(tabToShowHash);
                if (tabToShow.size() > 0) {
                    var self = this;
                    var tabToHide = jQuery(settings.tabSelector + ':visible', container);
                    var callback;
                    if (settings.callback && typeof settings.callback == 'function') callback = function() {
                        settings.callback.apply(tabToShow[0], [tabToShow[0], tabToHide[0]]);
                    };
                    function _activateTab() {
                        jQuery('>ul>li', container).removeClass(settings.selectedTabClass);
                        jQuery(self.parentNode).addClass(settings.selectedTabClass);
                    }
                    var showAnim = {}, hideAnim = {};
                    var showSpeed, hideSpeed;
                    if (settings.fxSlide || settings.fxFade) {
                        if (settings.fxSlide) {
                            showAnim['height'] = 'show';
                            hideAnim['height'] = 'hide';
                        }
                        if (settings.fxFade) {
                            showAnim['opacity'] = 'show';
                            hideAnim['opacity'] = 'hide';
                        }
                        showSpeed = hideSpeed = settings.fxSpeed;
                    } else {
                        if (settings.fxShow) {
                            showAnim = jQuery.extend(showAnim, settings.fxShow); // copy object
                            showSpeed = settings.fxShowSpeed || settings.fxSpeed;
                        } else {
                            showAnim['opacity'] = 'show';
                            showSpeed = 1; // as little as this prevents browser scroll to the tab
                        }
                        if (settings.fxHide) {
                            hideAnim = jQuery.extend(hideAnim, settings.fxHide); // copy object
                            hideSpeed = settings.fxHideSpeed || settings.fxSpeed;
                        } else {
                            hideAnim['opacity'] = 'hide';
                            hideSpeed = 1; // as little as this prevents browser scroll to the tab
                        }
                    }
                    tabToHide.animate(hideAnim, hideSpeed, function() { // animate in any case, prevents browser scroll to the fragment
                        _activateTab();
                        tabToShow.removeClass(settings.hiddenTabContainerClass).animate(showAnim, showSpeed, function() {
                            if (jQuery.browser.msie) {
                                tabToHide[0].style.filter = '';  // @ IE, retain acccessibility for print
                                tabToHide.addClass(settings.hiddenTabContainerClass).css({display: '', height: 'auto'}); // retain flexible height and acccessibility for print
                            }
                            tabToShow.css({height: 'auto'}); // retain flexible height
                            if (callback) callback();
                        });
                    });
                } else {
                    alert('There is no such container.');
                }
            }
            // Set scrollbar to saved position
            setTimeout(function() {
                window.scrollTo(scrollX, scrollY);
            }, 0);
        });
    });

};

// TODO: issue with mixing history and triggerTab
// maybe solved with links that should trigger tab by pointing to corresponding hash
jQuery.fn.triggerTab = function(tabIndex) {
    return this.each(function() {
        jQuery.tabs.trigger(tabIndex, this);
    });
};