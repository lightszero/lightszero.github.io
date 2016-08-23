namespace light3d
{


    export class mat
    {
        shader: string;
        hasInit: boolean = false;
        private _init(webgl: WebGLRenderingContext, shader: shaderPass)
        {
            for (var key in shader.mapUniform)
            {
                var u = shader.mapUniform[key];
                if (u.type == light3d.typeUniform.float)
                {
                    this.paramFloat[key] = <number>u.defvalue;
                }
                else if (u.type == light3d.typeUniform.float4)
                {
                    this.paramFloat4[key] = (<TSM.vec4>u.defvalue).copy();
                }
                else if (u.type == light3d.typeUniform.float4x4)
                {
                    this.paramFloat4x4[key] = (<TSM.mat4>u.defvalue).copy();
                }
                else if (u.type == light3d.typeUniform.texture)
                {
                    this.paramTexture[key] = <texture>u.defvalue;
                }
            }
            for (var key in shader.mapInfo["_def_"])
            {
                var v = shader.mapInfo["_def_"][key];
                if (key == "cull")
                {
                    if (v == "ccw")
                    {
                        this._culltag = 1;
                    }
                    else if (v == "cw")
                    {
                        this._culltag = 2;
                    }
                    else
                    {
                        this._culltag = 0;
                    }
                }
            }
            this.hasInit = true;
        }
        _culltag: number = 0;

        paramFloat: { [id: string]: number } = {};
        paramFloat4: { [id: string]: TSM.vec4 } = {};
        paramFloat4x4: { [id: string]: TSM.mat4 } = {};
        paramTexture: { [id: string]: texture } = {};
        uniform(webgl: WebGLRenderingContext, shader: shaderPass)
        {
            if (this.hasInit == false)
                this._init(webgl, shader);
            if (this.hasInit == false)
                return;
            //face cull
            if (this._culltag == 0)
            {
                webgl.disable(webgl.CULL_FACE);
            }
            else if (this._culltag == 1)
            {
                webgl.enable(webgl.CULL_FACE);
                webgl.frontFace(webgl.CCW);
            }
            else if (this._culltag == 2)
            {
                webgl.enable(webgl.CULL_FACE);
                webgl.frontFace(webgl.CW);
            }
            //zwrite
            webgl.depthMask(false);//这是zwrite
            //ztest 
            //if (this.ztest)
            //{
            //    this.webgl.enable(this.webgl.DEPTH_TEST);//这是ztest
            //    this.webgl.depthFunc(this.webgl.LEQUAL);//这是ztest方法
            //}
            //else
            {
                webgl.disable(webgl.DEPTH_TEST);//这是ztest
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
            //binddata

            webgl.useProgram(shader.program);



            var itex = 1;//默认的贴图序号
            for (var key in shader.mapUniform)
            {
                var u = shader.mapUniform[key];
                if (u.location == null) continue;
                if (u.type == light3d.typeUniform.float)
                {
                    webgl.uniform1f(u.location, this.paramFloat[key]);
                }
                else if (u.type == light3d.typeUniform.float4)
                {
                    let v = this.paramFloat4[key];
                    webgl.uniform4f(u.location, v.x, v.y, v.z, v.w);
                }
                else if (u.type == light3d.typeUniform.float4x4)
                {
                    let v = this.paramFloat4x4[key];
                    webgl.uniformMatrix4fv(u.location, false, v.values);
                }
                else if (u.type == light3d.typeUniform.texture)
                {
                    webgl.activeTexture(webgl.TEXTURE0 + itex);
                    var tex = this.paramTexture[key];
                    webgl.bindTexture(webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                    webgl.uniform1i(u.location, itex);

                    itex++;
                }
            }
        }
        collection(webgl: WebGLRenderingContext, shader: shaderPass, line: renderPipeLine, node: sceneNode, cam: renderCamera)
        {
            var _model = this.paramFloat4x4["_matModel"];
            if (_model != undefined)
            {
                node.matWorld.copy(_model);
            }

            var _view = this.paramFloat4x4["_matView"];
            if (_view != undefined)
            {
                cam.matView.copy(_view);
            }

            var _project = this.paramFloat4x4["_matProject"];
            if (_project != undefined)
            {
                cam.matProj.copy(_project);
            }

            var _modelviewproject = this.paramFloat4x4["_matModelViewProject"];
            if (_modelviewproject != undefined)
            {
                var mvp = node.matWorld.copy();
                mvp.multiply(cam.matView);
                mvp.multiply(cam.matProj);
                mvp.copy(_modelviewproject);
            }


            var _viewproject = this.paramFloat4x4["_matViewProject"];
            if (_viewproject != undefined)
            {
                var mvp = cam.matView.copy();
                mvp.multiply(cam.matProj);
                mvp.copy(_viewproject);
            }
        }
    }

    export class meshData
    {
        pos: TSM.vec3[];//use pos.length 作为定点数量
        color: lighttool.spriteColor[];
        color2: lighttool.spriteColor[];
        uv: TSM.vec2[];
        uv2: TSM.vec2[];
        normal: TSM.vec3[];
        normal2: TSM.vec3[];
        boneIndexA: Uint8Array;
        boneIndexB: Uint8Array;
        boneWeightA: number[];
        boneWeightB: number[];
        //三角形索引
        trisindex: number[];
        static addQuadPos(data: meshData, quad: TSM.vec3[]): void
        {
            var istart = data.pos.length;
            meshData.addQuadVec3(data.pos, quad);
            for (var i = 0; i < 6; i++)
                data.trisindex.push(istart + i);
        }
        static addQuadVec3ByValue(array: TSM.vec3[], value: TSM.vec3): void
        {
            for (var i = 0; i < 6; i++)
                array.push(value.copy());
        }
        static addQuadVec3(array: TSM.vec3[], quad: TSM.vec3[]): void
        {
            array.push(quad[0]);
            array.push(quad[1]);
            array.push(quad[2]);
            array.push(quad[2]);
            array.push(quad[1]);
            array.push(quad[3]);
        }
        static addQuadVec2(array: TSM.vec2[], quad: TSM.vec2[]): void
        {
            array.push(quad[0]);
            array.push(quad[1]);
            array.push(quad[2]);
            array.push(quad[2]);
            array.push(quad[1]);
            array.push(quad[3]);
        }
        static genBoxCCW(size: number): meshData
        {
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
                new TSM.vec3(-half, half, half),
                new TSM.vec3(-half, half, -half),
                new TSM.vec3(half, half, half),
                new TSM.vec3(half, half, -half)
            ]);
            meshData.addQuadVec2(data.uv, [
                new TSM.vec2(0, 0),
                new TSM.vec2(0, 1),
                new TSM.vec2(1, 0),
                new TSM.vec2(1, 1),
            ]);
            //back
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
            //front
            meshData.addQuadVec3ByValue(data.normal, new TSM.vec3(0, 0, -1));
            meshData.addQuadPos(data, [
                new TSM.vec3(-half, half, -half),
                new TSM.vec3(-half, -half, -half),
                new TSM.vec3(half, half, -half),
                new TSM.vec3(half, -half, -half)
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
                new TSM.vec3(-half, -half, half),
                new TSM.vec3(-half, -half, -half),
                new TSM.vec3(-half, half, half),
                new TSM.vec3(-half, half, -half)
            ]);
            meshData.addQuadVec2(data.uv, [
                new TSM.vec2(0, 0),
                new TSM.vec2(0, 1),
                new TSM.vec2(1, 0),
                new TSM.vec2(1, 1),
            ]);
            return data;
        }
    }
    export class meshGL
    {
        vbo: WebGLBuffer;
        vertexCount: number;
        vertexSize: number;
        ebo: WebGLBuffer;
        indexCount: number;
        line: boolean = false;

        bindColor: boolean = false;
        bindColor2: boolean = false;
        bindUV: boolean = false;
        bindUV2: boolean = false;
        bindNormal: boolean = false;
        bindNormal2: boolean = false;
        bindBoneIndexA: boolean = false;
        bindBoneWeightA: boolean = false;
        bindBoneIndexB: boolean = false;
        bindBoneWeightB: boolean = false;

        calcByteSize(): number
        {
            var total = 12;//pos
            if (this.bindColor) total += 16;
            if (this.bindColor2) total += 16;
            if (this.bindUV) total += 8;
            if (this.bindUV2) total += 8;
            if (this.bindNormal) total += 12;
            if (this.bindNormal2) total += 12;
            if (this.bindBoneIndexA) total += 4;
            if (this.bindBoneWeightA) total += 4;
            if (this.bindBoneIndexB) total += 4;
            if (this.bindBoneWeightB) total += 4;
            return total;
        }
        bind(webgl: WebGLRenderingContext, shadercode: shaderPass)
        {
            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.ebo);


            var total = this.vertexSize * 4;

            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            var seek = 0;
            {//pos
                if (shadercode.posPos >= 0)
                {
                    webgl.enableVertexAttribArray(shadercode.posPos);
                    webgl.vertexAttribPointer(shadercode.posPos, 3, webgl.FLOAT, false, total, seek);
                }
                seek += 12;
            }
            if (this.bindColor)
            {
                if (shadercode.posColor >= 0)
                {
                    webgl.enableVertexAttribArray(shadercode.posColor);
                    webgl.vertexAttribPointer(shadercode.posColor, 4, webgl.FLOAT, false, total, seek);
                }
                seek += 16;
            }
            if (this.bindColor2)
            {
                if (shadercode.posColor2 >= 0)
                {
                    webgl.enableVertexAttribArray(shadercode.posColor2);
                    webgl.vertexAttribPointer(shadercode.posColor2, 4, webgl.FLOAT, false, total, seek);
                }
                seek += 16;
            }
            if (this.bindUV)
            {
                if (shadercode.posUV >= 0)
                {
                    webgl.enableVertexAttribArray(shadercode.posUV);
                    webgl.vertexAttribPointer(shadercode.posUV, 2, webgl.FLOAT, false, total, seek);
                }
                seek += 8;
            }
            if (this.bindUV2)
            {
                if (shadercode.posUV2 >= 0)
                {
                    webgl.enableVertexAttribArray(shadercode.posUV2);
                    webgl.vertexAttribPointer(shadercode.posUV2, 2, webgl.FLOAT, false, total, seek);
                }
                seek += 8;
            }
            if (this.bindNormal)
            {
                if (shadercode.posNormal >= 0)
                {
                    webgl.enableVertexAttribArray(shadercode.posNormal);
                    webgl.vertexAttribPointer(shadercode.posNormal, 3, webgl.FLOAT, true, total, seek);
                }
                seek += 12;
            }
            if (this.bindNormal2)
            {
                if (shadercode.posNormal2 >= 0)
                {
                    webgl.enableVertexAttribArray(shadercode.posNormal2);
                    webgl.vertexAttribPointer(shadercode.posNormal2, 3, webgl.FLOAT, true, total, seek);
                }
                seek += 12;
            }
            if (this.bindBoneIndexA)
            {
                if (shadercode.posBoneA)
                {
                    webgl.enableVertexAttribArray(shadercode.posBoneA);
                    webgl.vertexAttribPointer(shadercode.posBoneA, 1, webgl.INT, false, total, seek);
                }
                seek += 4;
            }
            if (this.bindBoneIndexB)
            {
                if (shadercode.posBoneB)
                {
                    webgl.enableVertexAttribArray(shadercode.posBoneB);
                    webgl.vertexAttribPointer(shadercode.posBoneB, 1, webgl.INT, false, total, seek);
                }
                seek += 4;
            }
        }
        genVBO(webgl: WebGLRenderingContext, data: meshData)
        {
            this.vertexCount = data.pos.length;
            this.vertexSize = this.calcByteSize() / 4;
            var total = this.vertexSize;
            var varray = new Float32Array(total * data.pos.length);
            for (var i = 0; i < data.pos.length; i++)
            {
                var nseek = 0;
                varray[i * total + nseek] = data.pos[i].x; nseek++;
                varray[i * total + nseek] = data.pos[i].y; nseek++;
                varray[i * total + nseek] = data.pos[i].z; nseek++;
                if (this.bindColor)
                {
                    if (data.color == undefined || data.color.length == 0)
                    {
                        varray[i * total + nseek] = 1; nseek++;
                        varray[i * total + nseek] = 1; nseek++;
                        varray[i * total + nseek] = 1; nseek++;
                        varray[i * total + nseek] = 1; nseek++;
                    }
                    else
                    {
                        varray[i * total + nseek] = data.color[i].r; nseek++;
                        varray[i * total + nseek] = data.color[i].g; nseek++;
                        varray[i * total + nseek] = data.color[i].b; nseek++;
                        varray[i * total + nseek] = data.color[i].a; nseek++;
                    }
                }
                if (this.bindColor2)
                {
                    if (data.color2 == undefined || data.color2.length == 0)
                    {
                        varray[i * total + nseek] = 1; nseek++;
                        varray[i * total + nseek] = 1; nseek++;
                        varray[i * total + nseek] = 1; nseek++;
                        varray[i * total + nseek] = 1; nseek++;
                    }
                    else
                    {
                        varray[i * total + nseek] = data.color2[i].r; nseek++;
                        varray[i * total + nseek] = data.color2[i].g; nseek++;
                        varray[i * total + nseek] = data.color2[i].b; nseek++;
                        varray[i * total + nseek] = data.color2[i].a; nseek++;
                    }
                }
                if (this.bindUV)
                {
                    if (data.uv == undefined || data.uv.length == 0)
                    {
                        varray[i * total + nseek] = 0; nseek++;
                        varray[i * total + nseek] = 0; nseek++;
                    }
                    else
                    {
                        varray[i * total + nseek] = data.uv[i].x; nseek++;
                        varray[i * total + nseek] = data.uv[i].y; nseek++;
                    }
                }
                if (this.bindUV2)
                {
                    if (data.uv2 == undefined || data.uv2.length == 0)
                    {
                        varray[i * total + nseek] = 0; nseek++;
                        varray[i * total + nseek] = 0; nseek++;
                    }
                    else
                    {
                        varray[i * total + nseek] = data.uv2[i].x; nseek++;
                        varray[i * total + nseek] = data.uv2[i].y; nseek++;
                    }
                }
                if (this.bindNormal)
                {
                    if (data.normal == undefined || data.normal.length == 0)
                    {
                        varray[i * total + nseek] = 0; nseek++;
                        varray[i * total + nseek] = 0; nseek++;
                        varray[i * total + nseek] = 0; nseek++;
                    }
                    else
                    {
                        varray[i * total + nseek] = data.normal[i].x; nseek++;
                        varray[i * total + nseek] = data.normal[i].y; nseek++;
                        varray[i * total + nseek] = data.normal[i].z; nseek++;
                    }
                }
                if (this.bindNormal2)
                {
                    if (data.normal2 == undefined || data.normal2.length == 0)
                    {
                        varray[i * total + nseek] = 0; nseek++;
                        varray[i * total + nseek] = 0; nseek++;
                        varray[i * total + nseek] = 0; nseek++;
                    }
                    else
                    {
                        varray[i * total + nseek] = data.normal2[i].x; nseek++;
                        varray[i * total + nseek] = data.normal2[i].y; nseek++;
                        varray[i * total + nseek] = data.normal2[i].z; nseek++;
                    }
                }
                if (this.bindBoneIndexA)
                {
                    if (data.boneIndexA == undefined || data.boneIndexA.length == 0)
                    {
                        varray[i * total + nseek] = 0; nseek++;
                    }
                    else
                    {
                        varray[i * total + nseek] = data.boneIndexA[i]; nseek++;
                    }
                }
                if (this.bindBoneIndexB)
                {
                    if (data.boneIndexB == undefined || data.boneIndexB.length == 0)
                    {
                        varray[i * total + nseek] = 0; nseek++;
                    }
                    else
                    {
                        varray[i * total + nseek] = data.boneIndexB[i]; nseek++;
                    }
                }
            }

            this.vbo = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);
            webgl.bufferData(webgl.ARRAY_BUFFER, varray, webgl.STATIC_DRAW);
        }
        genIndex(webgl: WebGLRenderingContext, data: meshData, line: boolean = false)
        {
            this.line = line;

            var size = ((data.trisindex.length / 3) | 0) * 3;
            if (line) size *= 2;

            this.indexCount = size;
            var index = new Uint16Array(size);


            for (var i = 0; i < ((data.trisindex.length / 3) | 0); i++)
            {
                var a = data.trisindex[i * 3 + 0];
                var b = data.trisindex[i * 3 + 1];
                var c = data.trisindex[i * 3 + 2];

                if (this.line)
                {
                    index[i * 6 + 0] = a;
                    index[i * 6 + 1] = b;
                    index[i * 6 + 2] = b;
                    index[i * 6 + 3] = c;
                    index[i * 6 + 4] = c;
                    index[i * 6 + 5] = a;
                }
                else
                {
                    index[i * 3 + 0] = a;
                    index[i * 3 + 1] = b;
                    index[i * 3 + 2] = c;
                }
            }

            this.ebo = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.ebo);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, index, webgl.STATIC_DRAW);
        }
    }


    export class com_mesh implements nodeComponent, INodeRender
    {
        node: sceneNode;
        render: INodeRender;//组件是否有绘制能力
        mat: mat;

        constructor()
        {
            this.bshow = true;
            this.sortlayer = 0; //由材质决定
            this.sortz = 0;//update的时候算出来
            this.render = this;//自己实现自己的Render也是可以的，屌不屌

            this.mesh = new meshGL();//mesh的实例不应该在这里管理，这个慢慢来
            this.mesh.bindColor = true;
            this.mesh.bindColor2 = true;
            this.mesh.bindUV = true;
            this.mesh.bindNormal = true;
            this.mesh.bindNormal2 = true;


            this.mat = new mat();
            this.mat.shader = "test";
        }
        init()
        {

        }
        update()
        {
            this.sortz = this.node.matWorld.at(14);
        }


        bshow: boolean;//是否绘制
        sortlayer: number;//=0 表示不排序，直接画，>0 放在不同的排序层里 ，越大的越后画
        draw(line: renderPipeLine, cam: renderCamera)
        {
            //逻辑全了，怎么把东西画出来
            var webgl = line.webgl;

            var shader = line.shaderParser.mapshader[this.mat.shader];
            if (shader == null) return;
            //各种状态

            //组合mvp
            this.mat.collection(webgl, shader, line, this.node, cam)

            this.mat.uniform(webgl, shader);

            this.mesh.bind(webgl, shader);

            var mode = this.mesh.line ? webgl.LINES : webgl.TRIANGLES;
            webgl.drawElements(mode, this.mesh.indexCount, webgl.UNSIGNED_SHORT, 0);
        }
        sortz: number;

        private mesh: meshGL;
        setmesh(webgl: WebGLRenderingContext, data: meshData, line: boolean = false)
        {
            this.mesh.genVBO(webgl, data);
            this.mesh.genIndex(webgl, data, line);
        }
    }

}