/**
 * History/Remote 0.1 - jQuery plugin
 *
 * http://stilbuero.de/jquery/history/
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) { // simulate block scope

$.history = new function() {

    var _currentHash = location.hash;
    var _intervalId = null;
    var _observeHistory; // define outside if/else required by Opera

    if ($.browser.msie) {

        var _historyIframe; // for IE

        if (!location.hash) {
            location.replace('#'); // set an empty hash in IE, otherwise first click gets reeeeeeal slow... TODO find out!
        }

        // add hidden iframe
        $(function() {
            _historyIframe = $('<iframe style="display: none;"></iframe>').appendTo(document.body).get(0);
            var iframe = _historyIframe.contentWindow.document;
            iframe.open();
            iframe.close();
            iframe.location.hash = _currentHash.replace('#', '');
        });

        this.setHash = function(hash) {
            _currentHash = hash;
            var iframe = _historyIframe.contentWindow.document;
            iframe.open();
            iframe.close();
            iframe.location.hash = hash.replace('#', '');
        };

        _observeHistory = function() {
            var iframe = _historyIframe.contentWindow.document;
            var iframeHash = iframe.location.hash;
            if (iframeHash != _currentHash) {
                _currentHash = iframeHash;
                if (iframeHash != '#') {
                    // order does matter, set location.hash after triggering the click...
                    $('a[@href$="' + iframeHash + '"]').click();
                    location.hash = iframeHash;
                } else {
                    var output = $('.remote-output');
                    if (output.children().size() > 0) output.empty();
                }
            }
        };

    } else if ($.browser.mozilla || $.browser.opera) {

        this.setHash = function(hash) {
            _currentHash = hash;
        };

        _observeHistory = function() {
            if (location.hash) {
                if (_currentHash != location.hash) {
                    _currentHash = location.hash;
                    $('a[@href$="' + _currentHash + '"]').click();
                }
            } else if (_currentHash) {
                _currentHash = '';
                var output = $('.remote-output');
                if (output.children().size() > 0) output.empty();
            }
        };

    } else if ($.browser.safari) {

        var _backStack, _forwardStack, _addHistory; // for Safari

        // etablish back/forward stacks
        $(function() {
            _backStack = [];
            _backStack.length = history.length;
            _forwardStack = [];

        });
        var isFirst = false;
        _addHistory = function(hash) {
            _backStack.push(hash);
            _forwardStack.length = 0; // clear forwardStack (true click occured)
            isFirst = false;
        };

        this.setHash = function(hash) {
            _currentHash = hash;
            _addHistory(_currentHash);
        };

        _observeHistory = function() {
            var historyDelta = history.length - _backStack.length;
            if (historyDelta) { // back or forward button has been pushed
                isFirst = false;
                if (historyDelta < 0) { // back button has been pushed
                    // move items to forward stack
                    for (var i = 0; i < Math.abs(historyDelta); i++) _forwardStack.unshift(_backStack.pop());
                } else { // forward button has been pushed
                    // move items to back stack
                    for (var i = 0; i < historyDelta; i++) _backStack.push(_forwardStack.shift());
                }
                var cachedHash = _backStack[_backStack.length - 1];
                $('a[@href$="' + cachedHash + '"]').click();
                _currentHash = location.hash;
            } else if (_backStack[_backStack.length - 1] == undefined && !isFirst) {
                // back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
                // document.URL doesn't change in Safari
                if (document.URL.indexOf('#') >= 0) {
                    $('a[@href$="' + '#' + document.URL.split('#')[1] + '"]').click();
                } else {
                    var output = $('.remote-output');
                    if (output.children().size() > 0) output.empty();
                }
                isFirst = true;
            }
        };

    }

    this.observe = function() {
        // look for hash in current URL (not Safari)
        if (location.hash && typeof _addHistory == 'undefined') {
            $('a.remote[@href$="' + location.hash + '"]').click();
        }
        // start observer
        if (_observeHistory && _intervalId == null) {
            _intervalId = setInterval(_observeHistory, 100);
        }
    };

};

/**
 * Register a link that points to a fragment on the same site for history observation.
 * That will fix back and forward button for click events that are attached to that link
 * while maintaining bookmarkability.
 *
 * @example $('a').history();
 * @desc Register a link to be observed for history.
 *
 * @type jQuery
 *
 * @name history
 * @cat Plugins/History
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
$.fn.history = function() {
    return this.click(function(e) {
        var trueClick = e.clientX; // add to history only if true click occured, not a triggered click
        if (trueClick) { // add to history only if true click occured, not a triggered click
            $.history.setHash(this.hash);
        }
    });
};

/**
 * Hijax links and register them for history observation. The link's href attribute is altered to an hash
 * and a click event handler is attached to the link. This handler loads content from the URL the
 * link was pointing to before altering the href attribute and displays it in a given element.
 *
 * This solution maintains bookmarkability, fixes back and forward button and is totally
 * unobtrusive, i.e. guarantees accessibility in case of JavaScript disabled.
 *
 * @example $('a.remote').remote('#output');
 * @before <a href="/foo/bar.html">Bar</a>
 * @result <a href="#remote-1">Bar</a>
 * @desc Hijax all links with the class "remote" and let them load content from the URL of it's initial
 *       href attribute via XHR into an element with the id 'output'.
 *
 * @param String expr This function accepts a string containing a CSS selector or basic XPath.
 * @type jQuery
 *
 * @name remote
 * @cat Plugins/Remote
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Hijax links and register them for history observation. The link's href attribute is altered to an hash
 * and a click event handler is attached to the link. This handler loads content from the URL the
 * link was pointing to before altering the href attribute and displays it in a given element.
 *
 * This solution maintains bookmarkability, fixes back and forward button and is totally
 * unobtrusive, i.e. guarantees accessibility in case of JavaScript disabled.
 *
 * @example $('a.remote').remote(  $("#foo")[0] );
 * @before <a href="/foo/bar.html">Bar</a>
 * @result <a href="#remote-1">Bar</a>
 * @desc Hijax all links with the class "remote" and let them load content from the URL of it's initial
 *       href attribute via XHR into the element saved in $("#foo")[0].
 *
 * @param DOMElement elem A DOM element to load the content into.
 * @type jQuery
 *
 * @name remote
 * @cat Plugins/Remote
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
$.fn.remote = function(output) {
    var target = $(output).size() && $(output) || $('<div></div>').appendTo('body');
    target.addClass('remote-output');
    return this.each(function(i) {
        var remoteURL = this.href;
        var hash = '#remote-' + ++i;
        this.href = hash;
        $(this).click(function(e) {
            var trueClick = e.clientX; // add to history only if true click occured, not a triggered click
            target.load(remoteURL, function() {
                if (trueClick) {
                    $.history.setHash(hash); // setting hash in callback is required to make it work in Safari
                }
            });
        });
    });
};

})(jQuery);

// for development...
$.log = function(s) {
    var LOG_OUTPUT_ID = 'log-output';
    var LOG_OUTPUT_STYLE = 'position: fixed; _position: absolute; top: 0; right: 0; overflow: hidden; border: 1px solid; width: 300px; height: 800px; background: #fff; color: red; opacity: .95;';
    var logOutput = $('#' + LOG_OUTPUT_ID)[0] || $('<div style="' + LOG_OUTPUT_STYLE + '" id="' + LOG_OUTPUT_ID + '"></div>').prependTo('body')[0];
    $(logOutput).prepend('<code>' + s + '</code><br />');
};