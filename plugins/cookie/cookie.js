// Cookie Plugin

/**
 * Sets/gets a cookie with the given name and value and other optional parameters.
 *
 * @param String Name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Hash options A set of key/value pairs for optional cookie parameters.
 *
 * These are all the key/values that can be passed in to 'options':
 *
 * (Integer|Date) expires - Either an integer specifying the expiration date from now on in days or a Date object.
 *                          If you set this to zero, the cookie will be deleted. If you set it to null, or omit,
 *                          this option, the cookie will be a session cookie and will not be retained when the
 *                          the browser exits. This option is used to set the max-age attribute of the cookie.
 *
 * (String) path - The value of the path atribute of the cookie (default: path of page that created the cookie).
 *
 * (String) domain - The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 *
 * (Boolean) secure - If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                    require a secure protocol (like HTTPS).
 *
 * @return The value of the cookie.
 * @name $.cookie
 * @type jQuery
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', {expires: 7, path: '/', domain: 'jquery.com', secure: true});
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', '', {expires: 0});
 * @desc Delete a cookie.
 * @cat Plugins/Cookie
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        var expires = '';
        if (typeof options.expires == 'number' || (options.expires  && options.expires.getTime)) {
            var maxAge;
            if (typeof options.expires == 'number') {
                maxAge = options.expires * 24 * 60 * 60; // seconds
            } else {
                var now = new Date();
                maxAge = parseInt((options.expires.getTime() - now.getTime()) / 1000); // seconds
                if (maxAge > 0 && maxAge < 1) {
                    maxAge = 1;
                }
            }
            if (maxAge <= 0) {
                expires = '; expires=' + new Date(0).toGMTString(); // max-age=0 will not immediatly delete cookie in some browsers
            } else {
                expires = '; max-age=' + maxAge;
            }
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};