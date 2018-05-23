<?php
namespace Drupal\aov_builder\Validate;

use Drupal\Core\Field\FieldException;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form API callback. Validate element value.
 */
class buildTitles {
    /**
     * Validates given element.
     *
     * @param array              $element      The form element to process.
     * @param FormStateInterface $formState    The form state.
     * @param array              $form The complete form structure.
     */
    public static function validateBuildTitle(array &$element, FormStateInterface $formState, array &$form) {
        $webformKey = $element['#webform_key'];
        $value = $formState->getValue($webformKey);
        // Skip empty unique fields or arrays (aka #multiple).
        if ($value === '' || is_array($value)) {
            return;
        }
		$filterRegex = "(ass|shit|piss|cunt|fuck|bitch)";
		$match = preg_match($filterRegex, $value);
        if ($match) {
            if (isset($element['#title'])) {
                $tArgs = array(
                    '%name' => empty($element['#title']) ? $element['#parents'][0] : $element['#title'],
                    '%value' => $value,
                );
                $formState->setError(
                    $element,
                    t('The value %value is not allowed for element %name. Please use a different value.', $tArgs)
                );
            } else {
                $formState->setError($element);
            }
        }
    }
}