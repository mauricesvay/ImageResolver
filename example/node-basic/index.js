var ImageResolver = require('../../src/ImageResolver');

var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.FileExtension());
imageresolver.register(new ImageResolver.Opengraph());
// imageresolver.register(new ImageResolver.Webpage());

imageresolver.resolve('https://medium.com/life-learning/2a1841f1335d', function(result){
    // console.log(arguments.callee.caller.toString());
    console.log('result',result);
});