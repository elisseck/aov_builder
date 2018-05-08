(function ($, Drupal) {
  Drupal.behaviors.build_calculator = {
    attach: function (context, settings) {
      $("#edit-hero, #edit-level, #edit-items", context).once('build_calculator').each(function() {
	    $(this).change(function() {
          generateBuild(settings);
        });
	  });
    }
  };
  
  function generateBuild(settings) {
	$(".full_build").remove().append( "<p>" + settings.heroData + "</p>" );
  }
})(jQuery, Drupal);