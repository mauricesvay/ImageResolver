/**
 * Flickr photo page
 */

var API_URL = 'http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key={{APIKEY}}&photo_id={{ID}}&format=json&jsoncallback=?';

function Flickr(apikey) {
    this.apikey = apikey;
}
Flickr.prototype.resolve = function(url, clbk, options) {
    var matches = url.match(/http:\/\/www.flickr.com\/photos\/([^\/]*)\/([^\/]*)\/(.*)/) || [];
    var id;
    var image;
    var api;

    if (matches.length) {
        id = matches[2];
        api = API_URL
            .replace('{{APIKEY}}', this.apikey)
            .replace('{{ID}}', id);

        if ( options.ajax ) {
            var ajax = options.ajax;
            $.ajax({
                method: 'GET',
                url: api,
                dataType: 'jsonp',
                success: function(data) {
                    if (data && data.sizes && data.sizes.size) {
                        var sizes = data.sizes.size;
                        for (var i=0, l=sizes.length; i<l; i++) {
                            if (sizes[i].label === 'Large' || sizes[i].label === 'Original') {
                                clbk(sizes[i].source);
                                return;
                            }
                        }
                    }
                    clbk(null);
                    return;
                }
            });
        } else {
            console.error('Flickr requires an ajax adapter. To use this plugin, instantiate ImageResolver with an "ajax" option containing a jQuery-compatible ajax function.');
            clbk(null);
        }
    }
    clbk(null);
    return;
};

module.exports = Flickr;