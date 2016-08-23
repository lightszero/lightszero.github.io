declare var saveAs: (b:Blob,f:string) => void;
class state_First implements light3d.IUserState
{
    app: light3d.appRender;
    scene: light3d.renderScene;
    cam: light3d.renderCamera;

    cubenode: light3d.sceneNode;
    dataURLtoBlob(dataurl)
    {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--)
        {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    oninit(app: light3d.appRender)
    {
        this.app = app;

        var openpic = document.getElementById("openpic") as HTMLInputElement;
        var savepic = document.getElementById("savepic") as HTMLButtonElement;
        var pic = document.getElementById("pic") as HTMLImageElement;


        savepic.onclick = () =>
        {
            var b = new Blob(["test hellofuck"], { type: 'text/html' });
            var b2 = this.dataURLtoBlob(pic.src);
            var blob: File = openpic.files[0];

            saveAs(b2, "1.jpg");
        }


        var edit = ace.edit(document.getElementById("editor"));
        edit.setFontSize("24");
        edit.setTheme("ace/theme/chrome");
        edit.getSession().setMode("ace/mode/glsl");
        var edit2 = ace.edit(document.getElementById("editor2"));
        edit2.setTheme("ace/theme/twilight");
        edit2.getSession().setMode("ace/mode/glsl");
        var edit3 = ace.edit(document.getElementById("editor3"));
        edit3.setTheme("ace/theme/twilight");
        edit3.getSession().setMode("ace/mode/glsl");

        this.app.pipeline.parseShaderUrl("res/3d.shader.txt?" + Math.random()
            ,
            () =>
            {
                var s = this.app.pipeline.shaderParser.mapshader["test"];
                edit.setValue(s.infocode, 0);
                edit.clearSelection();
                edit2.setValue(s.vscode, 0);
                edit2.clearSelection();
                edit3.setValue(s.fscode, 0);
                edit3.clearSelection();
            }
        );//管线初始化shader


        lighttool.shaderMgr.parserInstance().parseUrl(app.webgl, "res/hud.shader.txt?" + Math.random());
        lighttool.fontMgr.Instance().reg("f1", "res/f1.font.txt", "res/f1.png", "");

        this.scene = app.pipeline.scenes["scene0"];
        this.cam = app.pipeline.cameras["cam0"];
        this.cam.asp = window.innerWidth / window.innerHeight;
        //给根节点加上cube 属性
        this.cubenode = new light3d.sceneNode();
        this.scene.nodeRoot.addChild(this.cubenode);

        var cube = new light3d.com_mesh();
        var data = light3d.meshData.genBoxCCW(0.3);
        cube.setmesh(app.webgl, data, false);
        this.cubenode.addComponent(cube);
        openpic.onchange = () =>
        {
            var blob: File = openpic.files[0];

            var reader = new FileReader();
            reader.onload = (event) =>
            {
                var t: any = event.target;
                var url: string = t.result;
                cube.mat.paramTexture["tex0"] = new light3d.texture(this.app.webgl, url);
                
            };
            reader.readAsDataURL(blob);
        }

    }
    timer: number = 0;
    onexit(app: light3d.appRender)
    {

    }
    onupdate(app: light3d.appRender, delta: number)
    {
        this.timer += delta;
        this.cubenode.matLocal.rotate(delta, TSM.vec3.up);
        //this.cubenode.matLocal.rotate(delta, TSM.vec3.right);

        this.cam.updateproj();
        this.cam.updateview();
        this.scene.update(delta);
    }
    onresize(app: light3d.appRender)
    {

    }
    stxt: string = "hello world";
    sx: number = 25;
    sy: number = 125;
    onhud(canvas: lighttool.spriteCanvas)
    {
        canvas.drawText("f1", this.stxt, new lighttool.spriteRect(this.sx, this.sy, 1000, 280));
        canvas.drawText("f1", "x=" + this.x + " | " + "y=" + this.y, new lighttool.spriteRect(0, 0, 500, 26), lighttool.spriteColor.white, new lighttool.spriteColor(1, 1, 1, 0.5));
        canvas.drawText("f1", "fps=" + this.app.fps, new lighttool.spriteRect(0, 26, 500, 26), new lighttool.spriteColor(1, 1, 0, 1), new lighttool.spriteColor(1, 1, 0, 0.5));
    }
    x: number = 0;
    y: number = 0;
    onpointevent(c: lighttool.spriteCanvas, e: lighttool.canvaspointevent, x: number, y: number): boolean
    {
        this.x = x;
        this.y = y;

        return false;
    }

}