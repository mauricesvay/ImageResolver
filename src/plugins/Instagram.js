/**
 * Instagram page
 */

var VALID_URL = /http(s*):\/\/instagr(\.am|am\.com)\/p\/([^\/]+)/;
var OUT_TPL = 'http://instagram.com/p/{{id}}/media/?size=l';

function Instagram() {
}
Instagram.prototype.resolve = function(url, clbk) {
    var id = url.match(VALID_URL);
    if (id && id.length > 1) {
        url = OUT_TPL.replace('{{id}}', id[3]);
        clbk(url);
        return;
    } else {
        clbk(null);
    }
};

module.exports = Instagram;
