function MimeType() {
}
MimeType.prototype.onSuccess = function(clbk,url,data,response){
  var contentType = response.type;

  switch (contentType) {
      case "image/jpeg":
      case "image/png":
      case "image/gif":
      case "image/svg+xml":
      case "image/bmp":
      case "image/tiff":
          clbk(url);
          break;
      default:
          clbk(null);
  }
  clbk = null;
  url = null;

};
MimeType.prototype.onError = function(clbk){
  clbk(null);
  clbk = null;
};
MimeType.prototype.resolve = function( url, clbk, options, utils ) {
    utils.fetch(
        url,
        this.onSuccess.bind(this,clbk,url),
        this.onError.bind(this,clbk)
    );
}

module.exports = MimeType;
