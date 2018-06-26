(function ($, Drupal) {
  Drupal.behaviors.build_comparison = {
    attach: function (context, settings) {
	  $("#edit-build-1").attr("disabled", true);
	  $("#ajax_placeholder_build_1, #ajax_placeholder_build_2").insertAfter(".js-form-item-build-2");
    }
  };
  $(document).ajaxComplete(function() {
    if ($('#ajax_placeholder_build_1').children().length > 0 && $('#ajax_placeholder_build_2').children().length > 0) {
      $('#build_2_values').children().each(function() {
        var id = $(this).id.split('build2')[1];
		if ($(this).className == 'data-up-latest') {
		  $('#build1' + id).attr("class", "data-down");
		}
		else if ($(this).className == 'data-down') {
		  $('#build1' + id).attr("class", "data-up-latest");
		}
      });
    }
  });
  

})(jQuery, Drupal);