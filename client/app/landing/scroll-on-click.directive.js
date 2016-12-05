angular.module('reworkApp.landing')
  .directive('scrollOnClick', function ($window) {
      return {
        restrict: 'A',
        link: function link(scope, $elem, attrs) {
          var idToScroll = attrs.href;
//          console.log(idToScroll);
//          angular.element($window).bind("scroll", function () {
//              var offsets = [];
//              angular.element('.menu li a').each(function (index, elem) {
//                 var href = elem.href.substr(elem.href.indexOf('#'), elem.href.length-elem.href.indexOf('#'));
//                console.log(href);
//                offsets.push(href.offset().top);
//              })
//            //          offsets.push($(idToScroll).offset().top);
//            console.log(offsets);
//            if (this.pageYOffset >= 200) {
//              scope.boolChangeClass = true;
//            }
//          });
        $elem.on('click', function () {
          if (attrs.title) {
            $('.navigation_list li').find('a').removeClass('active');
            $('.navigation_list li').find('span').html('');
            $elem.addClass('active');
            $elem.find('span').html(attrs.title);
          }
          var $target;
          if (idToScroll) {
            $target = $(idToScroll);
          } else {
            $target = $elem;
          }
          $('body').animate({
            scrollTop: $target.offset().top
          }, 'slow');
        });
      }
    };
  });
