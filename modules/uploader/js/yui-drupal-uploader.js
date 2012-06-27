Drupal.behaviors.yuiUploader = function() {
  if (typeof arguments.callee.called == 'undefined') {
    arguments.callee.called = true;
    YUI().use('uploader', 'uploader-flash', function (Y) {
      if(Y.Uploader.TYPE == "none" || Y.UA.ios) {
        Y.one(Drupal.settings.yui.uploader.select).set("text", "We are sorry, but the uploader technology is not supported on this platform.");
        return;
      }
      var uploader = new Y.UploaderFlash(Drupal.settings.yui.uploader.config);
      var post_vars = uploader.get('postVarsPerFile');
      var cookies = document.cookie.split(';');
      for (i=0; i < cookies.length; i++) {
        var cookie = cookies[i].split('=');
        if (cookie[0].indexOf('SESS') == 0) {
          post_vars.SID = cookie[1];
          break;
        }
      }
      uploader.get('postVarsPerFile', post_vars);
      uploader.render(Drupal.settings.yui.uploader.select);
      uploader.after("fileselect", function (event) {
        var file_list = event.fileList;
        var file_table = Y.one("#yui-uploader-filenames tbody");
        Y.each(file_list, function (file_instance) {
          file_table.append("<tr id='" + file_instance.get("id") + "_row" + "'>" +
                            "<td class='filename'>" + file_instance.get("name") + "</td>" +
                            "<td class='filesize'>" + file_instance.get("size") + "</td>" +
                            "<td class='percentdone'>Hasn't started yet</td>");
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
        Y.one("#yui-uploader-overall-progress").set("text", "Uploads complete!");
      });
    });
  }
}
