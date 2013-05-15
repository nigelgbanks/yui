<?php

/**
 * @file
 * Handles the display/submission of the admin settings form for this module.
 */

/**
 * Defines the admin settings form.
 *
 * Allows the user to choose between the min/raw/debug versions of YUI.
 *
 * @param array $form
 *   The Drupal form definition.
 * @param array $form_state
 *   The Drupal form state.
 *
 * @return array
 *   The Drupal form definition.
 */
function yui_admin_settings_form(array $form, array &$form_state) {
  // Clear the javascript cache when the setting is updated.
  $form['#submit'][] = 'drupal_clear_js_cache';
  $form['yui_compression_type'] = array(
    '#type' => 'radios',
    '#title' => t('Choose YUI compression level'),
    '#options' => array(
      YUI_MIN_COMPRESSION => t('Production (Minified)'),
      YUI_RAW_COMPRESSION => t('Development (Raw)'),
      YUI_DEBUG_COMPRESSION => t('Development (Debug)'),
    ),
    '#default_value' => variable_get('yui_compression_type', YUI_MIN_COMPRESSION),
  );
  return system_settings_form($form);
}
