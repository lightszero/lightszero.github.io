namespace light3d
{
    export interface IUserState
    {
        oninit(app: appRender);
        onexit(app: appRender);
        onupdate(app: appRender, delta: number);
        onresize(app: appRender);
        onhud(canvas: lighttool.spriteCanvas);
        onpointevent(c: lighttool.spriteCanvas, e: lighttool.canvaspointevent, x: number, y: number): boolean;
    }
    export class hud implements lighttool.canvasAction
    {
        app: appRender
        constructor(app: appRender)
        {
            this.app = app;
        }
        onresize(c: lighttool.spriteCanvas): void
        {
        }
        ondraw(c: lighttool.spriteCanvas): void
        {
            if (this.app.curState == null) return;
            this.app.curState.onhud(c);
        }

        onpointevent(c: lighttool.spriteCanvas, e: lighttool.canvaspointevent, x: number, y: number): boolean
        {
            if (this.app.curState == null) return;
            return this.app.curState.onpointevent(c, e, x, y);
        }

    }
    export class appRender
    {
        constructor(canvas: HTMLCanvasElement, state: IUserState)
        {
            this.canvas = canvas;
            this.curState = state;
        }
        webgl: WebGLRenderingContext;
        canvas: HTMLCanvasElement;
        curState: IUserState = null;
        pipeline: renderPipeLine = null;

        private _onresize()
        {
            if (this.curState != null)
            {
                this.curState.onresize(this);
            }
        }
        lasttime: number = Date.now();
        timer: number = 0;
        framecount: number = 0;
        fps: number = 0;
        private _onupdate()
        {
            if (this.curState != null)
            {
                var now: number = Date.now();
                var delta = (now - this.lasttime) / 1000.0; //用秒为delta的时间单位

                this.framecount++;
                this.timer += delta;
                if (this.timer > 1.0)
                {
                    this.fps = this.framecount / this.timer;
                    this.timer = 0;
                    this.framecount = 0;
                }
                this.curState.onupdate(this, delta);
                this.lasttime = now;
            }
        }
        changeState(state: IUserState)
        {
            if (this.curState != null)
                this.curState.onexit(this);
            this.curState = state;
            if (this.curState != null)
                this.curState.oninit(this);
        }

        private _init(): void
        {
            this.webgl = <WebGLRenderingContext>this.canvas.getContext('webgl') ||
                <WebGLRenderingContext>this.canvas.getContext("experimental-webgl");
            this.pipeline = new renderPipeLine(this.webgl);
            //renderpath
            this.pipeline.renderStep.push(new renderStep_Scene("scene0", null, "cam0"));
            this.pipeline.renderStep.push(new renderStep_Canvas(this.pipeline.webgl, new hud(this)));
            //rendercam
            this.pipeline.cameras["cam0"] = new renderCamera();
            this.pipeline.scenes["scene0"] = new renderScene();
        }
        Run(): void
        {
            this._init();

            setInterval(() =>
            {
                this._onupdate();
                this.pipeline.render();
            }, 10);

            window.addEventListener("resize", () =>
            {
                var el = this.canvas;
                el.width = el.clientWidth;
                el.height = el.clientHeight;
                el.width = el.clientWidth;
                el.height = el.clientHeight;

                this.pipeline.onscreenresize();
                this._onresize();
            });

            this.lasttime = Date.now();
            //启动状态逻辑
            var cs = this.curState;
            this.curState = null;
            this.changeState(cs);

        }
    }
    interface IRenderStep
    {
        render(line: renderPipeLine);
        onresize(line: renderPipeLine);
    }
    export class renderStep_Scene implements IRenderStep
    {
        constructor(scene: string, target: string, camera: string)
        {
            this.scene = scene;
            this.target = target;
            this.camera = camera;
        }
        target: string = null;//渲染目标，null 表示 render onScreen
        scene: string;
        camera: string;
        render(line: renderPipeLine)
        {
            if (this.target == null)
            {
                line.webgl.drawingBufferWidth = line.webgl.canvas.width;
                line.webgl.drawingBufferHeight = line.webgl.canvas.height;

                line.webgl.viewport(0, 0, line.webgl.drawingBufferWidth, line.webgl.drawingBufferHeight);
            }
            else
            {
                var t = line.targets[this.target];
                //use target de rt 和size
            }

            {
                //这里由clearoption控制
                line.webgl.clearColor(1.0, 0.0, 1.0, 1.0);
                line.webgl.clear(line.webgl.COLOR_BUFFER_BIT | line.webgl.DEPTH_BUFFER_BIT);
            }
            var c = line.cameras[this.camera];
            var s = line.scenes[this.scene];
            s.render(line, c);
        }
        onresize(line: renderPipeLine)
        {
        }
    }
    export class renderStep_Canvas implements IRenderStep
    {
        userAction: lighttool.canvasAction;
        canvas: lighttool.spriteCanvas;
        constructor(webgl: WebGLRenderingContext, userAction: lighttool.canvasAction)
        {
            this.userAction = userAction;

            var el = webgl.canvas;
            el.width = el.clientWidth;
            el.height = el.clientHeight;
            this.canvas = new lighttool.spriteCanvas(webgl, webgl.drawingBufferWidth, webgl.drawingBufferHeight);
            this.canvas.spriteBatcher.matrix = new Float32Array([
                1.0 * 2 / this.canvas.width, 0, 0, 0,//去掉asp的影响
                0, 1 * -1 * 2 / this.canvas.height, 0, 0,
                0, 0, 1, 0,
                -1, 1, 0, 1
            ]);
            this.canvas.spriteBatcher.ztest = false;//最前不需要ztest


            var c = this.canvas;
            el.onmousemove = (ev: MouseEvent) =>
            {
                this.userAction.onpointevent(c, lighttool.canvaspointevent.POINT_MOVE, ev.offsetX, ev.offsetY);
            };
            el.onmouseup = (ev: MouseEvent) =>
            {
                this.userAction.onpointevent(c, lighttool.canvaspointevent.POINT_UP, ev.offsetX, ev.offsetY);
            };
            el.onmousedown = (ev: MouseEvent) =>
            {
                this.userAction.onpointevent(c, lighttool.canvaspointevent.POINT_DOWN, ev.offsetX, ev.offsetY);
            };
        }
        render(line: renderPipeLine)
        {

            this.canvas.spriteBatcher.begindraw();

            this.userAction.ondraw(this.canvas);

            this.canvas.spriteBatcher.enddraw();
        }
        onresize(line: renderPipeLine)
        {
            var rc = this.canvas.webgl.canvas;
            this.canvas.width = rc.width;
            this.canvas.height = rc.height;
            this.canvas.spriteBatcher.matrix = new Float32Array([
                1.0 * 2 / this.canvas.width, 0, 0, 0,//去掉asp的影响
                0, 1 * -1 * 2 / this.canvas.height, 0, 0,
                0, 0, 1, 0,
                -1, 1, 0, 1
            ]);
            ////do resize func
            this.userAction.onresize(this.canvas);
        }
    }




    //画法管理器
    export class renderPipeLine
    {
        constructor(webgl: WebGLRenderingContext)
        {
            this.webgl = webgl;
        }
        webgl: WebGLRenderingContext;
        renderStep: IRenderStep[] = [];
        shaderParser: shaderParser = new shaderParser();
        parseShaderUrl(url: string, cb: () => void = null)
        {
            this.shaderParser.parseUrl(this.webgl, url, cb);
        }
        scenes: { [id: string]: renderScene } = {};
        targets: { [id: string]: renderTarget } = {};
        cameras: { [id: string]: renderCamera } = {};
        render()
        {
            //管线上有多个绘制场景，分别往不同的地方绘制
            for (var i = 0; i < this.renderStep.length; i++)
            {
                this.renderStep[i].render(this);
            }
            //但最终，一定要有一个往屏幕上画的过程
            this.webgl.flush();
        }
        onscreenresize()
        {
            for (var i = 0; i < this.renderStep.length; i++)
            {
                this.renderStep[i].onresize(this);
            }
        }
    }

}