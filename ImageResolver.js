window.ImageResolver = (function(){

    function ImageResolver() {
        this.filters = [];
    }

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
    if (pathname.match(/(png|jpg|jpeg|gif|bmp)$/i)) {
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
    var matches = url.match(/http:\/\/imgur.com\/(.*)/) || [];
    if (matches.length && (-1 === matches[1].indexOf('/'))) {
        clbk('http://i.imgur.com/' + matches[1] + '.jpg');
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
    var matches = url.match(/http:\/\/imgur.com\/a\/(.*)/) || [];
    var api;
    if (matches.length) {
        api = 'http://api.imgur.com/2/album/' + matches[1] + '.json';
        $.ajax({
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
        return;
    }
    clbk(null);
    return;
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
    var id = url.match(/http:\/\/instagram.com\/p\/([^\/]+)/);
    if (id.length > 1) {
        url = 'http://instagram.com/p/' + id[1] + '/media/?size=l';
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
        $.ajax({
            method: 'GET',
            url: api,
            dataType: 'jsonp',
            success: function(data) {
                if (data && data.sizes && data.sizes.size) {
                    var sizes = data.sizes.size;
                    for (var i=0, l=sizes.length; i<l; i++) {
                        if (sizes[i].label === 'Large') {
                            clbk(sizes[i].source);
                            return;
                        }
                    }
                }
                clbk(null);
                return;
            }
        });
        return;
    }
    clbk(null);
    return;
};

/**
 * Any web page
 */
function WebpageResolver() {
}
//Good-enough tag parser
//Doesn't support attr with no value
//Doesn't support values with = (equal character)
WebpageResolver.prototype._parseTag = function(tag) {
    tag = tag.replace('/>', '>');
    tag = tag.replace('>','');
    tag = tag.replace('<','');
    var tagname = tag.substr(0, tag.indexOf(' '));
    var attr = tag.match(/(\S+)=["']?([^"']*)["']?/g);
    var attributes = {};
    var parts;
    for (var i=0,l=attr.length; i<l; i++) {
        parts = attr[i].split('=');
        attributes[parts[0].toLowerCase()] = parts[1].replace(/^["']/,'').replace(/["']$/, '');
    }
    return {
        tag: tagname,
        attributes: attributes
    };
};
WebpageResolver.prototype.resolve = function(url, clbk) {
    var self = this;
    $.ajax({
        url : url,
        method: 'GET',
        dataType: 'text',
        success: function(html) {
            var images = html.match(/<img([^>]*)>/g) || [];
            var image;
            var candidates = [];
            var tag;
            for (var i=0,l=images.length; i<l; i++) {
                tag = self._parseTag(images[i]);
                if (tag.attributes.src && tag.attributes.width && tag.attributes.height) {
                    candidates.push({
                        url: tag.attributes.src,
                        surface: tag.attributes.width * tag.attributes.height
                    });
                }
            }

            if (candidates.length) {
                candidates = candidates.sort(function(a,b){
                    return b.surface - a.surface;
                });
                image = candidates[0].url;

                //Resolve relative url
                if (!image.match(/^http/)) {
                    if (image.match(/^\//)) {
                        image = URI(url).pathname(image).toString();
                    } else {
                        image = URI(url).filename(image).toString();
                    }
                }

                clbk(image);
                return;
            }
            clbk(null);
            return;
        },
        error: function() {
            clbk(null);
            return;
        }
    });
};

/**
 * Opengraph meta tags
 */
function OpengraphResolver() {
}
OpengraphResolver.prototype.resolve = function(url, clbk) {
    var self = this;
    //@FIXME: prevent multiple request. Should reuse previous one.
    $.ajax({
        url : url,
        method: 'GET',
        dataType: 'text',
        success: function(html) {
            var meta = html.match(/<meta([^>]*)>/g) || [];
            var tag;
            var image = null;
            for (var i=0,l=meta.length; i<l; i++) {
                //@FIXME: remove dependency on WebpageResolver
                tag = WebpageResolver.prototype._parseTag(meta[i]);
                if (tag.attributes.property && tag.attributes.property === 'og:image' && tag.attributes.content) {
                    image = tag.attributes.content;
                    break;
                }
            }
            clbk(image);
            return;
        },
        error: function() {
            clbk(null);
            return;
        }
    });
};
