var request = require('superagent');

var Utils = function( options ){
    this.options = options || {};
    this.cache = {};
};

Utils.prototype.fetch = function( url, success, error ) {

    var _this = this;

    if (url in this.cache) {
        success( this.cache[url].data, this.cache[url].response );
    } else {
        request.get( url , function( response ) {

            if ( response.ok ) {

                _this.cache[url] = {
                    data: response.text,
                    response: response
                }
                success( response.text, response );

            } else {

                error( response );

            }

        });
    }
};

module.exports = Utils;
