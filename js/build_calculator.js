(function ($) {
    Drupal.behaviors.build_calculator = {
      attach: function (context, settings) {
        alert('hello world');
         console.log(settings);
      }
    };
})(jQuery);