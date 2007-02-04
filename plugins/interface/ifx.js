/**
 * Interface Elements for jQuery
 * FX
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

/**
 * Validates elements that can be animated
 */
jQuery.fxCheckTag = function(e)
{
	if (/tr|td|tbody|caption|thead|tfoot|col|colgroup|th|body|header|script|frame|frameset|option|optgroup|meta/i.test(e.nodeName) )
		return false;
	else 
		return true;
};

/**
 * Destroy the wrapper used for some animations
 */
jQuery.fx.destroyWrapper = function(e, old)
{
	c = e.firstChild;
	cs = c.style;
	cs.position = old.position;
	cs.marginTop = old.margins.t;
	cs.marginLeft = old.margins.l;
	cs.marginBottom = old.margins.b;
	cs.marginRight = old.margins.r;
	cs.top = old.top + 'px';
	cs.left = old.left + 'px';
	e.parentNode.insertBefore(c, e);
	e.parentNode.removeChild(e);
};

/**
 * Builds a wrapper used for some animations
 */
jQuery.fx.buildWrapper = function(e)
{
	if (!jQuery.fxCheckTag(e))
		return false;
	var t = jQuery(e);
	var es = e.style;
	var restoreStyle = false;
	
	if (t.css('display') == 'none') {
		oldVisibility = t.css('visibility');
		t.css('visibility', 'hidden').show();
		restoreStyle = true;
	}
	oldStyle = {};
	oldStyle.position = t.css('position');
	oldStyle.sizes = jQuery.iUtil.getSize(e);
	oldStyle.margins = jQuery.iUtil.getMargins(e);
	
	oldFloat = e.currentStyle ? e.currentStyle.styleFloat : t.css('float');
	oldStyle.top = parseInt(t.css('top'))||0;
	oldStyle.left = parseInt(t.css('left'))||0;
	var wid = 'w_' + parseInt(Math.random() * 10000);
	var wr = document.createElement(/img|br|input|hr|select|textarea|object|iframe|button|form|table|ul|dl|ol/i.test(e.nodeName) ? 'div' : e.nodeName);
	jQuery.attr(wr,'id', wid);
	wrapEl = jQuery(wr).addClass('fxWrapper');
	var wrs = wr.style;
	var top = 0;
	var left = 0;
	if (oldStyle.position == 'relative' || oldStyle.position == 'absolute'){
		top = oldStyle.top;
		left = oldStyle.left;
	}
	
	wrs.top = top + 'px';
	wrs.left = left + 'px';
	wrs.position = oldStyle.position != 'relative' && oldStyle.position != 'absolute' ? 'relative' : oldStyle.position;
	wrs.height = oldStyle.sizes.hb + 'px';
	wrs.width = oldStyle.sizes.wb + 'px';
	wrs.marginTop = oldStyle.margins.t;
	wrs.marginRight = oldStyle.margins.r;
	wrs.marginBottom = oldStyle.margins.b;
	wrs.marginLeft = oldStyle.margins.l;
	wrs.overflow = 'hidden';
	if (jQuery.browser.msie) {
		wrs.styleFloat = oldFloat;
	} else {
		wrs.cssFloat = oldFloat;
	}
	if (jQuery.browser == "msie") {
		es.filter = "alpha(opacity=" + 0.999*100 + ")";
	}
	es.opacity = 0.999;
	//t.wrap(wr);
	e.parentNode.insertBefore(wr, e);
	wr.appendChild(e);
	es.marginTop = '0px';
	es.marginRight = '0px';
	es.marginBottom = '0px';
	es.marginLeft = '0px';
	es.position = 'absolute';
	es.listStyle = 'none';
	es.top = '0px';
	es.left = '0px';
	if (restoreStyle) {
		t.hide();
		es.visibility = oldVisibility;
	}
	return {oldStyle:oldStyle, wrapper:jQuery(wr)};
};

/**
 * named colors
 */
