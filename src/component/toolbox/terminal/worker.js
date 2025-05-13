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
        getFileProgress(opts) {
            let startTime = new Date().getTime();
            let lastTime = startTime;
            let total = opts.total;
            let lastOffset = 0;
            let lastStrLen = 0;
            let getProgressStr = (offset) => {
                let nowTime = new Date().getTime();
                let allUserTime = nowTime - startTime;
                let useTime = 0;
                useTime = nowTime - lastTime;
                lastTime = nowTime;
                let useTimeSize = 0;
                if (lastOffset > 0) {
                    useTimeSize = offset - lastOffset;
                } else {
                    useTimeSize = offset;
                }
                lastOffset = offset;
                if (useTime == 0 && useTimeSize > 0) {
                    useTime = 1;
                }
                let sleep = 0;
                if (useTime > 0 && useTimeSize > 0) {
                    sleep = Number(((useTimeSize * 1000) / useTime).toFixed(2));
                }
                let percent;
                let overS = total - offset;
                if (total === 0 || overS <= 0) {
                    percent = 100;
                } else {
                    percent = Number((offset / total * 100).toFixed(2));
                }

                let overT = -1;
                if (percent < 100 && overS > 0 && sleep > 0) {
                    overT = Number((overS * 1000 / sleep).toFixed(2));
                }
                let ss = []
                ss.push(tool.bytesHuman(total))
                ss.push(tool.bytesHuman(offset))
                ss.push("" + percent + "%")


                if (allUserTime > 0) {
                    ss.push("用时:" + tool.formatTimeStr(allUserTime))
                }
                if (sleep > 0) {
                    ss.push("速度:" + tool.bytesHuman(sleep) + "/s")
                }
                if (percent < 100 && overT > 0) {
                    ss.push("预计:" + tool.formatTimeStr(overT))
                }
                let str = '';
                ss.forEach((s) => {
                    s = " " + s;
                    let fSize = 10 - s.length;
                    for (let i = 0; i < fSize; i++) {
                        s = " " + s;
                    }
                    str += s;
                });

                let sL = lastStrLen - str.length
                for (let i = 0; i < sL; i++) {
                    str = str + " ";
                }
                lastStrLen = str.length
                str = str + "  ";
                return str
            };

            return getProgressStr
        },
    };


    return worker
};
export default {
    newWorker
}