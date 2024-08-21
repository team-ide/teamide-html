let sqlNames = []
let registerSql = () => {
    let monaco = window.monaco;
    if (monaco == null || monaco.languages == null) {
        return
    }
    let Keyword = monaco.languages.CompletionItemKind.Keyword;
    let bases = ["SELECT", "FROM", "WHERE", "LIKE", "AND", "OR", "ASC", "DESC", "LIMIT", "IN", "NOT", "AS", "COUNT", "COUNT(*)", "ORDER BY", "GROUP BY", "DISTINCT", "BETWEEN AND", "HAVING", "JOIN ON", "LEFT JOIN ON", "RIGHT JOIN ON", "UNION", "EXCEPT", "INSERT", "INSERT INTO", "UPDATE", "SET", "DELETE", "CREATE DATABASE", "CREATE TABLE", "CREATE INDEX", "ADD COLUMN", "ALERT TABLE", "DROP DATABASE", "DROP TABLE", "DROP INDEX", "SHOW DATABASES", "SHOW TABLES", "SHOW COLUMNS FROM tableName", "DESC tableName", "NOW()", "MIN()", "MAX()", "SUM()", "AVG()"]

    monaco.languages.registerCompletionItemProvider("sql", {
        provideCompletionItems: function (model, position) {
            let suggestions = []
            sqlNames.forEach(one => {
                suggestions.push({
                    label: one,
                    kind: Keyword,
                    insertText: one + " ",
                })
            })
            bases.forEach(one => {
                suggestions.push({
                    label: one,
                    kind: Keyword,
                    insertText: one + " ",
                })
            })
            return {
                suggestions: suggestions,
            };
        },
    });
}

let addSqlName = (a) => {
    if (sqlNames.indexOf(a) < 0) {
        sqlNames.push(a)
    }
}
let registerLanguagesEd = false;
let registerLanguages = () => {
    if (registerLanguagesEd) {
        return;
    }
    registerLanguagesEd = true;
    registerSql()
}

export default {
    addSqlName,
    registerLanguages,
}