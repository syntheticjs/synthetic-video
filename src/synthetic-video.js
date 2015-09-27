define([
	'polyvitamins~polychrome@master',
	'./codecs.js',
	'polyvitamins~polychrome-dom@master/put',
	'polyvitamins~polychrome-dom@master/empty',
	'polyvitamins~polychrome-dom@master/css',
	'polyvitamins~polychrome-dom@master/condition',
	'polyvitamins~polychrome-dom@master/classed',
	'polyvitamins~polychrome-dom@master/events',
	'polyvitamins~polychrome-dom@master/html',
	'polyvitamins~polychrome-dom@master/present',
	'polyvitamins~polychrome-dom@master/and',
	'polyvitamins~polychrome-dom@master/width',
	'polyvitamins~polychrome-dom@master/height',
	'polyvitamins~polychrome-dom@master/present',
	'polyvitamins~polychrome-objective@master/tie',
	'./synthetic-video.css'
], function($, codecs) {
	var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	// Remove event listner polyfill
	var removeEventListner = function(el, type, handler) {
		if ( el.addEventListener ) {
		el.removeEventListener(type, handler, false);
		}  else if ( elem.attachEvent ) {
		el.detachEvent("on" + type, handler);
		} else {
		el["on"+type] = null;
		};
	},
	// Event listner polyfill
	eventListner = function(el, type, handler, once) {
	    	var realhandler = once ? function() {
		removeEventListner(el, type, realhandler);
				} : handler;
		if ( el.addEventListener ) {
		listen = el.addEventListener( type, handler, false );
		} else if (el.attachEvent) {
		 listen = el.addEventListener( 'on'+type, handler, false );
		} else {
		el['on'+type] = handler;
		}
		return el;
	};

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

	var svgIcons = {
		"synthetic-video-icon-fullscreen": '<g id="synthetic-video-icon-fullscreen"><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M0,0v3v5h3V3.005l5.984,0.01L9,0H3H0z M3,14.995V10H0v5v3h3h6l-0.016-3.016L3,14.995z M21,0h-6l0.016,3.016L21,3.005V8h3V3V0H21z M21,14.995l-5.984-0.011L15,18h6h3v-3v-5h-3V14.995z"/></g>',
		"synthetic-video-icon-normalscreen": '<g id="synthetic-video-icon-normalscreen"><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M0,10l0.016,3.016L6,13.005V18h3v-5v-3H6H0z M24,8l-0.016-3.016L18,4.995V0h-3v5v3h3H24z M6,4.995l-5.984-0.01L0,8h6h3V5V0H6V4.995z M15,10v3v5h3v-4.995l5.984,0.011L24,10h-6H15z"/></g>',
		"synthetic-video-icon-pause": '<g id="synthetic-video-icon-pause"><rect fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="4" x="6" y="2" height="13.75"/><rect x="13.75" y="2" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="4" height="13.75"/></g>'
	};

	// Create function that create a link to svg arrow
	function createSvgSprite(id) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		svg.style.width = "24px";
		svg.style.height = "18px"
		$(this).html('<svg width="24px" height="18px">'+svgIcons[id]+'</svg>');
	};



	Synthetic.createComponent('synthetic-video', function($component) {
		$component
		.attached(function($element) {
			
		})
		.created(function($self, $element, $scope, $component) {
			console.log('creating');
			/*
			Creates svg icons
			*/
			// Hell, this code is not supported in IE10-
			/*if ("undefined"===typeof $component.__iconsMapCrated) {
				var defssvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				document.getElementsByTagName('body')[0].appendChild(defssvg);
				defssvg.style.display = 'none';
				defssvg.innerHTML = '<g id="synthetic-video-icon-fullscreen"><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M0,0v3v5h3V3.005l5.984,0.01L9,0H3H0z M3,14.995V10H0v5v3h3h6l-0.016-3.016L3,14.995z M21,0h-6l0.016,3.016L21,3.005V8h3V3V0H21z M21,14.995l-5.984-0.011L15,18h6h3v-3v-5h-3V14.995z"/></g>';
				defssvg.innerHTML += '<g id="synthetic-video-icon-normalscreen"><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M0,10l0.016,3.016L6,13.005V18h3v-5v-3H6H0z M24,8l-0.016-3.016L18,4.995V0h-3v5v3h3H24z M6,4.995l-5.984-0.01L0,8h6h3V5V0H6V4.995z M15,10v3v5h3v-4.995l5.984,0.011L24,10h-6H15z"/></g>';
				defssvg.innerHTML += '<g id="synthetic-video-icon-pause"><rect fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="4" x="6" y="2" height="13.75"/><rect x="13.75" y="2" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="4" height="13.75"/></g>';
				$component.__iconsMapCrated=true;
			}*/


			$scope.loaded = false;
			/* Put video tag */
			this.videoElement = $($element)
			.empty()
			.put('video', {
				"classed": ""
			})
			.bind('dblclick', function() {
				$self.toggleFullscreen();
				e.stopPropagation();
				return false;
			})
			.bind('click', function() {
				// toggle play pause
				$self.toggle();
			})[0];

			this.dummy = false;

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
			})
			.bind('dblclick', function() {
				$self.toggleFullscreen();
				e.stopPropagation();
				return false;
			});
			/* Control play */
			;
			this.videoControlPlay = this.videoControl.put('a', {
				"class": "synthetic-video__playbtn synthetic-video__unvisible",
				"href": ""
			}).tie(function() {
				$(this)
				.put('div')
				.html('<svg><g><path fill="none" d="M29,16.491L0,32.982V0L29,16.491z"/></g></svg>')
			})
			.bind('click',function(e) {

				if (!$scope.playing) {
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
				"class": "synthetic-video__fullscreenbtn"
			}).tie(function() {
				$(this)
				.put('span', {
					"class": "synthetic-video__disabled"
				})
				.tie(function() {
					createSvgSprite.call(this, 'synthetic-video-icon-fullscreen');
				})
				.and('span', {
					"class": "synthetic-video__enabled"
				})
				.tie(function() {
					createSvgSprite.call(this, 'synthetic-video-icon-normalscreen');
				});
			})
			.bind('click', function(e) {
				if ($scope.fullscreen) {
					$self.normalView();
				} else {
					$self.fullscreen();
				}
				e.stopPropagation();
				return false;
			});

			// Pause button
			this.videoControlPausebtn = this.videoControl.put('a', {
				"href": "",
				"class": "synthetic-video__pausebtn"
			}).tie(function() {
				$(this)
				.put('span', {
				})
				.tie(function() {
					createSvgSprite.call(this, 'synthetic-video-icon-pause');
				});
			})
			.bind('click', function(e) {
				$self.toggle();
				e.stopPropagation();
				return false;
			});

			// catch escape
			document.addEventListener("fullscreenchange", function() { $self.testExitFullscreen(); }, false);    
		    document.addEventListener("webkitfullscreenchange", function() { $self.testExitFullscreen(); }, false);
		    document.addEventListener("mozfullscreenchange", function() { $self.testExitFullscreen(); }, false);
		    document.addEventListener("MSFullscreenChange", function () { $self.testExitFullscreen(); }, false);

		    if ($scope.attributes.ratio) {
		    	eventListner(window, 'resize', function() {
		    		$self.trimVideo();
		    	});
		    }
		});
		
		
		/*
		Watch propertie poster
		*/
		$component.watch('attributes', ['poster'], function($scope, poster) {
			
			if (poster) this.videoElement.setAttribute("poster", poster);
			else this.videoElement.removeAttribute("poster");
		});

		/*
		Watch properties controls
		*/
		$component.watch('attributes', ['controls'], function($scope, controls) {

			this.videoControlPlay.present(Synthetic.hasPropertySubKey(controls, 'play'));
			this.videoControlFullscreen.present(Synthetic.hasPropertySubKey(controls, 'fullscreen'));
		});

		/*
		Video ratio
		*/
		$component.watch('attributes', ['ratio'], function($self, ratio) {
			$self.trimVideo();
		});

		/*
		Watch properties types and src
		*/
		$component.watch('attributes', ['types','src'], function($scope, types, src) {

			$(this.videoElement).empty();
			types="string"===typeof types ? types.split(',') : [],
			src="string"===typeof src ? src : '',
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
			
			$(this.videoElement).classed("synthetic-video__unvisible", !loaded);
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
		});

		$component.watch(['fullscreen'], function($self, fullscreen) {
			$($self.videoControlFullscreen).classed("synthetic-video__active", fullscreen);
		});

		$component.watch(['playing', 'loaded', 'attributes.poster', 'attributes.disabled'], function(playing, loaded, poster, disabled) {
			
			disabled=disabled!==null;

			if (disabled) {
				this.stop();
			}

			if (disabled || (poster&&!playing&&this.videoElement.currentTime===0)) {
				this.$element.style.backgroundImage="url("+poster+")";
			} else {
				this.$element.style.backgroundImage='none';
			}
			$(this.videoElement)[0].style.visibility = (!disabled&&(playing||this.videoElement.currentTime)>0?'visible':'hidden');
			$(this.videoControlPausebtn).classed("synthetic-video__unvisible", disabled||(!playing&&!!loaded));
			$(this.videoControlPlay).classed("synthetic-video__unvisible", disabled||!(!playing&&!!loaded));
			$(this.videoControlFullscreen).classed("synthetic-video__unvisible", disabled||!loaded);
		});

		return {
			testVideo: function($scope) {
				var that = this,
				max = (is_firefox ? 2 : 3);
				if (this.videoElement.readyState===0) {
					this.trimVideo();
				}
				if (this.videoElement.readyState<max
					
				) {
					
					setTimeout(function() {
						that.testVideo();
					},300);
				} else {

					$scope.loaded = true;
					console.log('set loaded to true');
				};
			},
			trimVideo: function($element, $scope) {
				// Set video width/height
				if (this.videoElement.videoHeight==0) return;

				if ($scope.attributes.ratio && !$scope.fullscreen)
				$($element).css("height", Math.round($($element).width()*parseFloat($scope.attributes.ratio))+'px');

				if ($scope.fullscreen)
				$($element).css("height", "100%");

				var vrHeight = this.videoElement.videoHeight,
				vrWidth = this.videoElement.videoWidth,
				wrapperWidth = !!$scope.fullscreen?$(window).width():$($element).width(),
				wrapperHeight = ($scope.attributes.ratio&&!$scope.fullscreen)?Math.round(parseFloat($scope.attributes.ratio)*wrapperWidth):$($element).height(),
				wr = wrapperWidth/vrWidth,
				relHeight = vrHeight*wr;
				
				$(this.videoElement).css({
					'width': wrapperWidth+'px',
					'height': relHeight+'px'
				});
				if ($scope.attributes.ratio) {
					$(this.videoElement).css({
						'marginTop': Math.round((wrapperHeight-relHeight)/2)+'px'
					});
				}
			},
			play: function($scope, force) {

				if ($scope.attributes.disabled) return false;

				if ($scope.mobileAPI && !force) {
					this.fullscreen();
				} else {

					$(this.videoElement).classed("synthetic-video__unvisible", false);
					
					$scope.playing = true;
					this.displayVideo(true);
					this.trimVideo();
				}
				return this;
			},
			stop: function($scope, pause) {
				if (this.mobileAPI && !pause) {
					$(this.videoElement).classed("synthetic-video__unvisible", true);
				}
				
				this.videoElement.pause();
				$scope.playing = false;
				return this;
			},
			toggle: function($scope) {

				if ($scope.playing) this.stop(true); // pause
				else this.play();
			},
			toggleFullscreen: function($scope) {
				if ($scope.fullscreen)
					this.normalView();
				else
					this.fullscreen();
					;
			},
			fullscreen: function($element, $self, $scope) {
				$($element).classed("synthetic-video__require-fullscreen", true);
				this.backupCss = {
					width: $element.style.width,
					height: $element.style.height
				}
				$($element).css({
					"width": "100%",
					"height": "100%"
				});
				$scope.fullscreen=true;

				/*
				Заменяем этот элемент пустышкой
				*/
				this.dummy = $($element).and('div').css({"display": "none"})[0];
				/*
				А сам элемент перемещаем в body
				*/
				document.body.appendChild($element);

				this.play(true);
				requestFullScreen(document.body);
				// make window full screen
				setTimeout(function() {
					$("body").classed("synthetic-video__require-fullscreen", true);
					// $("#banner").proportionalBlock("disable"); // Disable proportional block
					$scope.waitForEscapeFullscreen = true;
					$self.trimVideo();
				}, 350);

				return this;
			},
			normalView: function($self, $element, $scope, cssOnly) {
				$($element).classed("synthetic-video__require-fullscreen", false);
				$($element).css(this.backupCss);
				$scope.fullscreen = false;
				$scope.waitForEscapeFullscreen = false;
				if (!cssOnly) {
					exitFullScreenMode();
				}
				if ($scope.attributes.stopOutFullscreen) this.stop();

				/*
				Move element back to his place
				*/
				if (this.dummy) {
					$(this.dummy)
					.and($element);
					$(this.dummy)[0].parentNode.removeChild(this.dummy);
					/*
					После того как мы обратно закидываем элемент нужно ещё раз нажать на play
					*/
					this.videoElement.play();
				}

				$("body").classed("synthetic-video__require-fullscreen", false);

				setTimeout(function() {
					// Show overindex elements
					//$(".overindex").show();

					
					//$("#banner").proportionalBlock("enable");
					$self.trimVideo();
				}, 350);

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

					if ($scope.loaded) $(this.videoElement).classed("synthetic-video__unvisible", false);
					//$scope.showOnLoad = true;
					this.videoElement.play();
					if (fullscreen) this.fullscreen();
				};
			},
			displayWrapper: function($element) {
				$($element).classed("synthetic-video__unvisible", false);
				/*$($element).animate({
					opacity:1
				},1000);*/
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