jQuery.fx.namedColors = {
	'aqua':[0,255,255],
	'azure':[240,255,255],
	'beige':[245,245,220],
	'black':[0,0,0],
	'blue':[0,0,255],
	'brown':[165,42,42],
	'cyan':[0,255,255],
	'darkblue':[0,0,139],
	'darkcyan':[0,139,139],
	'darkgrey':[169,169,169],
	'darkgreen':[0,100,0],
	'darkkhaki':[189,183,107],
	'darkmagenta':[139,0,139],
	'darkolivegreen':[85,107,47],
	'darkorange':[255,140,0],
	'darkorchid':[153,50,204],
	'darkred':[139,0,0],
	'darksalmon':[233,150,122],
	'darkviolet':[148,0,211],
	'fuchsia':[255,0,255],
	'gold':[255,215,0],
	'green':[0,128,0],
	'indigo':[75,0,130],
	'khaki':[240,230,140],
	'lightblue':[173,216,230],
	'lightcyan':[224,255,255],
	'lightgreen':[144,238,144],
	'lightgrey':[211,211,211],
	'lightpink':[255,182,193],
	'lightyellow':[255,255,224],
	'lime':[0,255,0],
	'magenta':[255,0,255],
	'maroon':[128,0,0],
	'navy':[0,0,128],
	'olive':[128,128,0],
	'orange':[255,165,0],
	'pink':[255,192,203],
	'purple':[128,0,128],
	'red':[255,0,0],
	'silver':[192,192,192],
	'238,130,238':[238,130,238],
	'white':[255,255,255],
	'yellow':[255,255,0]
};

/**
 * parses a color to an object for reg, green and blue
 */
jQuery.fx.parseColor = function(color)
{
	if (jQuery.fx.namedColors[color]) 
		return {
			r: jQuery.fx.namedColors[color][0],
			g: jQuery.fx.namedColors[color][1],
			b: jQuery.fx.namedColors[color][2]
		};
	else if (result = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/.exec(color))
		return {
			r: parseInt(result[1]),
			g: parseInt(result[2]),
			b: parseInt(result[3])
		};
	else if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)$/.exec(color)) 
		return {
			r: parseFloat(result[1])*2.55,
			g: parseFloat(result[2])*2.55,
			b: parseFloat(result[3])*2.55
		};
	else if (result = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/.exec(color))
		return {
			r: parseInt("0x"+ result[1] + result[1]),
			g: parseInt("0x" + result[2] + result[2]),
			b: parseInt("0x" + result[3] + result[3])
		};
	else if (result = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/.exec(color))
		return {
			r: parseInt("0x" + result[1]),
			g: parseInt("0x" + result[2]),
			b: parseInt("0x" + result[3])
		};
	else
		return {r: 255, g: 255, b: 255};
};

/**
 * CSS rules that can be animated
 */
jQuery.fx.animatedCssRules = [
	'borderBottomWidth',
	'borderLeftWidth',
	'borderRightWidth',
	'borderTopWidth',
	'bottom',
	'fontSize',
	'height',
	'left',
	'letterSpacing',
	'lineHeight',
	'marginBottom',
	'marginLeft',
	'marginRight',
	'marginTop',
	'maxHeight',
	'maxWidth',
	'minHeight',
	'minWidth',
	'opacity',
	'outlineOffset',
	'outlineWidth',
	'paddingBottom',
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'right',
	'textIndent',
	'top',
    'width',
	'zIndex'
];
/**
 * CSS color rules that can be animated
 */
jQuery.fx.animatedColorsCssRules = [
	'backgroundColor',
	'borderBottomColor',
	'borderLeftColor',
	'borderRightColor',
	'borderTopColor',
	'color',
	'outlineColor'
];

/**
 * Overwrite animation to use new FX function
 */
jQuery.fn.extend({
	
	animate: function( prop, speed, easing, callback ) {
		return this.queue(function(){
			var opt = jQuery.speed(speed, easing, callback);
			var e = new jQuery.fxe( this, opt, prop );
			
		});
	}
});
/**
 * Improved FXC function that aniamtes collection of properties per timer. Accepts inline styles and class names to animate
 */
