namespace light3d
{
    export enum typeUniform
    {
        texture,
        float,
        float4,
        float4x4,
    }
    export class uniform
    {
        name: string;
        type: typeUniform;
        location: WebGLUniformLocation;
        defvalue: texture | number | TSM.vec4 | TSM.mat4;
    }

    export class shaderPass
    {
        vscode: string;
        fscode: string;
        infocode: string;//配置式
        vs: WebGLShader;
        fs: WebGLShader;
        program: WebGLProgram;

        //pos可以穷尽
        posPos: number = -1;
        posNormal: number = -1;
        posNormal2: number = -1;
        posColor: number = -1;
        posColor2: number = -1;
        posUV: number = -1;
        posUV2: number = -1;
        posBoneA: number = -1;
        posBoneB: number = -1;


        //uni不能穷尽,都去map里查好了
        //unimapTexture: { [id: string]: WebGLUniformLocation } = {};
        //unimapFloat: { [id: string]: WebGLUniformLocation } = {};
        //unimapFloat4: { [id: string]: WebGLUniformLocation } = {};
        //unimapFloat4x4: { [id: string]: WebGLUniformLocation } = {};

        mapUniform: { [id: string]: uniform } = {};
        mapInfo: { [id: string]: { [id: string]: string } } = {};
        private _scanUniform(txt: string)
        {
            var lines = txt.split("\n");
            for (var i in lines)
            {
                var line = lines[i];

                var words = line.match(new RegExp("([_a-zA-Z0-9]+)|([/=;]+)", "g"));
                if (words != null && words.length >= 3 && words[0] == "uniform")
                {
                    var t = words[1];
                    var n = words[2];
                    var info: uniform = new uniform();
                    this.mapUniform[n] = info;
                    info.name = n;
                    if (t == "sampler2D")
                    {
                        info.type = typeUniform.texture;
                        info.defvalue = null;
                    }
                    else if (t == "float")
                    {
                        info.type = typeUniform.float;
                        info.defvalue = 0;
                    }
                    else if (t == "vec4")
                    {
                        info.type = typeUniform.float4;
                        info.defvalue = new TSM.vec4(0, 0, 0, 0);
                    }
                    else if (t == "mat4")
                    {
                        info.type = typeUniform.float4x4;
                        info.defvalue = TSM.mat4.identity;
                    }
                }
            }
        }
        private _scanInfo(webgl: WebGLRenderingContext, txt: string)
        {
            if (this.mapInfo["_def_"] == undefined)
                this.mapInfo["_def_"] = {};


            var lines = txt.split("\n");
            for (var i in lines)
            {
                var line = lines[i];

                var words = line.match(new RegExp("([_a-zA-Z0-9]+)|([/=;]+)", "g"));
                if (words != null && words.length >= 2)
                {
                    if (words[0].charAt(0) == "/" || words[0].charAt(0) == "=" && words[0].charAt(0) == ";")
                        continue;
                    var c0 = words[0];
                    var c1 = words[1];
                    var c2 = null;
                    if (c1 == "=")
                    {
                        c1 = words[2];
                    }
                    else if (words.length >= 4 && words[2] == "=")
                    {
                        c2 = words[3];
                    }

                    if (c2 != null)
                    {// cmd x = y 模式 this.mapinfo[cmd][x]=y
                        if (this.mapInfo[c0] == undefined)
                            this.mapInfo[c0] = {};
                        this.mapInfo[c0][c1] = c2;
                        if (c0 == "defvalue")
                        {
                            var u = this.mapUniform[c1];
                            if (u != undefined)
                            {
                                if (u.type == typeUniform.texture)
                                {
                                    u.defvalue = texture.staticTexture(webgl, c2);
                                }
                            }
                        }
                    }
                    else
                    {// x y 模式 this.mapinfo["_def_"][x]=y
                        this.mapInfo["_def_"][c0] = c1;
                    }
                }
            }
        }

