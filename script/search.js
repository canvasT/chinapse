window.MSA.Search = MSA.Class({
    init: function(data){
        this.page = data.page;
        this.keyword = data.data.keyword;
        this.$p = $(this.page);
        this.$articleListCont = this.$p.find('.js-article-list');
        this.$listCont = this.$p.find('.js-list-cont');
        this.$formSearch = this.$p.find('.js-form-search');
        this.$btnConfirmSearch = this.$p.find('.js-btn-confirm-search');
        this.$iptSearch = this.$p.find('.js-ipt-search');
        this.$loading = this.$p.find('.js-loading');
        this.$appContent = this.$p.find('.app-content');
        this.initData();
        this.initDom();
        this.initEvent();
    },

    initData: function(){
        var that = this;
        this.startIndex = 0;
        this.documents = [];
    },

    initDom: function(){
        this.$iptSearch.val(this.keyword);
        this.loadDocuments();
    },

    initEvent: function(){
        var that = this;
        $p = this.$p;

        $p.on('click', 'li.js-item', function(e){
            e.isPropagationStopped()
            $item = $(this);

            var article = that.getArticleById(Number($item.attr('data-id')));
            if(article != undefined){
                App.load('detail', {
                    article: article
                });
            }
        })

        this.$btnConfirmSearch.on('click', function(){
            var keyword = that.$iptSearch.val();
            if(!keyword){
                alert('请输入关键字！');
            }else{
                that.keyword = keyword;
                that.startIndex = 0;
                // that.$articleListCont.html('');
                that.$articleListCont.after('<ul class="app-list js-article-list"></ul>').remove();
                that.$articleListCont = that.$p.find('.js-article-list');
                // that.$appContent.scroll();
                that.loadDocuments();
            }
        })
    },

    loadDocuments: function(){
        var that = this;
        App.infiniteScroll(that.$articleListCont[0], { loading: that.$loading[0] }, function (next) {
            var params = {
                start: that.startIndex
            };
            if(that.keyword){
                params.keyword = that.keyword;
            }
            sql.search(params).done(function(_res){
                var htmlList = [];
                $.each(_res, function(i, o){
                    if(o.title){
                        htmlList.push('<li class="js-item" data-id="' + o.id + '"><div class="doc-title">' + o.title + '</div><div class="doc-date">颁布日期：' + (o.publish_date || '-') + '</div></li>');
                        that.documents.push(o);
                    }
                });
                that.startIndex += htmlList.length;
                next(htmlList);
            });
        });
    },

    getArticleById: function(id){
        for(var i = 0, len = this.documents.length; i < len; i++){
            var article = this.documents[i];
            if(id == article.id){
                return article;
            }
        }
    }
});

App.controller('search', function (page, args) {
    var search = new MSA.Search({
        page: page,
        data: {
            keyword: args.keyword
        }
    });
});