import util from "./util";
import source from "./source";
import service from "./service";

let server = {
    util,
    source,
    service,
};

server.install = function (app) {
    app.server = this;
};

server.initData = function () {
    source.status = 'connecting';
    service.data().then(res => {
        if (res.code == 0) {
            let data = res.data;
            source.initData(data);

            server.initSession();
        } else {
            server.error(res.msg);
            source.initData();
        }
    }).catch(() => {
        source.initData();
    })
};
var sessionLoadding = false;
var refreshSessionStart = false;
function refreshSession() {
    function nextContinue() {
        setTimeout(() => {
            refreshSession();
        }, 1000 * 60 * 10);
    }
    if (sessionLoadding) {
        nextContinue();
    } else {
        service.session().then(res => {
            if (res.code == 0) {
                let data = res.data;
                source.initSession(data)
            } else {
                source.initSession();
            }
            nextContinue();
        }).catch(() => {
            nextContinue();
        })
    }
}
server.initSession = function () {
    sessionLoadding = true;
    service.session().then(res => {
        if (res.code == 0) {
            let data = res.data;
            source.initSession(data)
        } else {
            tool.error(res.msg);
            source.initSession();
        }
        sessionLoadding = false;
    }).catch(() => {
        source.initSession();
        sessionLoadding = false;
    })
    if (!refreshSessionStart) {
        refreshSessionStart = true;
        setTimeout(() => {
            refreshSession();
        }, 1000 * 60 * 10);
    }
};


export default server;