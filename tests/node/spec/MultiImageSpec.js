var ImageResolver = require('../../../src/ImageResolver');

var MultiImagePlugin = function(data) {
    var plugin = {};
    plugin.resolve = function(url, clbk, options, utils) {
        clbk(data);
        return;
    };
    return plugin;
};

describe("MultiImage", function(){
    it("should support image array as resolve result", function(done){
        var imageresolver = new ImageResolver();
        var images = ['a', 'b'];
        imageresolver.register(MultiImagePlugin(images));
        imageresolver.resolve(
            "http://multi-image-url.org",
            function(res){
                expect(res.image).toEqual(images[0]);
                expect(res.images).toEqual(images.slice(1));
                done();
            }
        );
    });

    it("should resolve to null if image array is []", function(done){
        var imageresolver = new ImageResolver();
        var images = [];
        imageresolver.register(MultiImagePlugin(images));
        imageresolver.resolve(
            "http://multi-image-url.org",
            function(res){
                expect(res).toBe(null);
                done();
            }
        );
    });
});
