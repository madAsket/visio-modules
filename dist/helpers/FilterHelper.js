'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FilterHelper = function () {
    function FilterHelper() {
        _classCallCheck(this, FilterHelper);

        this.filters = {};
        this.routerParams = [];
        this.currentURI = "/";
        this.currentViewName = null;
    }

    _createClass(FilterHelper, [{
        key: 'setFilter',
        value: function setFilter(attrs, reset) {
            //if reset, remove all only passed
            //TODO do not trigger history if filters the same;
            if (reset) {
                this.filters = attrs;
            } else {
                this.filters = $.extend(this.filters, attrs);
            }
            this.navigate(_backbone2.default.history.getFragment().split('?')[0] + "?" + decodeURIComponent($.param(this.filters, true)));
        }
    }, {
        key: 'removeFilter',
        value: function removeFilter(attr) {
            //if passed remove passed filters, else all
            if (attr && this.filters.hasOwnProperty(attr)) {
                delete this.filters[attr];
            } else {
                this.filters = {};
            }
            this.setFilter({});
        }
    }, {
        key: 'getFilterValue',
        value: function getFilterValue(key, def) {
            if (this.filters.hasOwnProperty(key)) {
                return this.filters[key];
            }
            return def;
        }
    }, {
        key: 'navigate',
        value: function navigate(url) {
            _backbone2.default.history.navigate(url, { trigger: true, replace: true });
        }
    }, {
        key: 'updateFilters',
        value: function updateFilters(viewName, routerParams) {
            this.currentViewName = viewName;
            this.filters = {};
            this.routerParams = routerParams;
            var fragment = _backbone2.default.history.getFragment();
            var hashes = fragment.split('?');
            this.currentURI = hashes[0];
            if (hashes.length == 2) {
                hashes = hashes[1].split('&');
                for (var i = 0; i < hashes.length; i++) {
                    //TODO merge duplicated keys
                    var hash = hashes[i].split('=');
                    if (hash[0] != "") {
                        this.filters[hash[0]] = decodeURIComponent(hashes[i].replace(hash[0] + "=", ''));
                    }
                }
            }
            console.log(this.currentURI);
            console.log(this.filters);
        }
    }]);

    return FilterHelper;
}();

exports.default = FilterHelper;
;