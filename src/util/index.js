
import md5 from 'js-md5';
import cryptoJS from 'crypto-js';
import jquery from 'jquery'

import keyCode from './keyCode';


let util = {};

import style from '../components/style/index.js';

util.addColor = function (color) {
    if (util.isNotEmpty(color)) {
        if (color.startsWith("#")) {
            style.addColor(color);
            color = color.substring(1);
        }
    }
    return color;
};

util.install = (app) => {
    util.app = app;
    util.$route = app.config.globalProperties.$route;
    util.$router = app.config.globalProperties.$router;
    util.getPath = (path) => {
        if (path == null) {
            return util.$route.path;
        }
        return path;
    };
    util.to = (path) => {
        util.$router.push(path)
    };
    app.provide("util", util);
};
util.md5 = md5;
util.jquery = jquery;
Object.assign(util, keyCode.keyEvent);


util.isManagePage = function (path) {
    path = util.getPath(path);
    if (path == '/manage' || path.indexOf('/manage/') == 0) {
        return true;
    }
    return false;
};
util.isUserPage = function (path) {
    path = util.getPath(path);
    if (path == '/user' || path.indexOf('/user/') == 0) {
        return true;
    }
    return false;
};
util.isToolboxPage = function (path) {
    path = util.getPath(path);
    if (path == '/toolbox' || path.indexOf('/toolbox/') == 0) {
        return true;
    }
    return false;
};
util.isApplicationPage = function (path) {
    path = util.getPath(path);
    if (path == '/application' || path.indexOf('/application/') == 0) {
        return true;
    }
    return false;
};
util.isWorkspacePage = function (path) {
    path = util.getPath(path);
    if (path == '/workspace' || path.indexOf('/workspace/') == 0) {
        return true;
    }
    return false;
};
util.shouldHeader = function (path) {
    path = util.getPath(path);
    return true;
};
util.shouldBody = function (path) {
    path = util.getPath(path);
    return true;
};
util.shouldBodyNav = function (path) {
    path = util.getPath(path);
    if (this.isManagePage(path)) {
        return true;
    }
    if (this.isUserPage(path)) {
        return true;
    }
    return false;
};
util.shouldFooter = function (path) {
    path = util.getPath(path);
    return false;
};

util.isEmpty = function (arg) {
    if (arg == null || arg == "") {
        return true;
    }
    return false;
};
util.isNotEmpty = function (arg) {
    return !util.isEmpty(arg);
};
util.isTrimEmpty = function (arg) {
    if (arg == null) {
        return true;
    }
    return util.isEmpty(('' + arg).trim());
};

util.isNotTrimEmpty = function (arg) {
    return !util.isTrimEmpty(arg);
};

util.stopEvent = function (event) {
    event = event || window.event;
    if (event) {
        event.stopPropagation && event.stopPropagation();
        event.preventDefault && event.preventDefault();
    }
};
util.setJWT = function (jwt) {
    if (util.isNotEmpty(jwt)) {
        util.setCookie("team-ide-jwt", jwt, 60);
    } else {
        util.setCookie("team-ide-jwt", "", 0);
    }
}
util.getJWT = function () {
    return util.getCookie("team-ide-jwt");
}
util.setCookie = function (cname, cvalue, exms) {
    var d = new Date();
    d.setTime(d.getTime() + (exms * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
util.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
    }
    return "";
}

util.byteToString = function (arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}

util.stringToByte = function (str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}
let k = util.byteToString([81, 53, 54, 104, 70, 65, 97, 117, 87, 107, 49, 56, 71, 121, 50, 105]);

//加密
util.encrypt = function (word, key) {
    const keyParse = cryptoJS.enc.Utf8.parse(key)
    const srcs = cryptoJS.enc.Utf8.parse(word)
    const encrypted = cryptoJS.AES.encrypt(srcs, keyParse, {
        iv: keyParse,
        mode: cryptoJS.mode.CBC,
        padding: cryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
};
//解密
util.decrypt = function (word, key) {
    const keyParse = cryptoJS.enc.Utf8.parse(key)
    const decrypted = cryptoJS.AES.decrypt(word, keyParse, {
        iv: keyParse,
        mode: cryptoJS.mode.CBC,
        padding: cryptoJS.pad.Pkcs7
    })
    return cryptoJS.enc.Utf8.stringify(decrypted).toString()
};
//随机生成指定数量的16进制key
util.generatekey = function (num) {
    let library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (var i = 0; i < num; i++) {
        let randomPoz = Math.floor(Math.random() * library.length);
        key += library.substring(randomPoz, randomPoz + 1);
    }
    return key;
};

// 加密
util.aesEncrypt = function (str) {
    return util.encrypt(str, k);
};
// 解密
util.aesDecrypt = function (str) {
    return util.decrypt(str, k);
};

util.getCacheKey = function (source, key) {
    return source.url + '-' + key;
};

util.getCache = function (key) {
    key = util.getCacheKey(key);
    return localStorage.getItem(key);
};
util.setCache = function (key, value) {
    key = util.getCacheKey(key);
    localStorage.setItem(key, value);
};
util.removeCache = function (key) {
    key = util.getCacheKey(key);
    return localStorage.removeItem(key);
};

export default util;