Drupal.behaviors.yuiUploader = function() {
  if (typeof arguments.callee.called == 'undefined') {
    arguments.callee.called = true;
    YUI().use('uploader', 'uploader-flash', function (Y) {
      if(Y.Uploader.TYPE == "none" || Y.UA.ios) {
        Y.one(Drupal.settings.yui.uploader.select).set("text", "We are sorry, but the uploader technology is not supported on this platform.");
        return;
      }
      var uploader = new Y.UploaderFlash(Drupal.settings.yui.uploader.config);
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
          uploader.uploadAll();
        }
      });
      uploader.on("uploadprogress", function (event) {
        var file_row = Y.one("#" + event.file.get("id") + "_row");
        file_row.one(".percentdone").set("text", event.percentLoaded + "%");
      });
      uploader.on("uploadstart", function (event) {
        uploader.set("enabled", false);
        //Y.one(upload_button_selector).addClass("yui3-button-disabled");
        //Y.one(upload_button_selector).detach("click");
      });
      uploader.on("uploadcomplete", function (event) {
        var file_row = Y.one("#" + event.file.get("id") + "_row");
        file_row.one(".percentdone").set("text", "Finished!");
      });
      //uploader.on("totaluploadprogress", function (event) {
       // Y.one("#overallProgress").setHTML("Total uploaded: <strong>" + event.percentLoaded + "%" + "</strong>");
      //});
      uploader.on("alluploadscomplete", function (event) {
        uploader.set("enabled", true);
        //uploader.set("fileList", []);
        //Y.one("#overallProgress").set("text", "Uploads complete!");
        //uploadDone = true;
      });
    });
  }
}
