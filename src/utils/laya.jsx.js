

Laya.createElement = function (type, config, children) {
  var propName;

  // 初始化参数
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  // 从config中提取出内容，如ref key props
  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : '' + config.key;
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;

    // 提取出config中的prop，放入props变量中
    for (propName in config) {
      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // 处理children，挂到props的children属性下
  // 入参的前两个为type和config，后面的就都是children参数了。故需要减2
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    // 只有一个参数时，直接挂到children属性下，不是array的方式
    props.children = children;
  } else if (childrenLength > 1) {
    // 不止一个时，放到array中，然后将array挂到children属性下
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // 取出组件类中的静态变量defaultProps，并给未在JSX中设置值的属性设置默认值
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 返回一个ReactElement对象
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};