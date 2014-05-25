var request = require('superagent');

var Utils = function( options ){
    this.options = options || {};
    this.cache = {};
};

Utils.prototype.fetch = function( url, success, error ) {

    var _this = this;
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
        r.end( function( err, response ) {

            if ( err ) {
                error();
                return;
            }

            _this.cache[url] = {
                data: response.text,
                response: response
            }
            success( response.text, response );

        });
    }
};

Utils.prototype.request = request;

module.exports = Utils;
