var ImageResolver = require('../../../src/ImageResolver');
var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.MimeType());

describe("MimeType : jpg", function(){
    it("should return the jpg URL as is", function(){
        var result;
        imageresolver.resolve(
            "http://upload.wikimedia.org/wikipedia/commons/3/3f/JPEG_example_flower.jpg",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://upload.wikimedia.org/wikipedia/commons/3/3f/JPEG_example_flower.jpg");
        });
    });
});

describe("MimeType : png", function(){
    it("should return the png URL as is", function(){
        var result;
        imageresolver.resolve(
            "http://www.libpng.org/pub/png/PngSuite/basn6a16.png",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://www.libpng.org/pub/png/PngSuite/basn6a16.png");
        });
    });
});

describe("MimeType : gif", function(){
    it("should return the gif URL as is", function(){
        var result;
        imageresolver.resolve(
            "http://upload.wikimedia.org/wikipedia/commons/b/bf/Duvor.gif",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://upload.wikimedia.org/wikipedia/commons/b/bf/Duvor.gif");
        });
    });
});

describe("MimeType : svg", function(){
    it("should return the svg URL as is", function(){
        var result;
        imageresolver.resolve(
            "http://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg");
        });
    });
});