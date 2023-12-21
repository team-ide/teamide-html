import tool from "@/tool/index.js";
import server from "../server";
import form from "../form";


let source = {};

source.status = null;
source.ready = false;
source.url = null;
source.api = null;
source.filesUrl = null;
source.hasNewVersion = false;
source.isServer = true;
source.setting = {};
let defaultUserSetting = {
    theme: "dark",
    keyTabClose: "Alt + 87",
    keySwitchTabUp: "Alt + 37",
    keySwitchTabDown: "Alt + 39",
    color: "",
    backgroudColor: "",
    headerColor: "",
    headerBackgroudColor: "",
    headerTabColor: "",
    headerTabBackgroudColor: "",
    bodyColor: "",
    bodyBackgroudColor: "",
    bodyTabColor: "",
    bodyTabBackgroudColor: "",
    terminalScrollback: 10000, // 终端 记录的历史行数，默认 10000行
    editorBackgroudColor: "",
    terminalBackgroudColor: "",
}
source.defaultUserSetting = defaultUserSetting;
source.userSetting = Object.assign({}, defaultUserSetting);
source.eventIsUserKey = (event) => {
    if (source.eventIsKeyGroups(event, source.userSetting.keyTabClose)) {
        if (source.workspaceTabClose) {
            source.workspaceTabClose()
            return true
        }
    } else if (source.eventIsKeyGroups(event, source.userSetting.keySwitchTabUp)) {
        if (source.workspaceSwitchTabUp) {
            source.workspaceSwitchTabUp()
            return true
        }
    } else if (source.eventIsKeyGroups(event, source.userSetting.keySwitchTabDown)) {
        if (source.workspaceSwitchTabDown) {
            source.workspaceSwitchTabDown()
            return true
        }
    }
};
source.eventIsKeyGroups = (event, keyGroups) => {
    if (tool.isEmpty(keyGroups)) {
        return false;
    }
    let ks = ('' + keyGroups).split(" + ");
    if (ks.length > 0) {
        for (let i in ks) {
            if (!source.matchEventKey(event, ks[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
};
source.matchEventKey = (event, key) => {
    key = ('' + key).toLowerCase()
    if (key == 'ctrl') {
        return event.ctrlKey;
    } else if (key == 'shift') {
        return event.shiftKey;
    } else if (key == 'alt') {
        return event.altKey;
    } else {
        return event.keyCode == key;
    }
};


source.login = {
    show: false,
    remove: false,
    user: null,
    userId: null,
}

source.register = {
    show: false,
    remove: true,
}

source.powers = [];
source.powerLinks = [];

source.init = (data) => {
    if (data != null) {
        source.url = data.url;
        source.api = data.api;
        source.filesUrl = data.filesUrl;
        source.isServer = data.isServer;
        source.quickCommandTypes = data.quickCommandTypes;
        source.setting = data.setting || {};
        source.databaseTypes = data.databaseTypes || [];
        source.sqlConditionalOperations = data.sqlConditionalOperations;
        source.toolboxTypes = data.toolboxTypes || [];
        source.toolboxTypes.forEach((one) => {
            form.toolbox[one.name] = one.configForm;
            if (one.otherForm) {
                for (let formName in one.otherForm) {
                    form.toolbox[one.name][formName] = one.otherForm[formName];
                }
            }
            let find = null;
            source.showTabGroups.forEach(g => {
                if (g.isToolboxType && g.value == one.name) {
                    find = g;
                }
            })
            if (!find) {
                source.showTabGroups.push({
                    isToolboxType: true,
                    name: "" + one.text,
                    value: one.name,
                    select: false,
                })
            }
        });
        tool.setClientKey(data.clientKey)
        tool.setClientTabKey(data.clientTabKey)
    } else {
        source.status = "error";
        source.ready = false;
    }
}
source.showTabGroups = [
    { isAll: true, name: "全部", select: true },
    { isToolboxType: true, name: "终端", value: "terminal", select: false },
    { isToolboxType: true, name: "文件管理器", value: "file-manager", select: false },
    { isToolboxType: true, name: "节点", value: "node", select: false },
    { isToolboxType: true, name: "页面", value: "page", select: false },
]
source.toolboxTypes = [];
source.getToolboxType = (type) => {
    let find = null
    source.toolboxTypes.forEach((one) => {
        if (one == type || one.name == type) {
            find = one
        }
    })
    return find;
}
source.namePackChars = [
    { value: "", text: "默认" },
    { value: "-", text: "不包装" },
    { value: "'", text: "'" },
    { value: '"', text: '"' },
    { value: "`", text: "`" },
];
source.sqlValuePackChars = [
    { value: "", text: "默认" },
    { value: "'", text: "'" },
    { value: '"', text: '"' },
];
source.toolboxCount = 0;
source.initUserToolboxCount = async () => {
    let data = {}
    if (source.login.user != null) {
        let res = await server.toolbox.count({});
        if (res.code != 0) {
            tool.error(res.msg);
        }
        data = res.data || {};
    }
    source.toolboxCount = data.count || 0;
}

source.sshToolboxList = [];
source.initUserToolboxSSHList = async (toolboxList) => {
    if (toolboxList == null && source.login.user != null) {
        let res = await server.toolbox.queryVisibility({ toolboxType: "ssh" });
        if (res.code != 0) {
            tool.error(res.msg);
        }
        let data = res.data || {};
        toolboxList = data.toolboxList || [];
    }
    form.sshToolboxOptions.splice(0, form.sshToolboxOptions.length)

    var sshToolboxList = [];
    toolboxList.forEach((one) => {
        if (one.toolboxType == "ssh") {
            sshToolboxList.push(one);
            var text = one.name
            if (one.comment != null && one.comment != "") {
                text += "(" + one.comment + ")"
            }
            form.sshToolboxOptions.push({
                text: text,
                value: one.toolboxId,
            })
        }
    });
    source.sshToolboxList = sshToolboxList;
}

source.nodeList = [];
source.initUserNodeList = async () => {
    let data = {}
    if (source.login.user != null) {
        let res = await server.node.list({});
        if (res.code != 0) {
            tool.error(res.msg);
        }
        data = res.data || {};
    }

    let nodeList = data.nodeList || [];

    source.nodeList = nodeList;
}


source.initSession = (data) => {
    if (tool.isNotEmpty(data)) {
        try {
            data = tool.aesDecrypt(data);
            data = JSON.parse(data)
        } catch (error) {
            data = null;
        }
    }
    if (data != null) {
        if (data.user == null && source.login.user == null) {
        } else if (data.user == null || source.login.user == null) {
            source.login.user = data.user;
        } else if (data.user.userId != source.login.user.userId) {
            source.login.user = data.user;
        } else {
            let oldUser = Object.assign({}, source.login.user || {})
            let newUser = Object.assign({}, data.user || {})
            delete oldUser.createTime;
            delete oldUser.updateTime;
            delete oldUser.deleteTime;
            delete newUser.createTime;
            delete newUser.updateTime;
            delete newUser.deleteTime;
            if (JSON.stringify(oldUser) != JSON.stringify(newUser)) {
                source.login.user = data.user;
            }
        }
        if (data.userSetting != null) {
            source.userSetting = Object.assign(Object.assign({}, defaultUserSetting), data.userSetting || {});
        }
        source.powers = data.powers || [];
        tool.setJWT(data.JWT);
        if (data.isAnonymous && data.user != null) {
            tool.setCache("anonymousUserId", "" + data.user.userId);
        }
    } else {
        source.login.user = null;
        source.powers = [];
    }
    source.status = "connected";
    source.ready = true;
}

source.hasPower = function (action) {
    source.powers = source.powers || [];
    let find = false;
    if (source.powers.indexOf(action) >= 0) {
        find = true;
    }

    if (tool.isOpenPage(action)) {
        return true;
    }
    return find;
}
export default source;