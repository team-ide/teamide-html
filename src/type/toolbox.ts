
/**
 * @description Toolbox -工具箱
 */
export interface Toolbox {
    sqlConditionalOperations: any,
    types: any,
    context: any,
    opens: any,
}

/**
 * @description 创建工具箱
 */
export function newToolbox(): Toolbox {
    let toolbox: Toolbox = {

        sqlConditionalOperations: null,
        types: null,
        context: null,
        opens: null,


    }
    return toolbox;
}