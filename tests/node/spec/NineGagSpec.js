var ImageResolver = require('../../../src/ImageResolver');
var NineGag = new ImageResolver.NineGag();

describe("NineGag : not a 9gag url", function() {
    it("should return null", function(){
        var result;
        NineGag.resolve("http://example.com/", function( res ){
            result = res;
        });
        expect(result).toBe(null);
    });
});

describe("NineGag : 9gag url", function() {
    it("should return url", function(){
        var result;
        NineGag.resolve("http://9gag.com/gag/4760092", function( res ){
            result = res;
        });
        expect(result).toBe("http://d24w6bsrhbeh9d.cloudfront.net/photo/4760092_700b.jpg");
    });
});

describe("NineGag : 9gag Girls url", function() {
    it("should return url", function(){
        var result;
        NineGag.resolve("http://9gag.com/gag/a75mmEb?sc=girl", function( res ){
            result = res;
        });
        expect(result).toBe("http://d24w6bsrhbeh9d.cloudfront.net/photo/a75mmEb_700b.jpg");
    });
});

describe("NineGag : 9gag Comics url", function() {
    it("should return url", function(){
        var result;
        NineGag.resolve("http://9gag.com/gag/aeNwN8B?sc=comic", function( res ){
            result = res;
        });
        expect(result).toBe("http://d24w6bsrhbeh9d.cloudfront.net/photo/aeNwN8B_700b.jpg");
    });
});
