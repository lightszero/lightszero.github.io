//v0.6
var lighttool;
(function (lighttool) {
    (function (canvaspointevent) {
        canvaspointevent[canvaspointevent["NONE"] = 0] = "NONE";
        canvaspointevent[canvaspointevent["POINT_DOWN"] = 1] = "POINT_DOWN";
        canvaspointevent[canvaspointevent["POINT_UP"] = 2] = "POINT_UP";
        canvaspointevent[canvaspointevent["POINT_MOVE"] = 3] = "POINT_MOVE";
    })(lighttool.canvaspointevent || (lighttool.canvaspointevent = {}));
    var canvaspointevent = lighttool.canvaspointevent;
    var spriteCanvas = (function () {
        function spriteCanvas(webgl, width, height) {
            this.uvrect = new lighttool.spriteRect();
            this.trect = new lighttool.spriteRect(); //ness
            this.webgl = webgl;
            this.width = width;
            this.height = height;
            this.spriteBatcher = new lighttool.spriteBatcher(webgl, lighttool.shaderMgr.parserInstance()); //ness
        }
        //draw tools
        spriteCanvas.prototype.drawTexture = function (texture, rect, uvrect, color) {
            if (uvrect === void 0) { uvrect = lighttool.spriteRect.one; }
            if (color === void 0) { color = lighttool.spriteColor.white; }
            texture.draw(this.spriteBatcher, uvrect, rect, color);
        };
        spriteCanvas.prototype.drawTextureCustom = function (texture, _mat, rect, uvrect, color, color2) {
            if (uvrect === void 0) { uvrect = lighttool.spriteRect.one; }
            if (color === void 0) { color = lighttool.spriteColor.white; }
            if (color2 === void 0) { color2 = lighttool.spriteColor.white; }
            texture.drawCustom(this.spriteBatcher, _mat, uvrect, rect, color, color2);
        };
        spriteCanvas.prototype.drawSprite = function (atlas, sprite, rect, color) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null)
                return;
            var r = a.sprites[sprite];
            if (r == undefined)
                return;
            if (a.texture == null)
                return;
            a.texture.draw(this.spriteBatcher, r, rect, color);
        };
        spriteCanvas.prototype.drawSpriteCustom = function (atlas, sprite, _mat, rect, color, color2) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            if (color2 === void 0) { color2 = lighttool.spriteColor.white; }
            var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null)
                return;
            var r = a.sprites[sprite];
            if (r == undefined)
                return;
            if (a.texture == null)
                return;
            a.texture.drawCustom(this.spriteBatcher, _mat, r, rect, color, color2);
        };
        spriteCanvas.prototype.drawSprite9 = function (atlas, sprite, rect, border, color) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null)
                return;
            var _r = a.sprites[sprite];
            if (_r == undefined)
                return;
            var l = (border.l - 1) / a.texturewidth;
            var r = (border.r - 1) / a.texturewidth;
            var t = (border.t - 1) / a.textureheight;
            var b = (border.b - 1) / a.textureheight;
            //left top
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y;
            this.uvrect.w = l;
            this.uvrect.h = t;
            this.trect.x = rect.x;
            this.trect.y = rect.y;
            this.trect.w = border.l;
            this.trect.h = border.t;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //top
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = t;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.t;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //right top
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y;
            this.uvrect.w = r;
            this.uvrect.h = t;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y;
            this.trect.w = border.r;
            this.trect.h = border.t;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //left
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = l;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //center
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + border.t;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //right
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = r;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.r;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //left bottom
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = l;
            this.uvrect.h = b;
            this.trect.x = rect.x;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.l;
            this.trect.h = border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //bottom
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = b;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //right bottom
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = r;
            this.uvrect.h = b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.r;
            this.trect.h = border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
        };
        spriteCanvas.prototype.drawSprite9Custom = function (atlas, sprite, _mat, rect, border, color, color2) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            if (color2 === void 0) { color2 = lighttool.spriteColor.white; }
            var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null)
                return;
            var _r = a.sprites[sprite];
            if (_r == undefined)
                return;
            var l = (border.l - 1) / a.texturewidth;
            var r = (border.r - 1) / a.texturewidth;
            var t = (border.t - 1) / a.textureheight;
            var b = (border.b - 1) / a.textureheight;
            //left top
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y;
            this.uvrect.w = l;
            this.uvrect.h = t;
            this.trect.x = rect.x;
            this.trect.y = rect.y;
            this.trect.w = border.l;
            this.trect.h = border.t;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //top
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = t;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.t;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //right top
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y;
            this.uvrect.w = r;
            this.uvrect.h = t;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y;
            this.trect.w = border.r;
            this.trect.h = border.t;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //left
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = l;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //center
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + border.t;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //right
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = r;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.r;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //left bottom
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = l;
            this.uvrect.h = b;
            this.trect.x = rect.x;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.l;
            this.trect.h = border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //bottom
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = b;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //right bottom
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = r;
            this.uvrect.h = b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.r;
            this.trect.h = border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
        };
        //绘制字体，只画一行，字体沿着左上角对齐，如需其他，参考源码自制
        spriteCanvas.prototype.drawText = function (font, text, rect, color, color2) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            if (color2 === void 0) { color2 = lighttool.spriteColor.black; }
            var f = lighttool.fontMgr.Instance().load(this.webgl, font);
            if (f == null)
                return;
            if (f.cmap == undefined)
                return;
            var xadd = 0;
            for (var i = 0; i < text.length; i++) {
                var c = text.charAt(i);
                var cinfo = f.cmap[c];
                if (cinfo == undefined) {
                    continue;
                }
                var s = rect.h / f.lineHeight;
                this.trect.x = rect.x + xadd + cinfo.xOffset * s; //xadd 横移，cinfo.xOffset * s 偏移
                this.trect.y = rect.y - cinfo.yOffset * s + f.baseline * s;
                //cinfo.yOffset * s 偏移
                //f.baseline * s字体基线，不管字体基线字体的零零点在字体左下角，现在需要左上脚，需要其他对齐方式另说
                this.trect.h = s * cinfo.ySize;
                this.trect.w = s * cinfo.xSize;
                xadd += cinfo.xAddvance * s;
                if (xadd >= rect.w)
                    break; //超出绘制限定框，不画了
                f.draw(this.spriteBatcher, cinfo, this.trect, color, color2);
            }
        };
        return spriteCanvas;
    }());
    lighttool.spriteCanvas = spriteCanvas;
})(lighttool || (lighttool = {}));
//# sourceMappingURL=canvas.js.map