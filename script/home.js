(function(exports, $, undefined){

    window.MSA.Home = MSA.Class({
        init: function(data){
            this.page = data.page;
            this.$p = $(this.page);
            this.$articleListCont = this.$p.find('.js-article-list');
            this.$listCont = this.$p.find('.js-list-cont');
            this.$title = this.$p.find('.app-title');
            this.$loading = this.$p.find('.js-loading');
            this.$appContent = this.$p.find('.app-content');
            this.initData();
            this.initDom();
            this.initEvent();
        },

        initData: function(){
            var that = this;
            this.startIndex = 0;
            this.categoryId = 444;
            this.documents = [];
        },

        initDom: function(){
            this.loadCategory();
            this.loadDocuments();
        },

        initEvent: function(){
            var that = this;
            $p = this.$p;

            $p.on('click', 'li.js-item', function(e){
                e.isPropagationStopped()
                $item = $(this);

                window.location.href = '/detail.html?id=' + Number($item.attr('data-id'));
            });
            
        },

        loadDocuments: function(){
            var that = this;
            App.infiniteScroll(that.$articleListCont[0], { loading: that.$loading[0] }, function (next) {
                var params = {
                    start: that.startIndex
                };
                if(that.categoryId){
                    params.cat = that.categoryId;
                }
                sql.listDocuments(params).done(function(_res){
                    var htmlList = [];
                    // _res = [
                    //     {
                    //         "category": {
                    //             "description": "", 
                    //             "tags": "", 
                    //             "section": 73, 
                    //             "created": "2014-08-27 07:45:06", 
                    //             "title": "每日快讯", 
                    //             "id": 444
                    //         }, 
                    //         "thumbnails": [], 
                    //         "title": "每日快讯每日快讯每日快讯每日快讯", 
                    //         "start_publication": "2014-08-27 08:12:55", 
                    //         "excerpt": "每日快讯每日快讯每日快讯每日快讯每日快讯", 
                    //         "id": 39464, 
                    //         "source": null, 
                    //         "original": null
                    //     },
                    //     {
                    //         "category": {
                    //             "description": "", 
                    //             "tags": "", 
                    //             "section": 73, 
                    //             "created": "2014-08-27 07:45:06", 
                    //             "title": "每日快讯", 
                    //             "id": 444
                    //         }, 
                    //         "thumbnails": [], 
                    //         "title": "每日快讯每日快讯每日快讯每日快讯", 
                    //         "start_publication": "2014-08-27 08:12:55", 
                    //         "excerpt": "每日快讯每日快讯每日快讯每日快讯每日快讯", 
                    //         "id": 39464, 
                    //         "source": null, 
                    //         "original": null
                    //     }
                    // ];
                    $.each(_res, function(i, o){
                        if(o.title){
                            if(o.thumbnails.length){
                                htmlList.push('<li class="js-item" data-id="' + o.id + '"><div class="thumbnail"><img src="' + window.MSA.apiDomain + o.thumbnails[0] + '" /></div><div class="doc-title">' + o.title + '</div><div class="doc-excerpt">' + (o.excerpt || '-') + '</div></li>');
                            }else{
                                htmlList.push('<li class="js-item" data-id="' + o.id + '"><div class="doc-title">' + o.title + '</div><div class="doc-excerpt">' + (o.excerpt || '-') + '</div></li>');
                            }
                            that.documents.push(o);
                        }
                    })
                    that.startIndex += htmlList.length;
                    next(htmlList);
                });
            });
        },

        loadCategory: function(){
            var that = this;
            var categoryId = Util.getURLParam('categoryId');
            that.categoryId = categoryId;
            sql.getCategory(categoryId).done(function(_res){
                that.$title.text(_res.title);
                window.document.title = _res.title;
            });
        }

    });

    App.controller('home', function (page) {
        var home = new MSA.Home({
            page: page
        });
    });

})(window,Zepto);