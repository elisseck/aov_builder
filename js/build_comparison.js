(function ($, Drupal) {
  Drupal.behaviors.build_comparison = {
    attach: function (context, settings) {
	  $("#edit-build-1").attr("disabled", true);
	  $("#ajax_placeholder_build_1, #ajax_placeholder_build_2").insertAfter(".js-form-item-build-2");
	  $("#ajax_placeholder_build_2").change(function() {
          generateIndicators();
        });
    }
  };
  $(document).ready(function() {
    var urlParams = new URLSearchParams(window.location.search);
    var param = urlParams.get('build');
    $("#edit-build-1").val(param).trigger('change');
	// select the target node
    var target = $('#build_2_values');
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log(mutation.type);
      });    
    });
  });
  
  function generateIndicators() {
	console.log($('#build_1_values'));
	console.log($('#build_1_values')[0].childNodes);
	console.log($('#build_2_values'));
	if ($('#build_1_values').hasOwnProperty(0) && $('#build_2_values').hasOwnProperty(0)) {
      var build1 = $('#build_1_values')[0].childNodes;
	  var build2 = $('#build_2_values')[0].childNodes;
	  for (var i; i < build1.length; i++) {
		console.log(build1[i]);
		console.log(build2[i]);
        if (build2[i]) {
         val1 = parseFloat(build1[i].textContent.split(': ')[1]);
		 val2 = parseFloat(build2[i].textContent.split(': ')[1]);
		 if (val1 < val2) {
           $(build1[i]).addClass("data-down");
		   $(build2[i]).addClass("data-up");
		 } else {
           $(build1[i]).addClass("data-up");
		   $(build2[i]).addClass("data-down");
		 }
		}
	  }
	}
  }

})(jQuery, Drupal);