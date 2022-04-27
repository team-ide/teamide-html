/**
 * @description 接口响应通过格式
 */
export interface HttpResponse {
    code: string
    msg: string
    [key: string]: any
}

/**
 * @description Source -数据源
 */
export interface Source {
    status: string
    ready: boolean
    url: string
    api: string
    filesUrl: string
    session: Session
    hasPower(action: string): boolean
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
        ready: false,
        url: null,
        api: null,
        filesUrl: null,
        session: {
            user: null,
            powers: [],
            JWT: null,
            powerLinks: []
        },
        hasPower: (action) => {
            if (this.session == null) {
                return false;
            }
            if (this.session.powers && this.session.powers.indexOf(action) != -1) {
                return true;
            }
            if (this.session.powerLinks && this.session.powerLinks.indexOf(action) != -1) {
                return true;
            }
            return false;
        }
    }
    return source;
}