/**
 * 获取实际数据类型
 * @param val
 * @returns {*}
 */
export function typeOf(val) {
    let types = {
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null',
        '[object Array]'    : 'array',
        '[object Object]'   : 'object',
        '[object String]'   : 'string',
        '[object Number]'   : 'number',
        '[object RegExp]'   : 'regExp',
        '[object Date]'     : 'date',
        '[object Boolean]'  : 'boolean',
        '[object Function]' : 'function',
        '[object Math]'     : 'math'
    }

    let type = types[Object.prototype.toString.call(val)]
    // 如果数据类型为number 则判断其是不是NaN
    if (type === 'number') {
        type = isNaN(val) ? 'NaN' : type
    }
    return type
}

/**
 * 判断是否是某种数据类型
 * @param type
 */
export function isType(type) {
    return function (value) {
        return typeOf(value) === type
    }
}

/**
 * 判断数据类型是否为array
 * @param val
 * @returns {*}
 */
export function isArray(val) {
    return isType('array')(val)
}

/**
 * 判断数据类型是否为undefined
 * @param val
 * @returns {*}
 */
export function isUndefined(val) {
    return isType('undefined')(val)
}

/**
 * 判断对象是否为空对象
 * @param obj
 * @returns {boolean}
 */
export function isEmptyObject(obj = {}) {
    for (let key in obj) {
        return false
    }

    return true
}
