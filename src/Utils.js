var request = require('superagent');

var Utils = function( options ){
    this.options = options || {};
    this.cache = {};
};

Utils.prototype.ender = function(url, success, error, r, err, response){
  if (r) {
    r.removeListener('error', error);
  }
  if ( err ) {
      error(err);
      url = null;
      success = null;
      error = null;
      r = null;
      return;
  }

  if (!(this.options && this.options.nocache)) {
    this.cache[url] = {
        data: response.text,
        response: response
    }
  }
  success( response.text, response );
  url = null;
  success = null;
  error = null;
  r = null;
};

Utils.prototype.fetch = function( url, success, error ) {

    var plugin = null;

    if ( this.options.requestPlugin && typeof this.options.requestPlugin === 'function' ) {
        plugin = this.options.requestPlugin;
    }

    if (url in this.cache) {
        success( this.cache[url].data, this.cache[url].response );
    } else {

        var r = request.get( url );
        if ( plugin ) {
            r = r.use( plugin );
        }
        if (this.options.timeout && 'object' === typeof this.options.timeout) {
          r.timeout(this.options.timeout);
        }
        r.on('error', error);
        r.end(this.ender.bind(this, url, success, error, r));
    }
};

Utils.prototype.request = request;

module.exports = Utils;
