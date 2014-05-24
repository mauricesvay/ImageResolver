var ImageResolver = require('../../../src/ImageResolver');
var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.ImgurPage());

describe("Imgur : Page", function(){
    it("should return the jpg URL", function(){
        var result;
        imageresolver.resolve(
            "http://imgur.com/kGKMw",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://i.imgur.com/kGKMw.jpg");
        });
    });
});

describe("Imgur : HTTPS Page", function(){
    it("should return the jpg URL", function(){
        var result;
        imageresolver.resolve(
            "https://imgur.com/kGKMw",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://i.imgur.com/kGKMw.jpg");
        });
    });
});

describe("Imgur : Page in gallery", function(){
    it("should return the jpg URL", function(){
        var result;
        imageresolver.resolve(
            "http://imgur.com/gallery/PYdu6W7",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://i.imgur.com/PYdu6W7.jpg");
        });
    });
});
