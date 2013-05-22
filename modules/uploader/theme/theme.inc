<?php

/**
 * @file
 * Theme hooks and functions.
 */

/**
 * Implements hook_preprocess_theme().
 */
function yui_uploader_preprocess_yui_uploader(array &$variables) {
  $element = &$variables['element'];
  _form_set_class($element, array(
      'yui-uploader',
  ));
  $element['#attributes'] = drupal_attributes($element['#attributes']);
}
