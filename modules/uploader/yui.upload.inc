<?php

/**
 * @file
 *
 * Handles the upload callback for the file.
 */

/**
 * Handles the uploading of files.
 */
function yui_uploader_upload_file() {
  $form_build_id = isset($_POST['form_build_id']) ? $_POST['form_build_id'] : NULL;
  $form_id = isset($_POST['form_id']) ? $_POST['form_id'] : NULL;
  if(!$form_build_id || !$form_id) {
    echo ' ';
    exit();
  }
  foreach ($_FILES as $file) {
    if($file['error'] == 0) {
      if($file = yui_uploader_save_uploaded_file($file)) {
        yui_uploader_store_uploaded_file($form_build_id, $form_id, $file);
      }
    } // @TODO log/display error to the user.
  }
  echo ' ';
  exit();
}

/**
 * Saves the given file to the yui/uploader folder.
 */
function yui_uploader_save_uploaded_file(array $file) {
  global $user;
  $directory = file_directory_path() . '/yui/uploader';
  $basename = $form_build_id . '_';
  $dest = file_create_filename($basename, $directory);
  if(move_uploaded_file($file['tmp_name'], $dest) !== FALSE) {
    $file = new stdClass();
    $file->uid = $user->uid;
    $file->filename = $file['name'];
    $file->filepath = $dest;
    $file->filemime = file_get_mimetype($file['name']);
    $file->filesize = $file['size'];
    $file->status = FILE_STATUS_TEMPORARY;
    $file->timestamp = time();
    drupal_write_record('files', $file);
    return $file;
  }
  return FALSE;
}

/**
 * Stores the uploaded file in the form_state.
 */
function yui_uploader_store_uploaded_file($form_build_id, $form_id, stdClass $file) {
  $form_state = array('storage' => NULL, 'submitted' => FALSE, 'post' => $_POST);
  if (!$form = form_get_cache($form_build_id, $form_state)) {
    $form = drupal_retrieve_form($form_id, $form_state);
    if(!isset($form_state['storage']['yui_uploader'])) {
      $form_state['storage']['yui_uploader'] = array();
    }
    $form_state['storage']['yui_uploader'][] = $file;
    form_set_cache($form_build_id, $form, $form_state);
  }
}

/**
 * Returns an array of the uploaded files as Drupal file objects.
 */
function yui_uploader_get_uploaded_files(array $form_state) {
  if(isset($form_state['storage']['yui_uploader'])) {
    return $form_state['storage']['yui_uploader'];
  }
  return array();
}