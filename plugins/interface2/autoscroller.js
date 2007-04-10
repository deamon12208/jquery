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

/**
 * Utility object that helps to make custom autoscrollers.
 * 
 *
 * @description Utility object that helps to make custom autoscrollers
 * @type jQuery
 * @cat Plugins/Interface
 * @author Stefan Petre
 */

(function($) {
	$.autoscroller = function (els, step, proxy, interval) {
		//var timer, elToScroll, elsToScroll, proxy = 20, step = 10;
		var autoscroller = this;
		autoscroller.data = [];
		if (els === 'document') {
			autoscroller.elsToScroll = $(document.body||document.documentElement);
			var clientScroll = $.iUtil.getScroll();
			autoscroller.data = [$.extend(
					{x:0,y:0, doc: true},
					clientScroll
				)];
			autoscroller.data[0].wb = Math.min(clientScroll.w,clientScroll.iw);
			autoscroller.data[0].hb = Math.min(clientScroll.h,clientScroll.ih);
		} else {
			autoscroller.elsToScroll = $(els).each(function(nr){
				autoscroller.data[nr] = $.extend(
					$.iUtil.getPosition(this),
					$.iUtil.getSize(this),
					$.iUtil.getScroll(this)
				);
			});
		}
		autoscroller.proxy = parseInt(proxy)||20;
		autoscroller.step = parseInt(step)||10;
		
		autoscroller.doScroll = function ()
		{
			autoscroller.elsToScroll.each(function(nr){
				if(
				   autoscroller.data[nr].y <= $.DDM.pointer.y
				   && autoscroller.data[nr].y + autoscroller.data[nr].hb + (autoscroller.data[nr].doc ? this.scrollTop : 0) >= $.DDM.pointer.y
				   && autoscroller.data[nr].x <= $.DDM.pointer.x
				   && autoscroller.data[nr].x + autoscroller.data[nr].wb + (autoscroller.data[nr].doc ? this.scrollLeft : 0) >= $.DDM.pointer.x
				) {
					if (
						autoscroller.data[nr].y + (autoscroller.data[nr].doc ? this.scrollTop : 0) <= $.DDM.pointer.y
						&& autoscroller.data[nr].y + autoscroller.proxy + (autoscroller.data[nr].doc ? this.scrollTop : 0) >= $.DDM.pointer.y
					) {
						this.scrollTop = this.scrollTop - autoscroller.step;
						if (autoscroller.data[nr].doc) {
							$.DDM.pointer.y -= autoscroller.step;
						}
					} else if(
						autoscroller.data[nr].y + autoscroller.data[nr].hb + (autoscroller.data[nr].doc ? this.scrollTop : 0) >= $.DDM.pointer.y
						&& autoscroller.data[nr].y + autoscroller.data[nr].hb - autoscroller.proxy + (autoscroller.data[nr].doc ? this.scrollTop : 0) <= $.DDM.pointer.y
					) {
						this.scrollTop = this.scrollTop + autoscroller.step;
						if (autoscroller.data[nr].doc) {
							$.DDM.pointer.y += autoscroller.step;
						}
					}
					if (
						autoscroller.data[nr].x + (autoscroller.data[nr].doc ? this.scrollLeft : 0) <= $.DDM.pointer.x
						&& autoscroller.data[nr].x + autoscroller.proxy + (autoscroller.data[nr].doc ? this.scrollLeft : 0) >= $.DDM.pointer.x
					) {
						this.scrollLeft = this.scrollLeft - autoscroller.step;
						if (autoscroller.data[nr].doc) {
							$.DDM.pointer.x -= autoscroller.step;
						}
					} else if(
						autoscroller.data[nr].x + autoscroller.data[nr].wb + (autoscroller.data[nr].doc ? this.scrollLeft : 0) >= $.DDM.pointer.x
						&& autoscroller.data[nr].x + autoscroller.data[nr].wb - autoscroller.proxy + (autoscroller.data[nr].doc ? this.scrollLeft : 0) <= $.DDM.pointer.x
					) {
						this.scrollLeft = this.scrollLeft + autoscroller.step;
						if (autoscroller.data[nr].doc) {
							$.DDM.pointer.x += autoscroller.step;
						}
					}
					if (autoscroller.data[nr].doc) {
						$.DDM.mouseMove();
					}
				}
			});
		};
		
		autoscroller.stop = function ()
		{
			clearInterval(autoscroller.timer);
			autoscroller.elToScroll = null;
			autoscroller.elsToScroll = null;
		};
		autoscroller.timer = setInterval(function(){autoscroller.doScroll();}, parseInt(interval)||40);
	};
 })(jQuery);