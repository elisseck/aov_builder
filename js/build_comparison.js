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
	// select the target node
    var target = $('#ajax_placeholder_build_2');
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log(mutation.type);
      });    
    });
  });
  

})(jQuery, Drupal);