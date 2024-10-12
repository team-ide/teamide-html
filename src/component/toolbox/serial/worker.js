import server from "@/server/index.js";
import tool from "@/tool/index.js";
import source from "@/source/index.js";

const newWorker = function (workerOption) {
    workerOption = workerOption || {};
    const worker = {
        toolboxWorker: workerOption.toolboxWorker,
        key: workerOption.key,
        onSocketOpen: workerOption.onSocketOpen,
        onSocketClose: workerOption.onSocketClose,
        onSocketError: workerOption.onSocketError,
        onSocketData: workerOption.onSocketData,
        building: false,
        inDataType: "text",
        outDataType: "text",
        appendNewline: false,
        init() {
            this.build()
        },
        refresh() {
            this.build()
        },
        async changeSetting() {

            let param = worker.getParam();
            param.inDataType = worker.inDataType;
            param.outDataType = worker.outDataType;
            let res = await server.serial.changeSetting(param);
            if (res.code != 0) {
                // tool.error(res.msg);
            }
            return res.data;
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
            this.newSocket();
        },
        sendDataToWS(data) {
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

            this.closeSocket();
            let url = source.api;
            url = url.substring(url.indexOf(":"));
            if (location.protocol.indexOf("https") == 0) {
                url = "wss" + url + "api/serial/websocket";
            } else {
                url = "ws" + url + "api/serial/websocket";
            }
            url += "?key=" + encodeURIComponent(worker.key);
            url = tool.appendUrlBaseParam(url);
            worker.userAndDirReady = false;
            let socket = new WebSocket(url);
            worker.socket = socket;

            socket.binaryType = "arraybuffer"
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
        getParam() {
            let param = worker.toolboxWorker.getWorkParam({
                workerId: worker.workerId,
                key: worker.key,
            })
            return param;
        },
        async newKey() {
            let param = worker.getParam();
            param.inDataType = worker.inDataType;
            param.outDataType = worker.outDataType;

            worker.userAndDirReady = false;
            let res = await server.serial.key(param);
            if (res.code != 0) {
                tool.error(res.msg);
            }
            return res.data;
        },
        async close() {
            this.closeSocket();

            let param = worker.getParam();
            let res = await server.serial.close(param);
            if (res.code != 0) {
                // tool.error(res.msg);
            }
            return res.data;
        },
    };


    return worker
};
export default {
    newWorker
}