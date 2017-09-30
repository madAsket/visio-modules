import * as MN from 'marionette';


export default MN.Behavior.extend({
    defaults: {
        limit:20
    },
    ui: {
        'paginatorBlock':".load-more"
    },
    events: {
        'click .event-paginator-load':"loadMore"
    },
    collectionEvents:{
        add:'updateMetaAdd',
        remove:"updateMetaRemove",
        sync:"updateMetaSync"
    },
    onBeforeShow(){
        this.ui.paginatorBlock.hide();
    },
    initialize(){
        this.offset = 0;
    },
    updateMetaSync(){
        console.log("SYNC meta ", this.view.collection.meta.get('total'));
        this.checkMoreLoaderUI();
    },
    updateMetaAdd(model, collection, options){
        if(options.paged){
            return false;
        }
        this.view.collection.meta.set('total', this.view.collection.meta.get('total') + 1);
        console.log("ADD to meta ", this.view.collection.meta.get('total'));
        this.checkMoreLoaderUI();
    },
    updateMetaRemove(){
        //TODO обновлять limit/offset при обновлении.
        this.view.collection.meta.set('total', this.view.collection.meta.get('total') - 1);
        console.log(this.view.collection.length);
        console.log(this.view.collection.meta.get('total'));
        console.log("REMOVE from meta ", this.view.collection.meta.get('total'));
        this.checkMoreLoaderUI();
    },
    checkMoreLoaderUI(){
        console.log(this.view.collection.meta.get('total'));
        console.log(this.view.collection.length);
        if(this.view.collection.meta.get('total') == this.view.collection.length){
            this.ui.paginatorBlock.hide();
        }else{
            this.ui.paginatorBlock.show();
        }
    },
    loadMore(){
        let lastFetchData = this.view.collection.fetchData;
        lastFetchData.limit = this.options.limit;
        this.offset += this.options.limit;
        lastFetchData.offset = this.offset;
        let collection = this.view.collection.clone();
        collection.fetch({data:lastFetchData, traditional:true,
            success:(data)=>{
                this.view.collection.add(collection.models, {paged:true});
                this.view.collection.meta.set('total', collection.meta.get('total'));
                this.updateMetaSync();
            },
            error:()=>{
                //TODO
            }
        });
        return false;
    }
});