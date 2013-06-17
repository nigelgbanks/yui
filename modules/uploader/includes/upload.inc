<?php

/**
 * @file
 * Handles the upload callback for the file.
 */

/**
 * Handles the uploading of files.
 */
function yui_uploader_upload_file() {
  yui_uploader_restore_session();
  $form_build_id = $_POST['form_build_id'];
  // Convert $_FILES array to Drupal friendly version.
  $yui_uploader = array();
  foreach ($_FILES['files'] as $key => $value) {
    $_FILES['files'][$key] = array('yui_uploader' => $value);
  }
  $file = file_save_upload('yui_uploader',
          array('file_validate_extensions' => array()),
          'public://');
  if (is_object($file)) {
    yui_uploader_store_uploaded_file($form_build_id, $file);
  }
  echo ' ';
  exit();
}

/**
 * Stores the uploaded file in the form_state.
 */
function yui_uploader_store_uploaded_file($form_build_id, stdClass $file) {
  $form_state = array('storage' => NULL, 'submitted' => FALSE, 'post' => $_POST);
  // Keep trying, either the request will time out or we will succeed.
  RETRY:
  if (lock_acquire('yui_upload_file')) {
    $form = form_get_cache($form_build_id, $form_state);
    if (isset($form)) {
      $form_state['storage']['yui_uploader'][] = $file;
      form_set_cache($form_build_id, $form, $form_state);
    }
    lock_release('yui_upload_file');
  }
  else {
    lock_wait('yui_upload_file', 1);
    goto RETRY;
  }
}

/**
 * Restore the users session from data stored in the POST request.
 *
 * We need this because of limitiations of flash (Since it doesn't POST cookies)
 */
function yui_uploader_restore_session() {
  if (user_is_anonymous()) {
    $name = $_POST['SNAME'];
    $id = $_POST['SID'];
    // Used by Drupal session handlers.
    $_COOKIE[$name] = $id;
    // Forget the session of the anonymous user incorrectly created because of
    // the missing cookies.
    session_destroy();
    // Restart the session with the correct information.
    session_start();
  }
}
