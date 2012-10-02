/*
 * jQuery (Infinite) scrollLoader
 * scrollLoader is a jQuery plugin for infinite scrolling. It's
 * very light weight allowing for a wider range of backend
 * implementations of infinite scrolling to be possible.
 *
 *
 *
 *
 *
 */
(function($) {
  return $.widget("rb.scrollLoader", {
    counter: 0,
    isLoading: false,
    firstLoad: false,
    options: {
      scrollElem  : window,
      ajaxType    : 'get',
      ajaxData    : null,
      ajaxUrl     : null,
      limit       : 24,
      success     : function() {},
      animate     : true,            // whether or not to animate the scrolling for new content (not implemented)
      beforeOffset: 0,               // offset the scrollTo distance (number of pixels before hitting bottom)
      loadFirst   : true,            // run the action method once first before doing anything
      maxPages    : 5,               // the number of pages to load until infinite scroll stops
      updateInterval: 150,           // not that important now, but the interval in which to update the bottom
                                     // position of the document height and position of the bottom of the page.
      allowOvershoot: false          // in some browsers, you can overshoot the document height when
                                     // scrolling down, using inertial scrolling (Macs, etc.),
                                     // set this to true to disallow overshoot
    },

    _create: function() {
      var self = this;

      // bind scrolling
      $(self.options.scrollElem).on('scroll', { self: self }, self._onScroll);

      if (self.options.loadFirst) {
        self.load();
      }
    },

    _init: function() {
      var self;
      return self = this;
    },

    _onScroll: function(event) {
      var self = event.data.self;
      if (self._isBottom() && !self.isLoading) {
        self.isLoading = true;
        self.load();
      }
    },

    _isBottom: function() {
      var self = this;
      if (self.allowOvershoot) {
        return $(window).scrollTop() >= self._bottomPosition;
      } else {
        return $(window).scrollTop() == self._bottomPosition;
      }
    },

    _updateBottomPosition: function() {
      var self = this;
      self._bottomPosition = $(document).height() - $(window).height() - self.options.beforeOffset;
    },

    load: function() {
      var self = this;
      $.ajax({
        type: self.options.ajaxType,
        url: self.options.ajaxUrl,
        data: {
          page: self.counter,
          limit: self.options.limit
        },
        success: function(data) {
          if (typeof self.options.success == 'function') {
            self.options.success(data);

            // update to the newest bottom position
            // use a setTimeout here as a copout to allow
            // the DOM some time to update. For now!
            setTimeout(function() {
              self._updateBottomPosition();
            }, self.options.updateInterval);
          }
        }
      });
    },

    getPage: function() {
      var self = this;
      return self.counter;
    },

    setLoadingFlag: function(flag) {
      var self = this;
      self.isLoading = flag;
    },

    incrementPage: function() {
      var self = this;
      self.counter++;
    },

    destroy: function() {
      // unbind the scroll
      $(self.options.scrollElem).unbind('scroll');

      // completely destroy the plugin
      return $.Widget.prototype.destroy.call(this);
    },

  });
})(jQuery);

