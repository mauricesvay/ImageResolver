/**
 * Any web page
 */

var htmlparser = require("htmlparser2");

var MINIMUM_SURFACE = 16 * 16;

function Webpage() {
}
Webpage.prototype._score = function(image) {
    var score = 0;
    var src;
    if (image.attributes.src) {
        src = image.attributes.src;
    }
    if (image.attributes['data-src']) {
        src = image.attributes['data-src'];
    }
    if (image.attributes['data-lazy-src']) {
        src = image.attributes['data-lazy-src'];
    }
    if (!src) {
        return;
    }

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
        {pattern:/ads/i, score:-1}
    ];

    for (var i=0,l=rules.length; i<l; i++) {
        if (src.match(rules[i].pattern)) {
            score += rules[i].score;
        }
    }

    return score;
};
Webpage.prototype.resolve = function(url, clbk, options, utils) {

    var self = this;

    utils.fetch(
        url,
        function onSuccess( html, status, xhr ) {
            self.parseHTML( html, clbk, options, utils );
        },
        function onError(){
            clbk(null);
        }
    );

};

Webpage.prototype.parseHTML = function( html, clbk, options, utils ) {
    var domutils = htmlparser.DomUtils;

    var handler = new htmlparser.DomHandler( function( error, dom ) {

        if ( error ) {
            clbk(null);
            return;
        }

        var img = domutils.getElementsByTagName('img', dom, true);

        if ( img.length ) {

            for (var i=0,l=img.length; i<l; i++) {

                //Look for lazy loaded images
                if ( img[i].attribs['data-src'] ) {
                    img[i].attribs['src'] = img[i].attribs['data-src'];
                }
                if ( img[i].attribs['data-lazy-src'] ) {
                    img[i].attribs['src'] = img[i].attribs['data-lazy-src'];
                }

                //Compute surface
                var w = img[i].attribs['width'] || 1;
                var h = img[i].attribs['height'] || 1;
                img[i].surface = w * h;

            }

            //Sort by surface
            img = img.sort( function( a, b ){
                return b.surface - a.surface;
            } );

            //@TODO Score images and sort

            clbk( img[0].attribs['src'] );
            return;

        }

        clbk(null);
    } );
    var parser = new htmlparser.Parser( handler );
    parser.write( html );
    parser.done();
}

module.exports = Webpage;