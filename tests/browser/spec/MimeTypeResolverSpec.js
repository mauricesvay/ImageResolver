describe("MimeTypeResolver", function(){

    $.ajaxPrefilter('text', function(options) {
        options.url = "http://www.inertie.org/ba-simple-proxy.php?mode=native&url=" + encodeURIComponent(options.url);
    });

    ImageResolver.register(new MimeTypeResolver());
    var image;

    describe("MimeTypeResolver : image/jpeg", function(){
        beforeEach(function(){
            function resolveJpgUrl() {
                ImageResolver.resolve(
                    "https://pbs.twimg.com/media/BWJwPkqCcAAn67x.jpg:large",
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

        it("should return the jpg URL as is", function(){
            expect(image).toBe("https://pbs.twimg.com/media/BWJwPkqCcAAn67x.jpg:large");
        });
    });
});