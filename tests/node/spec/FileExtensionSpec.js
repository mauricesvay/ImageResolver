var ImageResolver = require('../../../src/ImageResolver');
var FileExtension = new ImageResolver.FileExtension();

describe("FileExtension : not an image url", function() {
    it("should return null", function(){
        var result;
        FileExtension.resolve("http://example.com/", function( res ){
            result = res;
        });
        expect(result).toBe(null);
    });
});

describe("FileExtension : jpg url", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("http://example.com/test.jpg", function( res ){
            result = res;
        });
        expect(result).toBe("http://example.com/test.jpg");
    });
});

describe("FileExtension : jpg url with uppercase extension", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("http://example.com/test.JPG", function( res ){
            result = res;
        });
        expect(result).toBe("http://example.com/test.JPG");
    });
});


describe("FileExtension : jpeg url", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("http://example.com/test.jpeg", function( res ){
            result = res;
        });
        expect(result).toBe("http://example.com/test.jpeg");
    });
});

describe("FileExtension : jpg url with fragment", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("http://example.com/test.jpg#fragment", function( res ){
            result = res;
        });
        expect(result).toBe("http://example.com/test.jpg#fragment");
    });
});

describe("FileExtension : jpg url with querystring", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("http://example.com/test.jpg?query=string", function( res ){
            result = res;
        });
        expect(result).toBe("http://example.com/test.jpg?query=string");
    });
});

describe("FileExtension : https jpg url", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("https://example.com/test.jpg", function( res ){
            result = res;
        });
        expect(result).toBe("https://example.com/test.jpg");
    });
});

describe("FileExtension : no protocol scheme jpg url", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("//example.com/test.jpg", function( res ){
            result = res;
        });
        expect(result).toBe("//example.com/test.jpg");
    });
});

describe("FileExtension : png url", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("http://example.com/test.png", function( res ){
            result = res;
        });
        expect(result).toBe("http://example.com/test.png");
    });
});

describe("FileExtension : gif url", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("http://example.com/test.gif", function( res ){
            result = res;
        });
        expect(result).toBe("http://example.com/test.gif");
    });
});

describe("FileExtension : bmp url", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("http://example.com/test.bmp", function( res ){
            result = res;
        });
        expect(result).toBe("http://example.com/test.bmp");
    });
});

describe("FileExtension : svg url", function() {
    it("should return url", function(){
        var result;
        FileExtension.resolve("http://example.com/test.svg", function( res ){
            result = res;
        });
        expect(result).toBe("http://example.com/test.svg");
    });
});

describe("FileExtension : mp3 url", function() {
    it("should return null", function(){
        var result;
        FileExtension.resolve("http://example.com/test.mp3", function( res ){
            result = res;
        });
        expect(result).toBe(null);
    });
});
