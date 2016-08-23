window.onload = function () {
    //初始化Electron API
    var binit = electron.API.Init();
    if (!binit)
        return;
    //set window pos
    window.moveTo(0, 0);
    window.resizeTo(400, 800);
    var dx = document.getElementById("x");
    var dy = document.getElementById("y");
    var dtxt = document.getElementById("txt");
    var dbtn = document.getElementById("fix");
    //填充界面数据
    var praseData = function () {
        //从公共区域将数据取出
        var data = electron.API.Ipc_GetInfo("posdata");
        var json = JSON.parse(data);
        dx.value = json["x"];
        dy.value = json["y"];
        dtxt.value = json["txt"];
    };
    praseData();
    //广播一条消息
    dbtn.onclick = function (e) {
        var json = {};
        json["x"] = parseFloat(dx.value);
        json["y"] = parseFloat(dy.value);
        json["txt"] = dtxt.value;
        //数据可以通过公共区域交换
        electron.API.Ipc_SetInfo("posdata", JSON.stringify(json));
        //也可以通过消息参数的形式发出去
        electron.API.Ipc_SendToAllwin("updateposdata", JSON.stringify(json));
    };
};
//# sourceMappingURL=win.js.map