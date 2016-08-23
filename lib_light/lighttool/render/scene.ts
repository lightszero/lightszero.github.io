namespace light3d
{
    export class renderTarget
    {
    }
    export class renderCamera
    {
        matView: TSM.mat4 = new TSM.mat4();
        matProjP: TSM.mat4 = new TSM.mat4();
        matProjO: TSM.mat4 = new TSM.mat4();
        matProj: TSM.mat4 = new TSM.mat4();

        asp: number = 1;
        near: number = 0;
        far: number = 100;

        p_fov: number = Math.PI * 0.25;
        o_size: number = 2;
        opvalue: number = 0.5;//0=正交， 1=透视 中间值可以在两种相机间过度

        v_pos: TSM.vec3 = new TSM.vec3(0, 10, -20);
        v_forward: TSM.vec3 = new TSM.vec3(0, -0.5, 1);
        v_up: TSM.vec3 = new TSM.vec3(0, 1, 0);
        updateview()
        {
            TSM.mat4.sLookatLH(this.v_pos, this.v_forward, this.v_up, this.matView);
        }
        updateproj()
        {
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
        }
    }

    export class renderScene
    {
        render(line: renderPipeLine, cam: renderCamera)
        {
            this.nodeRoot.updateMatrix();
            this.sortArray.length = 0;
            //先随便画，只画那些有zwrite的，顺序无关，其他的丢到列表里
            this.nodeRoot.renderWithoutSort(line, cam, this.sortArray);
            //做个排序，再画
            this.sortArray.sort((a, b) =>
            {
                return (a.sortlayer * 10000 + a.sortz) - (b.sortlayer * 10000 + b.sortz);
            }
            );
            //排完再画
            for (var ir = 0; ir < this.sortArray.length; ir++)
            {
                this.sortArray[ir].draw(line, cam);
            }
        }
        update(delta: number)
        {
            this.nodeRoot.updateMatrix();
            this.nodeRoot.updateComponent(delta);
        }

        nodeRoot: sceneNode = new sceneNode();
        sortArray: INodeRender[] = [];
    }
    export interface INodeRender
    {
        bshow: boolean;//是否绘制
        sortlayer: number;//=0 表示不排序，直接画，>0 放在不同的排序层里 ，越大的越后画
        sortz: number;
        draw(line: renderPipeLine, cam: renderCamera);
    }
    export interface nodeComponent
    {
        node: sceneNode;
        render: INodeRender;//组件是否有绘制能力
        init(node: sceneNode);
        update(delta: number);
    }
    export class sceneNode
    {
        private parent: sceneNode = null;
        scene: renderScene = null;
        private children: sceneNode[] = [];
        components: nodeComponent[] = [];

        matLocal: TSM.mat4 = new TSM.mat4();
        matWorld: TSM.mat4 = new TSM.mat4();
        hasInit: boolean = false;

        updateMatrix()
        {
            if (this.parent == null)
            {
                this.matLocal.copy(this.matWorld);
            }
            else
            {
                this.parent.matWorld.copy(this.matWorld);
                this.matWorld.multiply(this.matLocal);
            }
            for (var c in this.children)
            {
                this.children[c].updateMatrix();
            }
        }
        renderWithoutSort(line: renderPipeLine, cam: renderCamera, needsort: INodeRender[])
        {
            for (var c in this.components)
            {
                var b = this.components[c];
                if (b.render != null)
                {
                    if (b.render.bshow == false) continue;
                    if (b.render.sortlayer == 0)
                        b.render.draw(line, cam);
                    else
                        needsort.push(b.render);
                }
            }
            for (var c in this.children)
            {
                var cc = this.children[c];
                cc.renderWithoutSort(line, cam, needsort);
            }
        }
        addComponent(comp: nodeComponent)
        {
            comp.node = this;
            this.components.push(comp);
            if (this.hasInit)
                comp.init(this);
        }
        addChild(node: sceneNode)
        {
            node.parent = this;
            this.children.push(node);
        }
        updateComponent(delta: number)
        {
            for (var c in this.components)
            {
                if (this.hasInit == false)
                    this.components[c].init(this);
                this.components[c].update(delta);
            }
            this.hasInit = true;
        }

    }
}