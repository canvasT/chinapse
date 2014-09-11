/**
 * 持久化数据层
 */

(function(exports,$){
    var PAGESIZE = 20;
    var CATEGORY_URL = window.MSA.apiDomain + '/api/news/category/';
    var DOCUMENTS_URL = window.MSA.apiDomain + '/api/news/entries/category/';
    var DOCUMENT_URL = window.MSA.apiDomain + '/api/news/entry/';
    // get documents list of one category
    function fetchDocuments(_param, _callback){
        var data = {
            start : parseInt(_param.start,10) || 0,
            cat : _param.cat,
            num : parseInt(_param.num,10) || PAGESIZE
        };

        $.ajax({
            url: DOCUMENTS_URL + _param.cat + '/',
            data: data,
            success: function(_res){
                if(_callback){
                    _callback(_res);
                }
            },
            error: function(){
                
            }
        });
    }
    function getHTMLById(_id, _callback){
        $.ajax({
            url: DOCUMENT_URL + _id + '/',
            success: function(_res){
                if(_callback){
                    _callback(_res);
                }
            },
            error: function(){
                var data = {
                    "category": {
                        "description": "", 
                        "tags": "", 
                        "section": 22, 
                        "created": "2011-01-01 00:00:00", 
                        "title": "辖区信息", 
                        "id": 45
                    }, 
                    "tags": "", 
                    "html_content": "<div id=\"entry-html-content\" style=\"margin-top: 20px; min-height: 480px;\">\r\n<p class=\"t2m\">宁波市新江桥便桥及新桥施工栈桥的防撞设施是保障杭甬运河新江桥段水域通航安全的重要手段之一，在工程施工期间，宁波三江口海事处积极发挥专业优势，全力保障该工程施工顺利进行。</p>\r\n<p class=\"t2m\">自6月18日宁波市建委召开该工程建设协调会并确定最终施工方案以来，该处一是提前约谈施工单位，要求落实施工期间安全管理措施。由于施工水域位于甬江通往姚江的弯道口，水文和航道条件较为复杂，该处要求施工单位确定施工船舶进点作业后锚泊定位的水域，不得影响该水域航行的其他船舶。二是强化多家施工单位之间的沟通，考虑到临近水域同时有甬江清淤与桥梁防撞设施施工工程，存在交叉水域，该处召集几家施工作业单位，要求建立施工动态信息通报制度，防止航行船舶与施工作业引起冲突。三是对参与施工作业的船舶实施安全检查，确保施工船舶技术状况符合要求，同时督促参与施工辅助的运输船舶办理进出港签证手续，强化现场巡航检查，密切关注施工作业动态，加强与各施工单位与船舶的联系，确保施工期间水上交通安全。</p>\r\n<p class=\"t2m\">通过各方的共同努力，目前新江桥便桥及新桥栈桥防撞设施完善工程已基本完工。</p>\r\n</div>", 
                    "start_publication": "2014-08-25 16:57:58", 
                    "title": "海事部门积极服务宁波新江桥便桥及新桥栈桥防撞设施建成完工", 
                    "excerpt": "\r\n宁波市新江桥便桥及新桥施工栈桥的防撞设施是保障杭甬运河新江桥段水域通航安全的重要手段之一，在工程施工期间，宁波三江口海事处积极发挥专业优势，全力保障该工程施", 
                    "last_update": "2014-08-25 16:57:48", 
                    "source": "三江口海事处", 
                    "is_top": false, 
                    "id": 39424, 
                    "pics": [
                        "/media/photos/2014/08/25/8014d78a97ffef73087e96c350ea0672_jpg_480x3000_autocrop-True_q85.jpg", 
                        "/media/photos/2014/08/25/d576a32763c0424125b821cb7621c5bb_jpg_480x3000_autocrop-True_q85.jpg"
                    ], 
                    "original": null
                }
                if(_callback){
                    _callback(data);
                }
            }
        });
    }

    function fetchCategory(_id, _callback){
        
        $.ajax({
            url: CATEGORY_URL + _id + '/',
            success: function(_result){
                _callback && _callback(_result);
            },
            error: function(){
                // _callback && _callback([]);
            }
        });
    }
    //
    var sql = {
        getDetailById : function(_id){
            var deferred = $.Deferred();
            getHTMLById(_id, function(_result){
                deferred.resolve(_result);
            });

            return deferred;
        },
        listDocuments : function(_param){
            if(_param.cat == null){
                throw Error('No category parameter')
            }

            var deferred = $.Deferred();
            var start = _param.start || 0,
                num = _param.num || PAGESIZE;
                // not hit
            fetchDocuments(_param,function(_res2){
                deferred.resolve(_res2);
            });

            return deferred;
        },
        getCategory: function(_id){
            var deferred = $.Deferred();
            fetchCategory(_id, function(_result){
                deferred.resolve(_result);
            });

            return deferred;
        }
    };
    //
    exports.sql = sql;

})(window,Zepto);