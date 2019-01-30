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


/**
 * 补充一段 countUp.js中的 千分位转换方法
 * @param num
 * @returns {string}
 */
export function formatNumber(num) {
    var neg = (num < 0),
        x, x1, x2, x3, i, len;
    num = self.roundsOff ? Math.abs(num).toFixed(self.decimals) : roundDown(Math.abs(num), self.decimals);
    num += '';
    x = num.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? self.options.decimal + x[1] : '';
    if (self.options.useGrouping) {
        x3 = '';
        for (i = 0, len = x1.length; i < len; ++i) {
            if (i !== 0 && ((i % 3) === 0)) {
                x3 = self.options.separator + x3;
            }
            x3 = x1[len - i - 1] + x3;
        }
        x1 = x3;
    }
    // optional numeral substitution
    if (self.options.numerals.length) {
        x1 = x1.replace(/[0-9]/g, function (w) {
            return self.options.numerals[+w];
        })
        x2 = x2.replace(/[0-9]/g, function (w) {
            return self.options.numerals[+w];
        })
    }
    return (neg ? '-' : '') + self.options.prefix + x1 + x2 + self.options.suffix;
}
