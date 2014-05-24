var ImageResolver = require('../../../src/ImageResolver');
var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.NineGag());

describe("NineGag : Pirate Dog", function(){
    it("should return the jpg URL", function(){
        var result;
        imageresolver.resolve(
            "http://9gag.com/gag/4760092",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://d24w6bsrhbeh9d.cloudfront.net/photo/4760092_700b.jpg");
        });
    });
});

describe("NineGag : Subcategory Girl", function(){
    it("should return the jpg URL", function(){
        var result;
        imageresolver.resolve(
            "http://9gag.com/gag/a75mmEb?sc=girl",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://d24w6bsrhbeh9d.cloudfront.net/photo/a75mmEb_700b.jpg");
        });
    });
});

describe("NineGag : Subcategory Comic", function(){
    it("should return the jpg URL", function(){
        var result;
        imageresolver.resolve(
            "http://9gag.com/gag/aeNwN8B?sc=comic",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://d24w6bsrhbeh9d.cloudfront.net/photo/aeNwN8B_700b.jpg");
        });
    });
});