
window.onload = () =>
{


    var loading = document.getElementById('loading');
    loading.hidden = false;
    var canvas = <HTMLCanvasElement>document.getElementById('rendercanvas');
    canvas.hidden = true;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    //2D和3D的系统是分离的
    lighttool.JSLoader.instance().addImportScript("lighttool/2d/spritebatcher.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/2d/resmgr.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/2d/canvas.js");

    //3d
    lighttool.JSLoader.instance().addImportScript("lighttool/math.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/resource/texture.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/resource/shader.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/render/scene.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/render/mesh.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/framework/framework.js");
    lighttool.JSLoader.instance().addImportScript("lighttool/reader.js");

    //aceeditor
    lighttool.JSLoader.instance().addImportScript("ace/ace.js");
    lighttool.JSLoader.instance().addImportScript("ace/theme-chrome.js");
    lighttool.JSLoader.instance().addImportScript("ace/theme-twilight.js");
    lighttool.JSLoader.instance().addImportScript("ace/mode-glsl.js");

    //filesaver
    lighttool.JSLoader.instance().addImportScript("filesaver/filesaver.js");

    //states
    lighttool.JSLoader.instance().addImportScript("state_first.js");

    lighttool.JSLoader.instance().preload(() =>
    {

        loading.hidden = true;
        canvas.hidden = false;

        var firstState = new state_First();
        var app: light3d.appRender = new light3d.appRender(canvas, firstState);
        app.Run();

        lighttool.loadTool.loadArrayBuffer("./11.bin", (ab) =>
        {
            var reader = new cengine.binReader(ab, 0);

            var slen = reader.readUInt8();
            var b = reader.readStringUtf8FixLength(slen);
            console.log("b=" + b);

            var write = new cengine.binWriter();
            write.writeUInt8(244);
            write.writeInt32(1);
            write.writeStringUtf8("我爱祖国天安门 fuck 1.0");
            var a = write.getBuffer();

            var r = new cengine.binReader(a);
            var bb = r.readUInt8();
            var bb2 = r.readInt32();
            var str = r.readStringUtf8();

            console.log("buf len=" + a);
        }
        );
    }
    );

    //var binit: boolean = electron.API.Init();
    //if (!binit) return;
    //electron.API.File_WriteText("d:\\electronwrite.txt", "Aasdfasdf", (err) =>
    //{
    //    if (err == null)
    //    {
    //        console.log("writefile ok.");
    //    }
    //    else
    //    {
    //        console.log("writefile error:" + err);
    //    }
    //}
    //);

    //var b: ArrayBuffer = new ArrayBuffer(16);
    //electron.API.File_WriteBinary("d:\\e1.bin", b, (err) =>
    //{
    //    if (err == null)
    //    {
    //        console.log("write b file ok.");
    //    }
    //    else
    //    {
    //        console.log("write b file error:" + err);
    //    }
    //}
    //);

    //electron.API.File_ReadText("d:\\electronwrite.txt", (err, data) =>
    //{
    //    console.log("read:" + data);
    //});
    //electron.API.File_ReadBinary("d:\\e1.bin", (err, data) =>
    //{
    //    console.log("read b:" + data + "," + data.length);
    //});

    ////electron.Dialog.showSave("hello world.", "jpeg", ["jpg", "jpeg"], (dat, err) =>
    ////{
    ////    console.log("dg:" + dat + "|" + err);
    ////}

    ////);
    //electron.API.Ipc_SetInfo("a", "asdfasdfasdfdsf");
    //var v = electron.API.Ipc_GetInfo("a");
    //electron.API.Ipc_OpenWin("ccd", "index2.html");
    //electron.API.showMessageBox(electron.MessageBoxType.Warning, "h1", v, ["ok", "yes", "no"], (err) =>
    //{
    //    console.log("dg:" + err);
    //});
    //setInterval(() =>
    //{
    //    var s = electron.API.Ipc_SendToAllwin("tryevent", "hahaha");
    //    console.log(s);
    //}, 100);
    //window.onbeforeunload = (e: BeforeUnloadEvent) =>
    //{
    //    if (confirm("really quit the main win？"))
    //    {
    //    }
    //    else
    //    {
    //        e.returnValue = false;
    //    }
    //}

};


