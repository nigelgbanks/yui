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
  $form_build_id = $_POST['form_build_id'];
  $form_id = $_POST['form_id'];
  foreach ($_FILES as $data) {
    if($data['error'] == 0) {
      $file = yui_uploader_save_uploaded_file($form_build_id, $data);
      if($file !== FALSE) {
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
function yui_uploader_save_uploaded_file($form_build_id, array $data) {
  global $user;
  $directory = file_directory_path() . '/yui/uploader';
  $basename = $form_build_id . '_' . $data['name'];
  $dest = file_create_filename($basename, $directory);
  if(move_uploaded_file($data['tmp_name'], $dest) !== FALSE) {
    $file = new stdClass();
    $file->uid = $user->uid;
    $file->filename = $data['name'];
    $file->filepath = $dest;
    $file->filemime = file_get_mimetype($data['name']);
    $file->filesize = $data['size'];
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
    if(!isset($form_state['storage']['yui_uploader'])) {
      $form_state['storage']['yui_uploader'] = array();
    }
    $form_state['storage']['yui_uploader'][] = $file;
    $count = count($form_state['storage']['yui_uploader']);
    drupal_prepare_form($form_id, $form, $form_state);
    form_set_cache($form_build_id, $form, $form_state);
  }
}

/**
 * Returns an array of the uploaded files as Drupal file objects.
 */
function yui_uploader_get_uploaded_files(array &$form_state) {
  if(isset($form_state['storage']['yui_uploader'])) {
    return $form_state['storage']['yui_uploader'];
  }
  return array();
}