Drupal.behaviors.yuiUploader = function() {
  if (typeof arguments.callee.called == 'undefined') {
    arguments.callee.called = true;
    YUI().use('uploader-flash', function (Y) {
      if(Y.Uploader.TYPE == "none" || Y.UA.ios) {
        Y.one(Drupal.settings.yui.uploader.select).set("text", "We are sorry, but the uploader technology is not supported on this platform.");
        return;
      }
      var uploader = new Y.UploaderFlash(Drupal.settings.yui.uploader.config);
      var uploaded = false;
      var upload_required = Drupal.settings.yui.uploader.required;
      if(Drupal.settings.yui.uploader.required) { // Upload required.
        $('#' + Drupal.settings.yui.uploader.formID + ' input[type="submit"]').not('.ahah-processed').click(function(e) {
          if(uploaded == false) {
            e.preventDefault();
            alert(Drupal.t('You must upload one or files, before you can submit the form.'));
          }
        });
      }
      if(Drupal.settings.yui.uploader.files.length > 0) {
        Y.one("#yui-uploader-files").setStyle('display', 'block');
        var file_table = Y.one("#yui-uploader-filenames tbody");
        Y.each(Drupal.settings.yui.uploader.files, function (file) {
          file_table.append("<tr>" +
                            "<td class='filename'>" + file.filename + "</td>" +
                            "<td class='filesize'>" + file.filesize + "</td>" +
                            "<td class='percentdone'>Upload complete!</td></tr>");
        });
      }
      uploader.render(Drupal.settings.yui.uploader.select);
      uploader.after("fileselect", function (event) {
        var file_list = event.fileList;
        var file_table = Y.one("#yui-uploader-filenames tbody");
        Y.each(file_list, function (file_instance) {
          file_table.append("<tr id='" + file_instance.get("id") + "_row" + "'>" +
                            "<td class='filename'>" + file_instance.get("name") + "</td>" +
                            "<td class='filesize'>" + file_instance.get("size") + "</td>" +
                            "<td class='percentdone'>Hasn't started yet</td></tr>");
        });
        if (file_list.length > 0) {
          Y.one("#yui-uploader-files").setStyle('display', 'block');
          uploader.uploadThese(file_list);
        }
      });
      uploader.on("uploadprogress", function (event) {
        var file_row = Y.one("#" + event.file.get("id") + "_row");
        file_row.one(".percentdone").set("text", event.percentLoaded + "%");
      });
      uploader.on("uploadstart", function (event) {
        uploader.set("enabled", false);
      });
      uploader.on("uploadcomplete", function (event) {
        var file_row = Y.one("#" + event.file.get("id") + "_row");
        file_row.one(".percentdone").set("text", "Finished!");
      });
      uploader.on("totaluploadprogress", function (event) {
        Y.one("#yui-uploader-overall-progress").setHTML("Total uploaded: <strong>" + event.percentLoaded + "%" + "</strong>");
      });
      uploader.on("alluploadscomplete", function (event) {
        uploader.set("enabled", true);
        uploaded = true;
        Y.one("#yui-uploader-overall-progress").set("text", "Upload complete!");
      });
    });
  }
}
