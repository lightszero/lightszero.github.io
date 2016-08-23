var light3d;
(function (light3d) {
    (function (textureformat) {
        textureformat[textureformat["RGBA"] = 1] = "RGBA";
        textureformat[textureformat["RGB"] = 2] = "RGB";
        textureformat[textureformat["GRAY"] = 3] = "GRAY";
    })(light3d.textureformat || (light3d.textureformat = {}));
    var textureformat = light3d.textureformat;
    var texReader = (function () {
        function texReader(webgl, texRGBA, width, height, gray) {
            if (gray === void 0) { gray = true; }
            this.gray = gray;
            this.width = width;
            this.height = height;
            var fbo = webgl.createFramebuffer();
            var fbold = webgl.getParameter(webgl.FRAMEBUFFER_BINDING);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo);
            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, texRGBA, 0);
            var readData = new Uint8Array(this.width * this.height * 4);
            readData[0] = 2;
            webgl.readPixels(0, 0, this.width, this.height, webgl.RGBA, webgl.UNSIGNED_BYTE, readData);
            webgl.deleteFramebuffer(fbo);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbold);
            if (gray) {
                this.data = new Uint8Array(this.width * this.height);
                for (var i = 0; i < width * height; i++) {
                    this.data[i] = readData[i * 4];
                }
            }
            else {
                this.data = readData;
            }
        }
        texReader.prototype.getPixel = function (u, v) {
            var x = (u * this.width) | 0;
            var y = (v * this.height) | 0;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                return 0;
            if (this.gray) {
                return this.data[y * this.width + x];
            }
            else {
                var i = (y * this.width + x) * 4;
                return new TSM.vec4(this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]);
            }
        };
        return texReader;
    }());
    light3d.texReader = texReader;
    var texture = (function () {
        function texture(webgl, url, format, mipmap, linear) {
            var _this = this;
            if (url === void 0) { url = null; }
            if (format === void 0) { format = textureformat.RGBA; }
            if (mipmap === void 0) { mipmap = false; }
            if (linear === void 0) { linear = true; }
            this.img = null;
            this.loaded = false;
            this.width = 0;
            this.height = 0;
            this.disposeit = false;
            this.webgl = webgl;
            this.format = format;
            if (url == null)
                return;
            this.texture = webgl.createTexture();
            this.img = new Image(); // HTMLImageElement(); //ness
            this.img.src = url;
            this.img.onload = function () {
                if (_this.disposeit) {
                    _this.img = null;
                    return;
                }
                _this._loadimg(mipmap, linear);
            };
        }
        texture.prototype._loadimg = function (mipmap, linear) {
            this.width = this.img.width;
            this.height = this.img.height;
            this.loaded = true;
            this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            this.webgl.pixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 0);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
            var formatGL = this.webgl.RGBA;
            if (this.format == textureformat.RGB)
                formatGL = this.webgl.RGB;
            else if (this.format == textureformat.GRAY)
                formatGL = this.webgl.LUMINANCE;
            this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, formatGL, formatGL, 
            //最后这个type，可以管格式
            this.webgl.UNSIGNED_BYTE, this.img);
            if (mipmap) {
                //生成mipmap
                this.webgl.generateMipmap(this.webgl.TEXTURE_2D);
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);
                }
            }
            else {
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);
                }
            }
            this.img = null;
        };
        texture.prototype._loadimgRaw = function (mipmap, linear, width, height, data) {
            this.width = width;
            this.height = height;
            this.loaded = true;
            this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            this.webgl.pixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 0);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
            var formatGL = this.webgl.RGBA;
            if (this.format == textureformat.RGB)
                formatGL = this.webgl.RGB;
            else if (this.format == textureformat.GRAY)
                formatGL = this.webgl.LUMINANCE;
            this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, formatGL, width, height, 0, formatGL, 
            //最后这个type，可以管格式
            this.webgl.UNSIGNED_BYTE, data);
            if (mipmap) {
                //生成mipmap
                this.webgl.generateMipmap(this.webgl.TEXTURE_2D);
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);
                }
            }
            else {
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);
                }
            }
            this.img = null;
        };
        texture.fromRaw = function (webgl, img, format, mipmap, linear) {
            if (format === void 0) { format = textureformat.RGBA; }
            if (mipmap === void 0) { mipmap = false; }
            if (linear === void 0) { linear = true; }
            var st = new texture(webgl, null, format, mipmap, linear);
            st.texture = webgl.createTexture();
            st.img = img;
            st._loadimg(mipmap, linear);
            return st;
        };
        texture.prototype.getReader = function (redOnly) {
            if (this.reader != null) {
                if (this.reader.gray != redOnly)
                    throw new Error("get param diff with this.reader");
                return this.reader;
            }
            if (this.format != textureformat.RGBA)
                throw new Error("only rgba texture can read");
            if (this.texture == null)
                return null;
            if (this.reader == null)
                this.reader = new texReader(this.webgl, this.texture, this.width, this.height, redOnly);
            return this.reader;
        };
        texture.prototype.dispose = function () {
            if (this.texture == null && this.img != null)
                this.disposeit = true;
            if (this.texture != null) {
                this.webgl.deleteTexture(this.texture);
            }
        };
        texture.staticTexture = function (webgl, name) {
            var t = texture.mapTexture[name];
            if (t != undefined)
                return t;
            var mipmap = false;
            var linear = true;
            t = new texture(webgl, null, textureformat.RGBA, mipmap, linear);
            t.texture = webgl.createTexture();
            var data = new Uint8Array(4);
            var width = 1;
            var height = 1;
            data[0] = 128;
            data[1] = 0;
            data[2] = 128;
            data[3] = 255;
            if (name == "gray") {
                data[0] = 128;
                data[1] = 128;
                data[2] = 128;
                data[3] = 255;
            }
            else if (name == "grid") {
                width = 256;
                height = 256;
                data = new Uint8Array(width * width * 4);
                for (var y = 0; y < height; y++) {
                    for (var x = 0; x < width; x++) {
                        var seek = (y * width + x) * 4;
                        if (((x - width * 0.5) * (y - height * 0.5)) > 0) {
                            data[seek] = 0;
                            data[seek + 1] = 0;
                            data[seek + 2] = 0;
                            data[seek + 3] = 255;
                        }
                        else {
                            data[seek] = 255;
                            data[seek + 1] = 255;
                            data[seek + 2] = 255;
                            data[seek + 3] = 255;
                        }
                    }
                }
            }
            t._loadimgRaw(mipmap, linear, width, height, data);
            texture.mapTexture[name] = t;
            return t;
        };
        texture.mapTexture = {};
        return texture;
    }());
    light3d.texture = texture;
})(light3d || (light3d = {}));
//# sourceMappingURL=texture.js.map