(function ($, Drupal) {
  Drupal.behaviors.build_calculator = {
    attach: function (context, settings) {
	  console.log(settings.heroData);
      $("#edit-hero, #edit-level, #edit-items", context).once('build_calculator').each(function() {
	    $(this).change(function() {
          generateBuild(settings);
        });
	  });
    }
  };
  
  function generateBuild(settings) {
	var selectedHero = $("edit-hero").val();
	console.log(selectedHero);
	var heroKeys = [
      "field_ability_power",
      "field_ad_per_level",
      "field_armor",
      "field_armor_per_level",
      "field_as_per_level",
      "field_attack_damage",
      "field_attack_speed",
      "field_cdr",
      "field_crit_chance",
      "field_critd_per_level",
      "field_critical_damage",
      "field_flat_pen_ad",
      "field_flat_pen_ap",
      "field_hp",
      "field_hp5_per_level",
      "field_hp_per_level",
      "field_hp_regen_5_seconds",
      "field_life_steal",
      "field_magic_defense",
      "field_magic_life_steal",
      "field_mana",
      "field_mana5_per_level",
      "field_mana_per_level",
      "field_mana_regen_5_seconds",
      "field_md_per_level",
      "field_movement_speed",
      "field_percent_pen_ad",
      "field_percent_pen_ap",
      ];
	//settings.heroData[selectedHero]
	var buildContainer = $(".full_build");
	buildContainer.empty();
	buildContainer.append( "<p>" + settings.heroData + "</p>" );
  }
})(jQuery, Drupal);