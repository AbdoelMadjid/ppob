/*
# ------------------------------------------------------------------------
# JD slideshow module
# ------------------------------------------------------------------------
# Copyright (C) 2004-2010 JoomlArt.com. All Rights Reserved.
# @license - PHP files are GNU/GPL V2. CSS / JS are Copyrighted Commercial,
# bound by Proprietary License of JoomlArt. For details on licensing, 
# Please Read Terms of Use at http://www.joomlart.com/terms_of_use.html.
# Author: JoomlArt.com
# Websites:  http://www.joomlart.com -  http://www.joomlancers.com
# Redistribution, Modification or Re-licensing of this file in part of full, 
# is bound by the License applied. 
# ------------------------------------------------------------------------
*/
(function(jQuery) {
	jQuery.fn.JDSlideshow = function(vars) {
		vars = vars == undefined ? {} : vars;
		var maineffect = vars.maineffect == undefined ? "fade"
				: vars.maineffect;
		var duration = vars.duration == undefined ? 1000 : vars.duration;
		var interval = vars.interval == undefined ? 4000 : vars.interval;
		var showdesc = vars.showdesc == undefined ? 1 : vars.showdesc;
		var mouseovers = vars.mouseover == undefined ? 0 : vars.mouseover;
		var total = vars.total == undefined ? 0 : vars.total;
		var navlength = vars.navlength == undefined ? 4 : vars.navlength;
		navlength = navlength <= 2 ? 3 : navlength;
		var navigation = vars.navigation == undefined ? 1 : vars.navigation;
		var thumbnav = vars.thumbnav == undefined ? 0 : vars.thumbnav;
		var opacity = vars.opacity == undefined ? 0.6 : vars.opacity;

		var currentKey = 0;
		var lastKey = 0;
		var id = jQuery(this).attr("id");
		var t = null;
		var t2 = null;
		var firstNav = 0;
		var lastNav = navlength - 1;
		var firstThumb = 0;
		var lastThumb = navlength - 1;

		var firstlaunch = true;
		/* show/Hide nav item depend on Nav length option */
		var showNav = function() {
			jQuery("#" + id + " .nav-item").each(function(i) {
				if (i > lastNav || i < firstNav) {
					jQuery(this).hide();
				} else {
					jQuery(this).show();
				}
			});
		}

		/* Change nav when sliding */
		var changeNav = function(i) {
			jQuery("#" + id + " .nav-item").each(function(k) {
				if (i == k) {
					jQuery(this).addClass("nav-current");
				} else {
					jQuery(this).removeClass("nav-current");
				}
			});
			if (i == 0) {
				firstNav = 0;
				lastNav = navlength - 1;
				showNav();
				return;
			}
			if (i == total - 1) {
				firstNav = total - navlength;
				lastNav = currentKey;
				showNav();
				return;
			}
			if (i == lastNav) {
				firstNav++;
				lastNav++;
				showNav();
				return;
			}

			if (i == firstNav) {
				firstNav--;
				lastNav--;
				showNav();
				return;
			} else {
				showNav();
				return;
			}

		}
		var changeThumbMask = function(i) {
			var thumbmain = jQuery("#" + id + " .jd-slideshow-thumb");
			var thumblist = jQuery("#" + id + " .thumb-list");
			var thumbitem = jQuery("#" + id + " .thumb-item");
			var listwidth = thumblist.width();
			var itemwidth = listwidth / total;
			var tmp = itemwidth - thumbitem.width();
			tmp = tmp / ((total * 2) - 2);
			var itemwidth2 = itemwidth + tmp * 2;
			var listheight = thumblist.height();
			var thumbmask = jQuery("#" + id + " .thumb-mask");
			var thumbmaskitem = jQuery("#" + id + " .thumb-mask-item");
			var thumbmaskcurrent = jQuery("#" + id + " .thumb-mask-current");
			var thumbwidth = thumbitem.width();
			var maskpade = (itemwidth - thumbwidth) / 2;
			var maskleft = -2000;
			if (i != 0) {
				maskleft = maskleft + (i - firstThumb) * itemwidth2;
			}
			thumbmask.stop(true, false).animate( {
				'left' : maskleft
			}, 'slow');

		}

		var changeThumb = function(i) {
			var thumbmain = jQuery("#" + id + " .jd-slideshow-thumb");
			var thumblist = jQuery("#" + id + " .thumb-list");
			var thumbitem = jQuery("#" + id + " .thumb-item");
			var listwidth = thumblist.width();
			var itemwidth = listwidth / total;
			var tmp = itemwidth - thumbitem.width();
			tmp = tmp / ((total * 2) - 2);
			var itemwidth2 = itemwidth + tmp * 2;
			var listheight = thumblist.height();
			var thumbmask = jQuery("#" + id + " .thumb-mask");
			var thumbmaskitem = jQuery("#" + id + " .thumb-mask-item");
			var thumbmaskcurrent = jQuery("#" + id + " .thumb-mask-current");
			var thumbwidth = thumbitem.width();
			var maskpade = itemwidth - thumbwidth;
			var thumbhandle = jQuery("#" + id + " .ja-slide-thumbs-handles");
			if (i == 0) {
				firstThumb = 0;
				lastThumb = navlength - 1;
				thumblist.animate( {
					'left' : 0
				}, 'slow');
				thumbhandle.animate( {
					'left' : 0
				}, 'slow');
				return;
			}
			if (i == total - 1) {
				firstThumb = total - navlength;
				lastThumb = currentKey;
				thumblist.animate( {
					'left' : -(total - navlength) * itemwidth2
				}, 'slow');
				thumbhandle.animate( {
					'left' : -(total - navlength) * itemwidth2
				}, 'slow');
				return;
			}
			if (i == lastThumb) {

				firstThumb++;
				lastThumb++;
				var left = thumblist.css('left').replace('px', '');
				left = left - itemwidth2;
				thumblist.animate( {
					'left' : left + 'px'
				}, 'slow');
				thumbhandle.animate( {
					'left' : left + 'px'
				}, 'slow');
				return;
			}

			if (i == firstThumb) {
				firstThumb--;
				lastThumb--;
				var left = thumblist.css('left').replace('px', '');
				left = parseInt(left) + parseInt(itemwidth2);
				thumblist.animate( {
					'left' : left + 'px'
				}, 'slow');
				thumbhandle.animate( {
					'left' : left + 'px'
				}, 'slow');
				return;
			}
		}
		var initThumbNav = function() {
			if (!thumbnav) {
				return;
			}
			var thumbmain = jQuery("#" + id + " .jd-slideshow-thumb");
			var thumblist = jQuery("#" + id + " .thumb-list");
			var thumbitem = jQuery("#" + id + " .thumb-item");
			var listwidth = thumblist.width();
			var itemwidth = listwidth / total;
			var tmp = itemwidth - thumbitem.width();
			tmp = tmp / ((total * 2) - 2);
			var itemwidth2 = itemwidth + tmp * 2;
			var padding = (itemwidth2 - thumbitem.width()) / 2;
			var listheight = thumblist.height();
			thumbmain.height(listheight);
			thumblist.width(listwidth);
			thumbmain.width(itemwidth2 * navlength - padding * 2);
			thumblist.css('position', 'absolute');
			var thumbmask = jQuery("#" + id + " .thumb-mask");
			var thumbmaskitem = jQuery("#" + id + " .thumb-mask-item");
			var thumbmaskcurrent = jQuery("#" + id + " .thumb-mask-current");
			thumbmaskitem.width(2000);
			thumbmaskitem.height(listheight);
			var thumbwidth = thumbitem.width();
			thumbmaskcurrent.width(thumbwidth);
			thumbmask.width(4000 + thumbwidth);
			var maskpade = (itemwidth2 - thumbwidth) / 2;
			thumbmask.css('left', (-2000));
			var thumbhandle = jQuery("#" + id + " .ja-slide-thumbs-handles");
			thumbhandle.width(listwidth);
			thumbhandle.css('position', 'absolute');
			thumbmaskitem.css('opacity', opacity);
		}

		/* Slide an image */
		var showImg = function() {
			if (showdesc == 2) {
				jQuery("#" + id + " .jd-slideshow .ss-desc-" + lastKey).hide();
			}
			if (maineffect != "fade") {
				jQuery("#" + id + " .jd-slideshow .ss-item:eq(" + lastKey + ")")
						.hide();
				jQuery(
						"#" + id + " .jd-slideshow .ss-item:eq(" + currentKey
								+ ")").show(maineffect, null, duration);
			} else {
				jQuery("#" + id + " .jd-slideshow .ss-item:eq(" + lastKey + ")")
						.fadeOut();
				jQuery(
						"#" + id + " .jd-slideshow .ss-item:eq(" + currentKey
								+ ")").fadeIn(duration);
			}
		}
		/* Autoplay Slideshow when page loaded */
		var autoPlay = function() {
			clearTimeout(t2);
			t2 = null;
			jQuery("#" + id + " .nav-control-play").text("Stop");
			showImg();
			changeNav(currentKey);
			if (thumbnav) {
				changeThumb(currentKey);
				changeThumbMask(currentKey);
			}
			lastKey = currentKey;
			currentKey = currentKey == total - 1 ? 0 : currentKey + 1;
			t = null;
			if (firstlaunch)
				t = setTimeout(autoPlay, 5000);
			else
				t = setTimeout(autoPlay, interval);
			firstlaunch = false;

		}
		/* Stop button handle */
		var stop = function() {
			jQuery("#" + id + " .nav-control-play").text("Play");
			clearTimeout(t);
			t = null;
		}
		var _init = function() {
			autoPlay();
			initThumbNav();
			/* Init showing Nav event */
			if (navigation == 1) {
				jQuery("#" + id + " .jd-slideshow-nav").show("slide");
			}
			if (navigation == 2) {
				jQuery("#" + id).mouseover(function() {
					jQuery("#" + id + " .jd-slideshow-nav").show();
				});
				jQuery("#" + id).mouseout(function() {
					jQuery("#" + id + " .jd-slideshow-nav").hide();
				});
			}
			jQuery("#" + id + " .nav-control").click(function() {
				if (jQuery("#" + id + " .nav-control-play").text() == "Stop") {
					stop();
				} else {
					autoPlay();
				}
			});
			jQuery("#" + id + " .nav-prev").click(function() {
				stop();
				if (currentKey == 1) {
					currentKey = total + 1;
				}
				if (currentKey == 0) {
					currentKey = total - 2;
				} else {
					currentKey = currentKey - 2;
				}
				autoPlay();
			});
			jQuery("#" + id + " .nav-next").click(function() {
				stop();
				autoPlay();
			});
			jQuery("#" + id + " .nav-item").each(function(i) {
				jQuery(this).click(function() {
					changeNav(i);
					currentKey = i;
					stop();
					autoPlay();
				});
			});
			if (thumbnav) {
				jQuery("#" + id + " .ja-slide-thumbs-handles span").each(
						function(i) {
							jQuery(this).click(function() {
								changeNav(i);
								changeThumb(i);
								currentKey = i;
								stop();
								autoPlay();
							});
						});
			}
			if (showdesc == 1) {
				jQuery("#" + id + " .ss-desc-wrap").css("display", "block");
			}

			jQuery(this).mouseover(function() {
				if (showdesc == 2) {
					jQuery("#" + id + " .ss-desc-wrap").show();
				}
				if (mouseovers) {
					stop();
					clearTimeout(t2);
					t2 = null;
				}
			});
			jQuery(" .jd-slideshow-wrap").mouseout(function() {
				if (showdesc == 2) {
					jQuery("#" + id + " .ss-desc-wrap").hide();
				}
				if (mouseovers) {
					jQuery("#" + id + " .nav-control-play").text("Stop");
					if (t == null) {
						t2 = setTimeout(autoPlay, interval / 2);
					}
				}
			});
		}
		_init();
	}
})(jQuery);