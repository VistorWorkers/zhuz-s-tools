/**
 * 数字千分位转换
 * 数值必须为小数
 * @param num
 * @returns {*}
 */
export function thousandBit(num) {
    let reg = /(\d)(?=(\d{3})+\.)/g
    if (!isNaN(num)) {
        let value = num + ''
        return value.replace(reg, '$1,')
    }

    return num
}
