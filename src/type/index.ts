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

    columnTypes: Option[]
    dataTypes: Option[]
    indexTypes: Option[]
    modelTypes: Model[]
    dataPlaces: Option[]
    databaseTypes: Option[]
    sqlConditionalOperations: Model[]

    session: Session

    hasPower(action: string): boolean
}

/**
 * @description Model -模型
 */
export interface Model {
    name: string
    text: string
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
        ready: false,

        url: null,
        api: null,
        filesUrl: null,

        columnTypes: null,
        dataTypes: null,
        indexTypes: null,
        modelTypes: null,
        dataPlaces: null,
        databaseTypes: null,
        sqlConditionalOperations: null,

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