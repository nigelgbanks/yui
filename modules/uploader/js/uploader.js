Drupal.behaviors.yuiUploader = function() {
  if (typeof arguments.callee.called == 'undefined') {
    arguments.callee.called = true;
    YUI().use('uploader', 'uploader-flash',  function (Y) {
      var prop = Drupal.settings.yui.uploader;
      var uploader = new Y.UploaderFlash(Drupal.settings.yui.uploader.config);
      uploader.render(Drupal.settings.yui.uploader.select);
    });
  }
}
