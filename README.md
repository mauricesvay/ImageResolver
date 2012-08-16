ImageResolver.js
================

ImageResolver.js does its best to determine the main image on a URL **without
loading all images**.

**Demo** : [http://mauricesvay.github.com/ImageResolver/](http://mauricesvay.github.com/ImageResolver/)

Works without any extra request with:

* image URLs
* imgur.com photo pages
* 9gag
* Instagram

Works with an additional request:

* imgur.com album pages
* flickr.com photo pages (requires an API key)
* any other webpage with Opengraph tags (requires a proxy)
* any other webpage by looking at `<img>` tags (requires a proxy)

ImageResolvers.js compatibility can be extended to more sites by writing plugins.

Usage
-----
The API might break in the future.

    <script src="ImageResolver.js" type="text/javascript"></script>
    <script>
    ImageResolver.register(new FileExtensionResolver());
    ImageResolver.register(new ImgurPageResolver());
    ImageResolver.register(new NineGagResolver());
    ImageResolver.register(new InstagramResolver());
    ImageResolver.resolve(url, callback);
    </script>


Dependencies
------------
I'm working to reduce dependencies, but for now you need:

* jQuery
* URI.js

License
-------

This app is under the BSD license:

    Copyright (c) 2012, Maurice Svay All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer. Redistributions in binary
    form must reproduce the above copyright notice, this list of conditions and
    the following disclaimer in the documentation and/or other materials
    provided with the distribution. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT
    HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
    INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
    FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
    COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
    INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
    LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
    OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
    LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
    EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
