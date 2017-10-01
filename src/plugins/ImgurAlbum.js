/**
 * Imgur album
 * See https://apidocs.imgur.com/
 */

var VALID_URL = /http(s*):\/\/(i\.|m\.)*imgur.com\/a\/([^\/]*)/;
var API_URL = 'https://api.imgur.com/3/album/{{albumHash}}';

function ImgurAlbum(config) {

    if (!config.client_id) {
        throw new Error("ImgurAlbum plugin: client_id is missing");
    }

    this.config = config;
}

ImgurAlbum.prototype.resolve = function(url, clbk, options, utils) {

    var request = utils.request;
    var id;
    var api;
    var matches = url.match( VALID_URL );

    if (matches && matches.length ) {

        id = matches[ matches.length - 1 ];
        api = API_URL.replace('{{albumHash}}', id);

        request
            .get( api )
            .set( "Authorization", "Client-ID " + this.config.client_id )
            .end( function( response ){
                var data = response.body.data;
                var images = data.images || [];

                var first = images.shift();

                if (first) {
                    clbk(first.link);
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
