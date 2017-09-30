'use strict';

var _backbone = require('backbone');

var Backbone = _interopRequireWildcard(_backbone);

require('jquery');

var _HTTPHelper = require('../helpers/HTTPHelper');

var _HTTPHelper2 = _interopRequireDefault(_HTTPHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

Backbone.Collection.prototype.parse = function (response) {
    if (response.meta) {
        this.meta = new Backbone.Model(response.meta);
        return response.objects;
    }
    this.meta = new Backbone.Model({ total: response.length });
    return response;
};

var proxiedSync = Backbone.sync;
Backbone.sync = function (method, model, options) {
    console.log('Backbone sync');
    options || (options = {});
    if (!options.crossDomain) {
        options.crossDomain = true;
    }
    if (!options.xhrFields) {
        options.xhrFields = { withCredentials: true };
    }
    _HTTPHelper2.default.ajaxSetup();
    return proxiedSync(method, model, options);
};

var collectionSync = Backbone.Collection.prototype.sync;
Backbone.Collection.prototype.sync = function (mode, collection, xhr) {
    console.log('collection sync');
    this.fetchData = xhr.data || {};
    if (!this.urlPatched) {
        this.url = REST_DOMAIN + this.url;
        this.urlPatched = true;
    }
    _HTTPHelper2.default.ajaxSetup();
    return collectionSync.apply(this, arguments);
};

var url = Backbone.Model.prototype.url;
Backbone.Model.prototype.url = function () {
    // var currentURL = REST_DOMAIN + url.apply(this, arguments);
    // return currentURL += currentURL.charAt(currentURL.length - 1) == '/' ? '' : '/';
    return REST_DOMAIN + url.apply(this, arguments);
};

var modelSync = Backbone.Model.prototype.sync;
Backbone.Model.prototype.sync = function (state, model, options) {
    console.log('model sync');
    console.log(arguments);
    if (!options.disableAuth) {
        _HTTPHelper2.default.ajaxSetup();
    }
    return modelSync.apply(this, arguments);
};