<?php

/**
 * @file
 *
 * Handles the upload callback for the file.
 */

/**
 * Handles the uploading of files.
 */
function yui_upload_file($form_build_id = NULL) {
  error_log(print_r($_POST, TRUE));
  error_log(print_r($_FILES, TRUE));
  echo " "; // Required or else the javascript won't update the upload progress
  exit();
}