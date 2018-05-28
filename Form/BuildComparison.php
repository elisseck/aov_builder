<?php

namespace Drupal\aov_builder\Form\BuildComparison;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;

class aov_callbacks {

  public static function loadBuild(array &$form, FormStateInterface $form_state) {
    /*$buildQuery = \Drupal::entityQuery('node')
      ->condition('status', 1)
      ->condition('type', 'build')
	  ->condition('nid', $form_state->getValue('edit-build-2')[0]['target_id']);
    $nid = $buildQuery->execute();
    $build = entity_load('node', $nid);*/

    // Add an Ajax response
    $content = [
      '#markup' => '<div>Hello World</div>',
	  '#attributes' => array(
	    'id' => array('ajax_placeholder'),
	  ),
    ];
    $response = new AjaxResponse();
	$response->addCommand(new HtmlCommand('#ajax_placeholder', $content));
    return $response;
  }

}