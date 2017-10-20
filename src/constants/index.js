

// export const COMPONENT_REQUEST_URL = 'http://localhost:3000/r/index.html?module=';
export const COMPONENT_REQUEST_URL = 'http://192.168.50.115:8080/';
export const STATIC_REQUEST_URL = '/';
// export const MENU_URL = 'menu.json';
export const MENU_URL = 'http://192.168.50.115:8080/service/list';
export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';
export const API_SERVER = 'http://192.168.50.115:8080';

export const C = (funcName, a) => {
    /* eslint-disable no-console */
    if (a) {
        console.log(`${funcName}:`, a);
    } else {
        console.log(funcName);
    }

    // Номер строки. В данном  варианте бесполезно, т.к. возвращает номер строки бандла. Потом ещё подумать.
    // try { throw new Error(); }
    // catch (err) {
    //     console.log(err.stack.split('\n')[2].match(/at\s+([^\s]+)\s+\((.+):(\d+):/));
    // }

    /* eslint-enable no-console */
};

const serialize = (obj, prefix) => {
    let str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(v !== null && typeof v === "object" ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};

export const CREATE_API_URL = ({ path, data = {} }) => {
    let queryString = serialize(data);
    if (!path){
        return queryString;
    }

    return `${API_SERVER}/${path}/?${queryString}`;
};