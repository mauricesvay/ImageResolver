/**
 * 9gag page
 */

var Url = require('url');

var VALID_HOSTNAME = '9gag.com';
var VALID_PATHNAME = /^\/gag\/(.*)$/;
var OUT_TPL = 'http://d24w6bsrhbeh9d.cloudfront.net/photo/{{id}}_700b.jpg';

function NineGag() {
}
NineGag.prototype.resolve = function(url, clbk) {

    var id;
    var url = Url.parse(url);
    var matches = url.pathname.match(VALID_PATHNAME) || [];

    if (url.hostname === VALID_HOSTNAME && matches.length ) {
        id = matches[1];
        clbk( OUT_TPL.replace('{{id}}', id ) );
        return;
    } else {
        clbk(null);
    }
};

module.exports = NineGag;