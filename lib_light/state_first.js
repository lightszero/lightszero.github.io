var state_First = (function () {
    function state_First() {
        this.timer = 0;
        this.stxt = "hello world";
        this.sx = 25;
        this.sy = 125;
        this.x = 0;
        this.y = 0;
    }
    state_First.prototype.dataURLtoBlob = function (dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };
    state_First.prototype.oninit = function (app) {
        var _this = this;
        this.app = app;
        var openpic = document.getElementById("openpic");
        var savepic = document.getElementById("savepic");
        var pic = document.getElementById("pic");
        savepic.onclick = function () {
            var b = new Blob(["test hellofuck"], { type: 'text/html' });
            var b2 = _this.dataURLtoBlob(pic.src);
            var blob = openpic.files[0];
            saveAs(b2, "1.jpg");
        };
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
        this.app.pipeline.parseShaderUrl("res/3d.shader.txt?" + Math.random(), function () {
            var s = _this.app.pipeline.shaderParser.mapshader["test"];
            edit.setValue(s.infocode, 0);
            edit.clearSelection();
            edit2.setValue(s.vscode, 0);
            edit2.clearSelection();
            edit3.setValue(s.fscode, 0);
            edit3.clearSelection();
        }); //管线初始化shader
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
        openpic.onchange = function () {
            var blob = openpic.files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                var t = event.target;
                var url = t.result;
                cube.mat.paramTexture["tex0"] = new light3d.texture(_this.app.webgl, url);
            };
            reader.readAsDataURL(blob);
        };
    };
    state_First.prototype.onexit = function (app) {
    };
    state_First.prototype.onupdate = function (app, delta) {
        this.timer += delta;
        this.cubenode.matLocal.rotate(delta, TSM.vec3.up);
        //this.cubenode.matLocal.rotate(delta, TSM.vec3.right);
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
//# sourceMappingURL=state_first.js.map