jQuery.extend({
		
	fxe: function( elem, options, prop ){

		var z = this, marked;

		// The styles
		var y = elem.style;
		var props = {};
		z.startTime = (new Date()).getTime();
		
		z.getValues = function(tp, vp)
		{
			for (var i=0; i<jQuery.fx.animatedCssRules.length; i++) {
				if (jQuery.fx.animatedCssRules[i] == tp)
					return [parseFloat( jQuery.curCSS(elem, tp) ), parseFloat(vp)];
			}
			for (var i=0; i<jQuery.fx.animatedColorsCssRules.length; i++) {
				if (jQuery.fx.animatedColorsCssRules[i] == tp)
					return [jQuery.fx.parseColor(jQuery.curCSS(elem, tp)), jQuery.fx.parseColor(vp)];
			}
			return false;
		};
		
		for(p in prop) {
			if (p == 'style') {
				var newStyles = jQuery.parseStyle(prop[p]);
				for (np in newStyles) {
					values = this.getValues(np, newStyles[np]);
					if (values != false)
						props[np] = values;
				}
			} else if (p == 'className') {
				if (document.styleSheets)
					for (var i=0; i<document.styleSheets.length; i++){
						var cssRules = document.styleSheets[i].cssRules||document.styleSheets[i].rules||null;
						if (cssRules) {
							for (var j=0; j<cssRules.length; j++) {
								if(cssRules[j].selectorText == '.' + prop[p]) {
									var rule = new RegExp('\.' + prop[p] + ' {');
									var styles = cssRules[j].style.cssText;
									var newStyles = jQuery.parseStyle(styles.replace(rule, '').replace(/}/g, ''));
									for (np in newStyles) {
										values = this.getValues(np, newStyles[np]);
										if (values != false)
											props[np] = values;
									}
								}
							}
						}
					}
			} else {
				
				values = this.getValues(p, prop[p]);
				if (values != false)
					props[p] = values;
			}
		}

		z.step = function(){
			var t = (new Date()).getTime();
			if (t > options.duration + z.startTime) {
				clearInterval(z.timer);
				z.timer = null;
				for (p in props) {
					if ( p == "opacity" )
						jQuery.attr(y, "opacity", props[p][1]);
					else if (typeof props[p][1] == 'object')
						y[p] = 'rgb(' + props[p][1].r +',' + props[p][1].g +',' + props[p][1].b +')';
					else 
						y[p] = props[p][1] + (p != 'zIndex' && p != 'fontWeight' ? 'px':'');
				}

				if ( jQuery.isFunction( options.complete ) )
					options.complete.apply( elem );
			} else {
				var n = t - this.startTime;
				var pr = n / options.duration;
				for (p in props) {
					if ( p == "opacity" )
						jQuery.attr(y, "opacity", options.easing && jQuery.easing[options.easing] ?
					jQuery.easing[options.easing](pr, n,  props[p][0], (props[p][1]-props[p][0]), options.duration) :
					((-Math.cos(pr*Math.PI)/2) + 0.5) * (props[p][1]-props[p][0]) + props[p][0]);
						
					else if (typeof props[p][1] == 'object') {
						y[p] = 'rgb('
						+ parseInt(options.easing && jQuery.easing[options.easing] ?
					jQuery.easing[options.easing](pr, n,  props[p][0].r, (props[p][1].r-props[p][0].r), options.duration) :
					((-Math.cos(pr*Math.PI)/2) + 0.5) * (props[p][1].r-props[p][0].r) + props[p][0].r)
						+ ','
						+ parseInt(options.easing && jQuery.easing[options.easing] ?
					jQuery.easing[options.easing](pr, n,  props[p][0].g, (props[p][1].g-props[p][0].g), options.duration) :
					((-Math.cos(pr*Math.PI)/2) + 0.5) * (props[p][1].g-props[p][0].g) + props[p][0].g)
						+ ','
						+ parseInt(options.easing && jQuery.easing[options.easing] ?
					jQuery.easing[options.easing](pr, n,  props[p][0].b, (props[p][1].r-props[p][0].b), options.duration) :
					((-Math.cos(pr*Math.PI)/2) + 0.5) * (props[p][1].b-props[p][0].b) + props[p][0].b)
						+')';
					} else {
						y[p] = (options.easing && jQuery.easing[options.easing] ?
					jQuery.easing[options.easing](pr, n,  props[p][0], (props[p][1]-props[p][0]), options.duration) :
					((-Math.cos(pr*Math.PI)/2) + 0.5) * (props[p][1]-props[p][0]) + props[p][0]) + (p != 'zIndex' && p != 'fontWeight' ? 'px':'');
					}
				}

			}
		};
	z.timer=setInterval(function(){z.step();},13);
	
	}
});

jQuery.parseStyle = function(stylesToConvert) {
	var newStyles = {};
	if (typeof stylesToConvert == 'string') {
		stylesArray = stylesToConvert.toLowerCase().split(';');
		jQuery.each(
			stylesArray,
			function() {
				rule = this.split(':');
				if (rule.length == 2) {
					newStyles[jQuery.trim(rule[0].replace(/\-(\w)/g,function(m,c){return c.toUpperCase();}))] = jQuery.trim(rule[1]);
				}
			}
		);
	}
	return newStyles;
};