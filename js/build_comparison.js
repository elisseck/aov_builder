(function ($, Drupal) {
  Drupal.behaviors.build_comparison = {
    attach: function (context, settings) {
	  var param = urlParams.get('build');
      $("#edit-build-1").val(param).trigger('change');
    }
  };
})(jQuery, Drupal);