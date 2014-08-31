(function(){

    var GET_DOMAIN_REG = /^.*@(.*)$/;

    var _baseUID = new Date().getTime();

	P('Util').messageBox = function(title, content, ico, callback, close, cancelCallback){
        $.message.alert({
            width: '485px',
            title: '登录',
            content: content,
            ico: ico || 'alarm',
            confirm: {
                show: false
            },
            cancel: {
                show: true,
                text: '关闭',
                callback: cancelCallback
            },
            popCallback: callback,
            closeCallback: close
        });
    }

    P('Util').delegate = function(fn, args, context){
        return function(){
            args = args.concat(arguments);
            fn.apply(context || window, args);
        }
    }

    P('Util').html_encode_reg = function(str) {
        //return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
        var s = "";  
        
        if (str.length == 0) 
            return "";  
        s = str.replace(/&/g, "&gt;");  
        s = s.replace(/</g, "&lt;");  
        s = s.replace(/>/g, "&gt;");  
        s = s.replace(/ /g, "&nbsp;");  
        s = s.replace(/\'/g, "&#39;");  
        s = s.replace(/\"/g, "&quot;");  
        s = s.replace(/\n/g, "<br>");  
        
        return s;
    }

    P('Util').html_decode_reg = function(str){  
        var s = "";  
        if (str.length == 0) 
            return "";  
        s = str.replace(/&gt;/g, "&");  
        s = s.replace(/&lt;/g, "<");  
        s = s.replace(/&gt;/g, ">");  
        s = s.replace(/&nbsp;/g, " ");  
        s = s.replace(/&#39;/g, "\'");  
        s = s.replace(/&quot;/g, "\"");  
        s = s.replace(/<br>/g, "\n");  

        return s;  
    }

    P('Util').html_encode_orig = function(str) {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    P('Util').html_decode_orig = function(str){  
        var div = document.createElement("div");
        div.innerHTML = str;
        return div.innerHTML;
    }

    // ie6下对splice支持不好
    P('Util').splice = function(){
        var arr = Array.prototype.shift.call(arguments);
        var args = arguments;
        return Array.prototype.splice.apply(arr, args);
    }

    P('Util').getDomain = function(str){
        var matchs;
        if(typeof str != 'string')
            return '';

        matchs = str.match(GET_DOMAIN_REG);
        return matchs[1] || '';
    }

    P('Util').stringify = window.JSON && window.JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"'+obj+'"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == "string") v = '"'+v+'"';
                else if (t == "object" && v !== null) v = arguments.callee(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    P('Util').uid = function(_basePrefix, _step, _offset){
        return (_basePrefix || "id_") + (_baseUID++);
    };

    P('Util').formatDate = function (value, fmt) {
        if (typeof (value) == "number")
            value = new Date(value);

        if(fmt === 'timestamp') return value.getTime();

        var o = {
            "y+": value.getFullYear(), // 年份      
            "M+": value.getMonth() + 1, //月份        
            "d+": value.getDate(), //日        
            "h+": value.getHours() % 12 == 0 ? 12 : value.getHours() % 12, //小时        
            "H+": value.getHours(), //小时        
            "m+": value.getMinutes(), //分        
            "s+": value.getSeconds(), //秒          
            "S": value.getMilliseconds() //毫秒        
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (value.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    P('Util').addURLParams = function(_url, _params){
        if(typeof _params != 'object')
            return _url;

        for(var i in _params){
            if(_params[i]){
                _url += (_url.indexOf('?') == -1 ? '?' : '&');
                _url += encodeURIComponent(i) + '=' + encodeURIComponent(_params[i]);
            }
        }

        return _url;
    }

    P('Util').getURLParams = function(){
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = decodeURIComponent(hash[1]);
            }
            return vars;
        },
    P('Util').getURLParam = function(name){
        return Util.getURLParams()[name];
    }

    function isType(type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) === "[object " + type + "]"
        }
    }

    P('Util').isObject = isType("Object");

    P('Util').isString = isType("String");

    P('Util').isArray = Array.isArray || isType("Array");

    P('Util').isFunction = isType("Function");


    P('Util').getObjFromArr = function(arr, key, val){
        if(!Util.isArray(arr))
            return null;

        for(var i = 0, len = arr.length; i < len; i++){
            var o = arr[i];
            if(o[key] && o[key] == val)
                return o;
        }
        return null;
    }

    P('Util').formatNumber = function(num) {
        var numStr = '' + num;
        var numArr;
        var inte;
        var deci;
        var isDeci = numStr.indexOf('.') >= 0;
        if(isDeci){
            numArr = numStr.split('.');
            inte = numArr[0] || '';
            deci = numArr[1] || '';    
            deci = '.' + deci;
        }else{
            inte = numStr;
            deci = '';
        }
        function format(str){
            if(str.length <= 3){
                return str;
            } else {
                var lastThreeChars = str.substr(str.length - 3)
                var remainChars = str.substr(0,str.length - 3)
                return arguments.callee(remainChars) + ',' + lastThreeChars;
            }
        }
        var inte = format(inte);
        return inte + deci;
    }

    P('Util').sameItem = function(list){
        return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+ list.join("\x0f\x0f") +"\x0f");
    }

    $Tool = P('Util');
})();