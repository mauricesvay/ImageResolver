var ImageResolver = require('../../../src/ImageResolver');
var Instagram = new ImageResolver.Instagram();

describe("Instagram : not an image url", function() {
    it("should return null", function(){
        var result;
        Instagram.resolve("http://example.com/", function( res ){
            result = res;
        });
        expect(result).toBe(null);
    });
});

describe("Instagram : normal url", function() {
    it("should return url", function(){
        var result;
        Instagram.resolve("http://instagram.com/p/dAu7UPgvn0/", function( res ){
            result = res;
        });
        expect(result).toBe("http://instagram.com/p/dAu7UPgvn0/media/?size=l");
    });
});

describe("Instagram : https url", function() {
    it("should return url", function(){
        var result;
        Instagram.resolve("https://instagram.com/p/dAu7UPgvn0/", function( res ){
            result = res;
        });
        expect(result).toBe("http://instagram.com/p/dAu7UPgvn0/media/?size=l");
    });
});

describe("Instagram : short url", function() {
    it("should return url", function(){
        var result;
        Instagram.resolve("http://instagr.am/p/dAu7UPgvn0/", function( res ){
            result = res;
        });
        expect(result).toBe("http://instagram.com/p/dAu7UPgvn0/media/?size=l");
    });
});