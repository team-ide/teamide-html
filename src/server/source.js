import util from "./util";

let source = {};


source.status = null;
source.ready = false;
source.url = null;
source.api = null;
source.filesUrl = null;
source.columnTypes = null;
source.dataTypes = null;
source.indexTypes = null;
source.modelTypes = null;
source.dataPlaces = null;
source.databaseTypes = null;
source.sqlConditionalOperations = [
    { text: "等于", value: "=" },
    { text: "不等于", value: "<>" },
    { text: "大于", value: ">" },
    { text: "大于或等于", value: ">=" },
    { text: "小于", value: "<" },
    { text: "小于或等于", value: "<=" },
    { text: "包含", value: "like" },
    { text: "不包含", value: "not like" },
    { text: "开始以", value: "like start" },
    { text: "开始不是以", value: "not like start" },
    { text: "结束以", value: "like end" },
    { text: "结束不是以", value: "not like end" },
    { text: "是null", value: "is null" },
    { text: "不是null", value: "is not null" },
    { text: "是空", value: "is empty" },
    { text: "不是空", value: "is not empty" },
    { text: "介于", value: "between" },
    { text: "不介于", value: "not between" },
    { text: "在列表", value: "in" },
    { text: "不在列表", value: "not in" },
    { text: "自定义", value: "custom" },
];

source.toolboxTypes = null;

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
source.initData = (data) => {
    if (data != null) {
        source.url = data.url;
        source.api = data.api;
        source.filesUrl = data.filesUrl;
        source.columnTypes = data.columnTypes;
        source.dataTypes = data.dataTypes;
        source.indexTypes = data.indexTypes;
        source.modelTypes = data.modelTypes;
        source.dataPlaces = data.dataPlaces;
        source.databaseTypes = data.databaseTypes;
        source.toolboxTypes = data.toolboxTypes;
    } else {
        source.status = "error";
        source.ready = false;
    }
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
        if (util.isEmpty(powerNav.action)) {
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
        if (util.isNotEmpty(powerNav.link)) {
            source.powerLinks.push(powerNav.link)
        }
        powerNavs.push(powerNav);
    });
    return powerNavs;
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
    return find;
}
export default source;