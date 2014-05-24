var ImageResolver = require('../../../src/ImageResolver');
var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.FileExtension());

describe("FileExtensionResolver : jpg", function(){
    beforeEach(function(){
        function resolveJpgUrl() {
            imageresolver.resolve(
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/250px-Sunflower_sky_backdrop.jpg",
                function(res){
                    result = res;
                }
            );
        }

        runs(resolveJpgUrl);

        waitsFor(function(){
          return result;
        });
    });

    it("should return the jpg URL as is", function(){
        expect(result.image).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/250px-Sunflower_sky_backdrop.jpg");
    });
    it("should not return another URL", function(){
        expect(result.image).not.toBe("http://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Sunflowers.jpg/800px-Sunflowers.jpg");
    });
});

describe("FileExtensionResolver : png", function(){
    beforeEach(function(){
        function resolveJpgUrl() {
            imageresolver.resolve(
                "http://www.libpng.org/pub/png/img_png/pnglogo-blk-sml1.png",
                function(result){
                    image = result;
                }
            );
        }

        runs(resolveJpgUrl);

        waitsFor(function(){
          return image;
        });
    });

    it("should return the png URL as is", function(){
        expect(image.image).toBe("http://www.libpng.org/pub/png/img_png/pnglogo-blk-sml1.png");
    });
    it("should not return another URL", function(){
        expect(image.image).not.toBe("http://phil.ipal.org/tc217.gif");
    });
});

describe("FileExtensionResolver : gif", function(){
    beforeEach(function(){
        function resolveJpgUrl() {
            imageresolver.resolve(
                "http://i.imgur.com/UmpOi.gif",
                function(result){
                    image = result;
                }
            );
        }

        runs(resolveJpgUrl);

        waitsFor(function(){
          return image;
        });
    });

    it("should return the gif URL as is", function(){
        expect(image.image).toBe("http://i.imgur.com/UmpOi.gif");
    });
    it("should not return another URL", function(){
        expect(image.image).not.toBe("http://i.imgur.com/t8zvc.gif");
    });
});