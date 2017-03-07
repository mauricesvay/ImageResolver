/**
 * Any web page
 */

var htmlparser = require("htmlparser2");
var URL = require('url');

var rules = [
    {pattern:/(large|big)/, score:1},
    {pattern:'upload', score:1},
    {pattern:'media', score:1},
    {pattern:'gravatar.com', score:-1},
    {pattern:'feeds.feedburner.com', score:-1},
    {pattern:/icon/i, score:-1},
    {pattern:/logo/i, score:-1},
    {pattern:/spinner/i, score:-1},
    {pattern:/loading/i, score:-1},
    {pattern:'badge', score:-1},
    {pattern:'1x1', score:-1},
    {pattern:'pixel', score:-1},
    {pattern:/ads/i, score:-1},
    {pattern:/doubleclick/i, score:-1}
];

var MINIMUM_SURFACE = 16 * 16;

function Webpage() {
}
Webpage.prototype._score = function( image ) {
    var score = 0;
    var src;
    if (image.attribs['src']) {
        src = image.attribs['src'];
    }
    if (image.attribs['data-src']) {
        src = image.attribs['data-src'];
    }
    if (image.attribs['data-lazy-src']) {
        src = image.attribs['data-lazy-src'];
    }
    if (!src) {
        return -10;
    }

    for (var i=0,l=rules.length; i<l; i++) {
        if (src.match(rules[i].pattern)) {
            score += rules[i].score;
        }
    }
    return score;
};

Webpage.prototype.onSuccess = function (url, clbk, data, response) {
    this.parseHTML( data, url, clbk);
    clbk = null;
    url = null;
};

Webpage.prototype.onError = function (clbk) {
  clbk(null);
  clbk = null;
};

Webpage.prototype.resolve = function(url, clbk, options, utils) {

    utils.fetch(
        url,
        this.onSuccess.bind(this, url, clbk),
        this.onError.bind(this,clbk)
    );

};

Webpage.prototype.domHandlerJob = function(url,clbk,error,dom){
        var domutils = htmlparser.DomUtils;

        if ( error ) {
            clbk(null);
            clbk = null;
            url = null;
            return;
        }

        var img = domutils.getElementsByTagName('img', dom, true);
        var images = [];
        var image;

        if ( img.length ) {

            for (var i=0,l=img.length; i<l; i++) {

                //Look for lazy loaded images
                if ( img[i].attribs['data-src'] ) {
                    img[i].attribs['src'] = img[i].attribs['data-src'];
                }
                if ( img[i].attribs['data-lazy-src'] ) {
                    img[i].attribs['src'] = img[i].attribs['data-lazy-src'];
                }

                if ( !img[i].attribs['src'] ) {
                    continue;
                }

                //Compute surface
                var w = img[i].attribs['width'] || 1;
                var h = img[i].attribs['height'] || 1;
                img[i].surface = w * h;

                img[i].score = this._score( img[i] );

                //Filter by size
                if ( img[i].surface > MINIMUM_SURFACE ) {
                    images.push( img[i] );
                }

            }

            if ( images.length > 0 ) {
                //Sort by score
                images.sort(function(a,b){
                    if ( a.surface == b.surface ) {
                        return b.score - a.score;
                    } else {
                        return b.surface - a.surface;
                    }
                });
                image = images[0].attribs['src'];

                //Resolve relative url
                if (!image.match(/^http/)) {
                    image = URL.resolve( url, image);
                }

                clbk( image );
            } else {
                clbk(null);
            }
        } else {
            clbk(null);
        }
        clbk = null;
        url = null;
};

Webpage.prototype.parseHTML = function( html, url, clbk) {

    var handler = new htmlparser.DomHandler(this.domHandlerJob.bind(this,url,clbk));
    clbk = null;
    url = null;
    var parser = new htmlparser.Parser( handler );
    parser.write( html );
    parser.done();
}

module.exports = Webpage;
