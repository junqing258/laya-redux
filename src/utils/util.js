export function uuid () {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export function deepClone(values) {
  var copy;
  if ( null == values ||  "object" !=  typeof values)  return values;
  if (values instanceof Date ) {
      copy = new Date();
      copy.setTime(values.getTime());
      return copy;
  }
  if (values instanceof Array ) {
      copy = [];
      for (var i = 0, len = values.length; i < len; i++) {
          copy[i] = deepClone(values[i]);
      }
      return copy;
  }
  if (values instanceof Object ) {
      copy = {};
      for (var attr in values) {
          if (values.hasOwnProperty(attr)) copy[attr] = deepClone(values[attr]);
      }
      return copy;
  }
  throw new Error("Unable to copy values! Its type isn't supported.");
}

export function randomNum(max, min) {
  min = min || 0;
  let tmax = Math.max(max, min), tmin = Math.min(max, min);
  return Math.floor(min + Math.random() * (max - min));
}

/**
 * 数字千分位格式化
 */
export function toThousands (num) {
  var result = '', counter = 0;
  num = (num || 0).toString();
  for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result = num.charAt(i) + result;
    if (!(counter % 3) && i != 0) { result = ',' + result; }
  }
  return result;
}

export function toWans(num, fixed) {
  var result = '';
  fixed = fixed || 2;
  num = Number(num || 0);
  if (num>=10000) {
    result = num/10000;
    let _st = result.toString(),
        _mt = Math.pow(10, fixed);
    if (_st.indexOf(".")>-1 && _st.split(".")[1].length>fixed) result = Math.round(_mt*result)/_mt;
    result += "万";
  } else {
    result = String(num);
  }
  return result;
}

export function getCharLength (str) {
  var str_length = 0;
  var str_len = 0;
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    var a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      str_length++;
    }
  }
  return str_length;
}

export function ellipsis (str, len) {
  var str_length = 0;
  var str_len = 0;
  var str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    var a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length > len) {
      str_cut = str_cut.concat('...');
      return str_cut;
    }
  }
  if (str_length <= len) {
    return str;
  }
}

export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r !== null) {return  window.unescape(r[2]);} 
  return null;
};


let _env = 'product';
if (/^https?:\/\/[a-zA-Z]+\d*(\-wap\.stg\d+\.)[A-Za-z0-9]+(\.com)/.test(location.href)) {
  _env = 'dev';
} else if (/^https?:\/\/\d*\.\d*\.\d*\.\d*/.test(location.href) || /^https?:\/\/localhost.*/.test(location.href) || /^file:\/\//.test(location.href)) {
  _env = 'local';
} else {
  _env = 'product';
}
export const env = _env;

export function checkLogin () {
  if (env === 'local') { return true; }
  if (GM && GM.userLogged) {
    return true;
  } else {
    return false;
  }
}

export function toLogin () {
  if (GM && GM.userLoginUrl) {
    return location.href = GM.userLoginUrl;
  }
}

export function appGoback () {
  if (GM && GM.isShowBtnBack_out) {
    return location.href = gamehallAndroidBackUrl;
  } else {
    history.go(-1);
  }
}

export function getBetStep (value, desc) {
  var st = 1;
  let sts = [10, 100, 1000, 10000, 100000];
  let stps = [100, 1000, 10000, 100000, 1000000];
  let index = -1;
  stps.find(v => {
    index++;
    if (desc) {
      return v >= value;
    } else {
      return v > value;
    }
  });
  return sts[index];
}

 /**
 * @public
 * 创建骨骼动画
 * @param {String} path 骨骼动画路径
 * @param {Number} rate 骨骼动画帧率，引擎默认为30，一般传24
 * @param {Number} type 动画类型 0,使用模板缓冲的数据，模板缓冲的数据，不允许修改	（内存开销小，计算开销小，不支持换装） 1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装） 2,使用动态方式，去实时去画	（内存开销小，计算开销大，支持换装,不建议使用）
 * @return Skeleton骨骼动画
 */
let paths = [];
let temps = [];
export function createSkeleton(path, rate, type) {
      rate = rate || 24;
      type = type || 0;
      var png = Laya.loader.getRes(path + ".png");
      var sk  = Laya.loader.getRes(path + ".sk");
      if(!png || !sk) {
          console.error("资源没有预加载:"+path);
          return null;
      }
      let index = paths.indexOf(path), templet;
      if (index===-1) {
        templet = new Laya.Templet();
        let len = paths.length;
        paths[len] = path;
        temps[len] = templet;
        templet.parseData(png, sk, rate);
      } else {
        templet = temps[index];
      }
      return new Laya.Skeleton(templet, type);
}