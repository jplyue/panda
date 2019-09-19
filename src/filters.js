import Vue from 'vue'
//金额格式化
Vue.filter('formatMoney', function (val) {
  // if (isNaN(+num)) {
  //   return num;
  // }
  // num = num.toString().replace(/\$|\,/g, '');
  // if (isNaN(num))
  //   num = "0";
  // var sign = (num == (num = Math.abs(num)));
  // var cents = parseFloat(Math.floor((num * 10000 + 0.50000000001) % 10000));
  // cents = (cents + '').replace(/0+$/g, '');
  // num = Math.floor(num).toString();
  // for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
  //   num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  // return (((sign) ? '' : '-') + num + (cents ? '.' + cents : ''));
  val = val.toString().replace(/\$|\,/g,'');
    if(isNaN(val)) {
      val = "0";  
    } 
    let sign = (val == (val = Math.abs(val)));
    val = Math.floor(val*100+0.50000000001);
    let cents = val%100;
    val = Math.floor(val/100).toString();
    if(cents<10) {
       cents = "0" + cents
    }
    for (var i = 0; i < Math.floor((val.length-(1+i))/3); i++) {
        val = val.substring(0,val.length-(4*i+3))+',' + val.substring(val.length-(4*i+3));
    }

    return (((sign)?'':'-') + val + '.' + cents);
});

//格式化字符串str，只保留len位
Vue.filter('ellipsis', function (str, len) {
  if (!str) {
    return '';
  }
  if (str.length <= len) {
    return str;
  } else {
    return str.slice(0, len);
  }
});

//从arr中根据id获取对应的name
Vue.filter('getNameById', function (id, arr, idAttr, nameAttr) {
  var name = '--';
  if (Array.isArray(arr)) {
    arr.some((v) => {
      if (v[idAttr] == id) {
        name = v[nameAttr];
        return true;
      }
    })
  }
  return name;
});
//百分比格式化,保留的小数位数
Vue.filter('percentageFormat', function (value, n) {
  if (isNaN(+value)) {
    return value;
  }
  value = +value;
  if (value) {
    var size = value * 100;
    return size.toFixed(n) + '%';
  } else {
    return value;
  }
});
//保留n位小数位数
Vue.filter('fixedFloat', function (value, n) {
  if (isNaN(+value)) {
    return value;
  }
  value = +value;
  if (value) {
    return value.toFixed(n);
  } else {
    return value;
  }
});