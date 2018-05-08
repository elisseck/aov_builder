(function ($, Drupal) {
  Drupal.behaviors.build_calculator = {
    attach: function (context, settings) {
      $("#edit-hero, #edit-level, #edit-items, .edit-arcana", context).once('build_calculator').each(function() {
	    $(this).change(function() {
          generateBuild(settings);
        });
	  });
    }
  };
  
  function generateBuild(settings) {
	//initialize build stats as numbers and grab our selected values
	var fullBuild = {
	  "field_ability_power": 0,
      "field_armor": 0,
      "field_attack_damage": 0,
      "field_attack_speed": 0,
      "field_cdr": 0,
      "field_crit_chance": 0,
      "field_flat_pen_ad": 0,
      "field_flat_pen_ap": 0,
      "field_hp": 0,
      "field_hp_regen_5_seconds": 0,
      "field_life_steal": 0,
      "field_magic_defense": 0,
      "field_magic_life_steal": 0,
      "field_mana": 0,
      "field_mana_regen_5_seconds": 0,
      "field_movement_speed": 0,
      "field_percent_pen_ad": 0,
      "field_percent_pen_ap": 0,
	  "field_critical_damage": 0,
	};
	var selectedHero = $("#edit-hero").val();
	var selectedLevel = $("#edit-level").val();
	var selectedItems = $("#edit-items").val();
	var selectedArcana = $(".edit-arcana").map(function(){
      return this.value;
    }).get().join(',');
	console.log(selectedArcana);
	//apply arcana first
	fullBuild = addArcana(settings.arcanaData, selectedArcana, fullBuild);
	//apply items next
	fullBuild = addItems(settings.itemData, selectedItems, fullBuild);
	//apply level scaling
	fullBuild = scaleByLevel(settings.heroData[selectedHero], selectedLevel, fullBuild);
	//output
	var buildContainer = $(".full_build");
	buildContainer.empty();
	console.log(fullBuild);
	for (var data in fullBuild) {
	  if (fullBuild.hasOwnProperty(data)) {
	    buildContainer.append( "<p><strong>" + data + ":</strong> " + fullBuild[data] + "</p>" );
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
          fullBuild[key] += parseFloat(hero[key][0]['value']) + (parseInt(selectedLevel) - 1) * parseFloat(hero[levelScales[key]][0]['value']);
		}
      }
    }
	return fullBuild;
  }
  
  function addItems(items, selectedItems, fullBuild) {
	len = selectedItems.length;
	for (var i = 0; i < len; i++) {
	  if (items.hasOwnProperty(selectedItems[i])) {
		for (var key in items[selectedItems[i]]) {
	      if (items[selectedItems[i]][key].hasOwnProperty(0)) {
		    fullBuild[key] += parseFloat(items[selectedItems[i]][key][0]['value']);
		  }
		}
	  }
	}
	return fullBuild;
  }
  
  function addArcana(arcana, selectedArcana, fullBuild) {
  //do arcana things
  return fullBuild;
  }
})(jQuery, Drupal);