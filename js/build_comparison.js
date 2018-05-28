(function ($, Drupal) {
  Drupal.behaviors.build_comparison = {
    attach: function (context, settings) {
    }
  };
  $( document ).ready(function() {
    var urlParams = new URLSearchParams(window.location.search);
    var param = urlParams.get('build');
    $("#edit-build-1").val(param).trigger('change');
  });
})(jQuery, Drupal);