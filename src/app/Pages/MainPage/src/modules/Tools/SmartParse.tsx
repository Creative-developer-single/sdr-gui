/**
 * 智能类型转换
 * @param {string} raw 输入字符串
 * @returns {number|string} 转换后的值
 */
export function smartParse(raw) {
    const trimmed = raw.trim();

    if (trimmed === "") {
        return "";
    }

    // 判断是否是合法数字（包含整数、小数、科学计数法）
    if (!isNaN(trimmed) && !isNaN(parseFloat(trimmed))) {
        return Number(trimmed);
    } else {
        return trimmed;
    }
}
