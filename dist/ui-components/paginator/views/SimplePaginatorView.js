'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require('marionette');

var MN = _interopRequireWildcard(_marionette);

var _paginator = require('../templates/paginator.tpl');

var _paginator2 = _interopRequireDefault(_paginator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = MN.ItemView.extend({
    template: _paginator2.default,
    className: 'bootgrid-footer container-fluid',
    events: {
        'click .event-page-change': 'changePage'
    },
    collectionEvents: {
        'sync': 'updatePages',
        'remove': 'updatePages',
        'add': 'updatePages'
    },
    initialize: function initialize(options) {
        this.limit = options.limit || 20;
        this.offset = options.offset || 0;
        this.total = this.collection.meta.get('total');
        this.currentPage = 1;
    },
    updatePages: function updatePages() {
        this.total = this.collection.meta.get('total');
        this.offset = 0;
        if (this.collection.fetchData.offset) this.offset = this.collection.fetchData.offset;
        this.currentPage = Math.ceil(this.offset / this.limit + 1);
        this.render();
    },

    changePage: function changePage(e) {
        var page = $(e.currentTarget).attr('href');
        if (page == this.currentPage) return false;
        var offset = this.limit * (page - 1);
        var fetchData = this.collection.fetchData;
        fetchData['offset'] = offset;
        this.collection.fetch({ data: fetchData, add: false, reset: true, traditional: true });
        return false;
    },
    templateHelpers: function templateHelpers() {
        var currentPages = Math.ceil(this.offset / this.limit + 1);
        var totalPages = Math.ceil(this.total / this.limit);
        return {
            total: this.total,
            offset: this.offset,
            limit: this.limit,
            currentPage: currentPages,
            totalPages: totalPages,
            prev: currentPages > 1,
            next: currentPages < totalPages
        };
    }
});