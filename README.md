ImageResolver.js
================

ImageResolver.js is a library that extracts the main image of a URL while saving resources.
Instead of loading all images of a URL, it will try to guess the main image from the URL or the webpage.
It's like Readability for images.

**Demo** : [http://mauricesvay.github.com/ImageResolver/](http://mauricesvay.github.com/ImageResolver/)

ImageResolver works in browsers and Node.js.

To detect images, ImageResolver comes with built-in plugins:

* FileExtension: use file extension in urls
* ImgurPage: extract image from imgur.com urls
* NineGag: extract image from 9gag.com urls
* Instagram: extract image from instagram.com urls
* MimeType: use MIME type to detect images
* ImgurAlbum: extract image from imgur.com albums
* Flickr: extract image from Flickr urls (requires API key)
* Opengraph: use opengraph meta to extract image
* Webpage: parse HTML to extract image

Of course, you can create your own plugins.

How to install
--------------

In Node.js:

```
npm install image-resolver
```

In a browser:

```
<script src="dist/ImageResolver.js" type="text/javascript"></script>
```

How to use
----------

```
var resolver = new ImageResolver();
resolver.register(new ImageResolver.FileExtension());
resolver.register(new ImageResolver.MimeType());
resolver.register(new ImageResolver.Opengraph());
resolver.register(new ImageResolver.Webpage());

resolver.resolve( "http://example.com/", function( result ){
    if ( result ) {
        console.log( result.image );
    } else {
        console.log( "No image found" );
    }
});
```

API
---

### ImageResolver( [options] )

Create a new instance of ImageResolver

### ImageResolver.register( plugin )

Register the given plugin for resolving images.
You must register at least one plugin.
Plugins are executed in the order of their registration.

### ImageResolver.resolve( url, callback )

Extract main image from given url. Callback will be called with `null` when
no image is found, or an object when the image is found.


How to write your own plugin
----------------------------

To create a plugin, create an object that has `resolve` method.
The `resolve` method must have this signature:

```
function( url, clbk, options, utils ) {
    ...
}
```

* url : url to resolve
* clbk : callback
* options : ImageResolver options
* utils : util functions

When your plugin has found an image, you must call `clbk` with the image as
parameter:

```
clbk( image_url );
```

If your plugin can not find an image, you must call `clbk` with null as
parameter

```
clbk( null );
```

If your plugin needs to make HTTP GET requests, it is recommended to use
`utils.fetch`. This function lets you make GET requests, works in browsers and Node.js,
and the result will be cached and shared between plugins.

If you need more control over HTTP requests, you can use `utils.request` that
gives you access to the raw superagent library.

Running tests
-------------

ImageResolver comes with a series of tests.

To run those tests:

* npm install -g jasmine-node
* npm test

Compiling the browser lib
-------------------------

* `npm install`
* `npm install -g gulp`
* `gulp` to build the browser lib