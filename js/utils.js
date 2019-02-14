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

/**
 * 日期格式化方法
 * @param timestamp
 * @param type
 * @returns {*}
 */
export const format = (timestamp, type) => {
    let ts = !timestamp ? new Date().getTime() : typeof(timestamp) === 'string' ? parseInt(timestamp) : timestamp
    type = type === undefined || type === "date" ? "yyyy-MM-dd" : type

    /**
     * 格式占位符：
     * 年: y; 月: M; 日: d; 小时: h; 分: m; 秒: s; 季度: q; 毫秒: S
     * 年可以用 1-4 个占位符; 毫秒只能用 1 个占位符，返回 1-3 位的数字; 其他可以使用 1-2 个占位符
     * @param type {string} 格式化占位符字符串
     */
    let formatFactory = (type) => {

            Date.prototype.format = function (fmt) {
                let o = {
                    "M+": this.getMonth() + 1,                      // 月份
                    "d+": this.getDate(),                           // 日
                    "h+": this.getHours(),                          // 小时
                    "m+": this.getMinutes(),                        // 分
                    "s+": this.getSeconds(),                        // 秒
                    "q+": Math.floor((this.getMonth() + 3) / 3),    // 季度
                    "S" : this.getMilliseconds()                     // 毫秒
                }
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
                for (let k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
                return fmt
            }

            return (new Date(ts)).format(type)
        },

        form = {
            "all"    : "yyyy-MM-dd hh:mm:ss",
            "time"   : "hh:mm:ss",
            "MD"     : "MM-dd",
            "MDHm"   : "MM-dd hh:mm",
            "MDHms"  : "MM-dd hh:mm:ss",
            "DHm"    : "dd hh:mm",
            "YMDHm"  : "yyyy-MM-dd hh:mm",
            "Hm"     : "hh:mm",
            "YM"     : "yyyy-MM",
            "default": "yyyy-MM-dd"
        }

    type = form[type] ? form[type] : type
    return formatFactory(type)
}


/**
 * 数组组合排序方法
 * @param arr {array} 期望排序的数组
 * @param orderBy {string} 用于排序的参考属性
 * @param direction {boolean|string|number} 如果是布尔值，true为升序；如果是字符串, asc为升序；如果是数字，正值为升序
 * @return {array} 排序后的数组
 */
export function listSort(arr, orderBy, direction) {

    if (!arr || !isArray(arr)) {
        console.error('第一个参数应为数组')
        return arr
    }
    if (!arr.length) return arr;

    if (!orderBy) {
        console.error('未指定排序参考字段名, 直接返回')
        return arr
    }

    direction = direction === 'asc' || direction > 0 ? true : false

    /**
     * 数组内对象分组方法
     * @param data {array} 格式[{name:1,key:132},{name:1,key:132},{name:3,key:132}]
     * @param key {string} 依据属性名分组
     * 使用方法：
     * arr1=[{name:1,key:132},{name:1,key:132},{name:3,key:132}]
     * getGroups(arr1,"name");
     * 返回：[{name:1,value:[{name:1,key:132},{name:1,key:132}]},{name:3,value:[{name:3,key:132}]}]
     */
    function makeGroups(data, key) {
        let arr = []
        data.map(item => {
            let flag = 1
            // 如果已经在arr中 则 添加至 已有对象中
            for (let j = 0; j < arr.length; j++) {
                if (arr[j].name == item[key]) {
                    arr[j].value.push(item)
                    flag = 0
                    break
                }
            }

            // 如果arr 中 没有 对应数据 则 新建一个
            if (flag) {
                let arrChild = []
                arrChild.push(item)
                let obj = {
                    name : item[key],
                    value: arrChild
                }
                arr.push(obj)
            }
        })
        return arr
    }

    /**
     * 单层解析数组内对象元素内数组方法
     * @param data {array} [{name:1,value:[{name:1,key:132},{name:1,key:132}]},{name:3,value:[{name:3,key:132}]}];
     * @param key {string} 需要进行数组解析的熟悉名；
     * 使用方法：
     * arr1=[{name:1,value:[{name:1,key:132},{name:1,key:132}]},{name:3,value:[{name:3,key:132}]}];
     * toDemerge(arr1,"value");
     * 返回：[{name:1,key:132},{name:1,key:132},{name:3,key:132}]}]
     */
    function toDemerge(arr, key) {
        let newArray = []
        arr.map(childArray => {
            childArray[key].map(item => {
                newArray.push(item)
            })
        })
        return newArray
    }

    return toDemerge(makeGroups(arr, orderBy).sort(sortBy('name', direction)), 'value')
}
