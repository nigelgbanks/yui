<?php
/**
 * @file
 *
 * The template for YUI Uploader form element.
 */
?>
<div id="<?php print $element['#id']; ?>" <?php print $element['#attributes']; ?>>
  <div class="yui-uploader"></div>
  <div class="yui-uploader-overall-progress"></div>
  <br/>
  <div class='yui-uploader-files' style='display:none'>
    <table class='yui-uploader-filenames' style='border-width:1px; border-style:solid; padding:5px;'>
      <thead>
        <tr>
          <th>Filename</th><th>File size</th><th>Percent uploaded</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>
