import * as Backbone from 'backbone';
import 'jquery';
import HTTPHelper from '../helpers/HTTPHelper'

Backbone.Collection.prototype.parse = function (response) {
    if(response.meta){
        this.meta = new Backbone.Model(response.meta);
        return response.objects;
    }
    this.meta = new Backbone.Model({total:response.length});
    return response;
};

var proxiedSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    console.log('Backbone sync');
    options || (options = {});
    if (!options.crossDomain) {
        options.crossDomain = true;
    }
    if (!options.xhrFields) {
        options.xhrFields = {withCredentials:true};
    }
    HTTPHelper.ajaxSetup();
    return proxiedSync(method, model, options);
};

var collectionSync = Backbone.Collection.prototype.sync;
Backbone.Collection.prototype.sync = function(mode, collection, xhr) {
    console.log('collection sync');
    this.fetchData = xhr.data || {};
    if(!this.urlPatched){
        this.url = REST_DOMAIN + this.url;
        this.urlPatched = true;
    }
    HTTPHelper.ajaxSetup();
    return collectionSync.apply(this, arguments);
};

var url = Backbone.Model.prototype.url;
Backbone.Model.prototype.url = function () {
    // var currentURL = REST_DOMAIN + url.apply(this, arguments);
    // return currentURL += currentURL.charAt(currentURL.length - 1) == '/' ? '' : '/';
    return REST_DOMAIN + url.apply(this, arguments);
};

var modelSync = Backbone.Model.prototype.sync;
Backbone.Model.prototype.sync = function(state, model, options) {
    console.log('model sync');
    console.log(arguments);
    if(!options.disableAuth){
        HTTPHelper.ajaxSetup();
    }
    return modelSync.apply(this, arguments);
};

