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

function ClbkInvoker (clbk, url) {
  this.clbk = clbk;
  this.url = url;
}
ClbkInvoker.prototype.invoke = function (image) {
  if (!this.clbk) {
    return;
  }
  if ( image ) {
      this.clbk( {
          'url': this.url,
          'image': image
      } );
  } else {
      this.clbk( null );
  }
  this.clbk = null;
  this.url = null;
};

function ImageResolver( options ) {

    this.options = options;
    this.utils = new Utils( options );
    this.filters = [];

}

ImageResolver.prototype.register = function(fn) {

    this.filters.push(fn);
    return this;

};

ImageResolver.prototype.onFilterResolve = function (url, clbk, index, data) {

    if (data === null) {
        this.next(url, clbk, index+1);
    } else {
        clbk.invoke(data);
    }
    url = null;
    clbk = null;
    index = null;

};

ImageResolver.prototype.next = function(url, clbk, index) {

    var filter;
    index = index || 0;
    if (index >= this.filters.length) {
      clbk.invoke(null);
      return;
    }
    filter = this.filters[index];
    if (filter) {
        filter.resolve( url, this.onFilterResolve.bind(this, url, clbk, index), this.options, this.utils );
    } else {
        clbk.invoke(null);
        return;
    }

};

ImageResolver.prototype.resolve = function(url, clbk) {

    this.next(url, new ClbkInvoker(clbk, url));
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
