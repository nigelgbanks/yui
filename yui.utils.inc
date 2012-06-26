<?php

/**
 * @file
 *
 * A collection of helper/utility functions for this module.
 */

/**
 * Returns the path to the YUI library.
 *
 * @return string
 *  The path to the YUI library if found, FALSE otherwise.
 */
function yui_get_path() {
  static $path;
  if (isset($path)) {
    return $path;
  }
  $path = FALSE;
  if (function_exists('libraries_get_path')) { // Libraries API integration.
    $path = libraries_get_path('yui');
    if ($path !== FALSE && !file_exists($path)) {  // Libraries API 1.x returns a default path; 2.x returns FALSE.
      $path = FALSE;
    }
  }
  else if (file_exists('./sites/all/libraries/yui')) {   // Manually check sites/all/libraries in case Libraries API is not available.
    $path = 'sites/all/libraries/yui';
  }
  return $path;
}

/**
 * Gets the installed version of YUI
 *
 * @return string
 *  The currently installed version, if found FALSE otherwise.
 */
function yui_get_version() {
  static $version;
  if(isset($version)) {
    return $version;
  }
  $version = FALSE;
  $filename = yui_get_path() . '/build/yui/yui.js';
  if(file_exists($filename)) {
    $text = file_get_contents($filename);
    $matches = array();
    preg_match('/VERSION[ ]*\=[ ]*\'(.*)\'/', $text, $matches);
    if(isset($matches[1])) { // The first sub expression.
      $version = $matches[1];
    }
  }
  return $version;
}

/**
 * Gets the suffix for the file depending on the compression settings.
 *
 * @return string
 *   The suffix of the file, denoting its compression type.
 */
function yui_get_file_suffix() {
  $suffix = array(
    YUI_RAW_COMPRESSION => '.js',
    YUI_MIN_COMPRESSION => '-min.js',
    YUI_DEBUG_COMPRESSION => '-debug.js'
  );
  $compression_type = variable_get('yui_compression_type', YUI_MIN_COMPRESSION);
  return $suffix[$compression_type];
}

/**
 * Gets the path to the given YUI file.
 *
 * @return string
 *  The path to the given YUI file if found, FALSE otherwise.
 */
function yui_get_file_path($file) {
  $filename = yui_get_path() . "/build/$file/$file" . yui_get_file_suffix();
  return file_exists($filename) ? $filename : FALSE;
}

/**
 * Adds the given YUI file.
 *
 * @param string $file
 *   The YUI widget or component to load.
 */
function yui_add_file($file) {
  static $exported_globals;
  if($filename = yui_get_file_path($file)) {
    drupal_add_js($filename);
  }
  if(!isset($exported_globals)) {
    $compression_type = variable_get('yui_compression_type', YUI_MIN_COMPRESSION);
    drupal_add_js(array('yui' => array('config' => array('filter' => $compression_type))), 'setting');
    drupal_add_js(drupal_get_path('module', 'yui') . '/js/yui-drupal-config.js');
    $exported_globals = TRUE;
  }
}