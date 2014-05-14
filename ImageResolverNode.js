var request = require('request');
var URI = require('URIjs');
var cheerio = require('cheerio');
// node_search
var ImageResolver = (function(){

    function ImageResolver() {
        this.filters = [];
        this.cache = {};
    }

    ImageResolver.prototype.fetch = function(url, success, error) {
        var cache = this.cache;
        /*
        if (url in cache) {
            success(cache[url].html, cache[url].status, cache[url].xhr);
        } else {
            $.ajax({
                url : url,
                method: 'GET',
                dataType: 'text',
                success: function(html, status, xhr) {
                    cache[url] = {
                        html:html,
                        status:status,
                        xhr:xhr
                    };
                    success(html, status, xhr);
                },
                error: error
            });
        }*/
        // node_search
        if (url in cache) {
            success(cache[url].html, cache[url].status, cache[url].xhr);
        } else {
            request(url, function(err, res, html) {
                if(err) {
                    error(err);
                } else {
                    cache[url] = {
                        html : html,
                        status : res.statusCode,
                        xhr : res
                    };
                    success(cache[url].html, cache[url].status, cache[url].xhr);
                }
            });
        }
    };

    ImageResolver.prototype.register = function(fn) {
        this.filters.push(fn);
        return this;
    };

    ImageResolver.prototype.next = function(filters, url, clbk) {
        var self = this;
        var filter;
        if (filters.length) {
            filter = filters[0];
            filter.resolve(url, function(data){
                if (data === null) {
                    self.next(filters.slice(1), url, clbk);
                    return;
                } else {
                    //console.log('Resolved with ' + filter.constructor.name);
                    clbk(data);
                    return;
                }
            });
            return;
        }
        // console.log('No image found on ' + url);
        clbk(null);
    };

    ImageResolver.prototype.resolve = function(url, clbk) {
        var filters = this.filters;
        this.next(filters, url, clbk);
        return this;
    };

    return new ImageResolver();

})();

/**
 * Plugins
 */

/**
 * filter by file extension
 */

function FileExtensionResolver() {
}
FileExtensionResolver.prototype.resolve = function(url, clbk) {
    var pathname = URI(url).pathname();
    if (pathname.match(/(png|jpg|jpeg|gif|bmp|svg)$/i)) {
        clbk(url);
        return;
    }
    clbk(null);
};


/**
 * Imgur page
 */
function ImgurPageResolver() {
}
ImgurPageResolver.prototype.resolve = function(url, clbk) {
    var matches = url.match(/http:\/\/(i\.)*imgur.com\/(gallery\/){0,1}(.*)/);
    if (matches && matches.length && (-1 === matches[matches.length-1].indexOf('/'))) {
        clbk('http://i.imgur.com/' + matches[matches.length-1] + '.jpg'); //@FIXME : image can be gif or png
        return;
    }
    clbk(null);
};

/**
 * Imgur album
 */
function ImgurAlbumResolver() {
}

ImgurAlbumResolver.prototype.resolve = function(url, clbk) {
    var matches = url.match(/http:\/\/imgur.com\/(a)\/(.*)/) || [];
    var api;
    if (matches.length) {
        api = 'http://api.imgur.com/2/album/' + matches[2] + '.json';
       /* $.ajax({
            url : api,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                var images = data.album.images || [];
                if (images.item && images.item.length) {
                    images = images.item;
                }
                var first = images.shift();
                if (first) {
                    clbk(first.links.large_thumbnail);
                    return;
                }
                clbk(null);
                return;
            }
        });
        */
        // node_search
        request(api, function(err, res, data) {
            data = JSON.parse(data);
            var images = data.album.images || [];
            if (images.item && images.item.length) {
                images = images.item;
            }
            var first = images.shift();
            if (first) {
                clbk(first.links.large_thumbnail);
                return;
            }
            clbk(null);
            //return;
        });
        return;
    }
    clbk(null);
    //return;
};

