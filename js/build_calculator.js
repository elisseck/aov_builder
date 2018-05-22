(function ($, Drupal) {
  Drupal.behaviors.build_calculator = {
    attach: function (context, settings) {
      $("#edit-hero, #edit-level, .edit-items, .edit-arcana, .edit-skill-levels", context).once('build_calculator').each(function() {
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
	var selectedSkillLevels = $(".edit-skill-levels").map(function(){
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
	//get skills last because they require fullBuild data
	skillBuild = getSkills(settings.skillAndBonusData[selectedHero], selectedSkillLevels, selectedHero, selectedLevel, fullBuild);
	//output to visible container and hidden container to separate nice markup vs easy data values
	var skillContainer = $(".skill_build");
	var buildContainer = $(".full_build");
	var hiddenContainer = $('input[name="full_build_hidden"]');
	buildContainer.add(skillContainer).empty();
	hiddenContainer.val("");
	hiddenContainer.val(JSON.stringify(fullBuild));
	//build skill grid
	var appended = appendToSkillContainer(skillContainer, skillBuild, settings.skillAndBonusData[selectedHero]);
	buildContainer.append("<div id=hero-title><h2>" + settings.heroData[selectedHero]['title'] + "</h2></div>");
	for (var data in fullBuild) {
	  if (fullBuild.hasOwnProperty(data)) {
		var label = "";
		if (settings.heroData[selectedHero].hasOwnProperty(data)) {
		  label = settings.heroData[selectedHero][data]['labels'];
		}
		buildContainer.append( "<p><strong>" + label + ":</strong> " + fullBuild[data] + "</p>" );
	  }
	}
  }

  function getBaseStats(hero, fullBuild) {
    for (var key in hero) {
	  if (hero[key].hasOwnProperty('values')) {
        if (hero[key]['values'].hasOwnProperty(0) && fullBuild.hasOwnProperty(key)) {
	      fullBuild[key] += parseFloat(hero[key]['values'][0]['value']);
	    }
	  }
	}
	return fullBuild;
  }

  function getSkills(skills, levels, hero, heroLevel, fullBuild) {
	var skillBuild = {};
	levels = levels.split(',');
	var skillScales = {
	  "field_scaling": "field_scaling_stat",
	  "field_cooldown": "field_cooldown_per_level",
	  "field_level_1": "field_skill_damage_per_level",
	}
	var bonusScales = {
	  "field_bonus_damage_level_1": "field_bonus_damage_per_level",
	  "field_scaling": "field_scaling_stat",
	}
	for (var skill in skills) {
	  skillBuild[skill] = {};
	  for (var key in skills[skill]) {
		skillBuild[skill][key] = {};
		//a ton of sanity checks because we really have no idea what's coming in here
	    if (skills[skill].hasOwnProperty(key)) {
		  if (key == 'bonuses') {
		    skillBuild[skill][key] = processBonuses(skills[skill][key], levels, skills[skill]['field_skill_type']['values'][0]['value'], fullBuild, bonusScales, heroLevel);
		  } else {
		    if (skills[skill][key].hasOwnProperty('values')) {
		      if (skills[skill][key]['values'].hasOwnProperty(0)) {
			    if (skills[skill][key]['values'][0].hasOwnProperty('value')) {
			      if (skillScales.hasOwnProperty(key)) {
				  //if it's a scaling field, scale value by the current fullBuild value for the scaling stat
				    if (key == 'field_scaling' && skills[skill].hasOwnProperty('field_scaling_stat')) {
				      skillBuild[skill][key] = parseFloat(skills[skill][key]['values'][0]['value']) * parseFloat(fullBuild[skills[skill]['field_scaling_stat']['values']]);
				    } else if (key !== 'field_scaling') {
				    //cases for each skill type so we scale by the correct level for level scaling
				      if (skills[skill]['field_skill_type']['values'][0]['value'] == 'Passive') {
				        skillBuild[skill][key] = parseFloat(skills[skill][key]['values'][0]['value']) + (parseFloat(skills[skill][skillScales[key]]['values'][0]['value']) * parseFloat(heroLevel));
				      } else if (skills[skill]['field_skill_type']['values'][0]['value'] == 'Skill 1') {
				        skillBuild[skill][key] = parseFloat(skills[skill][key]['values'][0]['value']) + (parseFloat(skills[skill][skillScales[key]]['values'][0]['value']) * parseFloat(levels[0]));
				      } else if (skills[skill]['field_skill_type']['values'][0]['value'] == 'Skill 2') {
				        skillBuild[skill][key] = parseFloat(skills[skill][key]['values'][0]['value']) + (parseFloat(skills[skill][skillScales[key]]['values'][0]['value']) * parseFloat(levels[1]));
				      } else {
				        skillBuild[skill][key] = parseFloat(skills[skill][key]['values'][0]['value']) + (parseFloat(skills[skill][skillScales[key]]['values'][0]['value']) * parseFloat(levels[2]));
				      }
			        }
			      }
				  else {
			        skillBuild[skill][key] = skills[skill][key]['values'];
			      }
			    }
		      }
		    }
		  }
		}
	  }
	  //stragglers with weird structure
	  skillBuild[skill]['field_scaling_stat'] = skills[skill]['field_scaling_stat']['termname'];
	  skillBuild[skill]['field_output_type'] = skills[skill]['field_output_type']['termname'];
	  skillBuild[skill]['title'] = skills[skill]['title']['values'];
	  //generate final output by adding attribute scaled value to level scaled value last
	  skillBuild[skill]['final_value'] = parseFloat(skillBuild[skill]['field_scaling']) + parseFloat(skillBuild[skill]['field_level_1']);
	}
	return skillBuild;
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
			} else if (fullBuild.hasOwnProperty(key)) {
		      fullBuild[key] += parseFloat(items[arr[i]][key][0]['value']);
			}
		  }
		}
	  }
	}
	return fullBuild;
  }

  function addArcana(arcana, selectedArcana, fullBuild) {
	var arcanaBuild = {
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
    var selected = selectedArcana.split(',');
	var len = selected.length;
	for (var j = 0; j < len; j++) {
      if (arcana.hasOwnProperty(selected[j])) {
	    for (var key in arcana[selected[j]]) {
		  if (arcana[selected[j]][key].hasOwnProperty('values')) {
		    if (arcana[selected[j]][key]['values'].hasOwnProperty(0)) {
		      if (key == "field_movement_speed_percent") {
			    fullBuild["field_movement_speed"] += (fullBuild["field_movement_speed"] * (parseFloat(arcana[selected[j]][key]['values'][0]['value'])/100));
			    arcanaBuild["field_movement_speed"] += (parseFloat(arcana[selected[j]][key]['values'][0]['value'])/100);
			  } else if (fullBuild.hasOwnProperty(key)) {
		        fullBuild[key] += parseFloat(arcana[selected[j]][key]['values'][0]['value']);
			    arcanaBuild[key] += parseFloat(arcana[selected[j]][key]['values'][0]['value']);
			  }
		    }
		  }
		}
	  }
	}
	arcanaContainer = $(".arcana_build");
	appendToArcanaContainer(arcanaContainer, arcanaBuild);
    return fullBuild;
  }
  
  function appendToArcanaContainer(container, arcanaBuild) {
	var arcanaKeys = {
	  "field_ability_power": 'Ability Power',
      "field_armor": 'Armor',
      "field_attack_damage": 'Attack Damage',
      "field_attack_speed": 'Attack Speed',
      "field_cdr": 'CDR',
      "field_crit_chance": 'Crit Chance',
      "field_flat_pen_ad": 'Flat Pen AD',
      "field_flat_pen_ap": 'Flat Pen AP',
      "field_hp": 'HP',
      "field_hp_regen_5_seconds": 'HP Regen / 5 Seconds',
      "field_life_steal": 'Life Steal',
      "field_magic_defense": 'Magic Defense',
      "field_magic_life_steal": 'Magic Life Steal',
      "field_mana": 'Mana',
      "field_mana_regen_5_seconds": 'Mana Regen / 5 Seconds',
      "field_movement_speed": 'Movement Speed',
      "field_percent_pen_ad": 'Percent Pen AD',
      "field_percent_pen_ap": 'Percent Pen AP',
	  "field_critical_damage": 'Critical Damage',
	};
	var markup = '<div id="arcana-final"><h3>Arcana Stats</h3>';
	for (var key in arcanaBuild) {
	  markup += '<div id=arcana-' + key + '>' + arcanaKeys[key] + ': '+ arcanaBuild[key] + '</div>'
	}
	markup += '</div>'
	container.empty();
	container.append(markup);
  }

  function appendToSkillContainer(container, skillBuild, skillBaseData) {
    var markup = '<div id="skills-final">';
	for (var skill in skillBuild) {
	  markup += '<div class="skill-title"><h3>' + skillBuild[skill]['field_skill_type'][0]['value'] + ' - ' + skillBuild[skill]['title'] + '</h3></div>';
	  if (skillBuild[skill]['body'].hasOwnProperty(0)) {
	    markup += '<div class="skill-description>' + skillBuild[skill]['body'][0]['value'] + '</div>';
	  }
	  markup += '<div class="skill-stats>';
	  markup += '<div class="skill-scaling">Scaling Value: ' + skillBaseData[skill]['field_scaling']['values'][0]['value'] + '</div>';
	  markup += '<div class="skill-scaling-stat">Scaling Stat: ' + skillBuild[skill]['field_scaling_stat'] + '</div>'; 
	  markup += '<div class="skill-cooldown">Cooldown: ' + skillBuild[skill]['field_cooldown'] + '</div>';
	  markup += '<div class="skill-output-value">Output Value: ' + skillBuild[skill]['final_value'] + '</div>';
	  markup += '<div class="skill-output-type">Output Type: ' + skillBuild[skill]['field_output_type'] + '</div>';
	  markup += '</div>';
	  if (skillBuild[skill]['bonuses']) {
		markup += '<div class="bonuses"><h4>Additional Effects</h4>';
	    for (var bonus in skillBuild[skill]['bonuses']) {
		  if (skillBuild[skill]['bonuses'][bonus]['body'].hasOwnProperty(0)) {
	        markup += '<div class="bonus-description">' + skillBuild[skill]['bonuses'][bonus]['body'][0]['value'] + '</div>';
		  }
		  if (skillBuild[skill]['bonuses'][bonus]['field_scaling'].hasOwnProperty('values')) {
		    markup += '<div class="bonus-scaling">Scaling Value: ' + skillBaseData[skill]['bonuses'][bonus]['field_scaling']['values'][0]['value'] + '</div>';
		  }
		  if (skillBuild[skill]['bonuses'][bonus]['field_scaling_stat']) {
		    markup += '<div class="bonus-scaling-stat">Scaling Stat: ' + skillBuild[skill]['bonuses'][bonus]['field_scaling_stat'] + '</div>';
		  }
		  markup += '<div class="bonus-output-value">Output Value: ' + skillBuild[skill]['bonuses'][bonus]['final_value'] + '</div>';
		  markup += '<div class="bonus-output-type">Output Type: ' + skillBuild[skill]['bonuses'][bonus]['field_output_type'] + '</div>';
	    }
		markup += '</div>';
      }
	}
	markup += '</div>';
	container.append(markup);
  }
  
  function processBonuses(bonusData, levels, skillType, fullBuild, bonusScales, heroLevel) {
	var bonusBuild = {};
	for (var bonus in bonusData) {
	bonusBuild[bonus] = {};
	  for (var key in bonusData[bonus]) {
		bonusBuild[bonus][key] = {};
		if (bonusData[bonus].hasOwnProperty(key)) {
		  if (bonusData[bonus][key].hasOwnProperty('values')) {
		    if (bonusData[bonus][key]['values'].hasOwnProperty(0)) {
			  if (bonusData[bonus][key]['values'][0].hasOwnProperty('value')) {
			    if (bonusScales.hasOwnProperty(key)) {
				  //if it's a scaling field, scale value by the current fullBuild value for the scaling stat
				  if (key == 'field_scaling' && bonusData[bonus].hasOwnProperty('field_scaling_stat')) {
				    bonusBuild[bonus][key] = parseFloat(bonusData[bonus][key]['values'][0]['value']) * parseFloat(fullBuild[bonusData[bonus]['field_scaling_stat']['values']]);
				  } else if (key !== 'field_scaling') {
				  //cases for each bonus type so we scale by the correct level for level scaling
				    if (skillType == 'Passive') {
				      bonusBuild[bonus][key] = parseFloat(bonusData[bonus][key]['values'][0]['value']) + (parseFloat(bonusData[bonus][bonusScales[key]]['values'][0]['value']) * parseFloat(heroLevel));
				    } else if (skillType == 'Skill 1') {
				      bonusBuild[bonus][key] = parseFloat(bonusData[bonus][key]['values'][0]['value']) + (parseFloat(bonusData[bonus][bonusScales[key]]['values'][0]['value']) * parseFloat(levels[0]));
				    } else if (skillType == 'Skill 2') {
				      bonusBuild[bonus][key] = parseFloat(bonusData[bonus][key]['values'][0]['value']) + (parseFloat(bonusData[bonus][bonusScales[key]]['values'][0]['value']) * parseFloat(levels[1]));
				    } else {
				      bonusBuild[bonus][key] = parseFloat(bonusData[bonus][key]['values'][0]['value']) + (parseFloat(bonusData[bonus][bonusScales[key]]['values'][0]['value']) * parseFloat(levels[2]));
				    }
			      }
				} 
				else {
			      bonusBuild[bonus][key] = bonusData[bonus][key]['values'];
			    }
			  }
			}
		  }
		}	
	  }
	  if (bonusData[bonus]['field_scaling_stat']) {
	    bonusBuild[bonus]['field_scaling_stat'] = bonusData[bonus]['field_scaling_stat']['termname'];
	  }
	  bonusBuild[bonus]['field_output_type'] = bonusData[bonus]['field_output_type']['termname'];
	  if (bonusBuild[bonus]['field_scaling']) {
	    bonusBuild[bonus]['final_value'] = parseFloat(bonusBuild[bonus]['field_scaling']) + parseFloat(bonusBuild[bonus]['field_bonus_damage_level_1']);
	  }
	  else {
		bonusBuild[bonus]['final_value'] = parseFloat(bonusBuild[bonus]['field_bonus_damage_level_1']);
	  }
	}
	return bonusBuild;
  }
})(jQuery, Drupal);