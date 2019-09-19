import utils from '@/lib/utils.js'
export default {
    //正数 + 0
    isNotNegativeNumber(rule, value, callback) {
        if (value !== '' && !utils.isPositiveNumber(value) && +value !== 0) {
            callback(new Error('不能为负数')); //callback(new Error('只允许输入0和正数'));
        }
        callback();
    },
    //正数
    isPositiveNumber(rule, value, callback) {
        if (value !== '' && !utils.isPositiveNumber(value)) {
            callback(new Error('只允许输入整数'));
        }
        callback();
    },
    //正整数 + 0
    isNotNegativeInt(rule, value, callback) {
        if (value !== '' && !utils.isPositiveInt(value) && +value !== 0) {
            callback(new Error('只允许输入0和正整数')); 
        }
        callback();
    },
    //正整数
    isPositiveInt(rule, value, callback) {
        if (value !== '' && !utils.isPositiveInt(value)) {
            callback(new Error('只允许输入正整数'));
        }
        callback();
    },
    //数字
    isNumber(rule, value, callback) {
        if (value !== '' && !utils.isInt(value) && !utils.isFloat(value)) {
            callback(new Error('只允许输入数字'));
        }
        callback();
    },
    //数值范围
    numberRange(rule, value, callback, min, max) {
        if (value !== '' && min != null) {
            if (+value < +min) {
                callback(new Error('不允许小于' + min));
            }
        }
        if (value !== '' && max != null) {
            if (+value > +max) {
                callback(new Error('不允许大于' + max));
            }
        }
        callback();
    },
    //密码
    validatePassword(rule, value, callback) {
        if (!/^[a-zA-Z0-9]{6,16}$/.test(value)) {
            callback(new Error('应为6位及以上的字母、数字或字母数字组合'));
        }
        callback();
    },
    //确认密码
    validate2Password(rule, value, callback, value2) {
        if (value !== value2) {
            callback(new Error('两次密码输入不一致 '));
        }
        callback();
    },
    //与旧密码相比较
    validateOldPassword(rule, value, callback, value2) {
        if (value === value2) {
            callback(new Error('新密码不能与旧密码相同 '));
        }
        callback();
    },
    //用户名
    validateUsername(rule, value, callback) {
        if (!/^[a-zA-Z0-9]{4,16}$/.test(value)) {
            callback(new Error('应为4位及以上的字母、数字或字母数字组合'));
        }
        callback();
    },
    //电话
    validatePhoneNumber(rule, value, callback) {
        if (value === '' || /^(0?1[123456789]\d{9})$|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/.test(value)) {
            callback();
        }
        callback(new Error('手机号码格式不正确'));
    },
    //email
    validateEmail(rule, value, callback) {
        if (value === '' || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            callback();
        }
        callback(new Error('邮箱格式不正确'));
    },
}