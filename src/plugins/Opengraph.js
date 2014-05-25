/**
 * Opengraph meta tags
 */

var htmlparser = require("htmlparser2");
var URL = require('url');

var tags = [
    // Facebook, Google+
    {
        type: "facebook",
        attribute : "property",
        name : "og:image",
        value : "content"
    },
    // Old Facebook
    {
        type: "facebook",
        attribute : "rel",
        name : "image_src",
        value : "href"
    },
    // Old Twitter card
    {
        type: "twitter",
        attribute : "name",
        name : "twitter:image",
        value : "value"
    },
    // New Twitter card
    {
        type: "twitter",
        attribute : "name",
        name : "twitter:image",
        value : "content"
    }
];

function Opengraph() {
}
Opengraph.prototype.resolve = function(url, clbk, options, utils) {
    var self = this;

    utils.fetch(
        url,
        function onSuccess( data, response ) {
            self.parseHTML( data, url, clbk, options, utils );
        },
        function onError(){
            clbk(null);
        }
    );
};

Opengraph.prototype.parseHTML = function( html, url, clbk, options, utils ) {
    var domutils = htmlparser.DomUtils;

    var handler = new htmlparser.DomHandler( function( error, dom ) {

        if ( error ) {
            clbk(null);
            return;
        }

        var meta = [].concat(
            domutils.getElementsByTagName('meta', dom, true),
            domutils.getElementsByTagName('link', dom, true)
        );

        var images = [];
        var image;
        var tag;

        // Find Opengraph tags
        for (var i=0,l=meta.length; i<l; i++) {
            tag = meta[i];
            for (var j=0, m=tags.length; j<m; j++) {
                if (
                    tag.attribs[tags[j].attribute] &&
                    tag.attribs[tags[j].attribute] === tags[j].name &&
                    tag.attribs[tags[j].value]
                ) {
                    images.push({
                        url: tag.attribs[tags[j].value],
                        type: tags[j].type,
                        score: 0
                    });
                }
            }
        }

        // Find best image among candidates
        if (images.length === 1) {
            image = images[0].url;
        } else if (images.length > 1) {
            for (i=0, l=images.length; i<l; i++) {
                //Increase score for image containing "large" or "big" in url
                if (images[i].url.match(/(large|big)/i)) {
                    images[i].score++;
                }
                // Increase score for twitter
                // Websites tend to limit image size to the size of Facebook preview
                if (images[i].type === 'twitter') {
                    images[i].score++;
                }
            }
            images.sort(function(a,b){
                return b.score - a.score;
            });
            image = images[0].url;
        }

        if ( image ) {
            //Resolve relative url
            if (!image.match(/^http/)) {
                image = URL.resolve( url, image);
            }
            clbk(image);
        } else {
            clbk(null);
        }

    } );
    var parser = new htmlparser.Parser( handler );
    parser.write( html );
    parser.done();
};

module.exports = Opengraph;