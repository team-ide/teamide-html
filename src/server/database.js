import http from '@/server/http';

let database = {
    check(param) {
        return http.post('api/database/check', param);
    },
    info(param) {
        return http.post('api/database/info', param);
    },
    data(param) {
        return http.post('api/database/data', param);
    },
    owners(param) {
        return http.post('api/database/owners', param);
    },
    ownerCreate(param) {
        return http.post('api/database/ownerCreate', param);
    },
    ownerDelete(param) {
        return http.post('api/database/ownerDelete', param);
    },
    ownerCreateSql(param) {
        return http.post('api/database/ownerCreateSql', param);
    },
    ddl(param) {
        return http.post('api/database/ddl', param);
    },
    model(param) {
        return http.post('api/database/model', param);
    },
    tables(param) {
        return http.post('api/database/tables', param);
    },
    tableDetail(param) {
        return http.post('api/database/tableDetail', param);
    },
    tableCreate(param) {
        return http.post('api/database/tableCreate', param);
    },
    tableCreateSql(param) {
        return http.post('api/database/tableCreateSql', param);
    },
    tableUpdate(param) {
        return http.post('api/database/tableUpdate', param);
    },
    tableUpdateSql(param) {
        return http.post('api/database/tableUpdateSql', param);
    },
    tableDelete(param) {
        return http.post('api/database/tableDelete', param);
    },
    tableDataTrim(param) {
        return http.post('api/database/tableDataTrim', param);
    },
    tableData(param) {
        return http.post('api/database/tableData', param);
    },
    dataListSql(param) {
        return http.post('api/database/dataListSql', param);
    },
    dataListExec(param) {
        return http.post('api/database/dataListExec', param);
    },
    executeSQL(param) {
        return http.post('api/database/executeSQL', param);
    },
    import(param) {
        return http.post('api/database/import', param);
    },
    export(param) {
        return http.post('api/database/export', param);
    },
    sync(param) {
        return http.post('api/database/sync', param);
    },
    taskStatus(param) {
        return http.post('api/database/taskStatus', param);
    },
    taskStop(param) {
        return http.post('api/database/taskStop', param);
    },
    taskClean(param) {
        return http.post('api/database/taskClean', param);
    },
    close(param) {
        return http.post('api/database/close', param);
    },

    test: {
        start(param) {
            return http.post('api/database/test/start', param);
        },
        info(param) {
            return http.post('api/database/test/info', param);
        },
        stop(param) {
            return http.post('api/database/test/stop', param);
        },
        list(param) {
            return http.post('api/database/test/list', param);
        },
        delete(param) {
            return http.post('api/database/test/delete', param);
        },
    },
};


export default database;