window.onload = function () {
    var loading = document.getElementById('loading');
    loading.hidden = false;
    var canvas = document.getElementById('rendercanvas');
    canvas.hidden = true;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", function (e) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    //2D和3D的系统是分离的
    lighttool.JSLoader.instance().addImportScript("lighttool/2d/spritebatcher.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/2d/resmgr.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/2d/canvas.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/math.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/resource/texture.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/resource/shader.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/render/scene.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/render/mesh.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/framework/framework.js");
    lighttool.JSLoader.instance().addImportScript("state_first.js");
    lighttool.JSLoader.instance().preload(function () {
        loading.hidden = true;
        canvas.hidden = false;
        var firstState = new state_First();
        var app = new light3d.appRender(canvas, firstState);
        app.Run();
    });
    //var binit: boolean = electron.API.Init();
    //if (!binit) return;
    //electron.API.File_WriteText("d:\\electronwrite.txt", "Aasdfasdf", (err) =>
    //{
    //    if (err == null)
    //    {
    //        console.log("writefile ok.");
    //    }
    //    else
    //    {
    //        console.log("writefile error:" + err);
    //    }
    //}
    //);
    //var b: ArrayBuffer = new ArrayBuffer(16);
    //electron.API.File_WriteBinary("d:\\e1.bin", b, (err) =>
    //{
    //    if (err == null)
    //    {
    //        console.log("write b file ok.");
    //    }
    //    else
    //    {
    //        console.log("write b file error:" + err);
    //    }
    //}
    //);
    //electron.API.File_ReadText("d:\\electronwrite.txt", (err, data) =>
    //{
    //    console.log("read:" + data);
    //});
    //electron.API.File_ReadBinary("d:\\e1.bin", (err, data) =>
    //{
    //    console.log("read b:" + data + "," + data.length);
    //});
    ////electron.Dialog.showSave("hello world.", "jpeg", ["jpg", "jpeg"], (dat, err) =>
    ////{
    ////    console.log("dg:" + dat + "|" + err);
    ////}
    ////);
    //electron.API.Ipc_SetInfo("a", "asdfasdfasdfdsf");
    //var v = electron.API.Ipc_GetInfo("a");
    //electron.API.Ipc_OpenWin("ccd", "index2.html");
    //electron.API.showMessageBox(electron.MessageBoxType.Warning, "h1", v, ["ok", "yes", "no"], (err) =>
    //{
    //    console.log("dg:" + err);
    //});
    //setInterval(() =>
    //{
    //    var s = electron.API.Ipc_SendToAllwin("tryevent", "hahaha");
    //    console.log(s);
    //}, 100);
    //window.onbeforeunload = (e: BeforeUnloadEvent) =>
    //{
    //    if (confirm("really quit the main win？"))
    //    {
    //    }
    //    else
    //    {
    //        e.returnValue = false;
    //    }
    //}
};
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
var light3d;
(function (light3d) {
    var hud = (function () {
        function hud(app) {
            this.app = app;
        }
        hud.prototype.onresize = function (c) {
        };
        hud.prototype.ondraw = function (c) {
            if (this.app.curState == null)
                return;
            this.app.curState.onhud(c);
        };
        hud.prototype.onpointevent = function (c, e, x, y) {
            if (this.app.curState == null)
                return;
            return this.app.curState.onpointevent(c, e, x, y);
        };
        return hud;
    }());
    light3d.hud = hud;
    var appRender = (function () {
        function appRender(canvas, state) {
            this.curState = null;
            this.pipeline = null;
            this.lasttime = Date.now();
            this.timer = 0;
            this.framecount = 0;
            this.fps = 0;
            this.canvas = canvas;
            this.curState = state;
        }
        appRender.prototype._onresize = function () {
            if (this.curState != null) {
                this.curState.onresize(this);
            }
        };
        appRender.prototype._onupdate = function () {
            if (this.curState != null) {
                var now = Date.now();
                var delta = (now - this.lasttime) / 1000.0; //用秒为delta的时间单位
                this.framecount++;
                this.timer += delta;
                if (this.timer > 1.0) {
                    this.fps = this.framecount / this.timer;
                    this.timer = 0;
                    this.framecount = 0;
                }
                this.curState.onupdate(this, delta);
                this.lasttime = now;
            }
        };
        appRender.prototype.changeState = function (state) {
            if (this.curState != null)
                this.curState.onexit(this);
            this.curState = state;
            if (this.curState != null)
                this.curState.oninit(this);
        };
        appRender.prototype._init = function () {
            this.webgl = this.canvas.getContext('webgl') ||
                this.canvas.getContext("experimental-webgl");
            this.pipeline = new renderPipeLine(this.webgl);
            //renderpath
            this.pipeline.renderStep.push(new renderStep_Scene("scene0", null, "cam0"));
            this.pipeline.renderStep.push(new renderStep_Canvas(this.pipeline.webgl, new hud(this)));
            //rendercam
            this.pipeline.cameras["cam0"] = new light3d.renderCamera();
            this.pipeline.scenes["scene0"] = new light3d.renderScene();
        };
        appRender.prototype.Run = function () {
            var _this = this;
            this._init();
            setInterval(function () {
                _this._onupdate();
                _this.pipeline.render();
            }, 10);
            window.addEventListener("resize", function () {
                var el = _this.canvas;
                el.width = el.clientWidth;
                el.height = el.clientHeight;
                el.width = el.clientWidth;
                el.height = el.clientHeight;
                _this.pipeline.onscreenresize();
                _this._onresize();
            });
            this.lasttime = Date.now();
            //启动状态逻辑
            var cs = this.curState;
            this.curState = null;
            this.changeState(cs);
        };
        return appRender;
    }());
    light3d.appRender = appRender;
    var renderStep_Scene = (function () {
        function renderStep_Scene(scene, target, camera) {
            this.target = null; //渲染目标，null 表示 render onScreen
            this.scene = scene;
            this.target = target;
            this.camera = camera;
        }
        renderStep_Scene.prototype.render = function (line) {
            if (this.target == null) {
                line.webgl.drawingBufferWidth = line.webgl.canvas.width;
                line.webgl.drawingBufferHeight = line.webgl.canvas.height;
                line.webgl.viewport(0, 0, line.webgl.drawingBufferWidth, line.webgl.drawingBufferHeight);
            }
            else {
                var t = line.targets[this.target];
            }
            {
                //这里由clearoption控制
                line.webgl.clearColor(1.0, 0.0, 1.0, 1.0);
                line.webgl.clear(line.webgl.COLOR_BUFFER_BIT | line.webgl.DEPTH_BUFFER_BIT);
            }
            var c = line.cameras[this.camera];
            var s = line.scenes[this.scene];
            s.render(line, c);
        };
        renderStep_Scene.prototype.onresize = function (line) {
        };
        return renderStep_Scene;
    }());
    light3d.renderStep_Scene = renderStep_Scene;
    var renderStep_Canvas = (function () {
        function renderStep_Canvas(webgl, userAction) {
            var _this = this;
            this.userAction = userAction;
            var el = webgl.canvas;
            el.width = el.clientWidth;
            el.height = el.clientHeight;
            this.canvas = new lighttool.spriteCanvas(webgl, webgl.drawingBufferWidth, webgl.drawingBufferHeight);
            this.canvas.spriteBatcher.matrix = new Float32Array([
                1.0 * 2 / this.canvas.width, 0, 0, 0,
                0, 1 * -1 * 2 / this.canvas.height, 0, 0,
                0, 0, 1, 0,
                -1, 1, 0, 1
            ]);
            this.canvas.spriteBatcher.ztest = false; //最前不需要ztest
            var c = this.canvas;
            el.onmousemove = function (ev) {
                _this.userAction.onpointevent(c, lighttool.canvaspointevent.POINT_MOVE, ev.offsetX, ev.offsetY);
            };
            el.onmouseup = function (ev) {
                _this.userAction.onpointevent(c, lighttool.canvaspointevent.POINT_UP, ev.offsetX, ev.offsetY);
            };
            el.onmousedown = function (ev) {
                _this.userAction.onpointevent(c, lighttool.canvaspointevent.POINT_DOWN, ev.offsetX, ev.offsetY);
            };
        }
        renderStep_Canvas.prototype.render = function (line) {
            this.canvas.spriteBatcher.begindraw();
            this.userAction.ondraw(this.canvas);
            this.canvas.spriteBatcher.enddraw();
        };
        renderStep_Canvas.prototype.onresize = function (line) {
            var rc = this.canvas.webgl.canvas;
            this.canvas.width = rc.width;
            this.canvas.height = rc.height;
            this.canvas.spriteBatcher.matrix = new Float32Array([
                1.0 * 2 / this.canvas.width, 0, 0, 0,
                0, 1 * -1 * 2 / this.canvas.height, 0, 0,
                0, 0, 1, 0,
                -1, 1, 0, 1
            ]);
            ////do resize func
            this.userAction.onresize(this.canvas);
        };
        return renderStep_Canvas;
    }());
    light3d.renderStep_Canvas = renderStep_Canvas;
    //画法管理器
    var renderPipeLine = (function () {
        function renderPipeLine(webgl) {
            this.renderStep = [];
            this.shaderParser = new light3d.shaderParser();
            this.scenes = {};
            this.targets = {};
            this.cameras = {};
            this.webgl = webgl;
        }
        renderPipeLine.prototype.parseShaderUrl = function (url) {
            this.shaderParser.parseUrl(this.webgl, url);
        };
        renderPipeLine.prototype.render = function () {
            //管线上有多个绘制场景，分别往不同的地方绘制
            for (var i = 0; i < this.renderStep.length; i++) {
                this.renderStep[i].render(this);
            }
            //但最终，一定要有一个往屏幕上画的过程
            this.webgl.flush();
        };
        renderPipeLine.prototype.onscreenresize = function () {
            for (var i = 0; i < this.renderStep.length; i++) {
                this.renderStep[i].onresize(this);
            }
        };
        return renderPipeLine;
    }());
    light3d.renderPipeLine = renderPipeLine;
})(light3d || (light3d = {}));
var lighttool;
(function (lighttool) {
    var JSLoader = (function () {
        function JSLoader() {
            this.importList = [];
        }
        JSLoader.instance = function () {
            if (!JSLoader._instance) {
                JSLoader._instance = new JSLoader();
            }
            return JSLoader._instance;
        };
        JSLoader.getXHR = function () {
            var xhr = null;
            if (window["XMLHttpRequest"]) {
                xhr = new window["XMLHttpRequest"]();
            }
            else {
                xhr = new ActiveXObject("MSXML2.XMLHTTP");
            }
            return xhr;
        };
        JSLoader.prototype.preload = function (complete) {
            var _this = this;
            this._complete = complete;
            requestAnimationFrame(function () {
                if (_this.importList.length > 0) {
                    _this.startLoadScript(null);
                }
                else {
                    _this.onAllLoadComplete();
                }
            });
        };
        JSLoader.prototype.addImportScript = function (path) {
            this.importList.push(path);
        };
        JSLoader.prototype.onAllLoadComplete = function () {
            if (this._complete) {
                this._complete();
            }
        };
        JSLoader.prototype.startLoadScript = function (e) {
            var _this = this;
            if (this.importList.length > 0) {
                var egret3DScript = document.createElement("script");
                egret3DScript.src = this.importList.shift();
                egret3DScript.onload = function (e) { return _this.startLoadScript(e); };
                egret3DScript.onerror = function (e) { return _this.loadScriptError(e); };
                document.head.appendChild(egret3DScript);
            }
            else {
                console.log("all complete");
                this.onAllLoadComplete();
            }
        };
        JSLoader.prototype.loadScriptError = function (e) {
            var error = "load Script Error \r\n no file:" + e.srcElement.src;
            alert(error);
            this.startLoadScript(null);
        };
        return JSLoader;
    }());
    lighttool.JSLoader = JSLoader;
})(lighttool || (lighttool = {}));
/**
* @fileoverview TSM - A TypeScript vector and matrix math library
* @author Matthias Ferch
* @version 0.6
*/
/*
 * Copyright (c) 2012 Matthias Ferch
 *
 * Project homepage: https://github.com/matthiasferch/tsm
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */
//以TSM为基础，做了一些接口形式上的统一
var TSM;
(function (TSM) {
    var EPSILON = 0.000001;
    //lights fix
    var vec2 = (function () {
        function vec2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        vec2.prototype.toArray = function (dest, seek) {
            if (seek === void 0) { seek = 0; }
            if (dest == null) {
                dest = new Float32Array(2);
                seek = 0;
            }
            dest[seek + 0] = this.x;
            dest[seek + 1] = this.y;
            return dest;
        };
        vec2.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec2();
            dest.x = this.x;
            dest.y = this.y;
            return dest;
        };
        vec2.prototype.reset = function () {
            this.x = 0;
            this.y = 0;
        };
        vec2.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
        };
        vec2.prototype.length = function () {
            return Math.sqrt(this.squaredLength());
        };
        vec2.prototype.squaredLength = function () {
            var x = this.x, y = this.y;
            return (x * x + y * y);
        };
        vec2.prototype.add = function (vector) {
            this.x += vector.x;
            this.y += vector.y;
        };
        vec2.prototype.subtract = function (vector) {
            this.x -= vector.x;
            this.y -= vector.y;
        };
        vec2.prototype.multiply = function (vector) {
            this.x *= vector.x;
            this.y *= vector.y;
        };
        vec2.prototype.divide = function (vector) {
            this.x /= vector.x;
            this.y /= vector.y;
        };
        vec2.prototype.scale = function (value) {
            this.x *= value;
            this.y *= value;
        };
        vec2.prototype.normalize = function (dest) {
            if (dest === void 0) { dest = null; }
            var length = this.length();
            if (length === 1) {
                return;
            }
            if (length === 0) {
                dest.x = 0;
                dest.y = 0;
                return;
            }
            length = 1.0 / length;
            this.x *= length;
            this.y *= length;
        };
        vec2.prototype.multiplyMat2 = function (matrix) {
            matrix.multiplyVec2(this, this);
        };
        vec2.prototype.multiplyMat3 = function (matrix) {
            matrix.multiplyVec2(this, this);
        };
        vec2.sEquals = function (vector, vector2, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            if (Math.abs(vector.x - vector2.x) > threshold)
                return false;
            if (Math.abs(vector.y - vector2.y) > threshold)
                return false;
            return true;
        };
        vec2.sCross = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            var x = vector.x, y = vector.y;
            var x2 = vector2.x, y2 = vector2.y;
            var z = x * y2 - y * x2;
            dest.x = 0;
            dest.y = 0;
            dest.z = z;
            return dest;
        };
        vec2.sDot = function (vector, vector2) {
            return (vector.x * vector2.x + vector.y * vector2.y);
        };
        vec2.sDistance = function (vector, vector2) {
            return Math.sqrt(this.sSquaredDistance(vector, vector2));
        };
        vec2.sSquaredDistance = function (vector, vector2) {
            var x = vector2.x - vector.x, y = vector2.y - vector.y;
            return (x * x + y * y);
        };
        vec2.sDirection = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec2();
            var x = vector.x - vector2.x, y = vector.y - vector2.y;
            var length = Math.sqrt(x * x + y * y);
            if (length === 0) {
                dest.x = 0;
                dest.y = 0;
                return dest;
            }
            length = 1 / length;
            dest.x = x * length;
            dest.y = y * length;
            return dest;
        };
        vec2.sLerp = function (vector, vector2, v, dest) {
            if (dest === void 0) { dest = null; }
            dest.x = vector.x * (1 - v) + vector2.x * v;
            dest.y = vector.y * (1 - v) + vector2.y * v;
            return dest;
        };
        vec2.sAdd = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec2();
            dest.x = vector.x + vector2.x;
            dest.y = vector.y + vector2.y;
            return dest;
        };
        vec2.sSubtract = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec2();
            dest.x = vector.x - vector2.x;
            dest.y = vector.y - vector2.y;
            return dest;
        };
        vec2.sProduct = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec2();
            dest.x = vector.x * vector2.x;
            dest.y = vector.y * vector2.y;
            return dest;
        };
        vec2.sDivide = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec2();
            dest.x = vector.x / vector2.x;
            dest.y = vector.y / vector2.y;
            return dest;
        };
        vec2.zero = new vec2(0, 0);
        return vec2;
    }());
    TSM.vec2 = vec2;
    //lights fix
    var vec3 = (function () {
        function vec3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
            var a = Number.MIN_VALUE;
        }
        //转换类
        vec3.prototype.toArray = function (dest, seek) {
            if (seek === void 0) { seek = 0; }
            if (dest == null) {
                dest = new Float32Array(3);
                seek = 0;
            }
            dest[seek + 0] = this.x;
            dest[seek + 1] = this.y;
            dest[seek + 2] = this.z;
            return dest;
        };
        vec3.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            dest.x = this.x;
            dest.y = this.y;
            dest.z = this.z;
            return dest;
        };
        vec3.prototype.toQuat = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new quat();
            var c = new vec3();
            var s = new vec3();
            c.x = Math.cos(this.x * 0.5);
            s.x = Math.sin(this.x * 0.5);
            c.y = Math.cos(this.y * 0.5);
            s.y = Math.sin(this.y * 0.5);
            c.z = Math.cos(this.z * 0.5);
            s.z = Math.sin(this.z * 0.5);
            dest.x = s.x * c.y * c.z - c.x * s.y * s.z;
            dest.y = c.x * s.y * c.z + s.x * c.y * s.z;
            dest.z = c.x * c.y * s.z - s.x * s.y * c.z;
            dest.w = c.x * c.y * c.z + s.x * s.y * s.z;
            return dest;
        };
        //有返回值的不能有参数
        vec3.prototype.length = function () {
            return Math.sqrt(this.squaredLength());
        };
        vec3.prototype.squaredLength = function () {
            var x = this.x, y = this.y, z = this.z;
            return (x * x + y * y + z * z);
        };
        vec3.prototype.reset = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        };
        vec3.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
        };
        vec3.prototype.normalize = function () {
            var length = this.length();
            if (length === 1) {
                return;
            }
            if (length === 0) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                return;
            }
            length = 1.0 / length;
            this.x *= length;
            this.y *= length;
            this.z *= length;
        };
        //有参数的不能有返回值
        vec3.prototype.add = function (vector) {
            this.x += vector.x;
            this.y += vector.y;
            this.z += vector.z;
        };
        vec3.prototype.subtract = function (vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            this.z -= vector.z;
        };
        vec3.prototype.multiply = function (vector) {
            this.x *= vector.x;
            this.y *= vector.y;
            this.z *= vector.z;
        };
        vec3.prototype.divide = function (vector) {
            this.x /= vector.x;
            this.y /= vector.y;
            this.z /= vector.z;
        };
        vec3.prototype.scale = function (value) {
            this.x *= value;
            this.y *= value;
            this.z *= value;
        };
        vec3.prototype.multiplyByMat3 = function (matrix) {
            matrix.multiplyVec3(this, this);
        };
        vec3.prototype.multiplyByQuat = function (quat) {
            quat.multiplyVec3(this, this);
        };
        //又有参数又有返回值的必须是static
        vec3.sEqual = function (vector, vector2, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            if (Math.abs(vector.x - vector2.x) > threshold)
                return false;
            if (Math.abs(vector.y - vector2.y) > threshold)
                return false;
            if (Math.abs(vector.z - vector2.z) > threshold)
                return false;
            return true;
        };
        vec3.sCross = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            var x = vector.x, y = vector.y, z = vector.z;
            var x2 = vector2.x, y2 = vector2.y, z2 = vector2.z;
            dest.x = y * z2 - z * y2;
            dest.y = z * x2 - x * z2;
            dest.z = x * y2 - y * x2;
            return dest;
        };
        vec3.sDot = function (vector, vector2) {
            var x = vector.x, y = vector.y, z = vector.z;
            var x2 = vector2.x, y2 = vector2.y, z2 = vector2.z;
            return (x * x2 + y * y2 + z * z2);
        };
        vec3.sDistance = function (vector, vector2) {
            var x = vector2.x - vector.x, y = vector2.y - vector.y, z = vector2.z - vector.z;
            return Math.sqrt(vec3.sSquaredDistance(vector, vector2));
        };
        vec3.sSquaredDistance = function (vector, vector2) {
            var x = vector2.x - vector.x, y = vector2.y - vector.y, z = vector2.z - vector.z;
            return (x * x + y * y + z * z);
        };
        vec3.sDirection = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            var x = vector.x - vector2.x, y = vector.y - vector2.y, z = vector.z - vector2.z;
            var length = Math.sqrt(x * x + y * y + z * z);
            if (length === 0) {
                dest.x = 0;
                dest.y = 0;
                dest.z = 0;
                return dest;
            }
            length = 1 / length;
            dest.x = x * length;
            dest.y = y * length;
            dest.z = z * length;
            return dest;
        };
        vec3.sLerp = function (vector, vector2, v, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            dest.x = vector.x * (1 - v) + vector2.x * v;
            dest.y = vector.y * (1 - v) + vector2.y * v;
            dest.z = vector.z * (1 - v) + vector2.z * v;
            return dest;
        };
        vec3.sAdd = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            dest.x = vector.x + vector2.x;
            dest.y = vector.y + vector2.y;
            dest.z = vector.z + vector2.z;
            return dest;
        };
        vec3.sSubtract = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            dest.x = vector.x - vector2.x;
            dest.y = vector.y - vector2.y;
            dest.z = vector.z - vector2.z;
            return dest;
        };
        vec3.sProduct = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            dest.x = vector.x * vector2.x;
            dest.y = vector.y * vector2.y;
            dest.z = vector.z * vector2.z;
            return dest;
        };
        vec3.sDivide = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            dest.x = vector.x / vector2.x;
            dest.y = vector.y / vector2.y;
            dest.z = vector.z / vector2.z;
            return dest;
        };
        vec3.zero = new vec3(0, 0, 0);
        vec3.up = new vec3(0, 1, 0);
        vec3.right = new vec3(1, 0, 0);
        vec3.forward = new vec3(0, 0, 1);
        return vec3;
    }());
    TSM.vec3 = vec3;
    //lights fix
    var vec4 = (function () {
        function vec4(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        vec4.prototype.toArray = function (dest, seek) {
            if (dest === void 0) { dest = null; }
            if (seek === void 0) { seek = 0; }
            if (dest == null) {
                dest = new Float32Array(4);
                seek = 0;
            }
            dest[seek + 0] = this.x;
            dest[seek + 1] = this.y;
            dest[seek + 2] = this.z;
            dest[seek + 3] = this.z;
            return dest;
        };
        vec4.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec4();
            dest.x = this.x;
            dest.y = this.y;
            dest.z = this.z;
            dest.w = this.w;
            return dest;
        };
        vec4.prototype.reset = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
        };
        vec4.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;
        };
        vec4.prototype.length = function () {
            return Math.sqrt(this.squaredLength());
        };
        vec4.prototype.squaredLength = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            return (x * x + y * y + z * z + w * w);
        };
        vec4.prototype.add = function (vector) {
            this.x += vector.x;
            this.y += vector.y;
            this.z += vector.z;
            this.w += vector.w;
        };
        vec4.prototype.subtract = function (vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            this.z -= vector.z;
            this.w -= vector.w;
        };
        vec4.prototype.multiply = function (vector) {
            this.x *= vector.x;
            this.y *= vector.y;
            this.z *= vector.z;
            this.w *= vector.w;
        };
        vec4.prototype.divide = function (vector) {
            this.x /= vector.x;
            this.y /= vector.y;
            this.z /= vector.z;
            this.w /= vector.w;
        };
        vec4.prototype.scale = function (value) {
            this.x *= value;
            this.y *= value;
            this.z *= value;
            this.w *= value;
        };
        vec4.prototype.normalize = function () {
            var length = this.length();
            if (length === 1) {
                return;
            }
            if (length === 0) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;
                return;
            }
            length = 1.0 / length;
            this.x *= length;
            this.y *= length;
            this.z *= length;
            this.w *= length;
        };
        vec4.prototype.multiplyMat4 = function (matrix) {
            matrix.multiplyVec4(this, this);
        };
        vec4.sEquals = function (vector, vector2, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            if (Math.abs(vector.x - vector2.x) > threshold)
                return false;
            if (Math.abs(vector.y - vector2.y) > threshold)
                return false;
            if (Math.abs(vector.z - vector2.z) > threshold)
                return false;
            if (Math.abs(vector.w - vector2.w) > threshold)
                return false;
            return true;
        };
        vec4.sLerp = function (vector, vector2, v, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec4();
            dest.x = vector.x + v * (vector2.x - vector.x);
            dest.y = vector.y + v * (vector2.y - vector.y);
            dest.z = vector.z + v * (vector2.z - vector.z);
            dest.w = vector.w + v * (vector2.w - vector.w);
            return dest;
        };
        vec4.sAdd = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec4();
            dest.x = vector.x + vector2.x,
                dest.y = vector.y + vector2.y,
                dest.z = vector.z + vector2.z,
                dest.w = vector.w + vector2.w;
            return dest;
        };
        vec4.sSubtract = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec4();
            dest.x = vector.x - vector2.x,
                dest.y = vector.y - vector2.y,
                dest.z = vector.z - vector2.z,
                dest.w = vector.w - vector2.w;
            return dest;
        };
        vec4.sProduct = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec4();
            dest.x = vector.x * vector2.x,
                dest.y = vector.y * vector2.y,
                dest.z = vector.z * vector2.z,
                dest.w = vector.w * vector2.w;
            return dest;
        };
        vec4.sDivide = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec4();
            dest.x = vector.x / vector2.x,
                dest.y = vector.y / vector2.y,
                dest.z = vector.z / vector2.z,
                dest.w = vector.w / vector2.w;
            return dest;
        };
        vec4.zero = new vec4(0, 0, 0, 1);
        return vec4;
    }());
    TSM.vec4 = vec4;
    //lights fix
    var mat2 = (function () {
        function mat2(values) {
            if (values === void 0) { values = null; }
            this.values = new Float32Array(4);
            if (values) {
                this.init(values);
            }
        }
        mat2.prototype.at = function (index) {
            return this.values[index];
        };
        mat2.prototype.init = function (values) {
            for (var i = 0; i < 4; i++) {
                this.values[i] = values[i];
            }
        };
        mat2.prototype.reset = function () {
            for (var i = 0; i < 4; i++) {
                this.values[i] = 0;
            }
        };
        mat2.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new mat2();
            for (var i = 0; i < 4; i++) {
                dest.values[i] = this.values[i];
            }
            return dest;
        };
        mat2.prototype.row = function (index) {
            return [
                this.values[index * 2 + 0],
                this.values[index * 2 + 1]
            ];
        };
        mat2.prototype.col = function (index) {
            return [
                this.values[index],
                this.values[index + 2]
            ];
        };
        mat2.prototype.determinant = function () {
            return this.values[0] * this.values[3] - this.values[2] * this.values[1];
        };
        mat2.prototype.setIdentity = function () {
            this.values[0] = 1;
            this.values[1] = 0;
            this.values[2] = 0;
            this.values[3] = 1;
        };
        mat2.prototype.transpose = function () {
            var temp = this.values[1];
            this.values[1] = this.values[2];
            this.values[2] = temp;
        };
        mat2.prototype.inverse = function () {
            var det = this.determinant();
            if (!det)
                return null;
            det = 1.0 / det;
            this.values[0] = det * (this.values[3]);
            this.values[1] = det * (-this.values[1]);
            this.values[2] = det * (-this.values[2]);
            this.values[3] = det * (this.values[0]);
        };
        mat2.prototype.multiply = function (matrix) {
            var a11 = this.values[0], a12 = this.values[1], a21 = this.values[2], a22 = this.values[3];
            this.values[0] = a11 * matrix.at(0) + a12 * matrix.at(2);
            this.values[1] = a11 * matrix.at(1) + a12 * matrix.at(3);
            this.values[2] = a21 * matrix.at(0) + a22 * matrix.at(2);
            this.values[3] = a21 * matrix.at(1) + a22 * matrix.at(3);
        };
        mat2.prototype.rotate = function (angle) {
            var a11 = this.values[0], a12 = this.values[1], a21 = this.values[2], a22 = this.values[3];
            var sin = Math.sin(angle), cos = Math.cos(angle);
            this.values[0] = a11 * cos + a12 * sin;
            this.values[1] = a11 * -sin + a12 * cos;
            this.values[2] = a21 * cos + a22 * sin;
            this.values[3] = a21 * -sin + a22 * cos;
        };
        mat2.prototype.multiplyVec2 = function (vector, result) {
            if (result === void 0) { result = null; }
            var x = vector.x, y = vector.y;
            if (result) {
                result.x = x * this.values[0] + y * this.values[1];
                result.y = x * this.values[2] + y * this.values[3];
                return result;
            }
            else {
                return new vec2(x * this.values[0] + y * this.values[1], x * this.values[2] + y * this.values[3]);
            }
        };
        mat2.prototype.scale = function (vector) {
            var a11 = this.values[0], a12 = this.values[1], a21 = this.values[2], a22 = this.values[3];
            var x = vector.x, y = vector.y;
            this.values[0] = a11 * x;
            this.values[1] = a12 * y;
            this.values[2] = a21 * x;
            this.values[3] = a22 * y;
        };
        mat2.sEquals = function (matrix, matrix2, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            for (var i = 0; i < 4; i++) {
                if (Math.abs(matrix.values[i] - matrix2.at(i)) > threshold)
                    return false;
            }
            return true;
        };
        mat2.sProduct = function (m1, m2, result) {
            if (result === void 0) { result = null; }
            var a11 = m1.at(0), a12 = m1.at(1), a21 = m1.at(2), a22 = m1.at(3);
            if (result) {
                result.init([
                    a11 * m2.at(0) + a12 * m2.at(2),
                    a11 * m2.at(1) + a12 * m2.at(3),
                    a21 * m2.at(0) + a22 * m2.at(2),
                    a21 * m2.at(1) + a22 * m2.at(3)
                ]);
                return result;
            }
            else {
                return new mat2([
                    a11 * m2.at(0) + a12 * m2.at(2),
                    a11 * m2.at(1) + a12 * m2.at(3),
                    a21 * m2.at(0) + a22 * m2.at(2),
                    a21 * m2.at(1) + a22 * m2.at(3)
                ]);
            }
        };
        mat2.identity = new mat2([1, 0, 0, 1]).setIdentity();
        return mat2;
    }());
    TSM.mat2 = mat2;
    //lights fix
    var mat3 = (function () {
        function mat3(values) {
            if (values === void 0) { values = null; }
            this.values = new Float32Array(9);
            if (values) {
                this.init(values);
            }
        }
        mat3.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new mat3();
            for (var i = 0; i < 9; i++) {
                dest.values[i] = this.values[i];
            }
            return dest;
        };
        mat3.prototype.toQuat = function (dest) {
            if (dest === void 0) { dest = null; }
            var m00 = this.values[0], m01 = this.values[1], m02 = this.values[2], m10 = this.values[3], m11 = this.values[4], m12 = this.values[5], m20 = this.values[6], m21 = this.values[7], m22 = this.values[8];
            var fourXSquaredMinus1 = m00 - m11 - m22;
            var fourYSquaredMinus1 = m11 - m00 - m22;
            var fourZSquaredMinus1 = m22 - m00 - m11;
            var fourWSquaredMinus1 = m00 + m11 + m22;
            var biggestIndex = 0;
            var fourBiggestSquaredMinus1 = fourWSquaredMinus1;
            if (fourXSquaredMinus1 > fourBiggestSquaredMinus1) {
                fourBiggestSquaredMinus1 = fourXSquaredMinus1;
                biggestIndex = 1;
            }
            if (fourYSquaredMinus1 > fourBiggestSquaredMinus1) {
                fourBiggestSquaredMinus1 = fourYSquaredMinus1;
                biggestIndex = 2;
            }
            if (fourZSquaredMinus1 > fourBiggestSquaredMinus1) {
                fourBiggestSquaredMinus1 = fourZSquaredMinus1;
                biggestIndex = 3;
            }
            var biggestVal = Math.sqrt(fourBiggestSquaredMinus1 + 1) * 0.5;
            var mult = 0.25 / biggestVal;
            if (dest == null)
                dest = new quat();
            switch (biggestIndex) {
                case 0:
                    dest.w = biggestVal;
                    dest.x = (m12 - m21) * mult;
                    dest.y = (m20 - m02) * mult;
                    dest.z = (m01 - m10) * mult;
                    break;
                case 1:
                    dest.w = (m12 - m21) * mult;
                    dest.x = biggestVal;
                    dest.y = (m01 + m10) * mult;
                    dest.z = (m20 + m02) * mult;
                    break;
                case 2:
                    dest.w = (m20 - m02) * mult;
                    dest.x = (m01 + m10) * mult;
                    dest.y = biggestVal;
                    dest.z = (m12 + m21) * mult;
                    break;
                case 3:
                    dest.w = (m01 - m10) * mult;
                    dest.x = (m20 + m02) * mult;
                    dest.y = (m12 + m21) * mult;
                    dest.z = biggestVal;
                    break;
            }
            return dest;
        };
        mat3.prototype.toMat4 = function (result) {
            if (result === void 0) { result = null; }
            if (result) {
                result.init([
                    this.values[0],
                    this.values[1],
                    this.values[2],
                    0,
                    this.values[3],
                    this.values[4],
                    this.values[5],
                    0,
                    this.values[6],
                    this.values[7],
                    this.values[8],
                    0,
                    0,
                    0,
                    0,
                    1
                ]);
                return result;
            }
            else {
                return new mat4([
                    this.values[0],
                    this.values[1],
                    this.values[2],
                    0,
                    this.values[3],
                    this.values[4],
                    this.values[5],
                    0,
                    this.values[6],
                    this.values[7],
                    this.values[8],
                    0,
                    0,
                    0,
                    0,
                    1
                ]);
            }
        };
        mat3.prototype.at = function (index) {
            return this.values[index];
        };
        mat3.prototype.init = function (values) {
            for (var i = 0; i < 9; i++) {
                this.values[i] = values[i];
            }
        };
        mat3.prototype.reset = function () {
            for (var i = 0; i < 9; i++) {
                this.values[i] = 0;
            }
        };
        mat3.prototype.row = function (index) {
            return [
                this.values[index * 3 + 0],
                this.values[index * 3 + 1],
                this.values[index * 3 + 2]
            ];
        };
        mat3.prototype.col = function (index) {
            return [
                this.values[index],
                this.values[index + 3],
                this.values[index + 6]
            ];
        };
        mat3.prototype.determinant = function () {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a10 = this.values[3], a11 = this.values[4], a12 = this.values[5], a20 = this.values[6], a21 = this.values[7], a22 = this.values[8];
            var det01 = a22 * a11 - a12 * a21, det11 = -a22 * a10 + a12 * a20, det21 = a21 * a10 - a11 * a20;
            return a00 * det01 + a01 * det11 + a02 * det21;
        };
        mat3.prototype.setIdentity = function () {
            this.values[0] = 1;
            this.values[1] = 0;
            this.values[2] = 0;
            this.values[3] = 0;
            this.values[4] = 1;
            this.values[5] = 0;
            this.values[6] = 0;
            this.values[7] = 0;
            this.values[8] = 1;
        };
        mat3.prototype.transpose = function () {
            var temp01 = this.values[1], temp02 = this.values[2], temp12 = this.values[5];
            this.values[1] = this.values[3];
            this.values[2] = this.values[6];
            this.values[3] = temp01;
            this.values[5] = this.values[7];
            this.values[6] = temp02;
            this.values[7] = temp12;
        };
        mat3.prototype.inverse = function () {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a10 = this.values[3], a11 = this.values[4], a12 = this.values[5], a20 = this.values[6], a21 = this.values[7], a22 = this.values[8];
            var det01 = a22 * a11 - a12 * a21, det11 = -a22 * a10 + a12 * a20, det21 = a21 * a10 - a11 * a20;
            var det = a00 * det01 + a01 * det11 + a02 * det21;
            if (!det)
                return null;
            det = 1.0 / det;
            this.values[0] = det01 * det;
            this.values[1] = (-a22 * a01 + a02 * a21) * det;
            this.values[2] = (a12 * a01 - a02 * a11) * det;
            this.values[3] = det11 * det;
            this.values[4] = (a22 * a00 - a02 * a20) * det;
            this.values[5] = (-a12 * a00 + a02 * a10) * det;
            this.values[6] = det21 * det;
            this.values[7] = (-a21 * a00 + a01 * a20) * det;
            this.values[8] = (a11 * a00 - a01 * a10) * det;
        };
        mat3.prototype.multiply = function (matrix) {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a10 = this.values[3], a11 = this.values[4], a12 = this.values[5], a20 = this.values[6], a21 = this.values[7], a22 = this.values[8];
            var b00 = matrix.at(0), b01 = matrix.at(1), b02 = matrix.at(2), b10 = matrix.at(3), b11 = matrix.at(4), b12 = matrix.at(5), b20 = matrix.at(6), b21 = matrix.at(7), b22 = matrix.at(8);
            this.values[0] = b00 * a00 + b01 * a10 + b02 * a20;
            this.values[1] = b00 * a01 + b01 * a11 + b02 * a21;
            this.values[2] = b00 * a02 + b01 * a12 + b02 * a22;
            this.values[3] = b10 * a00 + b11 * a10 + b12 * a20;
            this.values[4] = b10 * a01 + b11 * a11 + b12 * a21;
            this.values[5] = b10 * a02 + b11 * a12 + b12 * a22;
            this.values[6] = b20 * a00 + b21 * a10 + b22 * a20;
            this.values[7] = b20 * a01 + b21 * a11 + b22 * a21;
            this.values[8] = b20 * a02 + b21 * a12 + b22 * a22;
        };
        mat3.prototype.multiplyVec2 = function (vector, result) {
            if (result === void 0) { result = null; }
            var x = vector.x, y = vector.y;
            if (result) {
                result.x = x * this.values[0] + y * this.values[3] + this.values[6];
                result.y = x * this.values[1] + y * this.values[4] + this.values[7];
                return result;
            }
            else {
                return new vec2(x * this.values[0] + y * this.values[3] + this.values[6], x * this.values[1] + y * this.values[4] + this.values[7]);
            }
        };
        mat3.prototype.multiplyVec3 = function (vector, result) {
            if (result === void 0) { result = null; }
            var x = vector.x, y = vector.y, z = vector.z;
            if (result) {
                result.x = x * this.values[0] + y * this.values[3] + z * this.values[6];
                result.y = x * this.values[1] + y * this.values[4] + z * this.values[7];
                result.z = x * this.values[2] + y * this.values[5] + z * this.values[8];
                return result;
            }
            else {
                return new vec3(x * this.values[0] + y * this.values[3] + z * this.values[6], x * this.values[1] + y * this.values[4] + z * this.values[7], x * this.values[2] + y * this.values[5] + z * this.values[8]);
            }
        };
        mat3.prototype.rotate = function (angle, axis) {
            var x = axis.x, y = axis.y, z = axis.z;
            var length = Math.sqrt(x * x + y * y + z * z);
            if (!length)
                return null;
            if (length !== 1) {
                length = 1 / length;
                x *= length;
                y *= length;
                z *= length;
            }
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            var t = 1.0 - c;
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a20 = this.values[8], a21 = this.values[9], a22 = this.values[10];
            var b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s, b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s, b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;
            this.values[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.values[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.values[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.values[3] = a00 * b10 + a10 * b11 + a20 * b12;
            this.values[4] = a01 * b10 + a11 * b11 + a21 * b12;
            this.values[5] = a02 * b10 + a12 * b11 + a22 * b12;
            this.values[6] = a00 * b20 + a10 * b21 + a20 * b22;
            this.values[7] = a01 * b20 + a11 * b21 + a21 * b22;
            this.values[8] = a02 * b20 + a12 * b21 + a22 * b22;
        };
        mat3.sEquals = function (matrix, matrix2, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            for (var i = 0; i < 9; i++) {
                if (Math.abs(matrix.values[i] - matrix2.at(i)) > threshold)
                    return false;
            }
            return true;
        };
        mat3.sProduct = function (m1, m2, result) {
            if (result === void 0) { result = null; }
            var a00 = m1.at(0), a01 = m1.at(1), a02 = m1.at(2), a10 = m1.at(3), a11 = m1.at(4), a12 = m1.at(5), a20 = m1.at(6), a21 = m1.at(7), a22 = m1.at(8);
            var b00 = m2.at(0), b01 = m2.at(1), b02 = m2.at(2), b10 = m2.at(3), b11 = m2.at(4), b12 = m2.at(5), b20 = m2.at(6), b21 = m2.at(7), b22 = m2.at(8);
            if (result) {
                result.init([
                    b00 * a00 + b01 * a10 + b02 * a20,
                    b00 * a01 + b01 * a11 + b02 * a21,
                    b00 * a02 + b01 * a12 + b02 * a22,
                    b10 * a00 + b11 * a10 + b12 * a20,
                    b10 * a01 + b11 * a11 + b12 * a21,
                    b10 * a02 + b11 * a12 + b12 * a22,
                    b20 * a00 + b21 * a10 + b22 * a20,
                    b20 * a01 + b21 * a11 + b22 * a21,
                    b20 * a02 + b21 * a12 + b22 * a22
                ]);
                return result;
            }
            else {
                return new mat3([
                    b00 * a00 + b01 * a10 + b02 * a20,
                    b00 * a01 + b01 * a11 + b02 * a21,
                    b00 * a02 + b01 * a12 + b02 * a22,
                    b10 * a00 + b11 * a10 + b12 * a20,
                    b10 * a01 + b11 * a11 + b12 * a21,
                    b10 * a02 + b11 * a12 + b12 * a22,
                    b20 * a00 + b21 * a10 + b22 * a20,
                    b20 * a01 + b21 * a11 + b22 * a21,
                    b20 * a02 + b21 * a12 + b22 * a22
                ]);
            }
        };
        mat3.identity = new mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        return mat3;
    }());
    TSM.mat3 = mat3;
    //lights fix
    var mat4 = (function () {
        function mat4(values) {
            if (values === void 0) { values = null; }
            this.values = new Float32Array(16);
            if (values) {
                this.init(values);
            }
        }
        mat4.prototype.at = function (index) {
            return this.values[index];
        };
        mat4.prototype.init = function (values) {
            for (var i = 0; i < 16; i++) {
                this.values[i] = values[i];
            }
        };
        mat4.prototype.reset = function () {
            for (var i = 0; i < 16; i++) {
                this.values[i] = 0;
            }
        };
        mat4.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new mat4();
            for (var i = 0; i < 16; i++) {
                dest.values[i] = this.values[i];
            }
            return dest;
        };
        mat4.prototype.toMat3 = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest) {
                return new mat3([
                    this.values[0],
                    this.values[1],
                    this.values[2],
                    this.values[4],
                    this.values[5],
                    this.values[6],
                    this.values[8],
                    this.values[9],
                    this.values[10]
                ]);
            }
            else {
                dest.values[0] = this.values[0];
                dest.values[1] = this.values[1];
                dest.values[2] = this.values[2];
                dest.values[3] = this.values[4];
                dest.values[4] = this.values[5];
                dest.values[5] = this.values[6];
                dest.values[6] = this.values[8];
                dest.values[7] = this.values[9];
                dest.values[8] = this.values[10];
                return dest;
            }
        };
        mat4.prototype.toInverseMat3 = function (dest) {
            if (dest === void 0) { dest = null; }
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a20 = this.values[8], a21 = this.values[9], a22 = this.values[10];
            var det01 = a22 * a11 - a12 * a21, det11 = -a22 * a10 + a12 * a20, det21 = a21 * a10 - a11 * a20;
            var det = a00 * det01 + a01 * det11 + a02 * det21;
            if (!det)
                return null;
            det = 1.0 / det;
            if (!dest) {
                return new mat3([
                    det01 * det,
                    (-a22 * a01 + a02 * a21) * det,
                    (a12 * a01 - a02 * a11) * det,
                    det11 * det,
                    (a22 * a00 - a02 * a20) * det,
                    (-a12 * a00 + a02 * a10) * det,
                    det21 * det,
                    (-a21 * a00 + a01 * a20) * det,
                    (a11 * a00 - a01 * a10) * det
                ]);
            }
            else {
                dest.values[0] = det01 * det;
                dest.values[1] = (-a22 * a01 + a02 * a21) * det;
                dest.values[2] = (a12 * a01 - a02 * a11) * det;
                dest.values[3] = det11 * det;
                dest.values[4] = (a22 * a00 - a02 * a20) * det;
                dest.values[5] = (-a12 * a00 + a02 * a10) * det;
                dest.values[6] = det21 * det;
                dest.values[7] = (-a21 * a00 + a01 * a20) * det;
                dest.values[8] = (a11 * a00 - a01 * a10) * det;
                return dest;
            }
        };
        mat4.prototype.row = function (index) {
            return [
                this.values[index * 4 + 0],
                this.values[index * 4 + 1],
                this.values[index * 4 + 2],
                this.values[index * 4 + 3]
            ];
        };
        mat4.prototype.col = function (index) {
            return [
                this.values[index],
                this.values[index + 4],
                this.values[index + 8],
                this.values[index + 12]
            ];
        };
        mat4.prototype.determinant = function () {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3], a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7], a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11], a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];
            var det00 = a00 * a11 - a01 * a10, det01 = a00 * a12 - a02 * a10, det02 = a00 * a13 - a03 * a10, det03 = a01 * a12 - a02 * a11, det04 = a01 * a13 - a03 * a11, det05 = a02 * a13 - a03 * a12, det06 = a20 * a31 - a21 * a30, det07 = a20 * a32 - a22 * a30, det08 = a20 * a33 - a23 * a30, det09 = a21 * a32 - a22 * a31, det10 = a21 * a33 - a23 * a31, det11 = a22 * a33 - a23 * a32;
            return (det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06);
        };
        mat4.prototype.setIdentity = function () {
            this.values[0] = 1;
            this.values[1] = 0;
            this.values[2] = 0;
            this.values[3] = 0;
            this.values[4] = 0;
            this.values[5] = 1;
            this.values[6] = 0;
            this.values[7] = 0;
            this.values[8] = 0;
            this.values[9] = 0;
            this.values[10] = 1;
            this.values[11] = 0;
            this.values[12] = 0;
            this.values[13] = 0;
            this.values[14] = 0;
            this.values[15] = 1;
        };
        mat4.prototype.transpose = function () {
            var temp01 = this.values[1], temp02 = this.values[2], temp03 = this.values[3], temp12 = this.values[6], temp13 = this.values[7], temp23 = this.values[11];
            this.values[1] = this.values[4];
            this.values[2] = this.values[8];
            this.values[3] = this.values[12];
            this.values[4] = temp01;
            this.values[6] = this.values[9];
            this.values[7] = this.values[13];
            this.values[8] = temp02;
            this.values[9] = temp12;
            this.values[11] = this.values[14];
            this.values[12] = temp03;
            this.values[13] = temp13;
            this.values[14] = temp23;
        };
        mat4.prototype.inverse = function () {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3], a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7], a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11], a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];
            var det00 = a00 * a11 - a01 * a10, det01 = a00 * a12 - a02 * a10, det02 = a00 * a13 - a03 * a10, det03 = a01 * a12 - a02 * a11, det04 = a01 * a13 - a03 * a11, det05 = a02 * a13 - a03 * a12, det06 = a20 * a31 - a21 * a30, det07 = a20 * a32 - a22 * a30, det08 = a20 * a33 - a23 * a30, det09 = a21 * a32 - a22 * a31, det10 = a21 * a33 - a23 * a31, det11 = a22 * a33 - a23 * a32;
            var det = (det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06);
            if (!det)
                return null;
            det = 1.0 / det;
            this.values[0] = (a11 * det11 - a12 * det10 + a13 * det09) * det;
            this.values[1] = (-a01 * det11 + a02 * det10 - a03 * det09) * det;
            this.values[2] = (a31 * det05 - a32 * det04 + a33 * det03) * det;
            this.values[3] = (-a21 * det05 + a22 * det04 - a23 * det03) * det;
            this.values[4] = (-a10 * det11 + a12 * det08 - a13 * det07) * det;
            this.values[5] = (a00 * det11 - a02 * det08 + a03 * det07) * det;
            this.values[6] = (-a30 * det05 + a32 * det02 - a33 * det01) * det;
            this.values[7] = (a20 * det05 - a22 * det02 + a23 * det01) * det;
            this.values[8] = (a10 * det10 - a11 * det08 + a13 * det06) * det;
            this.values[9] = (-a00 * det10 + a01 * det08 - a03 * det06) * det;
            this.values[10] = (a30 * det04 - a31 * det02 + a33 * det00) * det;
            this.values[11] = (-a20 * det04 + a21 * det02 - a23 * det00) * det;
            this.values[12] = (-a10 * det09 + a11 * det07 - a12 * det06) * det;
            this.values[13] = (a00 * det09 - a01 * det07 + a02 * det06) * det;
            this.values[14] = (-a30 * det03 + a31 * det01 - a32 * det00) * det;
            this.values[15] = (a20 * det03 - a21 * det01 + a22 * det00) * det;
        };
        mat4.prototype.multiply = function (matrix) {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3];
            var a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7];
            var a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11];
            var a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];
            var b0 = matrix.at(0), b1 = matrix.at(1), b2 = matrix.at(2), b3 = matrix.at(3);
            this.values[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.values[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.values[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.values[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = matrix.at(4);
            b1 = matrix.at(5);
            b2 = matrix.at(6);
            b3 = matrix.at(7);
            this.values[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.values[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.values[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.values[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = matrix.at(8);
            b1 = matrix.at(9);
            b2 = matrix.at(10);
            b3 = matrix.at(11);
            this.values[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.values[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.values[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.values[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = matrix.at(12);
            b1 = matrix.at(13);
            b2 = matrix.at(14);
            b3 = matrix.at(15);
            this.values[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.values[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.values[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.values[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        };
        mat4.prototype.multiplyVec3 = function (vector, dest) {
            if (dest === void 0) { dest = null; }
            var x = vector.x, y = vector.y, z = vector.z;
            if (!dest) {
                return new vec3(this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12], this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13], this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14]);
            }
            else {
                dest.x = this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12];
                dest.y = this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13];
                dest.z = this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14];
                return dest;
            }
        };
        mat4.prototype.multiplyVec4 = function (vector, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec4();
            var x = vector.x, y = vector.y, z = vector.z, w = vector.w;
            dest.x = this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12] * w;
            dest.y = this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13] * w;
            dest.z = this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14] * w;
            dest.w = this.values[3] * x + this.values[7] * y + this.values[11] * z + this.values[15] * w;
            return dest;
        };
        mat4.prototype.translate = function (vector) {
            var x = vector.x, y = vector.y, z = vector.z;
            this.values[12] += this.values[0] * x + this.values[4] * y + this.values[8] * z;
            this.values[13] += this.values[1] * x + this.values[5] * y + this.values[9] * z;
            this.values[14] += this.values[2] * x + this.values[6] * y + this.values[10] * z;
            this.values[15] += this.values[3] * x + this.values[7] * y + this.values[11] * z;
        };
        mat4.prototype.scale = function (vector) {
            var x = vector.x, y = vector.y, z = vector.z;
            this.values[0] *= x;
            this.values[1] *= x;
            this.values[2] *= x;
            this.values[3] *= x;
            this.values[4] *= y;
            this.values[5] *= y;
            this.values[6] *= y;
            this.values[7] *= y;
            this.values[8] *= z;
            this.values[9] *= z;
            this.values[10] *= z;
            this.values[11] *= z;
        };
        mat4.prototype.rotate = function (angle, axis) {
            var x = axis.x, y = axis.y, z = axis.z;
            var length = Math.sqrt(x * x + y * y + z * z);
            if (!length)
                return null;
            if (length !== 1) {
                length = 1 / length;
                x *= length;
                y *= length;
                z *= length;
            }
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            var t = 1.0 - c;
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3], a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7], a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11];
            var b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s, b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s, b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;
            this.values[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.values[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.values[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.values[3] = a03 * b00 + a13 * b01 + a23 * b02;
            this.values[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.values[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.values[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.values[7] = a03 * b10 + a13 * b11 + a23 * b12;
            this.values[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.values[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.values[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.values[11] = a03 * b20 + a13 * b21 + a23 * b22;
        };
        mat4.sEquals = function (matrix, matrix2, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            for (var i = 0; i < 16; i++) {
                if (Math.abs(matrix.values[i] - matrix2.at(i)) > threshold)
                    return false;
            }
            return true;
        };
        //lights fix
        mat4.sFrustum = function (left, right, bottom, top, near, far, dest) {
            if (dest === void 0) { dest = null; }
            if (dest == null)
                dest = new mat4();
            var rl = (right - left), tb = (top - bottom), fn = (far - near);
            dest.values[0] = (near * 2) / rl;
            dest.values[1] = 0;
            dest.values[2] = 0;
            dest.values[3] = 0;
            dest.values[4] = 0;
            dest.values[5] = (near * 2) / tb;
            dest.values[6] = 0;
            dest.values[7] = 0;
            dest.values[8] = (right + left) / rl;
            dest.values[9] = (top + bottom) / tb;
            dest.values[10] = -(far + near) / fn;
            dest.values[11] = -1;
            dest.values[12] = 0;
            dest.values[13] = 0;
            dest.values[14] = -(far * near * 2) / fn;
            dest.values[15] = 0;
            return dest;
        };
        //lights fix
        mat4.sPerspective = function (fov, aspect, near, far, dest) {
            if (dest === void 0) { dest = null; }
            var top = near * Math.tan(fov * Math.PI / 360.0), right = top * aspect;
            return mat4.sFrustum(-right, right, -top, top, near, far, dest);
        };
        //lights fix
        mat4.sOrthographic = function (left, right, bottom, top, near, far, dest) {
            if (dest === void 0) { dest = null; }
            if (dest == null)
                dest = new mat4();
            var rl = (right - left), tb = (top - bottom), fn = (far - near);
            dest.values[0] = 2 / rl;
            dest.values[1] = 0;
            dest.values[2] = 0;
            dest.values[3] = 0;
            dest.values[4] = 0;
            dest.values[5] = 2 / tb;
            dest.values[6] = 0;
            dest.values[7] = 0;
            dest.values[8] = 0;
            dest.values[9] = 0;
            dest.values[10] = -2 / fn;
            dest.values[11] = 0;
            dest.values[12] = -(left + right) / rl;
            dest.values[13] = -(top + bottom) / tb;
            dest.values[14] = -(far + near) / fn;
            dest.values[15] = 1;
            return dest;
        };
        //lights fix
        mat4.sLookat = function (position, forward, up, dest) {
            if (up === void 0) { up = vec3.up; }
            if (dest === void 0) { dest = null; }
            if (dest == null)
                dest = new mat4();
            var z = forward;
            var x = vec3.sCross(up, z);
            x.normalize();
            var y = vec3.sCross(z, x);
            y.normalize();
            dest.values[0] = x.x;
            dest.values[1] = y.x;
            dest.values[2] = z.x;
            dest.values[3] = 0;
            dest.values[4] = x.y;
            dest.values[5] = y.y;
            dest.values[6] = z.y;
            dest.values[7] = 0;
            dest.values[8] = x.z;
            dest.values[9] = y.z;
            dest.values[10] = z.z;
            dest.values[11] = 0;
            dest.values[12] = -vec3.sDot(x, position);
            dest.values[13] = -vec3.sDot(y, position);
            dest.values[14] = -vec3.sDot(z, position);
            dest.values[15] = 1;
            return dest;
        };
        mat4.sProduct = function (m1, m2, result) {
            if (result === void 0) { result = null; }
            var a00 = m1.at(0), a01 = m1.at(1), a02 = m1.at(2), a03 = m1.at(3), a10 = m1.at(4), a11 = m1.at(5), a12 = m1.at(6), a13 = m1.at(7), a20 = m1.at(8), a21 = m1.at(9), a22 = m1.at(10), a23 = m1.at(11), a30 = m1.at(12), a31 = m1.at(13), a32 = m1.at(14), a33 = m1.at(15);
            var b00 = m2.at(0), b01 = m2.at(1), b02 = m2.at(2), b03 = m2.at(3), b10 = m2.at(4), b11 = m2.at(5), b12 = m2.at(6), b13 = m2.at(7), b20 = m2.at(8), b21 = m2.at(9), b22 = m2.at(10), b23 = m2.at(11), b30 = m2.at(12), b31 = m2.at(13), b32 = m2.at(14), b33 = m2.at(15);
            if (result) {
                result.init([
                    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
                    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
                    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
                    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
                ]);
                return result;
            }
            else {
                return new mat4([
                    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
                    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
                    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
                    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
                ]);
            }
        };
        //light add
        mat4.sLerp = function (left, right, v, dest) {
            if (dest === void 0) { dest = null; }
            if (dest == null)
                dest = new mat4();
            for (var i = 0; i < 16; i++) {
                dest.values[i] = left.values[i] * (1 - v) + right.values[i] * v;
            }
            return dest;
        };
        mat4.identity = new mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]);
        return mat4;
    }());
    TSM.mat4 = mat4;
    var quat = (function () {
        function quat(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        quat.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new quat();
            dest.x = this.x;
            dest.y = this.y;
            dest.z = this.z;
            dest.w = this.w;
            return dest;
        };
        quat.prototype.toMat3 = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new mat3();
            var x = this.x, y = this.y, z = this.z, w = this.w;
            var x2 = x + x, y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            dest.init([
                1 - (yy + zz),
                xy + wz,
                xz - wy,
                xy - wz,
                1 - (xx + zz),
                yz + wx,
                xz + wy,
                yz - wx,
                1 - (xx + yy)
            ]);
            return dest;
        };
        quat.prototype.toMat4 = function (dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new mat4();
            var x = this.x, y = this.y, z = this.z, w = this.w, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            dest.init([
                1 - (yy + zz),
                xy + wz,
                xz - wy,
                0,
                xy - wz,
                1 - (xx + zz),
                yz + wx,
                0,
                xz + wy,
                yz - wx,
                1 - (xx + yy),
                0,
                0,
                0,
                0,
                1
            ]);
            return dest;
        };
        quat.prototype.roll = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            return Math.atan2(2.0 * (x * y + w * z), w * w + x * x - y * y - z * z);
        };
        quat.prototype.pitch = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            return Math.atan2(2.0 * (y * z + w * x), w * w - x * x - y * y + z * z);
        };
        quat.prototype.yaw = function () {
            return Math.asin(2.0 * (this.x * this.z - this.w * this.y));
        };
        quat.sEquals = function (vector, vector2, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            if (Math.abs(vector.x - vector2.x) > threshold)
                return false;
            if (Math.abs(vector.y - vector2.y) > threshold)
                return false;
            if (Math.abs(vector.z - vector2.z) > threshold)
                return false;
            if (Math.abs(vector.w - vector2.w) > threshold)
                return false;
            return true;
        };
        quat.prototype.setIdentity = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        };
        quat.prototype.calculateW = function () {
            var x = this.x, y = this.y, z = this.z;
            this.w = -(Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z)));
        };
        quat.sDot = function (q1, q2) {
            return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
        };
        quat.prototype.inverse = function () {
            var dot = quat.sDot(this, this);
            if (!dot) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;
                return;
            }
            var invDot = dot ? 1.0 / dot : 0;
            this.x *= -invDot;
            this.y *= -invDot;
            this.z *= -invDot;
            this.w *= invDot;
        };
        quat.prototype.conjugate = function () {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
        };
        quat.prototype.length = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            return Math.sqrt(x * x + y * y + z * z + w * w);
        };
        quat.prototype.normalize = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            var length = Math.sqrt(x * x + y * y + z * z + w * w);
            if (!length) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;
                return;
            }
            length = 1 / length;
            this.x = x * length;
            this.y = y * length;
            this.z = z * length;
            this.w = w * length;
        };
        quat.prototype.add = function (other) {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            this.w += other.w;
        };
        quat.prototype.multiply = function (other) {
            var q2x = other.x, q2y = other.y, q2z = other.z, q2w = other.w;
            this.x = this.x * q2w + this.w * q2x + this.y * q2z - this.z * q2y;
            this.y = this.y * q2w + this.w * q2y + this.z * q2x - this.x * q2z;
            this.z = this.z * q2w + this.w * q2z + this.x * q2y - this.y * q2x;
            this.w = this.w * q2w - this.x * q2x - this.y * q2y - this.z * q2z;
        };
        quat.prototype.multiplyVec3 = function (vector, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new vec3();
            var x = vector.x, y = vector.y, z = vector.z;
            var qx = this.x, qy = this.y, qz = this.z, qw = this.w;
            var ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
            dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return dest;
        };
        quat.sAdd = function (q1, q2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new quat();
            dest.x = q1.x + q2.x;
            dest.y = q1.y + q2.y;
            dest.z = q1.z + q2.z;
            dest.w = q1.w + q2.w;
            return dest;
        };
        quat.sProduct = function (q1, q2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new quat();
            var q1x = q1.x, q1y = q1.y, q1z = q1.z, q1w = q1.w, q2x = q2.x, q2y = q2.y, q2z = q2.z, q2w = q2.w;
            dest.x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
            dest.y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
            dest.z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
            dest.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
            return dest;
        };
        quat.sCross = function (q1, q2, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new quat();
            var q1x = q1.x, q1y = q1.y, q1z = q1.z, q1w = q1.w, q2x = q2.x, q2y = q2.y, q2z = q2.z, q2w = q2.w;
            dest.x = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
            dest.y = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
            dest.z = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
            dest.w = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
            return dest;
        };
        quat.sShortLerp = function (q1, q2, v, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new quat();
            if (v <= 0.0) {
                return q1.copy(dest);
            }
            else if (v >= 1.0) {
                return q2.copy(dest);
            }
            var cos = quat.sDot(q1, q2), q2a = q2.copy();
            if (cos < 0.0) {
                q2a.inverse();
                cos = -cos;
            }
            var k0, k1;
            if (cos > 0.9999) {
                k0 = 1 - v;
                k1 = 0 + v;
            }
            else {
                var sin = Math.sqrt(1 - cos * cos);
                var angle = Math.atan2(sin, cos);
                var oneOverSin = 1 / sin;
                k0 = Math.sin((1 - v) * angle) * oneOverSin;
                k1 = Math.sin((0 + v) * angle) * oneOverSin;
            }
            dest.x = k0 * q1.x + k1 * q2a.x;
            dest.y = k0 * q1.y + k1 * q2a.y;
            dest.z = k0 * q1.z + k1 * q2a.z;
            dest.w = k0 * q1.w + k1 * q2a.w;
            return dest;
        };
        quat.sLerp = function (q1, q2, v, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new quat();
            var cosHalfTheta = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
            if (Math.abs(cosHalfTheta) >= 1.0) {
                return q1.copy(dest);
            }
            var halfTheta = Math.acos(cosHalfTheta), sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
            if (Math.abs(sinHalfTheta) < 0.001) {
                dest.x = q1.x * 0.5 + q2.x * 0.5;
                dest.y = q1.y * 0.5 + q2.y * 0.5;
                dest.z = q1.z * 0.5 + q2.z * 0.5;
                dest.w = q1.w * 0.5 + q2.w * 0.5;
                return dest;
            }
            var ratioA = Math.sin((1 - v) * halfTheta) / sinHalfTheta, ratioB = Math.sin(v * halfTheta) / sinHalfTheta;
            dest.x = q1.x * ratioA + q2.x * ratioB;
            dest.y = q1.y * ratioA + q2.y * ratioB;
            dest.z = q1.z * ratioA + q2.z * ratioB;
            dest.w = q1.w * ratioA + q2.w * ratioB;
            return dest;
        };
        quat.sFromAxis = function (axis, angle, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest)
                dest = new quat();
            angle *= 0.5;
            var sin = Math.sin(angle);
            dest.x = axis.x * sin;
            dest.y = axis.y * sin;
            dest.z = axis.z * sin;
            dest.w = Math.cos(angle);
            return dest;
        };
        quat.identity = new quat(0, 0, 0, 1);
        return quat;
    }());
    TSM.quat = quat;
})(TSM || (TSM = {}));
var light3d;
(function (light3d) {
    var mat = (function () {
        function mat() {
            this.paramFloat = {};
            this.paramFloat4 = {};
            this.paramFloat4x4 = {};
            this.paramTexture = {};
        }
        mat.prototype.uniform = function (webgl, shader) {
            var itex = 1; //默认的贴图序号
            for (var key in shader.mapUniform) {
                var u = shader.mapUniform[key];
                if (u.location == null)
                    continue;
                if (u.type == light3d.typeUniform.float) {
                    webgl.uniform1f(u.location, this.paramFloat[key]);
                }
                else if (u.type == light3d.typeUniform.float4) {
                    var v = this.paramFloat4[key];
                    webgl.uniform4f(u.location, v.x, v.y, v.z, v.w);
                }
                else if (u.type == light3d.typeUniform.float4x4) {
                    var v = this.paramFloat4x4[key];
                    webgl.uniformMatrix4fv(u.location, false, v.values);
                }
                else if (u.type == light3d.typeUniform.texture) {
                    webgl.activeTexture(webgl.TEXTURE0 + itex);
                    var tex = this.paramTexture[key];
                    webgl.bindTexture(webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                    webgl.uniform1i(u.location, itex);
                    itex++;
                }
            }
        };
        return mat;
    }());
    light3d.mat = mat;
    var meshData = (function () {
        function meshData() {
        }
        meshData.addQuadPos = function (data, quad) {
            var istart = data.pos.length;
            meshData.addQuadVec3(data.pos, quad);
            data.trisindex.push(istart + 0);
            data.trisindex.push(istart + 1);
            data.trisindex.push(istart + 2);
            data.trisindex.push(istart + 2);
            data.trisindex.push(istart + 1);
            data.trisindex.push(istart + 3);
        };
        meshData.addQuadVec3ByValue = function (array, value) {
            for (var i = 0; i < 6; i++)
                array.push(value.copy());
        };
        meshData.addQuadVec3 = function (array, quad) {
            array.push(quad[0]);
            array.push(quad[1]);
            array.push(quad[2]);
            array.push(quad[2]);
            array.push(quad[1]);
            array.push(quad[3]);
        };
        meshData.addQuadVec2 = function (array, quad) {
            array.push(quad[0]);
            array.push(quad[1]);
            array.push(quad[2]);
            array.push(quad[2]);
            array.push(quad[1]);
            array.push(quad[3]);
        };
        meshData.genBox = function (size) {
            var half = size * 0.5;
            var data = new meshData();
            data.pos = [];
            data.trisindex = [];
            data.normal = [];
            data.uv = [];
            //bottom
            meshData.addQuadVec3ByValue(data.normal, new TSM.vec3(0, -1, 0));
            meshData.addQuadPos(data, [
                new TSM.vec3(-half, -half, -half),
                new TSM.vec3(-half, -half, half),
                new TSM.vec3(half, -half, -half),
                new TSM.vec3(half, -half, half)
            ]);
            meshData.addQuadVec2(data.uv, [
                new TSM.vec2(0, 0),
                new TSM.vec2(0, 1),
                new TSM.vec2(1, 0),
                new TSM.vec2(1, 1),
            ]);
            //top
            meshData.addQuadVec3ByValue(data.normal, new TSM.vec3(0, 1, 0));
            meshData.addQuadPos(data, [
                new TSM.vec3(-half, half, -half),
                new TSM.vec3(-half, half, half),
                new TSM.vec3(half, half, -half),
                new TSM.vec3(half, half, half)
            ]);
            meshData.addQuadVec2(data.uv, [
                new TSM.vec2(0, 0),
                new TSM.vec2(0, 1),
                new TSM.vec2(1, 0),
                new TSM.vec2(1, 1),
            ]);
            //front
            meshData.addQuadVec3ByValue(data.normal, new TSM.vec3(0, 0, 1));
            meshData.addQuadPos(data, [
                new TSM.vec3(-half, -half, half),
                new TSM.vec3(-half, half, half),
                new TSM.vec3(half, -half, half),
                new TSM.vec3(half, half, half)
            ]);
            meshData.addQuadVec2(data.uv, [
                new TSM.vec2(0, 0),
                new TSM.vec2(0, 1),
                new TSM.vec2(1, 0),
                new TSM.vec2(1, 1),
            ]);
            //back
            meshData.addQuadVec3ByValue(data.normal, new TSM.vec3(0, 0, -1));
            meshData.addQuadPos(data, [
                new TSM.vec3(-half, -half, -half),
                new TSM.vec3(-half, half, -half),
                new TSM.vec3(half, -half, -half),
                new TSM.vec3(half, half, -half)
            ]);
            meshData.addQuadVec2(data.uv, [
                new TSM.vec2(0, 0),
                new TSM.vec2(0, 1),
                new TSM.vec2(1, 0),
                new TSM.vec2(1, 1),
            ]);
            //right
            meshData.addQuadVec3ByValue(data.normal, new TSM.vec3(1, 0, 0));
            meshData.addQuadPos(data, [
                new TSM.vec3(half, -half, -half),
                new TSM.vec3(half, -half, half),
                new TSM.vec3(half, half, -half),
                new TSM.vec3(half, half, half)
            ]);
            meshData.addQuadVec2(data.uv, [
                new TSM.vec2(0, 0),
                new TSM.vec2(0, 1),
                new TSM.vec2(1, 0),
                new TSM.vec2(1, 1),
            ]);
            //left
            meshData.addQuadVec3ByValue(data.normal, new TSM.vec3(-1, 0, 0));
            meshData.addQuadPos(data, [
                new TSM.vec3(-half, -half, -half),
                new TSM.vec3(-half, -half, half),
                new TSM.vec3(-half, half, -half),
                new TSM.vec3(-half, half, half)
            ]);
            meshData.addQuadVec2(data.uv, [
                new TSM.vec2(0, 0),
                new TSM.vec2(0, 1),
                new TSM.vec2(1, 0),
                new TSM.vec2(1, 1),
            ]);
            return data;
        };
        return meshData;
    }());
    light3d.meshData = meshData;
    var meshGL = (function () {
        function meshGL() {
            this.line = false;
            this.bindColor = false;
            this.bindColor2 = false;
            this.bindUV = false;
            this.bindUV2 = false;
            this.bindNormal = false;
            this.bindNormal2 = false;
            this.bindBoneIndexA = false;
            this.bindBoneWeightA = false;
            this.bindBoneIndexB = false;
            this.bindBoneWeightB = false;
        }
        meshGL.prototype.calcByteSize = function () {
            var total = 12; //pos
            if (this.bindColor)
                total += 16;
            if (this.bindColor2)
                total += 16;
            if (this.bindUV)
                total += 8;
            if (this.bindUV2)
                total += 8;
            if (this.bindNormal)
                total += 12;
            if (this.bindNormal2)
                total += 12;
            if (this.bindBoneIndexA)
                total += 4;
            if (this.bindBoneWeightA)
                total += 4;
            if (this.bindBoneIndexB)
                total += 4;
            if (this.bindBoneWeightB)
                total += 4;
            return total;
        };
        meshGL.prototype.bind = function (webgl, shadercode) {
            var total = this.vertexSize * 4;
            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            var seek = 0;
            {
                if (shadercode.posPos >= 0) {
                    webgl.enableVertexAttribArray(shadercode.posPos);
                    webgl.vertexAttribPointer(shadercode.posPos, 3, webgl.FLOAT, false, total, seek);
                }
                seek += 12;
            }
            if (this.bindColor) {
                if (shadercode.posColor >= 0) {
                    webgl.enableVertexAttribArray(shadercode.posColor);
                    webgl.vertexAttribPointer(shadercode.posColor, 4, webgl.FLOAT, false, total, seek);
                }
                seek += 16;
            }
            if (this.bindColor2) {
                if (shadercode.posColor2 >= 0) {
                    webgl.enableVertexAttribArray(shadercode.posColor2);
                    webgl.vertexAttribPointer(shadercode.posColor2, 4, webgl.FLOAT, false, total, seek);
                }
                seek += 16;
            }
            if (this.bindUV) {
                if (shadercode.posUV >= 0) {
                    webgl.enableVertexAttribArray(shadercode.posUV);
                    webgl.vertexAttribPointer(shadercode.posUV, 2, webgl.FLOAT, false, total, seek);
                }
                seek += 8;
            }
            if (this.bindUV2) {
                if (shadercode.posUV2 >= 0) {
                    webgl.enableVertexAttribArray(shadercode.posUV2);
                    webgl.vertexAttribPointer(shadercode.posUV2, 2, webgl.FLOAT, false, total, seek);
                }
                seek += 8;
            }
            if (this.bindNormal) {
                if (shadercode.posNormal >= 0) {
                    webgl.enableVertexAttribArray(shadercode.posNormal);
                    webgl.vertexAttribPointer(shadercode.posNormal, 3, webgl.FLOAT, true, total, seek);
                }
                seek += 12;
            }
            if (this.bindNormal2) {
                if (shadercode.posNormal2 >= 0) {
                    webgl.enableVertexAttribArray(shadercode.posNormal2);
                    webgl.vertexAttribPointer(shadercode.posNormal2, 3, webgl.FLOAT, true, total, seek);
                }
                seek += 12;
            }
            if (this.bindBoneIndexA) {
                if (shadercode.posBoneA) {
                    webgl.enableVertexAttribArray(shadercode.posBoneA);
                    webgl.vertexAttribPointer(shadercode.posBoneA, 1, webgl.INT, false, total, seek);
                }
                seek += 4;
            }
            if (this.bindBoneIndexB) {
                if (shadercode.posBoneB) {
                    webgl.enableVertexAttribArray(shadercode.posBoneB);
                    webgl.vertexAttribPointer(shadercode.posBoneB, 1, webgl.INT, false, total, seek);
                }
                seek += 4;
            }
        };
        meshGL.prototype.genVBO = function (webgl, data) {
            this.vertexCount = data.pos.length;
            this.vertexSize = this.calcByteSize() / 4;
            var total = this.vertexSize;
            var varray = new Float32Array(total * data.pos.length);
            for (var i = 0; i < data.pos.length; i++) {
                var nseek = 0;
                varray[i * total + nseek] = data.pos[i].x;
                nseek++;
                varray[i * total + nseek] = data.pos[i].y;
                nseek++;
                varray[i * total + nseek] = data.pos[i].z;
                nseek++;
                if (this.bindColor) {
                    if (data.color == undefined || data.color.length == 0) {
                        varray[i * total + nseek] = 1;
                        nseek++;
                        varray[i * total + nseek] = 1;
                        nseek++;
                        varray[i * total + nseek] = 1;
                        nseek++;
                        varray[i * total + nseek] = 1;
                        nseek++;
                    }
                    else {
                        varray[i * total + nseek] = data.color[i].r;
                        nseek++;
                        varray[i * total + nseek] = data.color[i].g;
                        nseek++;
                        varray[i * total + nseek] = data.color[i].b;
                        nseek++;
                        varray[i * total + nseek] = data.color[i].a;
                        nseek++;
                    }
                }
                if (this.bindColor2) {
                    if (data.color2 == undefined || data.color2.length == 0) {
                        varray[i * total + nseek] = 1;
                        nseek++;
                        varray[i * total + nseek] = 1;
                        nseek++;
                        varray[i * total + nseek] = 1;
                        nseek++;
                        varray[i * total + nseek] = 1;
                        nseek++;
                    }
                    else {
                        varray[i * total + nseek] = data.color2[i].r;
                        nseek++;
                        varray[i * total + nseek] = data.color2[i].g;
                        nseek++;
                        varray[i * total + nseek] = data.color2[i].b;
                        nseek++;
                        varray[i * total + nseek] = data.color2[i].a;
                        nseek++;
                    }
                }
                if (this.bindUV) {
                    if (data.uv == undefined || data.uv.length == 0) {
                        varray[i * total + nseek] = 0;
                        nseek++;
                        varray[i * total + nseek] = 0;
                        nseek++;
                    }
                    else {
                        varray[i * total + nseek] = data.uv[i].x;
                        nseek++;
                        varray[i * total + nseek] = data.uv[i].y;
                        nseek++;
                    }
                }
                if (this.bindUV2) {
                    if (data.uv2 == undefined || data.uv2.length == 0) {
                        varray[i * total + nseek] = 0;
                        nseek++;
                        varray[i * total + nseek] = 0;
                        nseek++;
                    }
                    else {
                        varray[i * total + nseek] = data.uv2[i].x;
                        nseek++;
                        varray[i * total + nseek] = data.uv2[i].y;
                        nseek++;
                    }
                }
                if (this.bindNormal) {
                    if (data.normal == undefined || data.normal.length == 0) {
                        varray[i * total + nseek] = 0;
                        nseek++;
                        varray[i * total + nseek] = 0;
                        nseek++;
                        varray[i * total + nseek] = 0;
                        nseek++;
                    }
                    else {
                        varray[i * total + nseek] = data.normal[i].x;
                        nseek++;
                        varray[i * total + nseek] = data.normal[i].y;
                        nseek++;
                        varray[i * total + nseek] = data.normal[i].z;
                        nseek++;
                    }
                }
                if (this.bindNormal2) {
                    if (data.normal2 == undefined || data.normal2.length == 0) {
                        varray[i * total + nseek] = 0;
                        nseek++;
                        varray[i * total + nseek] = 0;
                        nseek++;
                        varray[i * total + nseek] = 0;
                        nseek++;
                    }
                    else {
                        varray[i * total + nseek] = data.normal2[i].x;
                        nseek++;
                        varray[i * total + nseek] = data.normal2[i].y;
                        nseek++;
                        varray[i * total + nseek] = data.normal2[i].z;
                        nseek++;
                    }
                }
                if (this.bindBoneIndexA) {
                    if (data.boneIndexA == undefined || data.boneIndexA.length == 0) {
                        varray[i * total + nseek] = 0;
                        nseek++;
                    }
                    else {
                        varray[i * total + nseek] = data.boneIndexA[i];
                        nseek++;
                    }
                }
                if (this.bindBoneIndexB) {
                    if (data.boneIndexB == undefined || data.boneIndexB.length == 0) {
                        varray[i * total + nseek] = 0;
                        nseek++;
                    }
                    else {
                        varray[i * total + nseek] = data.boneIndexB[i];
                        nseek++;
                    }
                }
            }
            this.vbo = webgl.createBuffer();
            console.log("vbosize=" + varray.length);
            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);
            webgl.bufferData(webgl.ARRAY_BUFFER, varray, webgl.STATIC_DRAW);
        };
        meshGL.prototype.genIndex = function (webgl, data, line) {
            if (line === void 0) { line = false; }
            this.line = line;
            var size = ((data.trisindex.length / 3) | 0) * 3;
            if (line)
                size *= 2;
            this.indexCount = size;
            var index = new Uint16Array(size);
            for (var i = 0; i < ((data.trisindex.length / 3) | 0); i++) {
                var a = data.trisindex[i * 3 + 0];
                var b = data.trisindex[i * 3 + 1];
                var c = data.trisindex[i * 3 + 2];
                if (this.line) {
                    index[i * 6 + 0] = a;
                    index[i * 6 + 1] = b;
                    index[i * 6 + 2] = b;
                    index[i * 6 + 3] = c;
                    index[i * 6 + 4] = c;
                    index[i * 6 + 5] = a;
                }
                else {
                    index[i * 6 + 0] = a;
                    index[i * 6 + 1] = b;
                    index[i * 6 + 2] = c;
                }
            }
            this.ebo = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.ebo);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, index, webgl.STATIC_DRAW);
        };
        return meshGL;
    }());
    light3d.meshGL = meshGL;
    var com_mesh = (function () {
        function com_mesh() {
        }
        com_mesh.prototype.init = function () {
            this.bshow = true;
            this.sortlayer = 0; //由材质决定
            this.sortz = 0; //update的时候算出来
            this.render = this; //自己实现自己的Render也是可以的，屌不屌
            this.mesh = new meshGL(); //mesh的实例不应该在这里管理，这个慢慢来
            this.mesh.bindColor = true;
            this.mesh.bindColor2 = true;
            this.mesh.bindUV = true;
            this.mat = new mat();
            this.mat.shader = "test";
        };
        com_mesh.prototype.update = function () {
            this.sortz = this.node.matWorld.at(14);
        };
        com_mesh.prototype.draw = function (line, cam) {
            //逻辑全了，怎么把东西画出来
            var webgl = line.webgl;
            var shader = line.shaderParser.mapshader[this.mat.shader];
            if (shader == null)
                return;
            //各种状态
            //face cull
            webgl.disable(webgl.CULL_FACE);
            //zwrite
            webgl.depthMask(false); //这是zwrite
            //ztest 
            //if (this.ztest)
            //{
            //    this.webgl.enable(this.webgl.DEPTH_TEST);//这是ztest
            //    this.webgl.depthFunc(this.webgl.LEQUAL);//这是ztest方法
            //}
            //else
            {
                webgl.disable(webgl.DEPTH_TEST); //这是ztest
            }
            //alphablend
            //if (this.mat.transparent)
            //{
            //    //alphablend ，跟着mat走
            //    this.webgl.enable(this.webgl.BLEND);
            //    this.webgl.blendEquation(this.webgl.FUNC_ADD);
            //    //this.webgl.blendFunc(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA);
            //    this.webgl.blendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA,
            //        this.webgl.SRC_ALPHA, this.webgl.ONE);
            //}
            //else
            //{
            webgl.disable(webgl.BLEND);
            //}
            webgl.useProgram(shader.program);
            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.mesh.vbo);
            //webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.mesh.ebo);
            //binddata
            this.mesh.bind(webgl, shader);
            //apply uniform
            this.mat.uniform(webgl, shader);
            //dodraw
            var mode = this.mesh.line ? webgl.LINES : webgl.TRIANGLES;
            webgl.drawArrays(mode, 0, this.mesh.vertexCount);
            webgl.drawElements(mode, this.mesh.indexCount, webgl.UNSIGNED_SHORT, 0);
        };
        com_mesh.prototype.setmesh = function (webgl, data) {
            this.mesh.genVBO(webgl, data);
            this.mesh.genIndex(webgl, data);
        };
        return com_mesh;
    }());
    light3d.com_mesh = com_mesh;
})(light3d || (light3d = {}));
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
//v0.75
var lighttool;
(function (lighttool) {
    //加载工具
    var loadTool = (function () {
        function loadTool() {
        }
        loadTool.loadText = function (url, fun) {
            var req = new XMLHttpRequest(); //ness
            req.open("GET", url);
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 404)
                        fun(null, new Error("onerr 404"));
                    else
                        fun(req.responseText, null);
                }
            };
            req.onerror = function () {
                fun(null, new Error("onerr in req:")); //ness
            };
            req.send();
        };
        loadTool.loadArrayBuffer = function (url, fun) {
            var req = new XMLHttpRequest(); //ness
            req.open("GET", url);
            req.responseType = "arraybuffer"; //ie 一定要在open之后修改responseType
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 404)
                        fun(null, new Error("onerr 404"));
                    else
                        fun(req.response, null);
                }
            };
            req.onerror = function () {
                fun(null, new Error("onerr in req:")); //ness
            };
            req.send();
        };
        loadTool.loadBlob = function (url, fun) {
            var req = new XMLHttpRequest(); //ness
            req.open("GET", url);
            req.responseType = "blob"; //ie 一定要在open之后修改responseType
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 404)
                        fun(null, new Error("onerr 404"));
                    else
                        fun(req.response, null);
                }
            };
            req.onerror = function () {
                fun(null, new Error("onerr in req:")); //ness
            };
            req.send();
        };
        return loadTool;
    }());
    lighttool.loadTool = loadTool;
    //shader
    var shadercode = (function () {
        function shadercode() {
            this.posPos = -1;
            this.posColor = -1;
            this.posColor2 = -1;
            this.posUV = -1;
            this.uniMatrix = null;
            this.uniTex0 = null;
            this.uniTex1 = null;
            this.uniCol0 = null;
            this.uniCol1 = null;
        }
        shadercode.prototype.compile = function (webgl) {
            this.vs = webgl.createShader(webgl.VERTEX_SHADER);
            this.fs = webgl.createShader(webgl.FRAGMENT_SHADER);
            //分别编译shader
            webgl.shaderSource(this.vs, this.vscode);
            webgl.compileShader(this.vs);
            var r1 = webgl.getShaderParameter(this.vs, webgl.COMPILE_STATUS);
            if (r1 == false) {
                alert(webgl.getShaderInfoLog(this.vs));
            }
            //
            webgl.shaderSource(this.fs, this.fscode);
            webgl.compileShader(this.fs);
            var r2 = webgl.getShaderParameter(this.fs, webgl.COMPILE_STATUS);
            if (r2 == false) {
                alert(webgl.getShaderInfoLog(this.fs));
            }
            //program link
            this.program = webgl.createProgram();
            webgl.attachShader(this.program, this.vs);
            webgl.attachShader(this.program, this.fs);
            webgl.linkProgram(this.program);
            var r3 = webgl.getProgramParameter(this.program, webgl.LINK_STATUS);
            if (r3 == false) {
                alert(webgl.getProgramInfoLog(this.program));
            }
            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            this.posPos = webgl.getAttribLocation(this.program, "position");
            this.posColor = webgl.getAttribLocation(this.program, "color");
            this.posColor2 = webgl.getAttribLocation(this.program, "color2");
            this.posUV = webgl.getAttribLocation(this.program, "uv");
            this.uniMatrix = webgl.getUniformLocation(this.program, "matrix");
            this.uniTex0 = webgl.getUniformLocation(this.program, "tex0");
            this.uniTex1 = webgl.getUniformLocation(this.program, "tex1");
            this.uniCol0 = webgl.getUniformLocation(this.program, "col0");
            this.uniCol1 = webgl.getUniformLocation(this.program, "col1");
        };
        return shadercode;
    }());
    lighttool.shadercode = shadercode;
    var shaderParser = (function () {
        function shaderParser() {
            this.mapshader = {};
        }
        shaderParser.prototype._parser = function (txt) {
            var s1 = txt.split("<--");
            for (var i in s1) {
                var s2 = s1[i].split("-->");
                var stag = s2[0].split(" "); //tags;
                var sshader = s2[1]; //正文
                var lastname = "";
                var lasttag = 0;
                for (var j in stag) {
                    var t = stag[j];
                    if (t.length == 0)
                        continue;
                    if (t == "vs") {
                        lasttag = 1;
                    }
                    else if (t == "fs") {
                        lasttag = 2;
                    }
                    else {
                        lastname = t.substring(1, t.length - 1);
                    }
                }
                if (lastname.length == 0)
                    continue;
                if (this.mapshader[lastname] == undefined)
                    this.mapshader[lastname] = new shadercode(); //ness
                if (lasttag == 1)
                    this.mapshader[lastname].vscode = sshader;
                else if (lasttag == 2)
                    this.mapshader[lastname].fscode = sshader;
            }
        };
        shaderParser.prototype.parseUrl = function (webgl, url) {
            var _this = this;
            lighttool.loadTool.loadText(url, function (txt, err) {
                _this._parser(txt);
                _this.compile(webgl);
                //spriteBatcher
            });
        };
        shaderParser.prototype.parseDirect = function (webgl, txt) {
            this._parser(txt);
            this.compile(webgl);
        };
        shaderParser.prototype.dump = function () {
            for (var name in this.mapshader) {
                console.log("shadername:" + name);
                console.log("vs:" + this.mapshader[name].vscode);
                console.log("fs:" + this.mapshader[name].fscode);
            }
        };
        shaderParser.prototype.compile = function (webgl) {
            for (var name in this.mapshader) {
                this.mapshader[name].compile(webgl);
            }
        };
        return shaderParser;
    }());
    lighttool.shaderParser = shaderParser;
    //sprite 基本数据结构
    var spriteRect = (function () {
        function spriteRect(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        spriteRect.one = new spriteRect(0, 0, 1, 1); //ness
        spriteRect.zero = new spriteRect(0, 0, 0, 0); //ness
        return spriteRect;
    }());
    lighttool.spriteRect = spriteRect;
    var spriteBorder = (function () {
        function spriteBorder(l, t, r, b) {
            if (l === void 0) { l = 0; }
            if (t === void 0) { t = 0; }
            if (r === void 0) { r = 0; }
            if (b === void 0) { b = 0; }
            this.l = l;
            this.t = t;
            this.r = r;
            this.b = b;
        }
        spriteBorder.zero = new spriteBorder(0, 0, 0, 0); //ness
        return spriteBorder;
    }());
    lighttool.spriteBorder = spriteBorder;
    var spriteColor = (function () {
        function spriteColor(r, g, b, a) {
            if (r === void 0) { r = 1; }
            if (g === void 0) { g = 1; }
            if (b === void 0) { b = 1; }
            if (a === void 0) { a = 1; }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        spriteColor.white = new spriteColor(1, 1, 1, 1); //ness
        spriteColor.black = new spriteColor(0, 0, 0, 1); //ness
        spriteColor.gray = new spriteColor(0.5, 0.5, 0.5, 1); //ness
        return spriteColor;
    }());
    lighttool.spriteColor = spriteColor;
    var spritePoint = (function () {
        function spritePoint() {
        }
        return spritePoint;
    }());
    lighttool.spritePoint = spritePoint;
    //sprite材质
    var spriteMat = (function () {
        function spriteMat() {
        }
        return spriteMat;
    }());
    lighttool.spriteMat = spriteMat;
    var stateRecorder = (function () {
        function stateRecorder(webgl) {
            this.webgl = webgl;
        }
        stateRecorder.prototype.record = function () {
            //记录状态
            this.DEPTH_WRITEMASK = this.webgl.getParameter(this.webgl.DEPTH_WRITEMASK);
            this.DEPTH_TEST = this.webgl.getParameter(this.webgl.DEPTH_TEST);
            this.DEPTH_FUNC = this.webgl.getParameter(this.webgl.DEPTH_FUNC);
            //alphablend ，跟着mat走
            this.BLEND = this.webgl.getParameter(this.webgl.BLEND);
            this.BLEND_EQUATION = this.webgl.getParameter(this.webgl.BLEND_EQUATION);
            this.BLEND_SRC_RGB = this.webgl.getParameter(this.webgl.BLEND_SRC_RGB);
            this.BLEND_SRC_ALPHA = this.webgl.getParameter(this.webgl.BLEND_SRC_ALPHA);
            this.BLEND_DST_RGB = this.webgl.getParameter(this.webgl.BLEND_DST_RGB);
            this.BLEND_DST_ALPHA = this.webgl.getParameter(this.webgl.BLEND_DST_ALPHA);
            //    this.webgl.blendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA,
            //        this.webgl.SRC_ALPHA, this.webgl.ONE);
            this.CURRENT_PROGRAM = this.webgl.getParameter(this.webgl.CURRENT_PROGRAM);
            this.ARRAY_BUFFER = this.webgl.getParameter(this.webgl.ARRAY_BUFFER_BINDING);
            this.ACTIVE_TEXTURE = this.webgl.getParameter(this.webgl.ACTIVE_TEXTURE);
            this.TEXTURE_BINDING_2D = this.webgl.getParameter(this.webgl.TEXTURE_BINDING_2D);
        };
        stateRecorder.prototype.restore = function () {
            //恢复状态
            this.webgl.depthMask(this.DEPTH_WRITEMASK);
            if (this.DEPTH_TEST)
                this.webgl.enable(this.webgl.DEPTH_TEST); //这是ztest
            else
                this.webgl.disable(this.webgl.DEPTH_TEST); //这是ztest
            this.webgl.depthFunc(this.DEPTH_FUNC); //这是ztest方法
            if (this.BLEND) {
                this.webgl.enable(this.webgl.BLEND);
            }
            else {
                this.webgl.disable(this.webgl.BLEND);
            }
            this.webgl.blendEquation(this.BLEND_EQUATION);
            this.webgl.blendFuncSeparate(this.BLEND_SRC_RGB, this.BLEND_DST_RGB, this.BLEND_SRC_ALPHA, this.BLEND_DST_ALPHA);
            this.webgl.useProgram(this.CURRENT_PROGRAM);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.ARRAY_BUFFER);
            this.webgl.activeTexture(this.ACTIVE_TEXTURE);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.TEXTURE_BINDING_2D);
        };
        return stateRecorder;
    }());
    lighttool.stateRecorder = stateRecorder;
    var spriteBatcher = (function () {
        function spriteBatcher(webgl, shaderparser) {
            this.ztest = true;
            this.array = new Float32Array(1024 * 13); //ness
            this.dataseek = 0;
            this.rectClip = null;
            this.webgl = webgl;
            this.shaderparser = shaderparser;
            this.vbo = webgl.createBuffer();
            var asp = (this.webgl.drawingBufferWidth / this.webgl.drawingBufferHeight);
            this.matrix = new Float32Array([
                1.0 / asp, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]); //ness
            this.recorder = new stateRecorder(webgl); //ness
        }
        spriteBatcher.prototype.begindraw = function () {
            this.recorder.record();
        };
        spriteBatcher.prototype.enddraw = function () {
            this.endbatch();
            this.recorder.restore();
        };
        spriteBatcher.prototype.setMat = function (mat) {
            if (mat == this.mat)
                return;
            this.endbatch();
            this.webgl.disable(this.webgl.CULL_FACE);
            this.mat = mat;
            this.shadercode = this.shaderparser.mapshader[this.mat.shader];
            if (this.shadercode == undefined)
                return;
            //指定shader和vbo
            //关于深度 ，跟着spritebatcher走
            this.webgl.depthMask(false); //这是zwrite
            if (this.ztest) {
                this.webgl.enable(this.webgl.DEPTH_TEST); //这是ztest
                this.webgl.depthFunc(this.webgl.LEQUAL); //这是ztest方法
            }
            else {
                this.webgl.disable(this.webgl.DEPTH_TEST); //这是ztest
            }
            if (this.mat.transparent) {
                //alphablend ，跟着mat走
                this.webgl.enable(this.webgl.BLEND);
                this.webgl.blendEquation(this.webgl.FUNC_ADD);
                //this.webgl.blendFunc(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA);
                this.webgl.blendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA, this.webgl.SRC_ALPHA, this.webgl.ONE);
            }
            else {
                this.webgl.disable(this.webgl.BLEND);
            }
            this.webgl.useProgram(this.shadercode.program);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.vbo);
            //指定固定的数据结构，然后根据存在program的数据去绑定咯。
            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            if (this.shadercode.posPos >= 0) {
                this.webgl.enableVertexAttribArray(this.shadercode.posPos);
                //28 是数据步长(字节)，就是数据结构的长度
                //12 是数据偏移（字节）
                this.webgl.vertexAttribPointer(this.shadercode.posPos, 3, this.webgl.FLOAT, false, 52, 0);
            }
            if (this.shadercode.posColor >= 0) {
                this.webgl.enableVertexAttribArray(this.shadercode.posColor);
                this.webgl.vertexAttribPointer(this.shadercode.posColor, 4, this.webgl.FLOAT, false, 52, 12);
            }
            if (this.shadercode.posColor2 >= 0) {
                this.webgl.enableVertexAttribArray(this.shadercode.posColor2);
                this.webgl.vertexAttribPointer(this.shadercode.posColor2, 4, this.webgl.FLOAT, false, 52, 28);
            }
            if (this.shadercode.posUV >= 0) {
                this.webgl.enableVertexAttribArray(this.shadercode.posUV);
                this.webgl.vertexAttribPointer(this.shadercode.posUV, 2, this.webgl.FLOAT, false, 52, 44);
            }
            if (this.shadercode.uniMatrix != null) {
                this.webgl.uniformMatrix4fv(this.shadercode.uniMatrix, false, this.matrix);
            }
            if (this.shadercode.uniTex0 != null) {
                this.webgl.activeTexture(this.webgl.TEXTURE0);
                var tex = this.mat.tex0;
                this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.uniform1i(this.shadercode.uniTex0, 0);
            }
            if (this.shadercode.uniTex1 != null) {
                this.webgl.activeTexture(this.webgl.TEXTURE1);
                var tex = this.mat.tex1;
                this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.uniform1i(this.shadercode.uniTex1, 1);
            }
            if (this.shadercode.uniCol0 != null) {
                this.webgl.uniform4f(this.shadercode.uniCol0, mat.col0.r, mat.col0.g, mat.col0.b, mat.col0.a);
            }
            if (this.shadercode.uniCol1 != null) {
                this.webgl.uniform4f(this.shadercode.uniCol1, mat.col1.r, mat.col1.g, mat.col1.b, mat.col1.a);
            }
        };
        spriteBatcher.prototype.endbatch = function () {
            this.mat = null;
            if (this.dataseek == 0)
                return;
            //填充vbo
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, this.array, this.webgl.DYNAMIC_DRAW);
            //绘制
            this.webgl.drawArrays(this.webgl.TRIANGLES, 0, this.dataseek);
            //清理状态，可以不干
            //this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, null);
            //this.data.length = 0;
            this.dataseek = 0;
        };
        spriteBatcher.prototype.addQuad = function (ps) {
            if (this.shadercode == undefined)
                return;
            for (var jc = 0; jc < 6; jc++) {
                var j = jc < 3 ? jc : 6 - jc; // 0->0 1->1 2->2
                // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1
                var i = this.dataseek * 13;
                this.array[i++] = ps[j].x;
                this.array[i++] = ps[j].y;
                this.array[i++] = ps[j].z;
                this.array[i++] = ps[j].r;
                this.array[i++] = ps[j].g;
                this.array[i++] = ps[j].b;
                this.array[i++] = ps[j].a;
                this.array[i++] = ps[j].r2;
                this.array[i++] = ps[j].g2;
                this.array[i++] = ps[j].b2;
                this.array[i++] = ps[j].a2;
                this.array[i++] = ps[j].u;
                this.array[i++] = ps[j].v;
                this.dataseek++;
            }
            if (this.dataseek >= 1000) {
                this.endbatch();
            }
        };
        spriteBatcher.prototype.addTri = function (ps) {
            if (this.shadercode == undefined)
                return;
            {
                for (var j = 0; j < 3; j++) {
                    var i = this.dataseek * 13;
                    //for (var e in ps[j])
                    //{
                    //    this.array[i++] = ps[j][e];
                    //}
                    this.array[i++] = ps[j].x;
                    this.array[i++] = ps[j].y;
                    this.array[i++] = ps[j].z;
                    this.array[i++] = ps[j].r;
                    this.array[i++] = ps[j].g;
                    this.array[i++] = ps[j].b;
                    this.array[i++] = ps[j].a;
                    this.array[i++] = ps[j].r2;
                    this.array[i++] = ps[j].g2;
                    this.array[i++] = ps[j].b2;
                    this.array[i++] = ps[j].a2;
                    this.array[i++] = ps[j].u;
                    this.array[i++] = ps[j].v;
                    this.dataseek++;
                }
            }
            if (this.dataseek >= 1000) {
                this.endbatch();
            }
        };
        //这个接口接受裁剪
        spriteBatcher.prototype.addRect = function (ps) {
            if (this.shadercode == undefined)
                return;
            if (this.rectClip != null) {
                var xmin = ps[0].x;
                var xmax = ps[3].x;
                var ymin = ps[0].y;
                var ymax = ps[3].y;
                var umin = ps[0].u;
                var umax = ps[3].u;
                var vmin = ps[0].v;
                var vmax = ps[3].v;
                var wsize = xmax - xmin;
                var hsize = ymax - ymin;
                var usize = umax - umin;
                var vsize = vmax - vmin;
                var xl = Math.max(xmin, this.rectClip.x);
                var xr = Math.min(xmax, this.rectClip.x + this.rectClip.w);
                var yt = Math.max(ymin, this.rectClip.y);
                var yb = Math.min(ymax, this.rectClip.y + this.rectClip.h);
                var lf = (xl - xmin) / wsize;
                var tf = (yt - ymin) / hsize;
                var rf = (xr - xmax) / wsize;
                var bf = (yb - ymax) / hsize;
                umin = umin + lf * usize;
                vmin = vmin + tf * vsize;
                umax = umax + rf * usize;
                vmax = vmax + bf * vsize;
                for (var jc = 0; jc < 6; jc++) {
                    var j = jc < 3 ? jc : 6 - jc; // 0->0 1->1 2->2
                    // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1
                    var i = this.dataseek * 13;
                    var x = ps[j].x;
                    if (x < xl)
                        x = xl;
                    if (x > xr)
                        x = xr;
                    var y = ps[j].y;
                    if (y < yt)
                        y = yt;
                    if (y > yb)
                        y = yb;
                    var u = ps[j].u;
                    if (u < umin)
                        u = umin;
                    if (u > umax)
                        u = umax;
                    var v = ps[j].v;
                    if (v < vmin)
                        v = vmin;
                    if (v > vmax)
                        v = vmax;
                    this.array[i++] = x;
                    this.array[i++] = y;
                    this.array[i++] = ps[j].z;
                    this.array[i++] = ps[j].r;
                    this.array[i++] = ps[j].g;
                    this.array[i++] = ps[j].b;
                    this.array[i++] = ps[j].a;
                    this.array[i++] = ps[j].r2;
                    this.array[i++] = ps[j].g2;
                    this.array[i++] = ps[j].b2;
                    this.array[i++] = ps[j].a2;
                    this.array[i++] = u;
                    this.array[i++] = v;
                    this.dataseek++;
                }
            }
            else {
                for (var jc = 0; jc < 6; jc++) {
                    var j = jc < 3 ? jc : 6 - jc; // 0->0 1->1 2->2
                    // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1
                    var i = this.dataseek * 13;
                    this.array[i++] = ps[j].x;
                    this.array[i++] = ps[j].y;
                    this.array[i++] = ps[j].z;
                    this.array[i++] = ps[j].r;
                    this.array[i++] = ps[j].g;
                    this.array[i++] = ps[j].b;
                    this.array[i++] = ps[j].a;
                    this.array[i++] = ps[j].r2;
                    this.array[i++] = ps[j].g2;
                    this.array[i++] = ps[j].b2;
                    this.array[i++] = ps[j].a2;
                    this.array[i++] = ps[j].u;
                    this.array[i++] = ps[j].v;
                    this.dataseek++;
                }
            }
            if (this.dataseek >= 1000) {
                this.endbatch();
            }
        };
        spriteBatcher.prototype.setRectClip = function (rect) {
            this.rectClip = rect;
        };
        spriteBatcher.prototype.closeRectClip = function () {
            this.rectClip = null;
        };
        return spriteBatcher;
    }());
    lighttool.spriteBatcher = spriteBatcher;
    //texture
    (function (textureformat) {
        textureformat[textureformat["RGBA"] = 1] = "RGBA";
        textureformat[textureformat["RGB"] = 2] = "RGB";
        textureformat[textureformat["GRAY"] = 3] = "GRAY";
    })(lighttool.textureformat || (lighttool.textureformat = {}));
    var textureformat = lighttool.textureformat;
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
                return new spriteColor(this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]);
            }
        };
        return texReader;
    }());
    lighttool.texReader = texReader;
    var spriteTexture = (function () {
        function spriteTexture(webgl, url, format, mipmap, linear) {
            var _this = this;
            if (url === void 0) { url = null; }
            if (format === void 0) { format = textureformat.RGBA; }
            if (mipmap === void 0) { mipmap = false; }
            if (linear === void 0) { linear = true; }
            this.img = null;
            this.loaded = false;
            this.width = 0;
            this.height = 0;
            this.mat = null;
            this.disposeit = false;
            this.pointbuf = [
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            ];
            this.webgl = webgl;
            this.format = format;
            this.mat = new spriteMat(); //ness
            this.mat.tex0 = this;
            this.mat.transparent = true;
            this.mat.shader = "spritedefault";
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
        spriteTexture.prototype._loadimg = function (mipmap, linear) {
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
        spriteTexture.fromRaw = function (webgl, img, format, mipmap, linear) {
            if (format === void 0) { format = textureformat.RGBA; }
            if (mipmap === void 0) { mipmap = false; }
            if (linear === void 0) { linear = true; }
            var st = new spriteTexture(webgl, null, format, mipmap, linear);
            st.texture = webgl.createTexture();
            st.img = img;
            st._loadimg(mipmap, linear);
            return st;
        };
        spriteTexture.prototype.getReader = function (redOnly) {
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
        spriteTexture.prototype.dispose = function () {
            if (this.texture == null && this.img != null)
                this.disposeit = true;
            if (this.texture != null) {
                this.webgl.deleteTexture(this.texture);
            }
        };
        spriteTexture.prototype.draw = function (spriteBatcher, uv, rect, c) {
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
            }
            spriteBatcher.setMat(this.mat);
            spriteBatcher.addRect(this.pointbuf);
        };
        spriteTexture.prototype.drawCustom = function (spriteBatcher, _mat, uv, rect, c, c2) {
            _mat.tex0 = this;
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
            }
            spriteBatcher.setMat(_mat);
            spriteBatcher.addRect(this.pointbuf);
        };
        return spriteTexture;
    }());
    lighttool.spriteTexture = spriteTexture;
    var sprite = (function () {
        function sprite() {
        }
        return sprite;
    }());
    lighttool.sprite = sprite;
    //atlas
    var spriteAtlas = (function () {
        function spriteAtlas(webgl, atlasurl, texture) {
            var _this = this;
            if (atlasurl === void 0) { atlasurl = null; }
            if (texture === void 0) { texture = null; }
            this.sprites = {};
            this.webgl = webgl;
            if (atlasurl == null) {
            }
            else {
                lighttool.loadTool.loadText(atlasurl, function (txt, err) {
                    _this._parse(txt);
                });
            }
            this.texture = texture;
        }
        spriteAtlas.fromRaw = function (webgl, txt, texture) {
            if (texture === void 0) { texture = null; }
            var sa = new spriteAtlas(webgl, null, texture);
            sa._parse(txt);
            return sa;
        };
        spriteAtlas.prototype._parse = function (txt) {
            var json = JSON.parse(txt);
            this.textureurl = json["t"];
            this.texturewidth = json["w"];
            this.textureheight = json["h"];
            var s = json["s"];
            for (var i in s) {
                var ss = s[i];
                var r = new sprite(); //ness
                r.x = (ss[1] + 0.5) / this.texturewidth;
                r.y = (ss[2] + 0.5) / this.textureheight;
                r.w = (ss[3] - 1) / this.texturewidth;
                r.h = (ss[4] - 1) / this.textureheight;
                r.xsize = ss[3];
                r.ysize = ss[4];
                this.sprites[ss[0]] = r;
            }
        };
        spriteAtlas.prototype.drawByTexture = function (sb, sname, rect, c) {
            if (this.texture == null)
                return;
            var r = this.sprites[sname];
            if (r == undefined)
                return;
            this.texture.draw(sb, r, rect, c);
        };
        return spriteAtlas;
    }());
    lighttool.spriteAtlas = spriteAtlas;
    //font
    var charinfo = (function () {
        function charinfo() {
        }
        return charinfo;
    }());
    lighttool.charinfo = charinfo;
    var spriteFont = (function () {
        function spriteFont(webgl, urlconfig, texture) {
            var _this = this;
            this.pointbuf = [
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            ];
            this.webgl = webgl;
            if (urlconfig != null) {
                lighttool.loadTool.loadText(urlconfig, function (txt, err) {
                    _this._parse(txt);
                });
            }
            this.texture = texture;
            this.mat = new spriteMat(); //ness
            this.mat.shader = "spritefont";
            this.mat.tex0 = this.texture;
            this.mat.transparent = true;
        }
        spriteFont.fromRaw = function (webgl, txt, texture) {
            if (texture === void 0) { texture = null; }
            var sf = new spriteFont(webgl, null, texture);
            sf._parse(txt);
            return sf;
        };
        spriteFont.prototype._parse = function (txt) {
            var d1 = new Date().valueOf();
            var json = JSON.parse(txt);
            //parse fontinfo
            var font = json["font"];
            this.fontname = font[0];
            this.pointSize = font[1];
            this.padding = font[2];
            this.lineHeight = font[3];
            this.baseline = font[4];
            this.atlasWidth = font[5];
            this.atlasHeight = font[6];
            //parse char map
            this.cmap = {};
            var map = json["map"];
            for (var c in map) {
                var finfo = new charinfo(); //ness
                this.cmap[c] = finfo;
                finfo.x = (map[c][0] - 0.5) / this.atlasWidth;
                finfo.y = (map[c][1] - 0.5) / this.atlasHeight;
                finfo.w = (map[c][2] + 1) / this.atlasWidth;
                finfo.h = (map[c][3] + 1) / this.atlasHeight;
                finfo.xSize = map[c][2];
                finfo.ySize = map[c][3];
                finfo.xOffset = map[c][4];
                finfo.yOffset = map[c][5];
                finfo.xAddvance = map[c][6];
            }
            map = null;
            json = null;
            var d2 = new Date().valueOf();
            var n = d2 - d1;
            console.log("json time=" + n);
        };
        spriteFont.prototype.draw = function (sb, r, rect, c, colorBorder) {
            if (c === void 0) { c = spriteColor.white; }
            if (colorBorder === void 0) { colorBorder = new spriteColor(0, 0, 0, 0.5); }
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = r.x;
                p.v = r.y + r.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = r.x + r.w;
                p.v = r.y + r.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = r.x;
                p.v = r.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = r.x + r.w;
                p.v = r.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
            }
            sb.setMat(this.mat);
            sb.addRect(this.pointbuf);
        };
        spriteFont.prototype.drawChar = function (sb, cname, rect, c, colorBorder) {
            if (c === void 0) { c = spriteColor.white; }
            if (colorBorder === void 0) { colorBorder = new spriteColor(0, 0, 0, 0.5); }
            var r = this.cmap[cname];
            if (r == undefined)
                return;
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = r.x;
                p.v = r.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = r.x + r.w;
                p.v = r.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = r.x;
                p.v = r.y + r.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = r.x + r.w;
                p.v = r.y + r.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
            }
            sb.setMat(this.mat);
            sb.addRect(this.pointbuf);
        };
        return spriteFont;
    }());
    lighttool.spriteFont = spriteFont;
})(lighttool || (lighttool = {}));
var light3d;
(function (light3d) {
    var renderTarget = (function () {
        function renderTarget() {
        }
        return renderTarget;
    }());
    light3d.renderTarget = renderTarget;
    var renderCamera = (function () {
        function renderCamera() {
            this.matView = new TSM.mat4();
            this.matProjP = new TSM.mat4();
            this.matProjO = new TSM.mat4();
            this.matProj = new TSM.mat4();
            this.asp = 1;
            this.near = 0.1;
            this.far = 1000;
            this.p_fov = Math.PI * 0.25;
            this.o_size = 10;
            this.opvalue = 1; //0=正交， 1=透视 中间值可以在两种相机间过度
            this.v_pos = new TSM.vec3(0, 0, -10);
            this.v_forward = new TSM.vec3(0, 0, 1);
            this.v_up = new TSM.vec3(0, 1, 0);
        }
        renderCamera.prototype.updateview = function () {
            TSM.mat4.sLookat(this.v_pos, this.v_forward, this.v_up, this.matView);
        };
        renderCamera.prototype.updateproj = function () {
            if (this.opvalue > 0)
                TSM.mat4.sPerspective(this.p_fov, this.asp, this.near, this.far, this.matProjP);
            if (this.opvalue < 1)
                TSM.mat4.sOrthographic(this.asp * this.o_size * -0.5, this.asp * this.o_size * 0.5, this.o_size * -0.5, this.o_size * 0.5, this.near, this.far, this.matProjO);
            if (this.opvalue == 0)
                this.matProjO.copy(this.matProj);
            else if (this.opvalue == 1)
                this.matProjP.copy(this.matProj);
            else
                TSM.mat4.sLerp(this.matProjO, this.matProjP, this.opvalue, this.matProj);
        };
        return renderCamera;
    }());
    light3d.renderCamera = renderCamera;
    var renderScene = (function () {
        function renderScene() {
            this.nodeRoot = new sceneNode();
            this.sortArray = [];
        }
        renderScene.prototype.render = function (line, cam) {
            this.nodeRoot.updateMatrix();
            this.sortArray.length = 0;
            //先随便画，只画那些有zwrite的，顺序无关，其他的丢到列表里
            this.nodeRoot.renderWithoutSort(line, cam, this.sortArray);
            //做个排序，再画
            this.sortArray.sort(function (a, b) {
                return (a.sortlayer * 10000 + a.sortz) - (b.sortlayer * 10000 + b.sortz);
            });
            //排完再画
            for (var ir = 0; ir < this.sortArray.length; ir++) {
                this.sortArray[ir].draw(line, cam);
            }
        };
        renderScene.prototype.update = function (delta) {
            this.nodeRoot.updateMatrix();
            this.nodeRoot.updateComponent(delta);
        };
        return renderScene;
    }());
    light3d.renderScene = renderScene;
    var sceneNode = (function () {
        function sceneNode() {
            this.parent = null;
            this.scene = null;
            this.children = [];
            this.components = [];
            this.matLocal = new TSM.mat4();
            this.matWorld = new TSM.mat4();
        }
        sceneNode.prototype.updateMatrix = function () {
            if (this.parent == null) {
                this.matLocal.copy(this.matWorld);
            }
            else {
                this.parent.matWorld.copy(this.matWorld);
                this.matWorld.multiply(this.matLocal);
            }
            for (var c in this.children) {
                this.children[c].updateMatrix();
            }
        };
        sceneNode.prototype.renderWithoutSort = function (line, cam, needsort) {
            for (var c in this.components) {
                var b = this.components[c];
                if (b.render != null) {
                    if (b.render.bshow == false)
                        continue;
                    if (b.render.sortlayer == 0)
                        b.render.draw(line, cam);
                    else
                        needsort.push(b.render);
                }
            }
        };
        sceneNode.prototype.addComponent = function (comp) {
            comp.node = this;
            this.components.push(comp);
            comp.init(this);
        };
        sceneNode.prototype.updateComponent = function (delta) {
            for (var c in this.components) {
                this.components[c].update(delta);
            }
        };
        return sceneNode;
    }());
    light3d.sceneNode = sceneNode;
})(light3d || (light3d = {}));
var light3d;
(function (light3d) {
    (function (typeUniform) {
        typeUniform[typeUniform["texture"] = 0] = "texture";
        typeUniform[typeUniform["float"] = 1] = "float";
        typeUniform[typeUniform["float4"] = 2] = "float4";
        typeUniform[typeUniform["float4x4"] = 3] = "float4x4";
    })(light3d.typeUniform || (light3d.typeUniform = {}));
    var typeUniform = light3d.typeUniform;
    var infoUniform = (function () {
        function infoUniform() {
        }
        return infoUniform;
    }());
    light3d.infoUniform = infoUniform;
    var shadercode = (function () {
        function shadercode() {
            //pos可以穷尽
            this.posPos = -1;
            this.posNormal = -1;
            this.posNormal2 = -1;
            this.posColor = -1;
            this.posColor2 = -1;
            this.posUV = -1;
            this.posUV2 = -1;
            this.posBoneA = -1;
            this.posBoneB = -1;
            //uni不能穷尽,都去map里查好了
            //unimapTexture: { [id: string]: WebGLUniformLocation } = {};
            //unimapFloat: { [id: string]: WebGLUniformLocation } = {};
            //unimapFloat4: { [id: string]: WebGLUniformLocation } = {};
            //unimapFloat4x4: { [id: string]: WebGLUniformLocation } = {};
            this.mapUniform = {};
        }
        shadercode.prototype.compile = function (webgl) {
            this.vs = webgl.createShader(webgl.VERTEX_SHADER);
            this.fs = webgl.createShader(webgl.FRAGMENT_SHADER);
            //分别编译shader
            webgl.shaderSource(this.vs, this.vscode);
            webgl.compileShader(this.vs);
            var r1 = webgl.getShaderParameter(this.vs, webgl.COMPILE_STATUS);
            if (r1 == false) {
                if (confirm(webgl.getShaderInfoLog(this.vs) + "\n" + "did you want see the code?")) {
                    alert(this.vscode);
                }
            }
            //
            webgl.shaderSource(this.fs, this.fscode);
            webgl.compileShader(this.fs);
            var r2 = webgl.getShaderParameter(this.fs, webgl.COMPILE_STATUS);
            if (r2 == false) {
                if (confirm(webgl.getShaderInfoLog(this.fs) + "\n" + "did you want see the code?")) {
                    alert(this.fscode);
                }
            }
            //program link
            this.program = webgl.createProgram();
            webgl.attachShader(this.program, this.vs);
            webgl.attachShader(this.program, this.fs);
            webgl.linkProgram(this.program);
            var r3 = webgl.getProgramParameter(this.program, webgl.LINK_STATUS);
            if (r3 == false) {
                alert(webgl.getProgramInfoLog(this.program));
            }
            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            this.posPos = webgl.getAttribLocation(this.program, "position");
            this.posColor = webgl.getAttribLocation(this.program, "color");
            this.posColor2 = webgl.getAttribLocation(this.program, "color2");
            this.posUV = webgl.getAttribLocation(this.program, "uv");
            this.posUV2 = webgl.getAttribLocation(this.program, "uv2");
            this.posNormal = webgl.getAttribLocation(this.program, "normal");
            this.posNormal2 = webgl.getAttribLocation(this.program, "normal2");
            this.posBoneA = webgl.getAttribLocation(this.program, "boneA");
            this.posBoneB = webgl.getAttribLocation(this.program, "boneB");
            for (var iname in this.mapUniform) {
                var item = this.mapUniform[iname];
                item.location = webgl.getUniformLocation(this.program, item.name);
            }
        };
        return shadercode;
    }());
    light3d.shadercode = shadercode;
    var shaderParser = (function () {
        function shaderParser() {
            this.mapshader = {};
        }
        shaderParser.prototype._parser = function (webgl, txt) {
            var s1 = txt.split("<--");
            for (var i in s1) {
                var s2 = s1[i].split("-->");
                var stag = s2[0].split(" "); //tags;
                var sshader = s2[1]; //正文
                var lastname = "";
                var lasttag = 0;
                for (var j in stag) {
                    var t = stag[j];
                    if (t.length == 0)
                        continue;
                    if (t == "vs") {
                        lasttag = 1;
                    }
                    else if (t == "fs") {
                        lasttag = 2;
                    }
                    else if (t == "info") {
                        lasttag = 3;
                    }
                    else {
                        lastname = t.substring(1, t.length - 1);
                    }
                }
                if (lastname.length == 0)
                    continue;
                if (this.mapshader[lastname] == undefined)
                    this.mapshader[lastname] = new shadercode(); //ness
                if (lasttag == 1)
                    this.mapshader[lastname].vscode = sshader;
                else if (lasttag == 2)
                    this.mapshader[lastname].fscode = sshader;
                else if (lasttag == 3)
                    this.mapshader[lastname].mapUniform = this._parseUni(webgl, sshader);
            }
        };
        shaderParser.prototype._parseUni = function (webgl, txt) {
            var json = JSON.parse(txt);
            var map = {};
            for (var iname in json) {
                var info = new infoUniform();
                map[iname] = info;
                info.name = iname;
                var t = json[iname].type;
                var ds = json[iname].defvalue;
                if (t == "texture") {
                    info.type = typeUniform.texture;
                    info.defvalue = light3d.texture.staticTexture(webgl, ds);
                }
                else if (t == "float") {
                    info.type = typeUniform.float;
                    info.defvalue = parseFloat(ds);
                }
                else if (t == "float4") {
                    info.type = typeUniform.float4;
                    var vs = ds.split(",");
                    info.defvalue = new TSM.vec4(parseFloat(vs[0]), parseFloat(vs[1]), parseFloat(vs[2]), parseFloat(vs[3]));
                }
                else if (t == "float4x4") {
                    info.type = typeUniform.float4x4;
                    info.defvalue = TSM.mat4.identity;
                }
            }
            return map;
        };
        shaderParser.prototype.parseUrl = function (webgl, url) {
            var _this = this;
            lighttool.loadTool.loadText(url, function (txt, err) {
                _this._parser(webgl, txt);
                _this.compile(webgl);
                //spriteBatcher
            });
        };
        shaderParser.prototype.parseDirect = function (webgl, txt) {
            this._parser(webgl, txt);
            this.compile(webgl);
        };
        shaderParser.prototype.dump = function () {
            for (var name in this.mapshader) {
                console.log("shadername:" + name);
                console.log("vs:" + this.mapshader[name].vscode);
                console.log("fs:" + this.mapshader[name].fscode);
            }
        };
        shaderParser.prototype.compile = function (webgl) {
            for (var name in this.mapshader) {
                this.mapshader[name].compile(webgl);
            }
        };
        return shaderParser;
    }());
    light3d.shaderParser = shaderParser;
})(light3d || (light3d = {}));
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
            return null;
        };
        return texture;
    }());
    light3d.texture = texture;
})(light3d || (light3d = {}));
var state_First = (function () {
    function state_First() {
        this.stxt = "hello world";
        this.sx = 25;
        this.sy = 125;
        this.x = 0;
        this.y = 0;
    }
    state_First.prototype.oninit = function (app) {
        this.app = app;
        this.app.pipeline.parseShaderUrl("res/3d.shader.txt"); //管线初始化shader
        lighttool.shaderMgr.parserInstance().parseUrl(app.webgl, "res/hud.shader.txt");
        lighttool.fontMgr.Instance().reg("f1", "res/f1.font.txt", "res/f1.png", "");
        this.scene = app.pipeline.scenes["scene0"];
        this.cam = app.pipeline.cameras["cam0"];
        var comp = new light3d.com_mesh();
        this.scene.nodeRoot.addComponent(comp);
        var data = light3d.meshData.genBox(0.1);
        comp.setmesh(app.webgl, data);
    };
    state_First.prototype.onexit = function (app) {
    };
    state_First.prototype.onupdate = function (app, delta) {
        this.cam.updateproj();
        this.cam.updateview();
        this.scene.update(delta);
    };
    state_First.prototype.onresize = function (app) {
    };
    state_First.prototype.onhud = function (canvas) {
        canvas.drawText("f1", this.stxt, new lighttool.spriteRect(this.sx, this.sy, 1000, 280));
        canvas.drawText("f1", "x=" + this.x + " | " + "y=" + this.y, new lighttool.spriteRect(0, 0, 500, 26), lighttool.spriteColor.white, new lighttool.spriteColor(1, 1, 1, 0.5));
        canvas.drawText("f1", "fps=" + this.app.fps, new lighttool.spriteRect(0, 26, 500, 26), new lighttool.spriteColor(1, 1, 0, 1), new lighttool.spriteColor(1, 1, 0, 0.5));
    };
    state_First.prototype.onpointevent = function (c, e, x, y) {
        this.x = x;
        this.y = y;
        return false;
    };
    return state_First;
}());
//# sourceMappingURL=all.js.map