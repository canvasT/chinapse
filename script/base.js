(function(){

	/**
	 * 返回指定的命名空间，如果不存在则新建一个命名空间<br/>
	 * <pre>
	 *   P("MSA.cache");
	 *   P("window.MSA.cacha");
	 *   // 以上两者都将建立 window.ui, 然后返回 window.ui.package
	 * </pre>
	 * 注意：命名空间不要使用浏览器保留的关键字
	 * @param  {String} _namespace 命名空间的名称.
	 * @return {Object}            生成的命名空间对象.
	 */
	window.P = function(_namespace) {
	    if (!_namespace || !_namespace.length) return null;

	    var _package = window,
	    	arr = _namespace.split('.'),
	    	len = arr.length;

	    for (i = (arr[0] == 'window') ? 1 : 0; i < len; i++) {
	    	_package = _package[arr[i]] = _package[arr[i]] || {};
	    }

	    return _package;
	};

	/**
	 * 类定义，包含继承框架和单例模型
	 * 每个类都的init方法类似于java的Constructor构造方法
	 * MSA.clazz1 = MSA.Class({
	 * 	   init : function(args){
	 *	      // 初始化
	 *	   },
	 *	   fn : function(){
	 *	   	  // TODO...
	 *	   }
	 * });
	 * 单例: MSA.clazz1.getInstance(args);
	 * @param _proto {Object} 所有方法的Hash.
	 * @return function
	 */
	P('MSA').Class = function(_proto,_staticFuns) {
		var clazz = function() {
			// avoid call initialize when extending
			if (arguments[0] != 'extend' && !!this.init) {
				return this.init.apply(this, arguments);
			}
		};

		// 实现类的继承，支持多级继承
		clazz.extend = function(_super,_proto) {
			this._super = _super;
			this.superPro = _super.prototype;
			this.prototype = new _super('extend');
			this.prototype.constructor = this;

			// for super initialize  子类必须调用this.superInit()，否则多级继承会有问题
	    	var superp = _super;
			this.prototype.superInit = function() {
				if (!this._super) {
					this._super = {};
					var $superp = _super;
					for (var key in $superp.prototype) {
						var fn = $superp.prototype[key];
						if (typeof fn == 'function' && key != 'init') {
							this._super[key] = function(_key,_this){
								return function(){
									var fn = $superp.prototype[_key];
									$superp = $superp._super || _super;
									if (!$superp.prototype[_key]) {
										$superp = _super;
									}
									return !!fn && fn.apply(_this, arguments);
								};
							}(key,this);
						}
					}
				}
				var _init = superp.prototype.init;
				superp = superp._super || _super;
				return !!_init && _init.apply(this, arguments);
			};

			// 默认是父类的init
			this.prototype.init = this.prototype.superInit;

			for (var key in _proto) {
				this.prototype[key] = _proto[key];
			}
			return this;
		};

		// 单例模型
		clazz.getInstance = function(_config) {
			if (!this.instance) {
				this.instance = new this(_config);
			}

			return this.instance;
		}

		clazz.prototype = _proto || {};
		
		if(_staticFuns){
			for (var key in _staticFuns) {
				clazz[key] = _staticFuns[key];
			}
		}
		
		return clazz;
	};

	// 对Date的扩展，将 Date 转化为指定格式的String 
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	// 例子： 
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
	Date.prototype.Format = function(fmt){ //author: meizz 
		var o = { 
		    "M+" : this.getMonth()+1,                 //月份 
		    "d+" : this.getDate(),                    //日 
		    "h+" : this.getHours(),                   //小时 
		    "m+" : this.getMinutes(),                 //分 
		    "s+" : this.getSeconds(),                 //秒 
		    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
		    "S"  : this.getMilliseconds()             //毫秒 
	  	}; 
	  	if(/(y+)/.test(fmt)) 
	    	fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	  	for(var k in o) 
	    	if(new RegExp("("+ k +")").test(fmt)) 
	  			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
	  	return fmt; 
	}

	/**
	 * 绑定接口及参数，使其的调用对象保持一致
	 * @param  {Object}   that 需要保持一致的对象，null表示window对象.
	 * @param  {Variable} [argument0[,argument1 ...]] 函数调用时需要的参数.
	 * @return {Function} 返回绑定后的函数.
	 */
	Function.prototype.bind = function() {
		var fn = this,
			args = arguments,
			that = Array.prototype.shift.call(arguments);

		return function() {
			var argc = Array.prototype.slice.call(args, 0);
			Array.prototype.push.apply(argc, arguments);
			return fn.apply(that || window, argc);
		};
	};

	/*P('Util').objectCopy = function(o){
		var F = function(){};
		F.prototype = o;
		return new F();
	};

	P('Util').extend = function(Sub, Super, ext){
		var key;
		var proto = Util.objectCopy(Super.prototype);
		proto.constructor = Sub;
		Sub.super = Super.prototype;
		Sub.prototype = proto;


		for(key in ext){
			Sub.prototype[key] = ext[key];
		};
	};*/
})();