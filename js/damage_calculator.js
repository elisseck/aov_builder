(function ($, Drupal) {
  Drupal.behaviors.build_comparison = {
    attach: function (context, settings) {
	  $("#edit-build-1").attr("disabled", true);
    }
  };
})(jQuery, Drupal);