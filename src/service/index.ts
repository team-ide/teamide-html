import http from './http'
import util from 'util'
import { Source, Session, HttpResponse } from 'type'

export * from './toolbox';

/**
 * @description formatSourceData
 */
let formatSourceData = (source: Source, response: HttpResponse<Source>) => {
    if (response.code == 0 && response.data != null) {
        const data = response.data;
        if (data != null) {
            source.api = data.api;
            source.filesUrl = data.filesUrl;
        }
    }
}

/**
 * @description formatSourceSession
 */
let formatSourceSession = (source: Source, response: HttpResponse<string>) => {
    if (response.code == 0 && util.isNotEmpty(response.data)) {
        let session: Session
        try {
            let data = util.aesDecrypt(response.data);
            session = JSON.parse(data)
        } catch (error) {
            session = null;
        }
        if (session != null) {
            source.session.user = session.user;
            source.session.powers = session.powers || [];
            source.session.JWT = session.JWT;
            util.setJWT(session.JWT);
        } else {
            source.session.user = null;
            source.session.powers = [];
        }
        refreshPowers(source);
    }

}

let refreshPowers = (source: Source) => {
    source.session.powerLinks = [];

    source.headerNavs = formatPowerNavs(source, headerNavs);
    source.userNavs = formatPowerNavs(source, userNavs);
    source.manageNavs = formatPowerNavs(source, manageNavs);

}


let formatPowerNavs = function (source: Source, navs: any) {
    navs = navs || [];
    let powerNavs = [];
    navs.forEach((one: any) => {
        let powerNav = Object.assign({}, one);
        let subNavs = one.navs || [];
        powerNav.navs = [];

        let hasPower = false;
        if (util.isEmpty(powerNav.action)) {
            if (subNavs && subNavs.length > 0) {
                let subPowerNavs = formatPowerNavs(source, subNavs);
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
                let subPowerNavs = formatPowerNavs(source, subNavs);
                powerNav.navs = subPowerNavs;
            }
        }
        if (!hasPower) {
            return;
        }
        if (util.isNotEmpty(powerNav.link)) {
            source.session.powerLinks.push(powerNav.link)
        }
        powerNavs.push(powerNav);
    });
    return powerNavs;
}

// sessionLoadding
var sessionLoadding = false;

/**
 * @description refreshSession
 */
let refreshSession = async (loadSession: Function) => {
    if (sessionLoadding) {
        return
    }
    sessionLoadding = true
    await loadSession();
    sessionLoadding = false
    setTimeout(() => {
        refreshSession(loadSession);
    }, 1000 * 60 * 10);
}


/**
 * @description Service基础接口
 */
export class Service {

    /**
     * 关闭
     */
    static async close() {
    }

    /**
     * 等待指定的时间
     * @param ms
     */
    static async sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, ms)
        });
    }
    /**
     * @description 初始化服务信息
     * 
     * @param source 数据源
     */
    static async initServer(source: Source) {
        let startTime = new Date().getTime()
        source.status = "connecting";
        let response1 = await this.data(source)
        if (response1.code == 0) {
            let response2 = await this.session(source)
            if (response2.code == 0) {

                let endTime = new Date().getTime()
                let waitTime = 500 - (endTime - startTime)
                if (waitTime > 0) {
                    await this.sleep(waitTime)
                }
                source.status = "connected";
                source.ready = true;
            } else {
                source.status = "error";
                source.ready = false;
                if (util.isNotEmpty(response2.msg)) {
                    source.error = new Error(response2.msg);
                } else {
                    source.error = response2.error;
                }
            }
        } else {
            source.status = "error";
            source.ready = false;
            if (util.isNotEmpty(response1.msg)) {
                source.error = new Error(response1.msg);
            } else {
                source.error = response1.error;
            }
        }
    }

    /**
     * @description 查询服务器信息
     * 
     * @param source 数据源
     */
    static async data(source: Source) {
        let params = {
            origin: location.origin,
            pathname: location.pathname,
        };
        let response: HttpResponse<Source> = await http.post('data', params)
        formatSourceData(source, response)
        return response;
    }

    /**
     * @description 查询会话信息
     * 
     * @param source 数据源
     */
    static async session(source: Source) {
        let params: {};
        let response: HttpResponse<string> = await http.post('session', params)
        formatSourceSession(source, response)
        return response;
    }

}


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