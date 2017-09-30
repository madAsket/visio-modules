import Backbone from 'backbone';


export default class FilterHelper{
        constructor(){
            this.filters = {};
            this.routerParams = [];
            this.currentURI = "/";
            this.currentViewName = null;
        }
        setFilter(attrs, reset){
            //if reset, remove all only passed
            //TODO do not trigger history if filters the same;
            if(reset){
                this.filters = attrs;
            }else{
                this.filters = $.extend(this.filters, attrs);
            }
            this.navigate(Backbone.history.getFragment().split('?')[0]
                + "?"+decodeURIComponent($.param(this.filters, true)));
        }
        removeFilter(attr){
            //if passed remove passed filters, else all
            if(attr && this.filters.hasOwnProperty(attr)){
                delete this.filters[attr];
            }else{
                this.filters = {};
            }
            this.setFilter({});
        }
        getFilterValue(key, def){
            if(this.filters.hasOwnProperty(key)){
                return this.filters[key];
            }
            return def;
        }
        navigate(url){
            Backbone.history.navigate(
                url, {trigger: true, replace: true}
            );
        }
        updateFilters(viewName, routerParams){
            this.currentViewName = viewName;
            this.filters = {};
            this.routerParams = routerParams;
            var fragment = Backbone.history.getFragment();
            var hashes = fragment.split('?');
            this.currentURI = hashes[0];
            if(hashes.length == 2){
                hashes = hashes[1].split('&');
                for (var i = 0; i < hashes.length; i++) {
                    //TODO merge duplicated keys
                    var hash = hashes[i].split('=');
                    if(hash[0] != ""){
                        this.filters[hash[0]] = decodeURIComponent(hashes[i].replace(hash[0]+"=", ''));
                    }
                }
            }
            console.log(this.currentURI);
            console.log(this.filters);
        }
};