var ImageResolver = require('../../../src/ImageResolver');
var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.Opengraph());

describe("OpenGraph : IMDB", function(){
    it("should return the image URL", function(){
        var result;
        imageresolver.resolve(
            "http://www.imdb.com/title/tt2294629/",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("http://ia.media-imdb.com/images/M/MV5BMTQ1MjQwMTE5OF5BMl5BanBnXkFtZTgwNjk3MTcyMDE@._V1_SY1200_CR90,0,630,1200_AL_.jpg");
        });
    });
});
