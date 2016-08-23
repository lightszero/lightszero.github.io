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
        renderPipeLine.prototype.parseShaderUrl = function (url, cb) {
            if (cb === void 0) { cb = null; }
            this.shaderParser.parseUrl(this.webgl, url, cb);
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
//# sourceMappingURL=framework.js.map