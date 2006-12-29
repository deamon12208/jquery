/**
 * Interface Elements for jQuery
 * Autoscroller
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */


jQuery.iAutoscroller = {
	timer: null,
	elToScroll: null,
	elsToScroll: null,
	start: function(el, els)
	{
		jQuery.iAutoscroller.elToScroll = el;
		jQuery.iAutoscroller.elsToScroll = els;
		jQuery.iAutoscroller.timer = window.setInterval(jQuery.iAutoscroller.doScroll, 40);
	},
	doScroll : function()
	{
		for (i in jQuery.iAutoscroller.elsToScroll) {
				parentData = jQuery.extend(
					jQuery.iUtil.getPositionLite(jQuery.iAutoscroller.elsToScroll[i]),
					jQuery.iUtil.getSizeLite(jQuery.iAutoscroller.elsToScroll[i]),
					jQuery.iUtil.getScroll(jQuery.iAutoscroller.elsToScroll[i])
				);
				
				if (jQuery.iAutoscroller.elToScroll.dragCfg && jQuery.iAutoscroller.elToScroll.dragCfg.init == true) {
					elementData = {
						x : jQuery.iAutoscroller.elToScroll.dragCfg.nx,
						y : jQuery.iAutoscroller.elToScroll.dragCfg.ny,
						wb : jQuery.iAutoscroller.elToScroll.dragCfg.oC.wb,
						hb : jQuery.iAutoscroller.elToScroll.dragCfg.oC.hb
					};
				} else {
					elementData = jQuery.extend(
						jQuery.iUtil.getPositionLite(jQuery.iAutoscroller.elToScroll),
						jQuery.iUtil.getSizeLite(jQuery.iAutoscroller.elToScroll)
					);
				}
				
				if (parentData.t > 0 && parentData.y + parentData.t > elementData.y) {
					jQuery.iAutoscroller.elsToScroll[i].scrollTop -= 10;
				} else if (parentData.t <= parentData.h && parentData.t + parentData.hb < elementData.y + elementData.hb) {
					jQuery.iAutoscroller.elsToScroll[i].scrollTop += 10;
				}
				if (parentData.l > 0 && parentData.x + parentData.l > elementData.x) {
					jQuery.iAutoscroller.elsToScroll[i].scrollLeft -= 10;
				} else if (parentData.l <= parentData.wh && parentData.l + parentData.wb < elementData.x + elementData.wb) {
					jQuery.iAutoscroller.elsToScroll[i].scrollLeft += 10;
				}
		}
	},
	stop: function()
	{
		console.log('stop');
		window.clearInterval(jQuery.iAutoscroller.timer);
		jQuery.iAutoscroller.elToScroll = null;
		jQuery.iAutoscroller.elsToScroll = null;
	}
};