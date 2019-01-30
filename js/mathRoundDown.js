/**
 * 数字向下取整方法
 * @param num 数值
 * @param ws 保留小数位数
 * @returns {number}
 */
export function roundDown(num, ws) {
    let m = Math.pow(10, ws)
    return Math.floor(num * m) / m
}
