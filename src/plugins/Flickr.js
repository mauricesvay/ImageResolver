/**
 * Flickr photo page
 */

var API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key={{APIKEY}}&photo_id={{ID}}&format=json&nojsoncallback=1';

function Flickr(apikey) {
    this.apikey = apikey;
}
Flickr.prototype.resolve = function(url, clbk, options, utils) {
    var request = utils.request;
    var matches = url.match(/http(s*):\/\/www.flickr.com\/photos\/([^\/]*)\/([^\/]*)\/(.*)/) || [];
    var id;
    var image;
    var api;
    if (matches.length) {
        id = matches[3];
        api = API_URL
            .replace('{{APIKEY}}', this.apikey)
            .replace('{{ID}}', id);

        request
            .get( api )
            .end( function( response ){
                data = JSON.parse( response.text );
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
            } );
    } else {
        clbk(null);
        return;
    }
};

module.exports = Flickr;
