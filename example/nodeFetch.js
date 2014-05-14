var imgResNode = require('./../ImageResolverNode');
var ImageResolver = imgResNode.ImageResolver;

ImageResolver.register(new imgResNode.FileExtensionResolver());
ImageResolver.register(new imgResNode.ImgurPageResolver());
ImageResolver.register(new imgResNode.NineGagResolver());
ImageResolver.register(new imgResNode.InstagramResolver());

//Resolvers that need extra ajax requests
ImageResolver.register(new imgResNode.MimeTypeResolver());
ImageResolver.register(new imgResNode.ImgurAlbumResolver());
ImageResolver.register(new imgResNode.FlickrResolver('6a4f9b6d16c0eaced089c91a2e7e87ad')); //Please don't use my api key!
ImageResolver.register(new imgResNode.OpengraphResolver());
ImageResolver.register(new imgResNode.WebpageResolver());

ImageResolver.resolve('http://www.vanguardngr.com/2014/05/us-flying-manned-missions-track-nigeria-girls/?utm_source=dlvr.it&utm_medium=twitter', function(image){
    if (image) {
        console.log(image);
    } else {
        console.log('No image found');
    }
});