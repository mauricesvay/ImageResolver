var Utils         = require('./Utils');

var FileExtension = require('./plugins/FileExtension');
var NineGag       = require('./plugins/NineGag');
var Instagram     = require('./plugins/Instagram');
var ImgurPage     = require('./plugins/ImgurPage');

var ImgurAlbum    = require('./plugins/ImgurAlbum');
var Flickr        = require('./plugins/Flickr');
var MimeType      = require('./plugins/MimeType');
var Opengraph     = require('./plugins/Opengraph');
var Webpage       = require('./plugins/Webpage');

function ImageResolver( options ) {

    this.options = options;
    this.utils = new Utils( options );
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
        filter.resolve( url, function( data ){
            if (data === null) {
                self.next(filters.slice(1), url, clbk);
                return;
            } else {
                clbk(data);
                return;
            }
        }, this.options, this.utils );
    } else {
        clbk(null);
        return;
    }

};

ImageResolver.prototype.resolve = function(url, clbk) {

    var callback = function( image ) {
        if ( image ) {
            clbk( {
                'url': url,
                'image': image
            } );
            return;
        } else {
            clbk( null );
            return;
        }
    }

    var filters = this.filters;
    this.next(filters, url, callback);
    return this;

};

// Expose plugins
ImageResolver.FileExtension = FileExtension;
ImageResolver.NineGag       = NineGag;
ImageResolver.Instagram     = Instagram;
ImageResolver.ImgurPage     = ImgurPage;

ImageResolver.MimeType      = MimeType;
ImageResolver.ImgurAlbum    = ImgurAlbum;
ImageResolver.Flickr        = Flickr;
ImageResolver.Opengraph     = Opengraph;
ImageResolver.Webpage       = Webpage;

module.exports = ImageResolver;