        scanCode(webgl: WebGLRenderingContext)
        {
            this._scanUniform(this.vscode);
            this._scanUniform(this.fscode);
            if (this.infocode != undefined)
            {
                this._scanInfo(webgl, this.infocode);
            }
        }
        compile(webgl: WebGLRenderingContext)
        {
            this.vs = webgl.createShader(webgl.VERTEX_SHADER);
            this.fs = webgl.createShader(webgl.FRAGMENT_SHADER);

            //分别编译shader
            webgl.shaderSource(this.vs, this.vscode);
            webgl.compileShader(this.vs);
            var r1 = webgl.getShaderParameter(this.vs, webgl.COMPILE_STATUS);
            if (r1 == false)
            {
                if (confirm(webgl.getShaderInfoLog(this.vs) + "\n" + "did you want see the code?"))
                {
                    alert(this.vscode);
                }

            }
            //
            webgl.shaderSource(this.fs, this.fscode);
            webgl.compileShader(this.fs);
            var r2 = webgl.getShaderParameter(this.fs, webgl.COMPILE_STATUS);
            if (r2 == false)
            {
                if (confirm(webgl.getShaderInfoLog(this.fs) + "\n" + "did you want see the code?"))
                {
                    alert(this.fscode);
                }
            }

            //program link
            this.program = webgl.createProgram();

            webgl.attachShader(this.program, this.vs);
            webgl.attachShader(this.program, this.fs);

            webgl.linkProgram(this.program);
            var r3 = webgl.getProgramParameter(this.program, webgl.LINK_STATUS);
            if (r3 == false)
            {
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

            for (var iname in this.mapUniform)
            {
                var item = this.mapUniform[iname];
                item.location = webgl.getUniformLocation(this.program, item.name);
            }
        }
    }
    export class shaderParser
    {
        mapshader: { [id: string]: shaderPass } = {};
        private _parser(webgl: WebGLRenderingContext, txt: string): void
        {
            var needupdate: {} = {};
            var s1 = txt.split("<--");
            for (var i in s1)
            {
                var s2 = s1[i].split("-->");
                var stag = s2[0].split(" ");//tags;
                var sshader = s2[1];//正文
                var lastname: string = "";
                var lasttag: number = 0;

                for (var j in stag)
                {
                    var t = stag[j];
                    if (t.length == 0) continue;
                    if (t == "vs")//vectexshader
                    {
                        lasttag = 1;
                    }
                    else if (t == "fs")//fragmentshader
                    {
                        lasttag = 2;
                    }
                    else if (t == "info")
                    {
                        lasttag = 3;
                    }
                    else
                    {
                        lastname = t.substring(1, t.length - 1);
                    }
                }
                if (lastname.length == 0) continue;
                if (this.mapshader[lastname] == undefined)
                    this.mapshader[lastname] = new shaderPass();//ness
                needupdate[lastname] = 1;
                if (lasttag == 1)
                {
                    this.mapshader[lastname].vscode = sshader;
                }
                else if (lasttag == 2)
                {
                    this.mapshader[lastname].fscode = sshader;
                }
                else if (lasttag == 3)
                {
                    this.mapshader[lastname].infocode = sshader;
                }


            }
            for (var key in needupdate)
            {
                this.mapshader[key].scanCode(webgl);
            }
        }


        parseUrl(webgl: WebGLRenderingContext, url: string, cb: () => void = null)
        {
            lighttool.loadTool.loadText(url, (txt, err) =>
            {
                this._parser(webgl, txt);
                this.compile(webgl);
                if (cb != null)
                    cb.call(null);
            }
            );
        }
        parseDirect(webgl: WebGLRenderingContext, txt: string)
        {
            this._parser(webgl, txt);
            this.compile(webgl);
        }
        dump(): void
        {
            for (var name in this.mapshader)
            {
                console.log("shadername:" + name);
                console.log("vs:" + this.mapshader[name].vscode);
                console.log("fs:" + this.mapshader[name].fscode);
            }

        }
        compile(webgl: WebGLRenderingContext)
        {
            for (var name in this.mapshader)
            {
                this.mapshader[name].compile(webgl);
            }
        }
    }

}