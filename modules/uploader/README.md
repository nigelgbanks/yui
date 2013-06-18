CONTENTS OF THIS FILE
---------------------

 * summary
 * requirements
 * installation
 * configuration
 * todo

SUMMARY
-------

YUI

A Drupal module wrapper for the Yahoo YUI multi-file uploader.
Requires YUI 3.5 or greater.

Only one Uploader allowed per form for now uses $form_state.

Use like a regular file upload below is an example with defaults.

```PHP
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
```

When handling the submission of the form you can get the files uploaded with:

```PHP
function yui_uploader_get_uploaded_files(array &$form_state);
```

It returns an array of drupal file objects, or an empty array if no files have
been uploaded.

REQUIREMENTS
------------

* Drupal yui module.
* YUI versions 3.5 and up.
* PHP 5.3+

INSTALLATION
------------

YUI:

Go to http://yuilibrary.com/ and download a version of YUI that is at equal to
or above 3.5.

Note: This module has only been tested with version 3.5.1, which can be found
here http://yui.zenfs.com/releases/yui3/yui_3.5.1.zip

Unzip the downloaded file in sites/all/libraries.

TODO
------------

* Add form hook that will populate the $_FILES variable on submit. Could use an
  element validator hook?
