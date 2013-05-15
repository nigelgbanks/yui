/**
 * @file
 * Sets the YUI Global configuration from values passed to the drupal settings.
 */
(function ($) {
  Drupal.behaviors.yuiSetGlobalConfig = function() {
    if (typeof arguments.callee.called == 'undefined') {
      arguments.callee.called = true;
      YUI.GlobalConfig = Drupal.settings.yui.config;
    }
  }
})(jQuery);
