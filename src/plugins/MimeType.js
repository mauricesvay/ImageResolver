function MimeType() {
}
MimeType.prototype.resolve = function( url, clbk, options, utils ) {
    utils.fetch(
        url,
        function onSuccess( data, response ) {
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

        },
        function onError() {
            clbk(null);
        }
    );
}

module.exports = MimeType;
