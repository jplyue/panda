const moment = require('moment');
export default {  
    //是否为正数
    isPositiveNumber(value) {
        var result = true;
        if (isNaN(+value)) {
            result = false;
        } else {
            result = /^[0-9]*[1-9][0-9]*$/.test(value) || /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value);
        }
        return result;
    },
    //是否为正整数
    isPositiveInt(value) {
        var result = true;
        if (isNaN(+value)) {
            result = false;
        } else {
            result = /^[0-9]*[1-9][0-9]*$/.test(value);
        }
        return result;
    },
    //是否为整数
    isInt(value) {
        var result = true;
        if (isNaN(+value)) {
            result = false;
        } else {
            result = /^-?\d+$/.test(value);
        }
        return result;
    },
    //是否为浮点数
    isFloat(value) {
        var result = true;
        if (isNaN(+value)) {
            result = false;
        } else {
            result = /^(-?\d+)(\.\d+)?$/.test(value);
        }
        return result;
    },
    //是否为ipv4
    isIPV4(value) {
        var result = true;
        if (isNaN(+value)) {
            result = false;
        } else {
            result = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
        }
        return result;
    },
    createDom(htmlStr) {            //根据字符串创建dom
        var div = document.createElement("div");
        div.innerHTML = htmlStr;
        return div.childNodes[0];
    },
    formatDate(date, fmt) {         //格式化日期
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    setValByName(o, name, val) {    //根据'a.b.c'字符串来给变量赋值
        var names = name.split('.');
        var oVal = o;
        for (var i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                oVal[names[i]] = val;
            } else {
                oVal = oVal[names[i]];
            }
        }
    },
    copyToClipboard(Str) {          //复制到剪切板
        var inputText = this.createDom('<input type="textarea" value="' + Str + '"/>');
        document.querySelector('body').appendChild(inputText);
        var currentFocus = document.activeElement;
        inputText.focus();
        inputText.setSelectionRange(0, inputText.value.length);
        document.execCommand('copy', true);
        currentFocus.focus();
        inputText.parentNode.removeChild(inputText);
        return true;
    },
    getDictLabel(value, arr, key, color, name) {            //根据字典中颜色值获取html片段
        color = color ? color : 'color';
        name = name ? name : 'name';
        var szHtml = '';
        if (Array.isArray(arr)) {
            arr.forEach((v, k) => {
                if (value & v[key]) {
                    szHtml += '<span style="display: inlne-block;color: #fff;font-size:12px;padding:3px;margin-right:5px;border-radius:3px;background:#999">' + v[name] + '</span>';
                }
            });
        }
        return szHtml
    },
    getDictStatus(value, arr, key, color, name){
        color = color ? color : 'color';
        name = name ? name : 'name';
        var szHtml = '';
        if (Array.isArray(arr)) {
            arr.forEach((v, k) => {
                if (value & v[key]) {
                    szHtml += '<span style="display: inlne-block;color: #fff;font-size:12px;padding:3px;margin-right:2px;border-radius:3px;background:'+v.raw.color+'">' + v[name] + '</span>';
                }
            });
        }
        return szHtml
    },
    getItemsByAND(arr, value, name) {           //通过与操作获取符合的数组
        var aItems = [];
        if (Array.isArray(arr)) {
            arr.forEach((v) => {
                if (v[name] & value) {
                    aItems.push(v);
                }
            });
        }
        return aItems;
    },
    sumItems(arr, name) {             //求和
        var iSum = 0;
        if (Array.isArray(arr)) {
            arr.forEach((v) => {
                iSum += +v[name];
            });
        }
        return iSum;
    },
    sumArray(arr) {             //求和
        var iSum = 0;
        if (Array.isArray(arr)) {
            arr.forEach((v) => {
                iSum += +v;
            });
        }
        return iSum;
    },
    getItemById(arr, id, name) {           //根据id获取数组中的元素
        var item = {};
        if (Array.isArray(arr)) {
            arr.some((v) => {
                if (v[name] === id) {
                    item = v;
                    return true;
                }
            });
        }
        return item;
    },
    downloadFile(url, name) {       //下载文件
        var oEl = document.createElement('a');
        oEl.setAttribute('href', url)
        if (name) {
            oEl.setAttribute('download', name)
        }
        oEl.click();
    },
    getToday(date) {        //获取当天日期
        if(date){
            return moment(date).format('YYYY-MM-DD');
        }else{
            return moment().format('YYYY-MM-DD');
        }      
    },
    getDaysAgo(n, date) {     //获取n天前日期
        return moment(date).subtract(n, 'd').format('YYYY-MM-DD');
    },
    getWeeksAgo(n, date) {   //获取n个星期前日期
        return moment(date).subtract(n, 'w').format('YYYY-MM-DD');
    },
    getMonthsAgo(n, date) {   //获取n个月前日期
        return moment(date).subtract(n, 'M').format('YYYY-MM-DD');
    },
}