window.MSA.Detail = MSA.Class({
    init: function(data){
        this.page = data.page;
        this.article = data.article;
        this.$p = $(this.page);
        this.$appContent = this.$p.find('.app-content');
        this.$topBar = this.$p.find('.app-topbar');
        this.$topBar.addClass('detail-topbar');
        this.$title = this.$p.find('.app-title');
        this.$btnBack = this.$p.find('.js-btn-back');
        this.$footer = this.$p.find('.footer');
        this.initData();
        this.initDom();
        this.initEvent();
    },

    initData: function(){
        var that = this;
    },

    initDom: function(){
        this.loadDetail();
    },

    initEvent: function(){
        
    },

    loadDetail: function(){
    	var that = this;
        sql.getDetailById(this.article.id).done(function(_res){
            window.document.title = _res['title'];
            var html = '<div class="article-title">' + _res['title'] + '</div>';
            html += '<div class="article-date">' + _res['start_publication'] + '</div>';

            $.each(_res['pics'], function(i, o){
                html += '<div class="article-pic"><img class="article-pic" src="' + window.MSA.apiDomain + o + '" /></div>';
            });

            html += _res['html_content'];
            that.$appContent.find('.main').html(html);
            that.$footer.show();

            that.$btnBack.html(_res['category']['title']);
            that.$btnBack.attr('href', '/index.html?categoryId=' + _res['category']['id']);
        });
    }
});
App.controller('detail', function (page, args) {
    var detail = new MSA.Detail({
        page: page,
        article: args.article
    });
});