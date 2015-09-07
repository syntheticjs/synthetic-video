define(function() {
	function requestFullScreen(element) {
	    // Supports most browsers and their versions.
	    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

	    if (requestMethod) { // Native full screen.
	        requestMethod.call(element);
	    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
	        try {
	        	var wscript = new ActiveXObject("WScript.Shell");
	        } catch(e) {
	        	return false;
	        }
	        if (wscript !== null) {
	            wscript.SendKeys("{F11}");
	        }
	    }
	}

	function exitFullScreenMode() {
		if (document.cancelFullScreen) {
	      document.cancelFullScreen();
	    } else if (document.mozCancelFullScreen) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitCancelFullScreen) {
	      document.webkitCancelFullScreen();
	    }
	    if (typeof window.ActiveXObject !== "undefined") {
	    	try {
	        	var wscript = new ActiveXObject("WScript.Shell");
	        } catch(e) {
	        	return false;
	        }
	    	wscript.SendKeys("{F11}");
	    }
	    if (document.msExitFullscreen) {
	    	document.msExitFullscreen();
	    }
	}

	return function(videotag, options) {
		videotag = $(videotag);
		this.nodes = {
			videotag: $(videotag),
			wrapper: $(videotag).parent()
		};

		this.options = $.extend({
			playbtn: true,
			fullscreenAviable: true,
			stopAtNormal: true, // Останаваливает видео при возврате из полноэкранного режима
			autoplay: false,
			ratio: 0.5,
			muted: true,
			valign: 'middle',
			vshift: 0,
			resolution: false,
			triming: false
		}, options || {});

		/* Р•СЃР»Рё СЃР°Р№С‚ С„СѓРЅРєС†РёРѕРЅРёСЂСѓРµС‚ РІ СЂРµР¶РёРјРµ РјРѕР±РёР»СЊРЅРѕРіРѕ С‚РµР»РµС„РѕРЅР°, С‚Рѕ РїСЂРѕРїРѕСЂС†РёРё РІРёРґРµРѕ СѓРЅРёС„РёС†РёСЂСѓСЋС‚СЃСЏ */
		if (window.mobileAPI) this.options.ratio = window.mobileAPI.constants.videoBannerRatio; 

		this.scope = {
			loaded: false,
			showOnLoad: false
		}
		
		this.videoManager = null;
		this.trimVideo = function(height) {
				if (!this.options.triming) return;
				// Set video width/height
				if (videotag[0].videoHeight==0) return;
				var vrHeight = videotag[0].videoHeight;
				var vrWidth = videotag[0].videoWidth;
				var wrapperWidth = $(this.nodes.wrapper).width();
				
				var wr = wrapperWidth/vrWidth;
				$(videotag).css({
					'width': wrapperWidth+'px',
					'height': (vrHeight*wr)+'px'
				});

				// Trim video
				var width = $("#header-video-wrapper").width();
				var wrapH = (parseInt(width)*this.options.ratio);
				
				var vidH = $(videotag).height();
				switch(this.options.valign) {
					case 'top':
						var vidTop = 0;
					break;
					case 'middle':
						var vidTop = (wrapH-vidH)/2;
					break;
					case 'bottom':
						var vidTop = (wrapH-vidH);
					break;
				}
				vidTop+=this.options.vshift;

			if (this.videoManager.scope.waitForEscapeFullscreen) {
				$(this.nodes.videotag).css({
					"margin-top": '0px'
				});
			} else {	
				console.log('set vshift', this.options.vshift, vidTop);
				$(this.nodes.videotag).css({
					"margin-top": vidTop+'px'
				});
			};
		};
		// Add sources
		this.create = function() {
			var that = this;
			
			/* РќРѕРІР°СЏ РєРѕРЅС†РµРїС‚СѓР°Р»СЊРЅР°СЏ РґРёСЂРµРєС‚РёРІР° Р·Р°РїСЂРµС‰Р°РµС‚ РїРѕРєР°Р·С‹РІР°С‚СЊ РІРёРґРµРѕ РЅР° РјРѕР±РёР»СЊРЅС‹С… СѓСЃС‚СЂРѕР№СЃС‚РІР°С… Р±РµР· РїРµСЂРµС…РѕРґР° РІ РїРѕР»РЅРѕСЌРєСЂР°РЅРЅС‹Р№ СЂРµР¶РёРј*/
			if (window.mobileAPI) {
				$(this.nodes.videotag).hide();
			}

			// Bind control panel
			$(this.nodes.wrapper)
			.css({
				"position": "relative"
			})
			.put($('<div />', {
				"class": "video-controll"
			}))
				.condition(this.options.playbtn, function() {
					return $(this).put($('<a />', {
						"class": "playbtn",
						"data-trigger": "video-play",
						"href": ""
					}))
					.tie(function() {
						$(this).put($("<div />")).html('<svg><g><path fill="none" d="M29,16.491L0,32.982V0L29,16.491z"/></g></svg>')
					}).parent();
				}, function() {
					return this;
				})
				.condition(this.options.fullscreenAviable, function() {
					$(this).put($("<a />", {
						"href": "",
						"class": "fullscreenbtn",
						"data-trigger": "video-fullscreen",
					}))
					.condition(window.mobileAPI, function() {
						$(this).hide(); return this;
					}, function() { return this; })
					.tie(function() {
						$(this)
						.put($('<span />', {
							"class": "disabled"
						}))
						.html('Fullscreen ')
						.and($('<span />', {
							"class": "enabled"
						}))
						.html('Normal view ')
						.and($('<img />', {
							"src": "http://www.estetica.ru/newest/esofas/images/manufactory/full_screen_arrow.png",
							"class": "disabled"
						}))
						.and($('<img />', {
							"src": "http://www.estetica.ru/newest/esofas/images/manufactory/to-normal-view.png",
							"class": "enabled"
						}));
					});
				});
				
			
			// Mute
			if (this.options.muted) {
				this.nodes.videotag[0].muted = true;
			}
			videotag.load();
			this.testVideo();



			this.videoManager = new (function(banner) {
				this.banner = banner;
				this.scope = {
					waitForEscapeFullscreen: false,
					playing: false
				};
				this.init = function() {
					var that = this;
					this.binds();
					if (this.banner.options.autoplay) setTimeout(function() { that.play(); }, 100);
				};
				this.binds = function() {
					var that = this;
					// Play trigger
					$(this.banner.nodes.wrapper).find("[data-trigger=video-play]").click(function(e) {
						if (!that.scope.playing) {
							that.play();
							
						} else {
							that.stop();
						}
						e.stopPropagation();
						return false;
					});
					// Video full screen
					$(this.banner.nodes.wrapper).find("[data-trigger=video-fullscreen]").click(function(e) {

						if ($(this).hasClass("active")) {
							that.normalView();
						} else {
							that.fullscreen();
						}
						e.stopPropagation();
						return false;
					});
					// catch escape
					document.addEventListener("fullscreenchange", function() { that.testExitFullscreen(); }, false);    
				    document.addEventListener("webkitfullscreenchange", function() { that.testExitFullscreen(); }, false);
				    document.addEventListener("mozfullscreenchange", function() { that.testExitFullscreen(); }, false);
				    document.addEventListener("MSFullscreenChange", function () { that.testExitFullscreen(); }, false);
				    // Toggle on click
				    $(this.banner.nodes.wrapper).find(".video-controll").click(function() {
				    	
				    	that.toggle();
				    	return false;
				    });
				};
				this.play = function(force) {
					var force = force || false;
					if (window.mobileAPI && !force) {
						/* Р”Р»СЏ РјРѕР±РёР»СЊРЅС‹С… СѓСЃС‚СЂРѕР№СЃС‚РІ РЅР°Р¶Р°С‚РёРµ РєРЅРѕРїРєРё play СЂР°РІРЅРѕР·РЅР°С‡РЅРѕ РїРµСЂРµС…РѕРґСѓ РІ РїРѕР»РЅРѕСЌРєСЂР°РЅРЅС‹Р№ СЂРµР¶РёРј*/
						this.fullscreen();
					} else {
						$(this.banner.nodes.videotag).fadeIn("slow");
						$(this.banner.nodes.wrapper).find("[data-trigger=video-play]").addClass('hidden');
						$(this.banner.nodes.wrapper).find("[data-trigger=video-fullscreen]").fadeIn("slow");
						this.scope.playing = true;
						this.banner.displayVideo(true);
						this.banner.trimVideo();
					}
					return this;
				};
				this.stop = function(pause) {
					var pause = pause || false;
					if (window.mobileAPI && !pause) {
						/* Р’ РјРѕР±РёР»СЊРЅРѕРј СЂРµР¶РёРјРµ РїРѕСЃР»Рµ РѕСЃС‚Р°РЅРѕРІРєРё РІРёРґРµРѕ РѕРЅРѕ СЃРєСЂС‹РІР°РµС‚СЃСЏ */
						$(this.banner.nodes.videotag).hide();
						/* РћС‚РѕР±СЂР°Р¶РµРЅРёРµ РєРЅРѕРїРєРё РІС‹С…РѕРґР° РІ РїРѕР»РЅРѕСЌРєСЂР°РЅРЅС‹Р№ СЂРµР¶РёРј РґРѕРїСѓСЃС‚РёРјРѕ Р»РёС€СЊ РЅР° РїР»Р°РЅС€РµС‚Р°С… Рё РїРє */
						$(this.banner.nodes.wrapper).find("[data-trigger=video-fullscreen]").hide();
					}
					$(this.banner.nodes.wrapper).find("[data-trigger=video-play]").removeClass('hidden');
					this.banner.nodes.videotag[0].pause();
					this.scope.playing = false;
					return this;
				};
				this.toggle = function() {
					if (this.scope.playing) this.stop(true); // pause
						else this.play();
				};
				this.fullscreen = function() {
					var that = this;
					
					$(this.banner.nodes.wrapper).addClass("fullscreenvideo");
					
					this.play(true);

					requestFullScreen(document.body);

					// make window full screen
					setTimeout(function() {
						$("body").addClass("fix");
						$("#banner").addClass("fullscreen");
						$("[data-trigger=video-fullscreen]").addClass("active");
						$("#banner").proportionalBlock("disable"); // Disable proportional block
						that.scope.waitForEscapeFullscreen = true;
						that.banner.trimVideo();
					}, 200);
					
					// Hide overindex elements
					$(".overindex").hide();

					return this;
				};
				this.normalView = function(cssOnly) {
					var that = this;
					$(this.banner.nodes.wrapper).removeClass("fullscreenvideo");
					this.scope.waitForEscapeFullscreen = false;
					var cssOnly = cssOnly || false;
					if (!cssOnly) {
						exitFullScreenMode();
					}
					
					if (window.mobileAPI) {
						/* Р’ РјРѕР±РёР»СЊРЅРѕРј СЂРµР¶РёРјРµ РІС‹С…РѕРґ РёР· РїРѕР»РЅРѕСЌРєСЂР°РЅРЅРѕРіРѕ СЂРµР¶РёРјР° СЂР°РІРЅРѕСЃРёР»СЊРЅРѕ РѕСЃС‚Р°РЅРѕРІРєРµ РІРёРґРµРѕ*/
					}
					if (this.banner.options.stopAtNormal) this.stop();

					setTimeout(function() {
						// Show overindex elements
						$(".overindex").show();

						$("body").removeClass("fix");
						$("#banner").removeClass("fullscreen");
						$("[data-trigger=video-fullscreen]").removeClass("active");
						$("#banner").proportionalBlock("enable");
						that.banner.trimVideo();
					}, 200);

					return this;
				}
				this.testExitFullscreen = function() {
					
					if (this.scope.waitForEscapeFullscreen) {
						
						this.normalView(true);
					}
				}
				this.init();
			})(this);

			// Binds and execute
			$(window).resize(function() {

				that.trimVideo($(this).height());
			});
			//that.trimVideo($(window).height());
		}

		this.displayWrapper = function() {
			$(this.nodes.wrapper).animate({
				opacity:1
			},1000);
		};

		this.displayVideo = function(ok, fullscreen) {
			var fullscreen = fullscreen || false;
			this.displayWrapper();
			if (ok||false) {
				if (this.scope.loaded) $(this.nodes.videotag).animate({
					opacity:1
				},1000);
				this.scope.showOnLoad = true;
				this.nodes.videotag[0].play();
				if (fullscreen) $("#banner").addClass("fullscreen");
			};
		};

		this.testVideo = function() {
			var that = this;
			
			if (this.nodes.videotag[0].readyState<3) {
				setTimeout(function() {
					that.testVideo();
				},300);
			} else {
				//
				this.scope.loaded = true;
				if (this.scope.showOnLoad) {
					$(this.nodes.videotag).animate({
						'opacity': 1
					}, 1000);
				};
				that.trimVideo();
			};
		};
		this.create();
	};
});