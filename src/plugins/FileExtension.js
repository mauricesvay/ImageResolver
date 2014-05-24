/**
 * filter by file extension
 */

var Url = require('url');

function FileExtension() {
}
FileExtension.prototype.resolve = function(url, clbk) {

    var pathname = Url.parse(url).pathname;

    if (pathname.match(/\.(png|jpg|jpeg|gif|bmp|svg)$/i)) {
        clbk(url);
        return;
    }

    clbk(null);
};

module.exports = FileExtension;