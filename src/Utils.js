var request = require('request');

var Utils = function( options ){
	this.options = options || {};
	this.cache = {};
};

Utils.prototype.fetch = function( url, success, error ) {

    var _this = this;

    if (url in this.cache) {
        success(this.cache[url].html, this.cache[url].status, this.cache[url].xhr);
        return;
    }

	if ( this.options.ajax ) {
        this.options.ajax({
            url : url,
            method: 'GET',
            dataType: 'text',
            success: function(html, status, xhr) {
                _this.cache[url] = {
                    html: html,
                    status: status,
                    xhr: xhr
                };
                success(html, status, xhr);
            },
            error: error
        });
	} else {
        request( url , function( err, res ) {
            if( err ) {
                error();
                return;
            } else {
                _this.cache[url] = {
                    html: res.body,
                    status: res.statusCode,
                    xhr: null
                };
                success( res.body, res.statusCode, null );
                return;
            }
        });
	}
};

module.exports = Utils;
