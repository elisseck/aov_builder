(function ($, Drupal) {
  Drupal.behaviors.build_calculator = {
    attach: function (context, settings) {
      $("#edit-hero, #edit-level, #edit-items", context).once('build_calculator').each(function() {
	    $(this).change(function() {
          console.log("changed input");
        });
	  });
    }
  };
})(jQuery, Drupal);