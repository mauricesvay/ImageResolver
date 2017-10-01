var ImageResolver = require('../../../src/ImageResolver');
var imageresolver = new ImageResolver();
imageresolver.register(new ImageResolver.ImgurAlbum({
    client_id: "ENTER_YOUR_CLIENT_ID_HERE"
}));

describe("ImgurAlbum : album", function(){
    it("should return the image URL", function(){
        var result;
        imageresolver.resolve(
            "http://imgur.com/a/HGtG0",
            function(res){
                result = res;
            }
        );
        waitsFor(function(){
            return result;
        }, 10000);
        runs(function(){
            expect(result.image).toBe("https://i.imgur.com/2Lfe9vb.jpg");
        });
    });
});
