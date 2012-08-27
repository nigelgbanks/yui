Drupal.behaviors.yuiUploader = function(context) {
  for (var id in Drupal.settings.yui.uploader) {
    var id_selector = '#' + id;
    if (!$(id_selector + '.yui-processed').size()) {
      var settings = Drupal.settings.yui.uploader[id];
      $(id_selector).each(function() {
        new Drupal.yui.uploader(id_selector, settings);
      });
      $(id_selector).addClass('yui-processed');
    }
  }
};
Drupal.yui = Drupal.yui || {}; // If not defined create the yui namespace.
Drupal.yui.uploader = function(selector, settings) {
  YUI().use('uploader-flash', function (Y) {
    if(Y.Uploader.TYPE == 'none' || Y.UA.ios) {
      Y.one(selector).set('text', Drupal.t('We are sorry, but the uploader technology is not supported on this platform.'));
      return;
    }
    var uploader = new Y.UploaderFlash(settings.config);
    var uploaded = false, uploading = false;
    if(settings.required) { // Upload is required.
      $('#' + settings.formID).submit(function(e) { // Prevent form submission untill a file has been uploaded
        if(uploaded == false || uploading == true) {
          e.preventDefault();
          alert(Drupal.t('You must upload one or files, before you can submit the form.')); // Alerts aren't pretty perhaps we could do something else?
        }
      });
    }
    var files = Y.one(selector + ' .yui-uploader-files');
    var files_table = Y.one(selector + ' .yui-uploader-files .yui-uploader-filenames tbody');
    var files_progress = Y.one(selector + ' .yui-uploader-overall-progress');
    if(settings.files.length > 0) {
      settings.submittable = uploaded = true;
      files.setStyle('display', 'block');
      Y.each(settings.files, function (file) {
        files_table.append('<tr>' +
                          '<td class="filename">' + file.filename + '</td>' +
                          '<td class="filesize">' + file.filesize + '</td>' +
                          '<td class="percentdone">' + Drupal.t('Upload complete!') + '</td></tr>');
      });
    }
    uploader.render(selector + ' .yui-uploader');
    uploader.after('fileselect', function (event) {
      var file_list = event.fileList;
      Y.each(file_list, function (file_instance) {
        files_table.append('<tr id="' + file_instance.get('id') + '_row' + '">' +
                          '<td class="filename">' + file_instance.get('name') + '</td>' +
                          '<td class="filesize">' + file_instance.get('size') + '</td>' +
                          '<td class="percentdone">' + Drupal.t('Hasn\'t started yet') + '</td></tr>');
      });
      if (file_list.length > 0) {
        files.setStyle('display', 'block');
        uploading = true;
        settings.submittable = false;
        uploader.uploadThese(file_list);
      }
    });
    uploader.on('uploadprogress', function (event) {
      var file_row = Y.one('#' + event.file.get('id') + '_row');
      file_row.one('.percentdone').set('text', event.percentLoaded + '%');
    });
    uploader.on('uploadstart', function (event) {
      uploader.set('enabled', false);
    });
    uploader.on('uploadcomplete', function (event) {
      var file_row = Y.one('#' + event.file.get('id') + '_row');
      file_row.one('.percentdone').set('text', Drupal.t('Finished!'));
    });
    uploader.on('totaluploadprogress', function (event) {
      files_progress.setHTML(Drupal.t('Total uploaded') + ': <strong>' + event.percentLoaded + '%' + '</strong>');
    });
    uploader.on('alluploadscomplete', function (event) {
      uploader.set('enabled', true);
      settings.submittable = uploaded = true;
      uploading = false;
      files_progress.set('text', Drupal.t('Upload complete!'));
    });
  });
};