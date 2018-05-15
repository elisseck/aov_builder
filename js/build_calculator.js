(function ($, Drupal) {
  Drupal.behaviors.build_calculator = {
    attach: function (context, settings) {
      $("#edit-hero, #edit-level, .edit-items, .edit-arcana", context).once('build_calculator').each(function() {
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
	var selectedItems = $(".edit-items").map(function(){
      return this.value;
    }).get().join(',');
	var selectedArcana = $(".edit-arcana").map(function(){
      return this.value;
    }).get().join(',');
	//get base stats
	fullBuild = getBaseStats(settings.heroData[selectedHero], fullBuild);
	//apply arcana first
	fullBuild = addArcana(settings.arcanaData, selectedArcana, fullBuild);
	//apply items next
	fullBuild = addItems(settings.itemData, selectedItems, fullBuild);
	//apply level scaling
	fullBuild = scaleByLevel(settings.heroData[selectedHero], selectedLevel, fullBuild);
	//output
	var buildContainer = $(".full_build");
	buildContainer.empty();
	buildContainer.append("<div id=hero-title><h2>" + settings.heroData[selectedHero]['title'] + "</h2></div>")
	for (var data in fullBuild) {
	  if (fullBuild.hasOwnProperty(data)) {
		if (fullBuild[data] !== "NaN") {
		  var label = "";
		  if (settings.heroData[selectedHero].hasOwnProperty(data)) {
		    label = settings.heroData[selectedHero][data]['labels'];
		  }
		  buildContainer.append( "<p><strong>" + label + ":</strong> " + fullBuild[data] + "</p>" );
		}
	  }
	}
  }
  
  function getBaseStats(hero, fullBuild) {
    for (var key in hero) {
      if (hero[key]['values'].hasOwnProperty(0)) {
	    fullBuild[key] += parseFloat(hero[key]['values'][0]['value']);
	  }
	}
	return fullBuild;
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
		if (hero[key]['values'].hasOwnProperty(0) && hero[levelScales[key]]['values'].hasOwnProperty(0)) {
          fullBuild[key] += (parseInt(selectedLevel) - 1) * parseFloat(hero[levelScales[key]]['values'][0]['value']);
		}
      }
    }
	return fullBuild;
  }
  
  function addItems(items, selectedItems, fullBuild) {
	var arr = selectedItems.split(',');
	var len = arr.length;
	for (var i = 0; i < len; i++) {
	  if (items.hasOwnProperty(arr[i])) {
		for (var key in items[arr[i]]) {
	      if (items[arr[i]][key].hasOwnProperty(0)) {
			if (key == "field_movement_speed_percent") {
			  fullBuild["field_movement_speed"] += (fullBuild["field_movement_speed"] * (parseFloat(items[arr[i]][key][0]['value'])/100));
			} else {
		      fullBuild[key] += parseFloat(items[arr[i]][key][0]['value']);
			}
		  }
		}
	  }
	}
	return fullBuild;
  }
  
  function addArcana(arcana, selectedArcana, fullBuild) {
    var selected = selectedArcana.split(',');
	var len = selected.length;
	for (var j = 0; j < len; j++) {
      if (arcana.hasOwnProperty(selected[j])) {
	    for (var key in arcana[selected[j]]) {
		  if (arcana[selected[j]][key].hasOwnProperty(0)) {
		    fullBuild[key] += parseFloat(arcana[selected[j]][key][0]['value']);
		  }
		}
	  }
	}
    return fullBuild;
  }
})(jQuery, Drupal);