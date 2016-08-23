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
        shaderParser.prototype.parseUrl = function (webgl, url, cb) {
            var _this = this;
            if (cb === void 0) { cb = null; }
            lighttool.loadTool.loadText(url, function (txt, err) {
                _this._parser(txt);
                _this.compile(webgl);
                if (cb != null)
                    cb.call(null);
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
//# sourceMappingURL=spritebatcher.js.map