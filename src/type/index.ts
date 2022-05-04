/**
 * @description 接口响应通过格式
 */
export interface HttpResponse<T> {
    code: string | number
    msg: string
    error: Error,
    data: T
}

export * from "./source"

export * from "./toolbox"