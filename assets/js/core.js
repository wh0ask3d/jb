/* eslint-disable */

(function() {
  'use strict';

  var tween = window.popmotion.tween;
  var chain = window.popmotion.chain;
  var delay = window.popmotion.delay;
  var easing = window.popmotion.easing;

  window.objectFitImages();

  var isMobile = /iPhone|iPad|iPod|BlackBerry|IEMobile|Android/i.test(navigator.userAgent);

  var KEY_CODE = {
    esc: 27
  };

  var PrimaryNav;

  $(document).ready(function() {
    App();
    // pushStateAjax();
  });

  function App() {
    PrimaryNav.init();

    if($('.gallery').length > 0) {
      $('.gallery a').simpleLightbox({});
    }
    
    pageSlider();
    pageDetails();
    pageProject();
    scrollPoint()
    blogGallery();
    // DemoMenu();
    comingSoon();
    contactMap();
    heroSection();

    if (isMobile) {
      $('html').addClass('touch');
    } else {
      var skrollr = window.skrollr.init({
        smoothScrolling: true,
        smoothScrollingDuration: 200,
        forceHeight: false
      });
      skrollr.refresh();
    }

    if ($('.footer').length > 0) {
      animate('.footer', 'animated fadeIn');
      Affix('.footer', 'bottom');
    }

    if ($('.pricing-row').length > 0) {
      var prices = $('.pricing-row');

      $('html').animate({
        scrollTop: prices.offset().top - $('.footer').height() - 2
      }, 600, function() {
        $('.pricing-row__item').addClass('invisible').each(function (i, el) {
          $('.pricing-row__wrap').removeClass('invisible');

          setTimeout(function() {
            $(el).css({
              animationDuration: '800ms'
            }).removeClass('invisible').addClass('animated bounceInRight');
          }, 100 * i);
        });
      });
    }

    if ($('.scene').length > 0) {
      sceneProject();
    }

    $('.btn--load').on('click', function(e) {
      e.preventDefault();

      var t = 2000;
      var $btn = $(this);

      $btn.addClass('spin').find('.text').html($btn.data('text-progress'));

      $btn.find('.text i').each(function (i) {
        $(this).css('animation-delay', t / 4 * i + 'ms');
      });

      setTimeout(function() {
        $btn.removeClass('spin').find('.text').html($btn.data('text'));
      }, t);
    });

    $('.blog-room__reply').on('click', function (e) {
      e.preventDefault();

      var $target = $(this).attr('href');

      $('html').animate({
        scrollTop: $($target).offset().top
      }, 800, 'linear');

      $('#feedback .form-group:first-child input').focus();
    });

    $('.placeholder').each(function () {
      var $text = $(this);

      var $charts = $text.text().split('');

      $text.empty();

      $.each($charts, function (i, el) {
        $text.append('<span class="chart">' + el + '</span>');
      });

      $text.find('.chart').each(function (i) {
        var multiplier = i + 1;
        var calc = 50 * multiplier;

        $(this).css({ 'transition-delay': calc + 'ms' });
      });
    });
  }

  function heroSection() {
    var $blockHero = $('.block-hero');

    if ($blockHero.length > 0) {
      $(window).on('scroll', makeOpacity);
    }

    function makeOpacity() {
      var scrolled = $(window).scrollTop(),
          $top = $blockHero.offset().top,
          opacity = (1 - (scrolled / 20) / 20);

      if (scrolled >= $top) {
        if (opacity > 0) {
          $blockHero.css({
            transform: 'translate3d(0, ' + (scrolled) / 2 + 'px, 0)',
            opacity: opacity
          });
        }
      } else {
        $blockHero.css({ opacity: 1 });
      }
    }
  }

  function pushStateAjax() {
    var transition = Barba.BaseTransition.extend({
      start: function () {
        Promise
          .all([this.newContainerLoading, this.ready()])
          .then(this.loadPage.bind(this));
      },

      ready: function () {
        var deferred = Barba.Utils.deferred();

        deferred.resolve();

        return deferred.promise;
      },

      loadPage: function() {
        var _this = this,
            oldEl = _this.oldContainer,
            newEl = _this.newContainer,
            oldFooter = $(oldEl).find('.footer'),
            scene = $(newEl).find('.scene'),
            top = window.pageYOffset || document.documentElement.scrollTop;

        $(oldEl).css({
          width: '100%',
          left: 0,
          position: 'absolute'
        });

        $(oldEl).fadeOut(300);

        $(newEl).css({
          position: 'relative',
          visibility: 'visible',
          opacity: 0
        });

        $(oldEl).css('top', -top + 'px');

        window.scroll(0, 0);

        if (oldFooter.length > 0) {
          oldFooter.css({
            top: oldFooter.offset().top
          }).animate({
            opacity: 0
          }, 300);
        }

        if (scene.length) {
          $(newEl).animate({
            opacity: 1
          }, 300, function () {
            _this.done();
          });
        } else {
          $('body').addClass('page-load');

          setTimeout(function () {
            $('body').addClass('page-load_start');

            $(newEl).animate({
              opacity: 1
            }, 300);

            PrimaryNav.hide();

            setTimeout(function () {
              $('body').removeClass('page-load page-load_start');

              _this.done();
            }, 1000);
          }, 500);
        }
      }
    });

    Barba.Pjax.getTransition = function () {
      return transition;
    };

    Barba.Pjax.start();

    Barba.Dispatcher.on('transitionCompleted', function () {
      App();
    });
  }

  PrimaryNav = (function() {
    var html = document.querySelector('html'),
        cover = document.querySelector('.overlay');

    return {
      init: function() {
        var _this = this;
        var menuToggle = document.querySelector('.toggle-menu');

        menuProps('closed', true);

        menuToggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          menuToggle.classList.toggle('toggle-menu_active');

          if ($('html').hasClass('menu-open') === true) {
            _this.hide();

            setTimeout(function() {
              menuToggle.style.marginRight = '0px';
            }, 100);
          } else {
            _this.show();

            menuToggle.style.marginRight = scrollbarWidth();
          }
        });

        cover.addEventListener('click', function(e) {
          e.preventDefault();

          menuToggle.classList.remove('toggle-menu_active');
          _this.hide();
        });

        document.addEventListener('keyup', function(e) {
          e.preventDefault();
          if ($('html').hasClass('menu-open') === true) {
            if (e.keyCode === KEY_CODE.esc) {
              menuToggle.classList.remove('toggle-menu_active');
              _this.hide();
            }
          }
        });
      },

      show: function() {
        document.querySelector('html, body').style.overflowY = 'hidden';
        document.querySelector('body').style.paddingRight = scrollbarWidth();

        cover.className = 'overlay';
        cover.style.display = 'block';
        html.classList.add('menu-open');

        menuProps('open');
      },

      hide: function() {
        html.classList.remove('menu-open');
        cover.classList.add('overlay_hide');

        menuProps('closed');

        setTimeout(function() {
          if ($(html).hasClass('menu-open') === false) {
            document.querySelector('html, body').style.overflowY = '';
            document.querySelector('body').style.paddingRight = '';
          }
        }, 100);

        setTimeout(function() {
          cover.style.display = 'none';
        }, 300);
      }
    }

    function menuProps(state, initial) {
      var panel = document.querySelector('.menu');
      var items = panel.querySelectorAll('.menu a');

      var panelProps = {
        initialPose: initial ? 'closed' : undefined,
        open: {
          x: '0%',
          opacity: 1,
          delayChildren: 300,
          staggerChildren: 50,
          transition: window.popmotion.tween
        },
        closed: {
          x: '100%',
          opacity: 0,
          delayChildren: 300,
          transition: {
            'default': { ease: 'linear', duration: 400 },
            'opacity': { ease: 'easeIn', duration: 200, delay: 100 }
          }
        }
      };

      var itemProps = {
        open: { x: 0, opacity: 1 },
        closed: { x: 50, opacity: 0 }
      };

      var composite = window.pose(panel, panelProps);

      for (var i = 0; i < items.length; i++) {
        (function(i) {
          return composite.addChild(items[i], itemProps);
        })(i);
      }

      composite.set(state);
    }

    function scrollbarWidth() {
      var outer = document.createElement('div');

      outer.style.visibility = 'hidden';
      outer.style.width = '100px';
      outer.style.msOverflowStyle = 'scrollbar';

      document.body.appendChild(outer);

      var widthNoScroll = outer.offsetWidth;
      outer.style.overflow = 'scroll';

      var inner = document.createElement('div');
      inner.style.width = '100%';
      outer.appendChild(inner);

      var widthScroll = inner.offsetWidth;

      outer.parentNode.removeChild(outer);

      return widthNoScroll - widthScroll + 'px';
    }
  })();

  function DemoMenu() {
    var panel = document.querySelector('.demo-panel');
    var toggle = document.querySelector('.demo-toggle');
    var toggleClose = document.querySelector('.demo-panel__close');

    demoProps('closed', true);

    toggle.addEventListener('click', demoShow);
    toggleClose.addEventListener('click', demoClose);

    document.addEventListener('keyup', demoCloseEsc);

    function demoShow(e) {
      e.preventDefault();

      demoProps('open');

      panel.classList.add('show');
    }

    function demoClose(e) {
      e.preventDefault();

      demoProps('closed');

      panel.classList.remove('show');
    }

    function demoCloseEsc(e) {
      demoProps('closed');

      if (e.keyCode === KEY_CODE.esc) {
        if (panel.classList.contains('show')) {
          panel.classList.remove('show');
        }
      }
    }

    function demoProps (state, initial) {
      var panel = document.querySelector('.demo-panel');
      var items = panel.querySelectorAll('.demo-panel li');

      var panelProps = {
        initialPose: initial ? 'closed' : undefined,
        open: {
          x: '0%',
          opacity: 1,
          delayChildren: 200,
          staggerChildren: 50,
          transition: window.popmotion.tween
        },
        closed: {
          x: '-100%',
          opacity: 0,
          delayChildren: 200,
          transition: {
            'default': { ease: 'linear', duration: 300 },
            'opacity': { ease: 'easeIn', duration: 100, delay: 100 }
          }
        }
      };

      var itemProps = {
        open: { x: 0, opacity: 1 },
        closed: { x: 50, opacity: 0 }
      };

      var composite = window.pose(panel, panelProps);

      for (var i = 0; i < items.length; i++) {
        (function(i) {
          return composite.addChild(items[i], itemProps);
        })(i);
      }

      composite.set(state);
    }
  }

  function wheelScroll($el, carousel) {
    $el.on('mousewheel', function (e) {
      if (e.deltaY > 0) {
        carousel.slideNext();
      } else {
        carousel.slidePrev();
      }
      e.preventDefault();
    });
  }

  var Affix = function(elem, pos) {
    var el = $(elem),
        didScroll,
        lastScrollTop = 0,
        delta = 0,
        elH = el.outerHeight();

    $(window).on('scroll', function() {
      didScroll = true;
    });

    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 100);

    function hasScrolled() {
      var st = $(document).scrollTop();

      if (Math.abs(lastScrollTop - st) <= delta) return;

      if (st > lastScrollTop && st > elH) {
        el.addClass('hide')
      } else if (st + $(window).height() < $(document).height()) {
        el.removeClass('hide')
      }

      lastScrollTop = st;
    }
  }

  function sceneProject() {
    var preloader = document.querySelector('.scene');
    var loader = popmotion.styler(preloader);
    var image = popmotion.styler(preloader.querySelector('.scene__thumbnail'));
    var titles = popmotion.styler(preloader.querySelector('.scene__signature'));
    var progress = popmotion.styler(preloader.querySelector('.scene__progress'));

    chain(
      delay(1000),
      tween({
        from: { opacity: 1 },
        to: { opacity: 0 },
        duration: 1200,
        easing: easing.linear
      })
    ).start(image.set);

    chain(
      delay(1000),
      tween({
        from: { opacity: 1 },
        to: { opacity: 0 },
        duration: 1200,
        easing: easing.linear
      })
    ).start(titles.set);

    chain(
      delay(2200),
      tween({
        from: 0, to: 100, duration: 1200, ease: easing.easeOut
      })
    ).start(function (v) {
      return loader.set('x', v + '%');
    });

    tween({
      from: -100, to: 100, duration: 4000, ease: easing.easeOut
    }).start(function (v) {
      return progress.set('x', v + '%');
    });
  }

  function scrollPoint() {
    var scroll;

    makeScroll();

    $(window).on('scroll', makeScroll);

    function makeScroll() {
      clearTimeout(scroll);

      scroll = setTimeout(function() {
        var wT = $(window).scrollTop(),
            wH = $(window).height();

        $('.scroll-point').each(function () {
          var $this = $(this);


          if ($this.offset().top < wT + wH / 1.5) {
            $this.addClass('point');
          } else {
            $this.removeClass('point');
          }
        });
      }, 30);
    }
  }

  function animate(el, classess) {
    if ($(el).length) {
      $(el).removeClass('invisible').addClass(classess);
    }
  }

  function pageSlider() {
    var homeSlider = $('.js-home-slider');

    var carousel = new Swiper(homeSlider, {
      direction: 'horizontal',
      loop: true,
      speed: 1000,
      mousewheel: {
        releaseOnEdges: true
      },
      navigation: {
        prevEl: '.homepage-slider__arrow--left',
        nextEl: '.homepage-slider__arrow--right'
      },
      scrollbar: {
        el: '.swiper-scrollbar'
      },
      on: {
        slideChangeTransitionEnd: function() {
          var linked = homeSlider.find('.swiper-slide-active a').attr('href');
          var title = homeSlider.find('.swiper-slide-active img').attr('alt');

          homeSlider.find('.homepage-slider__caption').attr('href', linked);
          homeSlider.find('.homepage-slider__caption span').text(title);
        }
      }
    });
  }

  function pageDetails() {
    var homeDetails = '.js-home-details';

    var carousel = new Swiper(homeDetails, {
      effect: 'horizontal',
      mousewheel: {
        releaseOnEdges: true
      },
      loop: true,
      speed: 2000,
      autoplay: {
        delay: 5000000,
        disableOnInteraction: false
      },
      scrollbar: {
        el: '.swiper-scrollbar'
      },
      breakpoints: {
        768: {
          speed: 1200
        }
      },
      on: {
        init: function() {
          carouselAnim();
        },
        slideChangeTransitionStart: function() {
          $(homeDetails).addClass('animated-fade');
        },
        slideChangeTransitionEnd: function() {
          carouselAnim();
        }
      }
    });

    function carouselAnim() {
      var getText = $(homeDetails).find('.swiper-slide-active img').data('title');
      var renderText = $(homeDetails + ' .home-details__title a');
      var symbols = getText.split('');
      var lineAnim = renderText.parent().find('.line');

      var stopAnim = function () {
        if ($(homeDetails).hasClass('animated-fade')) {
          $(homeDetails).removeClass('animated-fade');
        }
      }

      renderText.empty();

      for (var i = 0; i < symbols.length; i++) {
        (function(i) {
          renderText.append('<span class="symbol">' + symbols[i] + '</span>');
        })(i);
      }

      renderText.find('span').each(function (i) {
        var multiplier = i + 4;
        var calc = 30 * multiplier;

        lineAnim.css({
          'transition-duration': calc + 'ms'
        });

        $(this).animate({
          'transition-delay': calc + 'ms'
        }, stopAnim, 0);
      });
    }
  }

  function pageProject() {
    var projectDetails = '.js-project-details';

    var carousel = new Swiper(projectDetails, {
      direction: 'horizontal',
      loop: true,
      speed: 1000,
      freeMode: true,
      freeModeMomentum: true,
      pagination: {
        clickable: true,
        el: '.js-project-details-indication',
        bulletElement: 'li',
        bulletClass: 'indicator',
        bulletActiveClass: 'active'
      },
      navigation: {
        prevEl: '.js-project-details-prev',
        nextEl: '.js-project-details-next'
      },
      scrollbar: {
        el: '.swiper-scrollbar'
      },
      breakpoints: {
        750: {
          freeMode: false
        }
      }
    });

    carousel.on('slideChangeTransitionStart', function () {
      $(projectDetails).addClass('animated-fade');
    });

    carousel.on('slideChangeTransitionEnd', function () {
      var slides = $(projectDetails).find('.swiper-slide');
      var currentSlide = $(projectDetails).find('.swiper-slide-active');
      var prevSlide = $(projectDetails).find('.js-project-slider-prev h2 span');
      var nextSlide = $(projectDetails).find('.js-project-slider-next h2 span');

      $(projectDetails).removeClass('animated-fade');

      if (carousel.isBeginning) {
        prevSlide.text(slides.eq(-1).find('h2').text());
      } else {
        prevSlide.text(currentSlide.prev().find('h2').text());
      }

      if (carousel.isEnd) {
        nextSlide.text(slides.eq(0).find('h2').text());
      } else {
        nextSlide.text(currentSlide.next().find('h2').text());
      }
    });

    carousel.on('resize', function () {
      carousel.slideReset();
      carousel.updateSize();
    });

    wheelScroll($('#projectGallery'), carousel);
  }

  function blogGallery() {
    var posts = $('.js-post-gallery');
    var pswp = $('.pswp')[0];

    var options = {
      index: $(this).index(),
      bgOpacity: 0.85,
      showHideOpacity: true
    };

    var items = [];

    posts.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      posts.each(function () {
        var $this = $(this);

        var item = {
          src: $this.attr('href'),
          w: $this.data('width'),
          h: $this.data('height'),
          title: $this.data('caption')
        };
        items.push(item);
      });

      var gallery = new window.PhotoSwipe(
        pswp,
        window.PhotoSwipeUI_Default,
        items,
        options
      );

      gallery.init();
    });
  }

  function comingSoon() {
    $('.js-countdown').countdown('2020/10/10', function (e) {
      $(this).html(e.strftime(
        "<div class=\"row text-center\">\n\n        <div class=\"col-3 col-sm-3\">\n          <div class=\"caption\">Days</div>\n          <div class=\"tick\">%d</div>\n        </div>\n        <div class=\"col-3 col-sm-3\">\n          <div class=\"caption\">Hours</div>\n          <div class=\"tick\">%H</div>\n        </div>\n        <div class=\"col-3 col-sm-3\">\n          <div class=\"caption\">Minutes</div>\n          <div class=\"tick\">%M</div>\n        </div>\n        <div class=\"col-3 col-sm-3\">\n          <div class=\"caption\">Seconds</div>\n          <div class=\"tick\">%S</div>\n        </div>\n      </div>"
      ));
    });
  }

  function contactMap() {
    var mapInit = function () {
      // Get the HTML DOM element that will contain your map
      // We are using a div with id="map" seen below in the <body>
      var Map = window.google.maps;
      var mapEl = document.getElementById('map');

      var options = {
        // How zoomed in you want the map to start at (always required)
        zoom: 16,
        scrollwheel: false,

        // The latitude and longitude to center the map (always required)
        center: new Map.LatLng(-34.8679988, 138.5118251),

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ]
      };

      // Create the Google Map using our element and options defined above
      var map = new Map.Map(mapEl, options);

      // Let's also add a marker while we're at it
      var marker = new Map.Marker({
        title: 'Mitchell Hayes',
        icon: './assets/images/marker.png',
        position: new Map.LatLng(-34.8679988, 138.5118251),
        map: map
      });

      return marker;
    };

    if ($('.contacts__map').length > 0) {
      return mapInit();
    }
  }
})();
