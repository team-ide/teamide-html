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

source.header = {
    title: "Team · IDE",
    toggleable: "lg",
    type: "dark",
    variant: "dark",
}

source.frame = {
    show: true,
    remove: false,
    headerNavs: [],
    userNavs: [],
    manageNavs: []
}

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


source.enum = {
};

source.log = {
};

source.powers = [];
source.powerLinks = [];


let userNavs = [
    {
        name: "个人资料",
        icon: "person-circle",
        link: "/user",
        action: "user_page",
    },
    {
        name: "账号安全",
        icon: "person-circle",
        link: "/user/security",
        action: "user_security_page",
    },
    {
        name: "授权信息",
        icon: "person-circle",
        link: "/user/auth",
        action: "user_auth_page",
    },
    {
        name: "安全凭证",
        icon: "person-circle",
        link: "/user/certificate",
        action: "user_certificate_page",
    },
    {
        name: "消息通知",
        icon: "person-circle",
        link: "/user/message",
        action: "user_message_page",
    },
    {
        name: "个人设置",
        icon: "person-circle",
        link: "/user/setting",
        action: "user_setting_page",
    },
];

let manageNavs = [
    {
        name: "用户管理",
        icon: "person-circle",
        navs: [
            {
                name: "用户列表",
                icon: "person-circle",
                link: "/manage/user",
                action: "manage_user_page",
            },
            {
                name: "授权列表",
                icon: "person-circle",
                link: "/manage/user/auth",
                action: "manage_user_auth_page",
            },
            {
                name: "锁定记录",
                icon: "person-circle",
                link: "/manage/user/lock",
                action: "manage_user_lock_page",
            },
        ],
    },
    {
        name: "权限管理",
        icon: "person-circle",
        navs: [
            {
                name: "功能权限",
                icon: "person-circle",
                link: "/manage/power/action",
                action: "manage_power_action_page",
            },
            {
                name: "数据权限",
                icon: "person-circle",
                link: "/manage/power/data",
                action: "manage_power_data_page",
            },
        ],
    },
    {
        name: "企业管理",
        icon: "person-circle",
        navs: [
            {
                name: "企业列表",
                icon: "person-circle",
                link: "/manage/enterprise",
                action: "manage_enterprise_page",
            },
            {
                name: "组织机构",
                icon: "person-circle",
                link: "/manage/organization",
                action: "manage_organization_page",
            },
        ],
    },
    {
        name: "群组管理",
        icon: "person-circle",
        navs: [
            {
                name: "群组列表",
                icon: "person-circle",
                link: "/manage/group",
                action: "manage_group_page",
            },
        ],
    },
    {
        name: "任务管理",
        icon: "person-circle",
        navs: [
            {
                name: "任务列表",
                icon: "person-circle",
                link: "/manage/job",
                action: "manage_job_page",
            },
        ],
    },
    {
        name: "安全管理",
        icon: "person-circle",
        navs: [
            {
                name: "日志管理",
                icon: "person-circle",
                link: "/manage/log",
                action: "manage_log_page",
            },
            {
                name: "登录记录",
                icon: "person-circle",
                link: "/manage/login",
                action: "manage_login_page",
            },
        ],
    },
    {
        name: "系统管理",
        icon: "person-circle",
        navs: [
            {
                name: "系统设置",
                icon: "person-circle",
                link: "/manage/system/setting",
                action: "manage_system_setting_page",
            },
            {
                name: "系统日志",
                icon: "person-circle",
                link: "/manage/system/log",
                action: "manage_system_log_page",
            },
        ],
    },
];

let headerNavs = [
    {
        name: "首页",
        icon: "home",
        link: "/",
        match(path) {
            if (path == '/') {
                return true;
            }
        },
    },
    {
        name: "应用",
        icon: "home",
        link: "/application",
        action: "application_page",
        match(path) {
            if (path == '/application' || path.indexOf('/application/') == 0) {
                return true;
            }
        },
    },
    {
        name: "工作台",
        icon: "home",
        link: "/workspace",
        action: "workspace_page",
        match(path) {
            if (path == '/workspace' || path.indexOf('/workspace/') == 0) {
                return true;
            }
        },
    },
    {
        name: "工具箱",
        icon: "home",
        link: "/toolbox",
        action: "toolbox_page",
        match(path) {
            if (path == '/toolbox' || path.indexOf('/toolbox/') == 0) {
                return true;
            }
        },
    },
    {
        name: "个人资料",
        icon: "home",
        link: "/user",
        navs: userNavs,
        match(path) {
            if (path == '/user' || path.indexOf('/user/') == 0) {
                return true;
            }
        },
    },
    {
        name: "系统管理",
        icon: "home",
        link: "/manage",
        navs: manageNavs,
        match(path) {
            if (path == '/manage' || path.indexOf('/manage/') == 0) {
                return true;
            }
        },
    },
];
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
source.initLoginUserData = () => {

    source.initUserToolboxCount();
    source.initUserToolboxSSHList();
    source.initUserNodeList();
}
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
source.initUserToolboxSSHList = async () => {
    let data = {}
    if (source.login.user != null) {
        let res = await server.toolbox.list({ toolboxType: "ssh" });
        if (res.code != 0) {
            tool.error(res.msg);
        }
        data = res.data || {};
    }
    form.sshToolboxOptions.splice(0, form.sshToolboxOptions.length)
    let toolboxList = data.toolboxList || [];

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

let refreshPowers = function () {
    source.powerLinks = [];
    source.frame.headerNavs = getPowerNavs(headerNavs);
    source.frame.userNavs = getPowerNavs(userNavs);
    source.frame.manageNavs = getPowerNavs(manageNavs);
}
let getPowerNavs = function (navs) {
    navs = navs || [];
    let powerNavs = [];
    navs.forEach(one => {
        let powerNav = Object.assign({}, one);
        let subNavs = one.navs || [];
        powerNav.navs = [];

        let hasPower = false;
        if (tool.isEmpty(powerNav.action)) {
            if (subNavs && subNavs.length > 0) {
                let subPowerNavs = getPowerNavs(subNavs);
                powerNav.navs = subPowerNavs;
                if (subPowerNavs.length > 0) {
                    hasPower = true;
                }
            } else {
                hasPower = true;
            }
        } else {
            // 有权限
            if (source.hasPower(powerNav.action)) {
                hasPower = true;
                let subPowerNavs = getPowerNavs(subNavs);
                powerNav.navs = subPowerNavs;
            }
        }
        if (!hasPower) {
            return;
        }
        if (tool.isNotEmpty(powerNav.link)) {
            source.powerLinks.push(powerNav.link)
        }
        powerNavs.push(powerNav);
    });
    return powerNavs;
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
    refreshPowers();
    source.status = "connected";
    source.ready = true;
}

source.hasPower = function (action) {
    if (action == '/user') {
        if (source.frame.userNavs.length > 0) {
            return true;
        }
    }
    if (action == '/manage') {
        if (source.frame.manageNavs.length > 0) {
            return true;
        }
    }
    source.powers = source.powers || [];
    source.powerLinks = source.powerLinks || [];
    let find = false;
    if (source.powers.indexOf(action) >= 0 || source.powerLinks.indexOf(action) >= 0) {
        find = true;
    }

    if (tool.isOpenPage(action)) {
        return true;
    }
    return find;
}
export default source;