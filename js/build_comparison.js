(function ($, Drupal) {
  Drupal.behaviors.build_comparison = {
    attach: function (context, settings) {
	  $("#edit-build-1").attr("disabled", true);
	  $("#ajax_placeholder_build_1, #ajax_placeholder_build_2").insertAfter(".js-form-item-build-2");
    }
  };
  $(document).ready(function() {
    var urlParams = new URLSearchParams(window.location.search);
    var param = urlParams.get('build');
    $("#edit-build-1").val(param).trigger('change'); 
  });
  $(document).ajaxComplete(function() {
    if ($('#ajax_placeholder_build_1').children().length > 0 && $('#ajax_placeholder_build_2').children().length > 0) {
      $('#build_2_values').children().each(function() {
        var id = $(this).attr('id').split('build_2')[1];
		if ($(this).attr('class') == 'data-up-last') {
		  $('#build_1' + id).attr("class", "data-down");
		}
		else if ($(this).attr('class') == 'data-down') {
		  $('#build_1' + id).attr("class", "data-up-last");
		}
      });
    }
  });
  

})(jQuery, Drupal);