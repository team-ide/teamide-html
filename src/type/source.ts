
/**
 * @description Source -数据源
 */
export interface Source {
    status: string
    error: Error
    ready: boolean

    url: string
    api: string
    filesUrl: string

    headerNavs: any
    manageNavs: any
    userNavs: any

    session: Session

    hasPower(action: string): boolean

    toolbox: any
    toolboxLoading: boolean
    toolboxError: any
}

/**
 * @description Model -模型
 */
export interface Model {
    name: string
    text: string
    icon: string
    comment: string
}

/**
 * @description Option -选项
 */
export interface Option {
    value: string
    text: string
    comment: string
}

/**
 * @description Session -会话
 */
export interface Session {
    user: LoginUser
    powers: string[]
    powerLinks: string[]
    JWT: string
}

/**
 * @description LoginUser -登录用户
 */
export interface LoginUser {
    userId: number
    name: string
    avatar: string
    account: string
    email: string
}
/**
 * @description 创建源
 */
export function newSource(): Source {
    let source: Source = {
        status: null,
        error: null,
        ready: false,

        url: null,
        api: null,
        filesUrl: null,


        headerNavs: [],
        manageNavs: [],
        userNavs: [],

        session: {
            user: null,
            powers: [],
            JWT: null,
            powerLinks: []
        },

        hasPower: (action) => {
            if (source.session == null) {
                return false;
            }
            if (source.session.powers && source.session.powers.indexOf(action) != -1) {
                return true;
            }
            if (source.session.powerLinks && source.session.powerLinks.indexOf(action) != -1) {
                return true;
            }
            return false;
        },

        toolbox: null,
        toolboxLoading: false,
        toolboxError: null,

    }
    return source;
}