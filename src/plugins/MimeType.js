function MimeType() {
}
MimeType.prototype.resolve = function( url, clbk, options, utils ) {
    utils.fetch(
        url,
        function onSuccess( html, status, xhr ) {
            var contentType = xhr.getResponseHeader("Content-Type");

            switch (contentType) {
                case "image/jpeg":
                case "image/png":
                case "image/gif":
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