/**
 * 9gag page
 */
function NineGagResolver() {
}

NineGagResolver.prototype.resolve = function(url, clbk) {
    var matches = url.match(/http:\/\/9gag.com\/gag\/(.*)/) || [];
    var id;
    var image;
    if (matches.length) {
        id = matches[1];
        image = 'http://d24w6bsrhbeh9d.cloudfront.net/photo/' + id + '_700b.jpg';
        clbk(image);
        return;
    }
    clbk(null);
};

/**
 * Instagram page
 */
function InstagramResolver() {
}

InstagramResolver.prototype.resolve = function(url, clbk) {
    var id = url.match(/http:\/\/instagr(\.am|am\.com)\/p\/([^\/]+)/);
    if (id && id.length > 1) {
        url = 'http://instagram.com/p/' + id[2] + '/media/?size=l';
        clbk(url);
        return;
    }
    clbk(null);
};

/**
 * Flickr photo page
 */
function FlickrResolver(apikey) {
    this.apikey = apikey;
}

FlickrResolver.prototype.resolve = function(url, clbk) {
    var matches = url.match(/http:\/\/www.flickr.com\/photos\/([^\/]*)\/([^\/]*)\/(.*)/) || [];
    var id;
    var image;
    var api;
    var tplApi = 'http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key={{APIKEY}}&photo_id={{ID}}&format=json&jsoncallback=?';
    if (matches.length) {
        id = matches[2];
        api = tplApi
            .replace('{{APIKEY}}', this.apikey)
            .replace('{{ID}}', id);
        /*$.ajax({
            method: 'GET',
            url: api,
            dataType: 'jsonp',
            success: function(data) {
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
            }
        });*/
        // node_search
        request(api, function(err, res, data) {
            data = JSON.parse(data);
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
            //return;
        });
        return;
    }
    clbk(null);
    //return;
};

function MimeTypeResolver() {
}

MimeTypeResolver.prototype.resolve = function(url,clbk) {
    ImageResolver.fetch(
        url,
        function(html, status, xhr) {
            // var contentType = xhr.getResponseHeader("Content-Type");
            // xhr = response from request lib
            //console.log(xhr);
            // node_search
            var contentType = xhr.headers['content-type'];

            switch (contentType) {
                case "image/jpeg":
                case "image/png":
                case "image/gif":
                    clbk(url);
                    break;
                default:
                    clbk(null);
            }

        }
    );
}

/**
 * Any web page
 */
function WebpageResolver() {
}

// node_search | new function _parseTag
WebpageResolver.prototype._parseTag = function(tag) {
    $ = cheerio.load(tag);

    var item = $('*').first()[0];

    var attributes = {};

    for(var index in item.attribs) {
        attributes[index] = item.attribs[index];
    }
    var ret = {
        tag : item.name.toUpperCase(),
        attributes : attributes
    };

    return ret
};

