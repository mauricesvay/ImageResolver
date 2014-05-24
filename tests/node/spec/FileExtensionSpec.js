var ImageResolver = require('../../../src/ImageResolver');
var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.FileExtension());

describe("FileExtension : jpg", function(){
    it("should return the jpg URL as is", function(){
        var result;
        imageresolver.resolve(
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/250px-Sunflower_sky_backdrop.jpg",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/250px-Sunflower_sky_backdrop.jpg");
        });
    });
});

describe("FileExtension : png", function(){
    it("should return the png URL as is", function(){
        var result;
        imageresolver.resolve(
            "http://www.libpng.org/pub/png/img_png/pnglogo-blk-sml1.png",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://www.libpng.org/pub/png/img_png/pnglogo-blk-sml1.png");
        });
    });
});

describe("FileExtension : gif", function(){
    it("should return the gif URL as is", function(){
        var result;
        imageresolver.resolve(
            "http://i.imgur.com/UmpOi.gif",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://i.imgur.com/UmpOi.gif");
        });
    });
});