//v0.4
var lighttool;
(function (lighttool) {
    var texutreMgrItem = (function () {
        function texutreMgrItem() {
        }
        return texutreMgrItem;
    }());
    lighttool.texutreMgrItem = texutreMgrItem;
    var textureMgr = (function () {
        function textureMgr() {
            this.mapInfo = {};
        }
        textureMgr.Instance = function () {
            if (textureMgr.g_this == null)
                textureMgr.g_this = new textureMgr(); //ness
            return textureMgr.g_this;
        };
        textureMgr.prototype.reg = function (url, urladd, format, mipmap, linear) {
            //重复注册处理
            var item = this.mapInfo[url];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new texutreMgrItem(); //ness
            this.mapInfo[url] = item;
            item.url = url;
            item.urladd = urladd;
            item.format = format;
            item.mipmap = mipmap;
            item.linear = linear;
        };
        textureMgr.prototype.regDirect = function (url, tex) {
            var item = this.mapInfo[url];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new texutreMgrItem(); //ness
            this.mapInfo[url] = item;
            item.url = url;
            item.tex = tex;
        };
        textureMgr.prototype.unreg = function (url) {
            var item = this.mapInfo[url];
            if (item == undefined)
                return;
            this.unload(url);
            this.mapInfo[url] = undefined;
        };
        textureMgr.prototype.unload = function (url) {
            var item = this.mapInfo[url];
            if (item == undefined)
                return;
            item.tex.dispose();
            item.tex = null;
        };
        textureMgr.prototype.load = function (webgl, url) {
            var item = this.mapInfo[url];
            if (item == undefined)
                return null;
            if (item.tex == null) {
                item.tex = new lighttool.spriteTexture(webgl, item.url + item.urladd, item.format, item.mipmap, item.linear); //ness
            }
            return item.tex;
        };
        return textureMgr;
    }());
    lighttool.textureMgr = textureMgr;
    var atlasMgrItem = (function () {
        function atlasMgrItem() {
        }
        return atlasMgrItem;
    }());
    lighttool.atlasMgrItem = atlasMgrItem;
    var atlasMgr = (function () {
        function atlasMgr() {
            this.mapInfo = {};
        }
        atlasMgr.Instance = function () {
            if (atlasMgr.g_this == null)
                atlasMgr.g_this = new atlasMgr(); //ness
            return atlasMgr.g_this;
        };
        atlasMgr.prototype.reg = function (name, urlatlas, urlatalstex, urlatalstex_add) {
            //重复注册处理
            var item = this.mapInfo[name];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new atlasMgrItem(); //ness
            this.mapInfo[name] = item;
            item.url = urlatlas;
            item.urlatalstex = urlatalstex;
            item.urlatalstex_add = urlatalstex_add;
        };
        atlasMgr.prototype.unreg = function (name, disposetex) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return;
            this.unload(name, disposetex);
            this.mapInfo[name] = undefined;
        };
        atlasMgr.prototype.regDirect = function (name, atlas) {
            var item = this.mapInfo[name];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new atlasMgrItem(); //ness
            this.mapInfo[name] = item;
            item.atals = atlas;
        };
        atlasMgr.prototype.unload = function (name, disposetex) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return;
            if (disposetex) {
                item.atals.texture.dispose();
                item.atals.texture = null;
            }
            item.atals = null;
        };
        atlasMgr.prototype.load = function (webgl, name) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return null;
            if (item.atals == null) {
                var tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                if (tex == undefined) {
                    textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add, lighttool.textureformat.RGBA, false, true);
                    tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                }
                item.atals = new lighttool.spriteAtlas(webgl, item.url, tex); //ness
            }
            return item.atals;
        };
        return atlasMgr;
    }());
    lighttool.atlasMgr = atlasMgr;
    var fontMgrItem = (function () {
        function fontMgrItem() {
        }
        return fontMgrItem;
    }());
    lighttool.fontMgrItem = fontMgrItem;
    var fontMgr = (function () {
        function fontMgr() {
            this.mapInfo = {};
        }
        fontMgr.Instance = function () {
            if (fontMgr.g_this == null)
                fontMgr.g_this = new fontMgr(); //ness
            return fontMgr.g_this;
        };
        fontMgr.prototype.reg = function (name, urlfont, urlatalstex, urlatalstex_add) {
            //重复注册处理
            var item = this.mapInfo[name];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new fontMgrItem(); //ness
            this.mapInfo[name] = item;
            item.url = urlfont;
            item.urlatalstex = urlatalstex;
            item.urlatalstex_add = urlatalstex_add;
        };
        fontMgr.prototype.regDirect = function (name, font) {
            var item = this.mapInfo[name];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new fontMgrItem(); //ness
            this.mapInfo[name] = item;
            item.font = font;
        };
        fontMgr.prototype.unreg = function (name, disposetex) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return;
            this.unload(name, disposetex);
            this.mapInfo[name] = undefined;
        };
        fontMgr.prototype.unload = function (name, disposetex) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return;
            if (disposetex) {
                item.font.texture.dispose();
                item.font.texture = null;
            }
            item.font = null;
        };
        fontMgr.prototype.load = function (webgl, name) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return null;
            if (item.font == null) {
                var tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                if (tex == undefined) {
                    textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add, lighttool.textureformat.GRAY, false, true);
                    tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                }
                item.font = new lighttool.spriteFont(webgl, item.url, tex); //ness
            }
            return item.font;
        };
        return fontMgr;
    }());
    lighttool.fontMgr = fontMgr;
    var shaderMgr = (function () {
        function shaderMgr() {
        }
        shaderMgr.parserInstance = function () {
            if (shaderMgr.g_shaderParser == null)
                shaderMgr.g_shaderParser = new lighttool.shaderParser(); //ness
            return shaderMgr.g_shaderParser;
        };
        return shaderMgr;
    }());
    lighttool.shaderMgr = shaderMgr;
})(lighttool || (lighttool = {}));
//# sourceMappingURL=resmgr.js.map