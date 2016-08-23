// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path="react/react-global.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="electron/electron_api.ts" />
//react 的 states 要用来混合的，将它指定预制类型并没有任何意义，一个字典就行了
var ReactComp = (function (_super) {
    __extends(ReactComp, _super);
    function ReactComp() {
        _super.apply(this, arguments);
    }
    //componentWillMount()//最开始的初始化，ui还没有准备好
    //{
    //}
    //componentDidMount()//第一次界面准备好
    //{
    //}
    //componentDidUpdate()//当界面更新以后
    //{
    //}
    ReactComp.prototype.render = function () {
        return React.createElement("div", null);
    };
    return ReactComp;
}(React.Component));
var Prop_NumItem = (function () {
    function Prop_NumItem() {
    }
    return Prop_NumItem;
}());
var Comp_NumItem = (function (_super) {
    __extends(Comp_NumItem, _super);
    function Comp_NumItem() {
        _super.apply(this, arguments);
    }
    Comp_NumItem.prototype.componentWillMount = function () {
    };
    Comp_NumItem.prototype.componentDidMount = function () {
        var _this = this;
        var r = this.refs["n"];
        r.value = this.props.value.toString();
        r.onkeyup = function () {
            r.value = r.value.replace(/\D/g, '');
        };
        r.oninput = function () {
            _this.props.value = parseFloat(r.value);
        };
        this.componentDidUpdate();
    };
    Comp_NumItem.prototype.componentDidUpdate = function () {
        var r = this.refs["n"];
        r.value = this.props.value.toString();
    };
    Comp_NumItem.prototype.render = function () {
        return React.createElement("div", null, React.createElement("a", null, this.props.title), React.createElement("input", {ref: "n"}));
    };
    return Comp_NumItem;
}(ReactComp));
var Prop_TextItem = (function () {
    function Prop_TextItem() {
    }
    return Prop_TextItem;
}());
var Comp_TextItem = (function (_super) {
    __extends(Comp_TextItem, _super);
    function Comp_TextItem() {
        _super.apply(this, arguments);
    }
    Comp_TextItem.prototype.componentWillMount = function () {
    };
    Comp_TextItem.prototype.componentDidMount = function () {
        var _this = this;
        var r = this.refs["n"];
        r.oninput = function () {
            _this.props.value = r.value;
        };
        this.componentDidUpdate();
    };
    Comp_TextItem.prototype.componentDidUpdate = function () {
        var r = this.refs["n"];
        r.value = this.props.value;
    };
    Comp_TextItem.prototype.render = function () {
        return React.createElement("div", null, React.createElement("a", null, this.props.title), React.createElement("input", {ref: "n"}));
    };
    return Comp_TextItem;
}(ReactComp));
//首字必须大写
var Comp_Main = (function (_super) {
    __extends(Comp_Main, _super);
    function Comp_Main() {
        _super.apply(this, arguments);
    }
    Comp_Main.prototype.componentWillMount = function () {
        var binit = electron.API.Init();
        if (binit) {
            //从公共区域将数据取出
            var data = electron.API.Ipc_GetInfo("posdata");
            var json = JSON.parse(data);
            this.x = json["x"];
            this.y = json["y"];
            this.txt = json["txt"];
        }
        else {
            this.x = 333;
            this.y = 55;
            this.txt = "what the fuck.";
        }
    };
    Comp_Main.prototype.componentDidMount = function () {
        var _this = this;
        var btn = this.refs["btn"];
        btn.onclick = function () {
            var x = _this.refs["x"];
            var y = _this.refs["y"];
            var txt = _this.refs["txt"];
            var json = {};
            json["x"] = x.props.value;
            json["y"] = y.props.value;
            json["txt"] = txt.props.value;
            var txtt = JSON.stringify(json);
            if (electron.API.Init() == false)
                return;
            electron.API.Ipc_SetInfo("posdata", txtt);
            //也可以通过消息参数的形式发出去
            electron.API.Ipc_SendToAllwin("updateposdata", txtt);
        };
    };
    Comp_Main.prototype.render = function () {
        return React.createElement("table", null, React.createElement("tr", null, React.createElement("th", null, React.createElement("a", null, "made by react."))), React.createElement("tr", null, React.createElement("td", null, React.createElement(Comp_NumItem, {ref: "x", title: "pos:x", value: this.x}))), React.createElement("tr", null, React.createElement("td", null, React.createElement(Comp_NumItem, {ref: "y", title: "pos:y", value: this.y}))), React.createElement("tr", null, React.createElement("td", null, React.createElement(Comp_TextItem, {ref: "txt", title: "text:", value: this.txt}))), React.createElement("tr", null, React.createElement("td", null, React.createElement("button", {ref: "btn"}, "fix it."))));
    };
    return Comp_Main;
}(ReactComp));
window.onload = function () {
    var binit = electron.API.Init();
    //set window pos
    window.moveTo(0, 0);
    window.resizeTo(400, 800);
    var com = React.createElement("div", null, " ", React.createElement(Comp_Main, null));
    ReactDOM.render(com, document.body);
};
//# sourceMappingURL=winreact.js.map