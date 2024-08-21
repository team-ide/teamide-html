var initMonacoEd = false;

let initMonaco = (from) => {
    if (initMonacoEd) {
        return;
    }
    console.log("init monaco from:", from)
    initMonacoEd = true;
    require.config({ paths: { vs: "static/monaco-editor/min/vs" } });
    window.MonacoEnvironment = {
        getWorkerUrl: function (workerId, label) {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`;`)}`;
        },
    };
    // vs/editor/editor.main.xxx.js  有多个文件需要导入
    require(
        [
            "vs/editor/editor.main",
        ]
        , () => {
            window.monaco = monaco;
            let onMonacoList = window.onMonacoList || [];
            onMonacoList.forEach(callback => {
                callback()
            })
        }
    );
}


window.onMonacoList = []
window.onMonacoLoad = (callback, from) => {
    if (window.monaco) {
        callback()
    } else {
        window.onMonacoList.push(callback)
        initMonaco(from);
    }

}