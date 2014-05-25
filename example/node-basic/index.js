var ImageResolver = require('../../src/ImageResolver');

var resolver = new ImageResolver();
resolver.register(new ImageResolver.FileExtension());
resolver.register(new ImageResolver.MimeType());
resolver.register(new ImageResolver.Opengraph());
resolver.register(new ImageResolver.Webpage());

resolver.resolve( 'http://www.imdb.com/title/tt2294629/', function( result ){
    if ( result ) {
        console.log( result.image );
    } else {
        console.log( 'No image found ' );
    }
});
