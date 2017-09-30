'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require('marionette');

var MN = _interopRequireWildcard(_marionette);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = MN.Behavior.extend({
    defaults: {
        limit: 20
    },
    ui: {
        'paginatorBlock': ".load-more"
    },
    events: {
        'click .event-paginator-load': "loadMore"
    },
    collectionEvents: {
        add: 'updateMetaAdd',
        remove: "updateMetaRemove",
        sync: "updateMetaSync"
    },
    onBeforeShow: function onBeforeShow() {
        this.ui.paginatorBlock.hide();
    },
    initialize: function initialize() {
        this.offset = 0;
    },
    updateMetaSync: function updateMetaSync() {
        console.log("SYNC meta ", this.view.collection.meta.get('total'));
        this.checkMoreLoaderUI();
    },
    updateMetaAdd: function updateMetaAdd(model, collection, options) {
        if (options.paged) {
            return false;
        }
        this.view.collection.meta.set('total', this.view.collection.meta.get('total') + 1);
        console.log("ADD to meta ", this.view.collection.meta.get('total'));
        this.checkMoreLoaderUI();
    },
    updateMetaRemove: function updateMetaRemove() {
        //TODO обновлять limit/offset при обновлении.
        this.view.collection.meta.set('total', this.view.collection.meta.get('total') - 1);
        console.log(this.view.collection.length);
        console.log(this.view.collection.meta.get('total'));
        console.log("REMOVE from meta ", this.view.collection.meta.get('total'));
        this.checkMoreLoaderUI();
    },
    checkMoreLoaderUI: function checkMoreLoaderUI() {
        console.log(this.view.collection.meta.get('total'));
        console.log(this.view.collection.length);
        if (this.view.collection.meta.get('total') == this.view.collection.length) {
            this.ui.paginatorBlock.hide();
        } else {
            this.ui.paginatorBlock.show();
        }
    },
    loadMore: function loadMore() {
        var _this = this;

        var lastFetchData = this.view.collection.fetchData;
        lastFetchData.limit = this.options.limit;
        this.offset += this.options.limit;
        lastFetchData.offset = this.offset;
        var collection = this.view.collection.clone();
        collection.fetch({ data: lastFetchData, traditional: true,
            success: function success(data) {
                _this.view.collection.add(collection.models, { paged: true });
                _this.view.collection.meta.set('total', collection.meta.get('total'));
                _this.updateMetaSync();
            },
            error: function error() {
                //TODO
            }
        });
        return false;
    }
});