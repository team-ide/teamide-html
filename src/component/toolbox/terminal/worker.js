import server from "@/server/index.js";
import tool from "@/tool/index.js";
import source from "@/source/index.js";

const newWorker = function (workerOption) {
    workerOption = workerOption || {};
    const worker = {
        workerId: workerOption.workerId,
        place: workerOption.place,
        placeId: workerOption.placeId,
        key: workerOption.key,
        onSocketOpen: workerOption.onSocketOpen,
        onSocketClose: workerOption.onSocketClose,
        onSocketError: workerOption.onSocketError,
        onSocketData: workerOption.onSocketData,
        building: false,
        rows: 40,
        cols: 100,
        isUploading: false,
        isDownloading: false,
        lastUser: null,
        lastDir: null,
        init() {
            this.build()
        },
        refresh() {
            this.build()
        },
        async build() {
            if (this.building) {
                return
            }
            this.building = true
            if (tool.isNotEmpty(this.key)) {
                if (worker.socket != null) {
                    worker.closeSocket();
                }
                await this.close();
            }
            let keyData = await this.newKey()
            if (keyData == null || tool.isEmpty(keyData.key)) {
                this.building = false
                return
            }
            this.key = keyData.key;
            this.isWindows = keyData.isWindows;
            this.newSocket();
        },
        sendDataToWS(data) {
            if (this.isWindows) {
                // data = data.replace(/(\r\n|\n|\r|↵)/g, `\r\n`);
            }
            if (typeof data === "string") {
                worker.socket.send(data);
            } else {
                worker.socket.send(new Uint8Array(data));
            }
        },
        closeSocket() {
            try {
                if (worker.socket != null) {
                    worker.socket.close();
                }
            } catch (e) {
                console.log("closeSocket error:", e)
            }
        },
        newSocket() {

            this.isUploading = false;
            this.isDownloading = false;
            this.closeSocket();
            let url = source.api;
            url = url.substring(url.indexOf(":"));
            if (location.protocol.indexOf("https") == 0) {
                url = "wss" + url + "api/terminal/websocket";
            } else {
                url = "ws" + url + "api/terminal/websocket";
            }
            url += "?key=" + encodeURIComponent(worker.key);
            url = tool.appendUrlBaseParam(url);
            url += "&place=" + encodeURIComponent(worker.place);
            url += "&placeId=" + encodeURIComponent(worker.placeId);
            url += "&workerId=" + encodeURIComponent(worker.workerId);
            url += "&cols=" + worker.cols;
            url += "&rows=" + worker.rows;
            worker.userAndDirReady = false;
            let socket = new WebSocket(url);
            worker.socket = socket;

            socket.binaryType = "arraybuffer"
            if (worker.isWindows) {
                // socket.binaryType = "string"
            } else {
                // socket.binaryType = "blob"

            }
            socket.onopen = () => {
                worker.onSocketOpen();
                this.building = false
            };
            socket.onmessage = (event) => {
                let data = event.data;
                worker.onSocketData(data);
            };
            socket.onclose = () => {
                worker.socket = null;
                worker.onSocketClose();
            };
            socket.onerror = () => {
                worker.onSocketError();
            };
        },
        wait(timeout) {
            return new Promise((resolve, reject) => {
                setTimeout(() => { resolve() }, timeout)
            });
        },
        async upload(octets) {
            let form = new FormData();
            let binaryString = '';
            octets.forEach((byte) => {
                binaryString += String.fromCharCode(byte);
            });
            let value = window
                ? window.btoa(binaryString)
                : Buffer.from(binaryString).toString('base64');
            // console.log(octets)
            // console.log(binaryString)
            // console.log(value)
            form.append("value", value);
            form.append("key", worker.key);
            let res = await server.terminal.upload(form);
            if (res.code != 0) {
                throw new Error(res.msg);
            }
        },
        getParam() {
            let param = {
                workerId: worker.workerId,
                place: worker.place,
                placeId: worker.placeId,
                key: worker.key,
            };
            return param;
        },
        async newKey() {
            let param = worker.getParam();

            worker.userAndDirReady = false;
            let res = await server.terminal.key(param);
            if (res.code != 0) {
                tool.error(res.msg);
            }
            return res.data;
        },
        async changeSize() {
            let param = worker.getParam();
            param.cols = Number(worker.cols)
            param.rows = Number(worker.rows)
            let res = await server.terminal.changeSize(param);
            if (res.code != 0) {
                // tool.error(res.msg);
            }
            return res.data;
        },
        async close() {
            this.closeSocket();

            let param = worker.getParam();
            let res = await server.terminal.close(param);
            if (res.code != 0) {
                // tool.error(res.msg);
            }
            return res.data;
        },
        async getLogs() {
            let param = worker.getParam();
            let res = await server.terminal.getLogs(param);
            if (res.code != 0) {
                tool.error(res.msg);
            }
            return res.data;
        },
        async systemMonitor() {
            let param = worker.getParam();
            let res = await server.terminal.system.monitor(param);
            // if (res.code != 0) {
            //     tool.error(res.msg);
            // }
            return res.data;
        },
        async systemInfo() {
            let param = worker.getParam();
            let res = await server.terminal.system.info(param);
            // if (res.code != 0) {
            //     tool.error(res.msg);
            // }
            return res.data;
        },
    };


    return worker
};
export default {
    newWorker
}