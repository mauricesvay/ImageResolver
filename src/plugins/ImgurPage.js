/**
 * Imgur page
 */

var VALID_URL = /http(s*):\/\/(i\.|m\.)*imgur.com\/(gallery\/){0,1}(.*)/;
var OUT_TPL = 'http://i.imgur.com/{{id}}.jpg'; //@FIXME : image can be gif or png

function ImgurPage() {
}
ImgurPage.prototype.resolve = function(url, clbk) {

	var id;
    var matches = url.match( VALID_URL );

    if (matches && matches.length && (-1 === matches[matches.length-1].indexOf('/'))) {
    	id = matches[ matches.length - 1 ];
        clbk( OUT_TPL.replace( '{{id}}', id ) );
        return;
    } else {
        clbk( null );
    }

};

module.exports = ImgurPage;
