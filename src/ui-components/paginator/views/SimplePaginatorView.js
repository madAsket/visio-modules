import * as MN from 'marionette';
import PaginatorTemplate from "../templates/paginator.tpl"


export default MN.ItemView.extend({
    template:PaginatorTemplate,
    className:'bootgrid-footer container-fluid',
    events:{
        'click .event-page-change':'changePage'
    },
    collectionEvents:{
        'sync':'updatePages',
        'remove':'updatePages',
        'add':'updatePages'
    },
    initialize(options){
        this.limit = options.limit || 20;
        this.offset = options.offset || 0;
        this.total = this.collection.meta.get('total');
        this.currentPage = 1;
    },
    updatePages(){
        this.total = this.collection.meta.get('total');
        this.offset = 0;
        if(this.collection.fetchData.offset)
            this.offset = this.collection.fetchData.offset;
        this.currentPage = Math.ceil((this.offset / this.limit)+1);
        this.render();
    },
    changePage:function(e){
        var page = $(e.currentTarget).attr('href');
        if(page == this.currentPage) return false;
        let offset = this.limit * (page - 1);
        let fetchData = this.collection.fetchData;
        fetchData['offset'] = offset;
        this.collection.fetch({data:fetchData, add:false, reset:true, traditional:true});
        return false;
    },
    templateHelpers: function () {
        let currentPages = Math.ceil((this.offset / this.limit)+1);
        let totalPages = Math.ceil(this.total / this.limit);
        return {
            total: this.total,
            offset: this.offset,
            limit: this.limit,
            currentPage:currentPages,
            totalPages:totalPages,
            prev: currentPages > 1,
            next: currentPages < totalPages
        }
    }
})