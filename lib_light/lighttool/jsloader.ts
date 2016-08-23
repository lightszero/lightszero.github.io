namespace lighttool
{

    export class JSLoader
    {
        private static _instance: JSLoader;


        private importList: string[] = [];

        private _complete: Function;

        public static instance(): JSLoader
        {
            if (!JSLoader._instance)
            {
                JSLoader._instance = new JSLoader();
            }

            return JSLoader._instance;
        }

        private static getXHR(): any
        {
            var xhr: any = null;
            if (window["XMLHttpRequest"])
            {
                xhr = new window["XMLHttpRequest"]();
            } else
            {
                xhr = new ActiveXObject("MSXML2.XMLHTTP");
            }
            return xhr;
        }





        public preload(complete: Function)
        {
            this._complete = complete;
            requestAnimationFrame
                (() =>
                {
                    if (this.importList.length > 0)
                    {
                        this.startLoadScript(null);
                    }
                    else
                    {
                        this.onAllLoadComplete();
                    }
                });
        }

        public addImportScript(path: string)
        {
            this.importList.push(path);
        }

        private onAllLoadComplete()
        {
            if (this._complete)
            {
                this._complete();
            }
        }

        private startLoadScript(e)
        {
            if (this.importList.length > 0)
            {
                var egret3DScript: HTMLScriptElement = document.createElement("script");
                egret3DScript.src = this.importList.shift();
                egret3DScript.onload = (e) => this.startLoadScript(e);
                egret3DScript.onerror = (e) => this.loadScriptError(e);
                document.head.appendChild(egret3DScript);
            }
            else
            {
                console.log("all complete");
                this.onAllLoadComplete();
            }
        }

        private loadScriptError(e)
        {
            var error: string = "load Script Error \r\n no file:" + e.srcElement.src;
            alert(error);
            this.startLoadScript(null);
        }
    }
}