YUI().use('uploader', 'uploader-flash',  function (Y) {
  Y.Uploader = Y.UploaderFlash;
  var prop = Drupal.settigns.yui.uploader;
  var uploader = new Y.Uploader({width: prop.width,
                                 height: prop.height});
  uploader.set("fileFilters", prop.fileFilters);
  uploader.render(prop.id);
});