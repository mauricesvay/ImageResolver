var ImageResolver = require('../../../src/ImageResolver');
var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.Flickr( '6a4f9b6d16c0eaced089c91a2e7e87ad' ));

describe("Flickr : Sunflowers", function(){
    it("should return the image URL", function(){
        var result;
        imageresolver.resolve(
            "http://www.flickr.com/photos/48202796@N05/7543031692/",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("https://farm9.staticflickr.com/8431/7543031692_494bed13d4_b.jpg");
        });
    });
});

describe("Flickr : Tulips in Explore", function(){
    it("should return the image URL", function(){
        var result;
        imageresolver.resolve(
            "https://www.flickr.com/photos/simon_xu/14248906772/in/explore-2014-05-23",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("https://farm3.staticflickr.com/2906/14248906772_8cc69441ee_b.jpg");
        });
    });
});
