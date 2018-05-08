(function ($, Drupal) {
  Drupal.behaviors.build_calculator = {
    attach: function (context, settings) {
      $("#edit-hero, #edit-level, #edit-items", context).once('myCustomBehavior').find("#edit-hero, #edit-level, #edit-items").each(function() {
	    $(this).change(function() {
          console.log("changed input" + this);
        });
	  });
    }
  };
})(jQuery, Drupal);