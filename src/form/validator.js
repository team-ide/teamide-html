import tool from "@/tool/index.js";

let cloneForm = function (form) {
    form = form || [];
    let res = {};
    Object.assign(res, form);
    res.fields = [];
    if (form.fields) {
        form.fields.forEach(field => {
            let f = {};
            res.fields.push(f);
            Object.assign(f, field);
            f.rules = [];
            if (field.rules) {
                field.rules.forEach(rule => {
                    let r = {};
                    f.rules.push(r);
                    Object.assign(r, rule);
                });
            }
        });
    }

    return res;
};
let buildFormValidator = function (form) {
    let validatorForm = cloneForm(form);

    let colNum = 0;
    validatorForm.rows = []
    let lastRow = null;
    validatorForm.fields.forEach((field, index) => {
        if (isEmpty(field.name)) {
            return;
        }
        let col = Number(field.col || 24);
        field.col = col;
        if (field.showPlaintextBtn) {
            field.showPlaintextBtn = true;
        } else {
            field.showPlaintextBtn = false;
        }
        field.addClass = "";
        if (lastRow == null) {
            lastRow = {
                cols: [],
            }
            validatorForm.rows.push(lastRow)
        }
        colNum += col
        if (col >= 24 || colNum == 24) {
            colNum = 0
            if (col < 24) {
                field.addClass += ' pdl-5'
            }
            lastRow.cols.push(field)
            lastRow = null
        } else if (colNum > 24) {
            lastRow = {
                cols: [],
            }
            validatorForm.rows.push(lastRow)

            lastRow.cols.push(field)
        } else {
            field.addClass += ' pdr-5'
            lastRow.cols.push(field)
        }

        field.valid = undefined;
        field.required = false;
        field.validMessage = undefined;
        let rules = field.rules || [];
        rules.forEach(rule => {
            if (rule.required) {
                field.required = true;
            }
        });

        field.validate = function (data) {
            return validateField(data, field);
        };
    });

    validatorForm.validate = function (data) {
        return validateFields(data, validatorForm.fields)
    };
    validatorForm.validateAll = function (data) {
        return validateFields(data, validatorForm.fields, true)
    };
    validatorForm.validateReset = function (data) {
        return validateReset(data, validatorForm.fields)
    };
    validatorForm.newDefaultData = function () {
        let data = {};
        validatorForm.fields.forEach(field => {
            if (isEmpty(field.name)) {
                return;
            }
            if (field.fields && field.fields.length > 0) {
                if (field.type == 'list') {
                    data[field.name] = field.defaultValue || [];
                } else {
                    data[field.name] = field.defaultValue || {};
                    field.fields.forEach(one => {
                        data[field.name][one.name] = one.defaultValue || null;
                    });
                }
            } else {
                data[field.name] = field.defaultValue || null;
            }
        });
        return data;
    };

    return validatorForm;
};

let validateFields = async function (data, fields, all) {
    validateReset(fields);
    if (fields == null || fields.length == 0) {
        return {
            valid: true,
        }
    }
    let fails = [];
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        await validateField(data, field);
        if (!field.valid) {
            fails.push(field)
            if (!all) {
                break;
            }
        }
    }
    return {
        valid: fails.length == 0,
        errors: fails,
    }
};

let execVIf = function (vIf, data) {
    if (vIf == null || vIf === "") {
        return true;
    }
    try {
        var script = ``;
        for (let key in data) {
            script += `var ` + key + `= data['` + key + `'];`;
        }
        script += vIf;
        var res = eval("" + script + "");
        return res;
    } catch (error) {
        console.log(error);
    }
    return false;
};
let validateField = async function (data, field) {
    if (field.type == 'jsonView') {
        field.valid = true;
        return;
    }
    if (field.type == 'json') {
        let jsonValue = null;
        if (field.jsonStringValue != "") {
            try {
                jsonValue = tool.JSONbig.parse(field.jsonStringValue);
            } catch (error) {
                try {
                    jsonValue = eval("(" + field.jsonStringValue + ")");
                } catch (error2) {
                    field.valid = false;//无效的 验证失败
                    field.validMessage = error;
                    return;
                }
            }
            data[field.name] = jsonValue;
        }
    }
    let value = data[field.name];
    if (value != null) {
        if (field.isNumber) {
            if (isNaN(Number(value))) {
                field.valid = false;//无效的 验证失败
                field.validMessage = "" + value + " 不是有效数字";
                return;
            }
            data[field.name] = Number(value);
        }
    }
    // 返回 true 表示 字段展示 返回 false 表示字段隐藏 不需要验证
    if (!execVIf(field.vIf, data)) {
        field.valid = true;
        return;
    }
    let rules = field.rules || [];
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];
        if (!await validateRule(data, field, rule)) {
            return;
        }
    }
    field.valid = true;
    return;
};

let validateRule = async function (data, field, rule) {

    let value = data[field.name];
    let valid = true;
    // required 必填
    // pattern 正则
    // range 区间
    // length 长度
    // enum 可枚举值
    if (valid && rule.required && isEmpty(value)) {
        valid = false;
    }
    if (valid && rule.length && ('' + value).length > rule.length) {
        valid = false;
    }
    if (valid && rule.minLength && ('' + value).length < rule.minLength) {
        valid = false;
    }
    if (valid && rule.maxLength && ('' + value).length > rule.maxLength) {
        valid = false;
    }
    if (valid && rule.min && value < rule.min) {
        valid = false;
    }
    if (valid && rule.max && value > rule.max) {
        valid = false;
    }
    if (valid && rule.pattern && !rule.pattern.test(value)) {
        valid = false;
    }
    let msg = null;
    if (valid && rule.validate) {
        try {
            valid = await rule.validate()
        } catch (error) {
            valid = false
            msg = error;
        }
    }
    if (valid) {
        field.valid = true;//有效的 验证成功
        field.validMessage = null;
    } else {
        msg = msg || rule.message || field.message;
        field.valid = false;//无效的 验证失败
        field.validMessage = msg;
    }
    return valid
};
let validateReset = function (fields) {
    fields.forEach(field => {
        field.valid = undefined;
        field.validMessage = undefined;
    });
};

let isEmpty = function (arg) {
    if (arg == null || arg === "") {
        return true;
    }
    return false;
};
let isTrimEmpty = function (arg) {
    if (arg == null) {
        return true;
    }
    return isEmpty(('' + arg).trim());
};

let isNotTrimEmpty = function (arg) {
    return !isTrimEmpty(arg);
};
export default {
    buildFormValidator
};