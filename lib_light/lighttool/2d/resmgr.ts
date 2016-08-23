//v0.4
namespace lighttool
{
    export class texutreMgrItem
    {
        tex: spriteTexture;
        url: string;
        urladd: string;
        format: textureformat;
        mipmap: boolean;
        linear: boolean;
    }
    export class textureMgr
    {

        private static g_this: textureMgr;
        static Instance(): textureMgr
        {
            if (textureMgr.g_this == null)
                textureMgr.g_this = new textureMgr();//ness

            return textureMgr.g_this;
        }
        mapInfo: { [id: string]: texutreMgrItem } = {};
        reg(url: string, urladd: string, format: textureformat, mipmap: boolean, linear: boolean)
        {
            //重复注册处理
            let item = this.mapInfo[url];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new texutreMgrItem();//ness

            this.mapInfo[url] = item;
            item.url = url;
            item.urladd = urladd;
            item.format = format;
            item.mipmap = mipmap;
            item.linear = linear;
        }
        regDirect(url: string, tex: spriteTexture)
        {
            let item = this.mapInfo[url];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new texutreMgrItem();//ness

            this.mapInfo[url] = item;
            item.url = url;
            item.tex = tex;
        }
        unreg(url: string)
        {
            var item = this.mapInfo[url];
            if (item == undefined) return;
            this.unload(url);

            this.mapInfo[url] = undefined;
        }
        unload(url: string)
        {
            var item = this.mapInfo[url];
            if (item == undefined) return;

            item.tex.dispose();
            item.tex = null;
        }
        load(webgl: WebGLRenderingContext, url: string): spriteTexture
        {
            var item = this.mapInfo[url];
            if (item == undefined) return null;
            if (item.tex == null)
            {
                item.tex = new spriteTexture(webgl, item.url + item.urladd, item.format, item.mipmap, item.linear);//ness
            }
            return item.tex;
        }
    }
    export class atlasMgrItem
    {
        atals: spriteAtlas;
        url: string;
        urlatalstex: string;
        urlatalstex_add: string;
    }
    export class atlasMgr
    {
        private static g_this: atlasMgr;
        static Instance(): atlasMgr
        {
            if (atlasMgr.g_this == null)
                atlasMgr.g_this = new atlasMgr();//ness

            return atlasMgr.g_this;
        }

        mapInfo: { [id: string]: atlasMgrItem } = {}
        reg(name: string, urlatlas: string, urlatalstex: string, urlatalstex_add: string)
        {
            //重复注册处理
            let item = this.mapInfo[name];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new atlasMgrItem();//ness

            this.mapInfo[name] = item;
            item.url = urlatlas;
            item.urlatalstex = urlatalstex;
            item.urlatalstex_add = urlatalstex_add;
        }
        unreg(name: string, disposetex: boolean)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return;
            this.unload(name, disposetex);

            this.mapInfo[name] = undefined;

        }
        regDirect(name: string, atlas: spriteAtlas)
        {
            let item = this.mapInfo[name];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new atlasMgrItem();//ness

            this.mapInfo[name] = item;
            item.atals = atlas;
        }
        unload(name: string, disposetex: boolean)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return;

            if (disposetex)
            {
                item.atals.texture.dispose();
                item.atals.texture = null;
            }
            item.atals = null;
        }

        load(webgl: WebGLRenderingContext, name: string): spriteAtlas
        {
            var item = this.mapInfo[name];
            if (item == undefined) return null;
            if (item.atals == null)
            {
                var tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                if (tex == undefined)
                {
                    textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add,
                        lighttool.textureformat.RGBA, false, true);

                    tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                }
                item.atals = new spriteAtlas(webgl, item.url, tex);//ness
            }
            return item.atals;

        }
    }
    export class fontMgrItem
    {
        font: spriteFont;
        url: string;
        urlatalstex: string;
        urlatalstex_add: string;
    }
    export class fontMgr
    {
        private static g_this: fontMgr;
        static Instance(): fontMgr
        {
            if (fontMgr.g_this == null)
                fontMgr.g_this = new fontMgr();//ness

            return fontMgr.g_this;
        }

        mapInfo: { [id: string]: fontMgrItem } = {}
        reg(name: string, urlfont: string, urlatalstex: string, urlatalstex_add: string)
        {
            //重复注册处理
            let item = this.mapInfo[name];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new fontMgrItem();//ness

            this.mapInfo[name] = item;
            item.url = urlfont;
            item.urlatalstex = urlatalstex;
            item.urlatalstex_add = urlatalstex_add;
        }
        regDirect(name: string, font: spriteFont)
        {
            let item = this.mapInfo[name];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new fontMgrItem();//ness

            this.mapInfo[name] = item;
            item.font = font;
        }
        unreg(name: string, disposetex: boolean)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return;
            this.unload(name, disposetex);

            this.mapInfo[name] = undefined;

        }

        unload(name: string, disposetex: boolean)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return;

            if (disposetex)
            {
                item.font.texture.dispose();
                item.font.texture = null;
            }
            item.font = null;
        }

        load(webgl: WebGLRenderingContext, name: string): spriteFont
        {
            var item = this.mapInfo[name];
            if (item == undefined) return null;
            if (item.font == null)
            {
                var tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                if (tex == undefined)
                {
                    textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add,
                        lighttool.textureformat.GRAY, false, true);

                    tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                }
                item.font = new spriteFont(webgl, item.url, tex);//ness
            }
            return item.font;

        }
    }
    export class shaderMgr
    {
        private static g_shaderParser: lighttool.shaderParser;
        static parserInstance(): lighttool.shaderParser
        {
            if (shaderMgr.g_shaderParser == null)
                shaderMgr.g_shaderParser = new lighttool.shaderParser();//ness
            return shaderMgr.g_shaderParser;
        }
    }
}