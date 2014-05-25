var ImageResolver = require('../../../src/ImageResolver');
var ImgurPage = new ImageResolver.ImgurPage();

describe("Imgur : not a imgur url", function() {
    it("should return null", function(){
        var result;
        ImgurPage.resolve("http://example.com/", function( res ){
            result = res;
        });
        expect(result).toBe(null);
    });
});

describe("Imgur : imgur page", function() {
    it("should return url", function(){
        var result;
        ImgurPage.resolve("http://imgur.com/kGKMw", function( res ){
            result = res;
        });
        expect(result).toBe("http://i.imgur.com/kGKMw.jpg");
    });
});

describe("Imgur : imgur mobile page", function() {
    it("should return url", function(){
        var result;
        ImgurPage.resolve("http://m.imgur.com/kGKMw", function( res ){
            result = res;
        });
        expect(result).toBe("http://i.imgur.com/kGKMw.jpg");
    });
});

describe("Imgur : imgur https page", function() {
    it("should return url", function(){
        var result;
        ImgurPage.resolve("https://imgur.com/kGKMw", function( res ){
            result = res;
        });
        expect(result).toBe("http://i.imgur.com/kGKMw.jpg");
    });
});

describe("Imgur : imgur page in gallery", function() {
    it("should return url", function(){
        var result;
        ImgurPage.resolve("http://imgur.com/gallery/PYdu6W7", function( res ){
            result = res;
        });
        expect(result).toBe("http://i.imgur.com/PYdu6W7.jpg");
    });
});
