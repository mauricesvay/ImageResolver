var Utils = function( options ){
	this.options = options;
	this.cache = {};
};

Utils.prototype.fetch = function( url, success, error ) {
	if ( this.options.ajax ) {
		var cache = this.cache;
        if (url in cache) {
            success(cache[url].html, cache[url].status, cache[url].xhr);
        } else {
            this.options.ajax({
                url : url,
                method: 'GET',
                dataType: 'text',
                success: function(html, status, xhr) {
                    cache[url] = {
                        html: html,
                        status: status,
                        xhr: xhr
                    };
                    success(html, status, xhr);
                },
                error: error
            });
        }
	} else {
		console.error('No Ajax adapter found. Instantiate ImageResolver with an "ajax" option containing a jQuery-compatible ajax function.');
		error();
	}
};

module.exports = Utils;
