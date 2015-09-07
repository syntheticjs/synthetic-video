define([
	'polyvitamins~polychrome@master',
	'./codecs.json',
	'polyvitamins~polychrome-dom@master/put',
	'polyvitamins~polychrome-dom@master/empty',
	'polyvitamins~polychrome-dom@master/css',
	'polyvitamins~polychrome-dom@master/condition',
	'polyvitamins~polychrome-dom@master/classed',
	'polyvitamins~polychrome-dom@master/events',
	'polyvitamins~polychrome-dom@master/html',
	'polyvitamins~polychrome-dom@master/and',
	'polyvitamins~polychrome-dom@master/width',
	'polyvitamins~polychrome-dom@master/height',
	'polyvitamins~polychrome-dom@master/present',
	'polyvitamins~polychrome-objective@master/tie'
], function($, codecs) {

	Synthetic.createComponent('synthetic-video', function($component) {
		$component
		.attached(function($element) {
			
		})
		.created(function($self, $element, $scope) {
			
			/* Put video tag */
			this.videoElement = $($element)
			.empty()
			.put('video', {
				"classed": "synthetic-video__visible"
			})[0];

			$($element)
			.css({
				"position": "relative"
			});

			this.videoControl = $($element).put('div', {
				"class": "synthetic-video__controll"
			})
			.bind('click', function() {
				// toggle play pause
				$self.toggle();
			});
			/* Control play */
			this.videoControlPlay = this.videoControl.put('a', {
				"class": "playbtn",
				"href": ""
			}).tie(function() {
				$(this)
				.put('div')
				.html('<svg><g><path fill="none" d="M29,16.491L0,32.982V0L29,16.491z"/></g></svg>')
			})
			.bind('click',function(e) {
				if ($scope.playing) {
					$self.play();
				} else {
					$self.stop();
				}
				e.stopPropagation();
				return false;
			});

			/* Fullscreen */
			this.videoControlFullscreen = this.videoControl.put('a', {
				"href": "",
				"class": "synthetic-video__fullscreenbtn synthetic-video__visible"
			}).tie(function() {
				$(this)
				.put('span', {
					"class": "disabled"
				})
				.html('Fullscreen ')
				.and('span', {
					"class": "enabled"
				})
				.html('Normal view ')
				.and('img', {
					"src": "http://www.estetica.ru/newest/esofas/images/manufactory/full_screen_arrow.png",
					"class": "disabled"
				})
				.and('img', {
					"src": "http://www.estetica.ru/newest/esofas/images/manufactory/to-normal-view.png",
					"class": "enabled"
				});
			})
			.bind('click', function() {
				if ($scope.fullscreen) {
					$self.normalView();
				} else {
					$self.fullscreen();
				}
				e.stopPropagation();
				return false;
			});

			// catch escape
			document.addEventListener("fullscreenchange", function() { $self.testExitFullscreen(); }, false);    
		    document.addEventListener("webkitfullscreenchange", function() { $self.testExitFullscreen(); }, false);
		    document.addEventListener("mozfullscreenchange", function() { $self.testExitFullscreen(); }, false);
		    document.addEventListener("MSFullscreenChange", function () { $self.testExitFullscreen(); }, false);
		});
		
		/*
		Watch properties controls
		*/
		$component.watch('attributes', ['controls'], function($scope, controls) {

			this.videoControlPlay.present(Synthetic.hasPropertySubKey(controls, 'play'));
			this.videoControlFullscreen.present(Synthetic.hasPropertySubKey(controls, 'fullscreen'));
		});

		/*
		Watch properties types and src
		*/
		$component.watch('attributes', ['types','src'], function($scope, types, src) {

			$(this.videoElement).empty();
			types=types.split(','),
			psrc=src.lastIndexOf('.')>src.lastIndexOf('/') ? src.substring(0, src.lastIndexOf('.')) : src;
			for (var i = 0;i<types.length;++i) {
				$(this.videoElement).put('source', {
					"src": psrc+'.'+types[i],
					"type": codecs[types[i]]||""
				});
			};
			$scope.loaded = false;
			this.videoElement.load();
			
			$scope.waitForEscapeFullscreen = false;
			$scope.playing = false;
			this.testVideo();
		});

		/*
		Watch loaded
		*/
		$component.watch(['loaded'], function($self, $scope, loaded) {

			$(this.videoElement).classed("synthetic-video__visible", !!loaded);
			if (loaded) {
				this.trimVideo();
				if ($scope.attributes.autoplay) {
					setTimeout(function() { $self.play(); }, 100);
				}
			}
		});

		/*
		Watch properties muted
		*/
		$component.watch('attributes', ['muted'], function(muted) {
			this.videoElement.muted = !!muted;
		});

		/*
		Watch properties
		*/
		$component.watch('attributes', ['ratio','valign','vshift'], function($scope, $element, ratio, valign, vshift) {
			
			// Trim video
			var width = $($element).width();
			var wrapH = (parseInt(width)*parseFloat(ratio));
			
			var vidH = $(this.videoElement).height();
			switch(valign||'middle') {
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
			vidTop+=parseInt(vshift);

			if ($scope.waitForEscapeFullscreen) {
				$(this.videoElement).css({
					"margin-top": '0px'
				});
			} else {
				$(this.videoElement).css({
					"margin-top": vidTop+'px'
				});
			};
		})

		return {
			testVideo: function($scope) {
				var that = this;
				if (this.videoElement.readyState<3) {
					setTimeout(function() {
						that.testVideo();
					},300);
				} else {

					$scope.loaded = true;
				};
			},
			trimVideo: function($element, $scope) {
				if (!$scope.trimmed) return;
				// Set video width/height
				if (this.videoElement.videoHeight==0) return;

				var vrHeight = this.videoElement.videoHeight,
				vrWidth = this.videoElement.videoWidth,
				wrapperWidth = $($element).width(),
				wr = wrapperWidth/vrWidth;
				$(this.videoElement).css({
					'width': wrapperWidth+'px',
					'height': (vrHeight*wr)+'px'
				});
			},
			play: function($scope, force) {
				if (!force) {
					this.fullscreen();
				} else {
					$(this.videoElement).classed("synthetic-video__visible", true);
					$(this.videoControlPlay).classed("synthetic-video__visible", false);
					$(this.videoControlFullscreen).classed("synthetic-video__visible", true);
					$scope.playing = true;
					this.displayVideo(true);
					this.trimVideo();
				}
				return this;
			},
			stop: function($scope, pause) {
				if (this.mobileAPI && !pause) {
					$(this.videoElement).classed("synthetic-video__visible", false);
				} else {
					$(this.videoControlFullscreen).classed("synthetic-video__visible", false);
				}
				this.videoElement.pause();
				$scope.playing = false;
				return this;
			},
			toggle: function($scope) {
				if ($scope.playing) this.stop(true); // pause
				else this.play();
			},
			fullscreen: function($element, $self) {
				$($element).classed("fullscreenvideo", true);
				this.play();
				requestFullScreen(document.body);
				// make window full screen
				setTimeout(function() {
					$("body").classed("synthetic-video__require-fullscreen", true);
					$($self.videoControlFullscreen).classed("synthetic-video__active", true);
					// $("#banner").proportionalBlock("disable"); // Disable proportional block
					$scope.waitForEscapeFullscreen = true;
					$self.trimVideo();
				}, 200);

				return this;
			},
			normalView: function($element, cssOnly) {
				$($element).classed("fullscreenvideo", false);
				$scope.waitForEscapeFullscreen = false;
				if (!cssOnly) {
					exitFullScreenMode();
				}
				if ($scope.attributes.stopOutFullscreen) this.stop();

				setTimeout(function() {
					// Show overindex elements
					//$(".overindex").show();

					$("body").classed("synthetic-video__require-fullscreen", false);
					
					$($self.videoControlFullscreen).classed("synthetic-video__active", false);
					//$("#banner").proportionalBlock("enable");
					this.trimVideo();
				}, 200);

				return this;
			},
			testExitFullscreen: function($scope) {
				if ($scope.waitForEscapeFullscreen) {
					this.normalView(true);
				}
			},
			displayVideo: function($scope, ok, fullscreen) {
				this.displayWrapper();
				if (ok||false) {
					if ($scope.loaded) $(this.videoElement).classed("synthetic-video__visible", true);
					//$scope.showOnLoad = true;
					this.videoElement.play();
					if (fullscreen) this.fullscreen();
				};
			}
		}
	});

	/*
"<video id="+num+" controls width="+video.Width+" height="+video.Height+">\n"+
	"<source src=\"" + video.TheoraFileName + "\" type='video/ogg; codecs=\"theora, vorbis\"'/>\n" +
	"<source src=\"" + video.WebMFileName + "\" type='video/webm' >\n" +
	"<source src=\"" + video.H264FileName + "\" type='video/mp4'>\n" +
	"<p>Video is not visible, most likely your browser does not support HTML5 video</p>\n</video>\n" + 
	*/

});