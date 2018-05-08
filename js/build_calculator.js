(function ($, Drupal) {
  Drupal.behaviors.build_calculator = {
    attach: function (context, settings) {
	  console.log(settings.heroData);
      $("#edit-hero, #edit-level, #edit-items", context).once('build_calculator').each(function() {
	    $(this).change(function() {
		  var selectedHero = $("#edit-hero").val();
		  var selectedLevel = $("#edit-level").val();
		  var selectedItems = $("#edit-items").val();
          generateBuild(settings);
        });
	  });
    }
  };
  
  function generateBuild(settings) {
	var fullBuild = {};
	var selectedHero = $("#edit-hero").val();
	console.log(selectedHero);
	var selectedLevel = $("#edit-level").val();
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
	fullBuild = scaleByLevel(settings.heroData[selectedHero], selectedLevel, fullBuild);
	var buildContainer = $(".full_build");
	buildContainer.empty();
	for (var data in fullBuild) {
	  if (fullBuild.hasOwnProperty(data)) {
	    buildContainer.append( "<p>" + fullBuild[data] + "</p>" );
	  }
	}
  }
  
  function scaleByLevel(hero, selectedLevel, fullBuild) {
	var levelScales = {
		"field_hp": "field_hp_per_level",
		"field_mana": "field_mana_per_level",
		"field_armor": "field_armor_per_level",
		"field_critical_damage": "field_critd_per_level",
		"field_attack_speed": "field_as_per_level",
		"field_attack_damage": "field_ad_per_level",
		"field_magic_defense": "field_md_per_level",
		"field_mana_regen_5_seconds": "field_mana5_per_level",
		"field_hp_regen_5_seconds": "field_hp5_per_level",
	}
	for (var key in levelScales) {
      if (levelScales.hasOwnProperty(key)) {
		if (hero[key].hasOwnProperty(0) && hero[levelScales[key]].hasOwnProperty(0)) {
          fullBuild[key] = parseFloat(hero[key][0]['value']) + (parseInt(selectedLevel) - 1) * parseFloat(hero[levelScales[key]][0]['value']);
		}
      }
    }
	return fullBuild;
  }
})(jQuery, Drupal);