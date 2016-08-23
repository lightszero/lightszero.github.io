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
            this.near = 0;
            this.far = 100;
            this.p_fov = Math.PI * 0.25;
            this.o_size = 2;
            this.opvalue = 0.5; //0=正交， 1=透视 中间值可以在两种相机间过度
            this.v_pos = new TSM.vec3(0, 10, -20);
            this.v_forward = new TSM.vec3(0, -0.5, 1);
            this.v_up = new TSM.vec3(0, 1, 0);
        }
        renderCamera.prototype.updateview = function () {
            TSM.mat4.sLookatLH(this.v_pos, this.v_forward, this.v_up, this.matView);
        };
        renderCamera.prototype.updateproj = function () {
            if (this.opvalue > 0)
                TSM.mat4.sPerspectiveLH(this.p_fov, this.asp, this.near, this.far, this.matProjP);
            if (this.opvalue < 1)
                TSM.mat4.sOrthoLH(this.asp * this.o_size, this.o_size, this.near, this.far, this.matProjO);
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
            this.hasInit = false;
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
            for (var c in this.children) {
                var cc = this.children[c];
                cc.renderWithoutSort(line, cam, needsort);
            }
        };
        sceneNode.prototype.addComponent = function (comp) {
            comp.node = this;
            this.components.push(comp);
            if (this.hasInit)
                comp.init(this);
        };
        sceneNode.prototype.addChild = function (node) {
            node.parent = this;
            this.children.push(node);
        };
        sceneNode.prototype.updateComponent = function (delta) {
            for (var c in this.components) {
                if (this.hasInit == false)
                    this.components[c].init(this);
                this.components[c].update(delta);
            }
            this.hasInit = true;
        };
        return sceneNode;
    }());
    light3d.sceneNode = sceneNode;
})(light3d || (light3d = {}));
//# sourceMappingURL=scene.js.map