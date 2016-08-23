var lighttool;
(function (lighttool) {
    var JSLoader = (function () {
        function JSLoader() {
            this.importList = [];
        }
        JSLoader.instance = function () {
            if (!JSLoader._instance) {
                JSLoader._instance = new JSLoader();
            }
            return JSLoader._instance;
        };
        JSLoader.getXHR = function () {
            var xhr = null;
            if (window["XMLHttpRequest"]) {
                xhr = new window["XMLHttpRequest"]();
            }
            else {
                xhr = new ActiveXObject("MSXML2.XMLHTTP");
            }
            return xhr;
        };
        JSLoader.prototype.preload = function (complete) {
            var _this = this;
            this._complete = complete;
            requestAnimationFrame(function () {
                if (_this.importList.length > 0) {
                    _this.startLoadScript(null);
                }
                else {
                    _this.onAllLoadComplete();
                }
            });
        };
        JSLoader.prototype.addImportScript = function (path) {
            this.importList.push(path);
        };
        JSLoader.prototype.onAllLoadComplete = function () {
            if (this._complete) {
                this._complete();
            }
        };
        JSLoader.prototype.startLoadScript = function (e) {
            var _this = this;
            if (this.importList.length > 0) {
                var egret3DScript = document.createElement("script");
                egret3DScript.src = this.importList.shift();
                egret3DScript.onload = function (e) { return _this.startLoadScript(e); };
                egret3DScript.onerror = function (e) { return _this.loadScriptError(e); };
                document.head.appendChild(egret3DScript);
            }
            else {
                console.log("all complete");
                this.onAllLoadComplete();
            }
        };
        JSLoader.prototype.loadScriptError = function (e) {
            var error = "load Script Error \r\n no file:" + e.srcElement.src;
            alert(error);
            this.startLoadScript(null);
        };
        return JSLoader;
    }());
    lighttool.JSLoader = JSLoader;
})(lighttool || (lighttool = {}));
//# sourceMappingURL=jsloader.js.map