WebpageResolver.prototype._score = function(image) {
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
WebpageResolver.prototype.resolve = function(url, clbk) {
    var self = this;
    ImageResolver.fetch(
        url,
        function(html) {
            var images = html.match(/<img([^>]*)>/g) || [];
            var image;
            var candidates = [];
            var significant_surface = 16*16;
            var significant_surface_count = 0;
            var tag;
            var src;
            var surface;
            for (var i=0,l=images.length; i<l; i++) {
                surface = 0;
                tag = self._parseTag(images[i]);
                if (tag && tag.attributes){

                    //Check for lazy loaded images
                    if (tag.attributes.src) {
                        src = tag.attributes.src;
                    }
                    if (tag.attributes['data-src']) {
                        src = tag.attributes['data-src'];
                    }
                    if (tag.attributes['data-lazy-src']) {
                        src = tag.attributes['data-lazy-src'];
                    }
                    if (!src){
                        continue;
                    }

                    // Compute surface area, even when only 1 dimension is specified
                    if (tag.attributes.width) {
                        if (tag.attributes.height) {
                            surface = parseInt(tag.attributes.width, 10) * parseInt(tag.attributes.height,10);
                        } else {
                            surface = parseInt(tag.attributes.width, 10);
                        }
                    } else {
                        if (tag.attributes.height) {
                            surface = parseInt(tag.attributes.height,10);
                        } else {
                            surface = 0;
                        }
                    }
                    if (surface > significant_surface) {
                        significant_surface_count++;
                    }

                    candidates.push({
                        url: src,
                        surface: surface,
                        score: self._score(tag)
                    });
                }
            }

            if (!candidates.length) {
                clbk(null);
                return;
            }

            //Remove scores below 0
            candidates = candidates.filter(function(item){
                return (item.score >= 0);
            });
            if (!candidates.length) {
                clbk(null);
                return;
            }

            //Sort candidates by size, or score
            if (significant_surface_count > 0) {
                candidates = candidates.sort(function(a,b){
                    return b.surface - a.surface;
                });
            } else {
                candidates = candidates.sort(function(a,b){
                    return b.score - a.score;
                });
            }
            image = candidates[0].url;
            //Resolve relative url
            if (!image.match(/^http/)) {
                var uri = new URI(image);
                image = uri.absoluteTo(url);
            }

            clbk(image);
            return;
        },
        function() {
            clbk(null);
            return;
        }
    );
};

/**
 * Opengraph meta tags
 */
function OpengraphResolver() {
}

OpengraphResolver.prototype.resolve = function(url, clbk) {
    var self = this;
    ImageResolver.fetch(
        url,
        function(html) {
            // @TODO : add <link rel="image_src" href="http://www.example.com/facebook-logo.jpg" />
            var meta = html.match(/<(meta|link)([^>]*)>/g) || [];
            var tag;
            var images = [];
            var image = null;
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

            for (var i=0,l=meta.length; i<l; i++) {
                //@FIXME: remove dependency on WebpageResolver
                tag = WebpageResolver.prototype._parseTag(meta[i]);
                if (tag) {
                    for (var j=0, m=tags.length; j<m; j++) {
                        if (
                            tag.attributes[tags[j].attribute] &&
                            tag.attributes[tags[j].attribute] === tags[j].name &&
                            tag.attributes[tags[j].value]
                        ) {
                            images.push({
                                url: tag.attributes[tags[j].value],
                                type: tags[j].type,
                                score: 0
                            });
                        }
                    }
                }
            }
            if (images.length === 1) {
                image = images[0].url;
            } else if (images.length > 1) {
                for (i=0, l=images.length; i<l; i++) {
                    //Increase score for image containing "large" or "big" in url
                    if (images[i].url.match(/(large|big)/i)) {
                        images[i].score++;
                    }
                    // Increase score for twitter
                    if (images[i].type === 'twitter') {
                        images[i].score++;
                    }
                }
                images.sort(function(a,b){
                    return b.score - a.score;
                });
                image = images[0].url;
            }

            //Resolve relative url
            if (image && !image.match(/^http/)) {
                var uri = new URI(image);
                image = uri.absoluteTo(url);
            }

            clbk(image);
            return;
        },
        function() {
            clbk(null);
            return;
        }
    );
};

// node_search | exports for use in node js -> see example
exports.ImageResolver = ImageResolver;
exports.FileExtensionResolver = FileExtensionResolver;
exports.ImgurAlbumResolver = ImgurAlbumResolver;
exports.ImgurPageResolver = ImgurPageResolver;
exports.NineGagResolver = NineGagResolver;
exports.InstagramResolver = InstagramResolver;
exports.FlickrResolver = FlickrResolver;
exports.MimeTypeResolver = MimeTypeResolver;
exports.WebpageResolver = WebpageResolver;
exports.OpengraphResolver = OpengraphResolver;