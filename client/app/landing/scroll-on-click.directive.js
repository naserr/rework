angular.module('reworkApp.landing')
  .directive('scrollOnClick', function() {
    return {
      restrict: 'A',
      link: function link(scope, $elem, attrs) {
        var idToScroll = attrs.href;
        $elem.on('click', function() {
          if(attrs.title) {
            $('.navigation_list li').find('a').removeClass('active');
            $('.navigation_list li').find('span').html('');
            $elem.addClass('active');
            $elem.find('span').html(attrs.title);
          }
          var $target;
          if(idToScroll) {
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
