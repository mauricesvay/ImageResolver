var ImageResolver = require('../../src/ImageResolver');

var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.FileExtension());
imageresolver.register(new ImageResolver.Opengraph());
imageresolver.register(new ImageResolver.Webpage());

imageresolver.resolve('http://www.imdb.com/title/tt2294629/', function(result){
    console.log('result',result);
});