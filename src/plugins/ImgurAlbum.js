/**
 * Imgur album
 */

var VALID_URL = /http(s*):\/\/(i\.|m\.)*imgur.com\/a\/([^\/]*)/;
var API_URL = 'http://api.imgur.com/2/album/{{ID}}.json';

function ImgurAlbum() {
}
ImgurAlbum.prototype.resolve = function(url, clbk, options, utils) {

    var request = utils.request;
    var id;
    var api;
    var matches = url.match( VALID_URL );

    if (matches && matches.length ) {

        id = matches[ matches.length - 1 ];
        api = API_URL.replace('{{ID}}', id);

        request
            .get( api )
            .end( function( response ){
                data = JSON.parse( response.text );
                var images = data.album.images || [];

                if (images.item && images.item.length) {
                    images = images.item;
                }

                var first = images.shift();

                if (first) {
                    clbk(first.links.large_thumbnail);
                    return;
                } else {
                    clbk(null);
                    return;
                }

            } );

    } else {

        clbk( null );
        return;

    }
};

module.exports = ImgurAlbum;
