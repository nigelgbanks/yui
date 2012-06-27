Only one Uploader allowed on screen at a time. Requires YUI 3.5 or greater.

TODO: Add form hook that will populate the $_FILES variable on submit. Could use an element validator hook...

Use like a regular file upload below is an example with defaults.

$form['upload'] = array(
  'upload' => array(
      '#type' => 'yui_uploader',
      '#required' => TRUE, // If FALSE the user can submit the form without uploading any files, if true at least one file must be uploaded.
      '#width' => '30px', // The width of the upload button.
      '#height' => '40px', // The height of the rendered button
      '#extensions' => array('*'), // Limit uploads to matching file extensions. Examples array('jpg', 'xml')
      '#multiple_files' => TRUE, // Allow multiple files to selected at once
  ),
);

When handling the submission of the form you can get the files uploaded with this function yui_uploader_get_uploaded_files(array &$form_state);
It returns an array of drupal file objects, or an empty array if no files have been uploaded