"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require("marionette");

var MN = _interopRequireWildcard(_marionette);

var _tabs = require("../templates/tabs");

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = MN.ItemView.extend({
    template: _tabs2.default,
    tagName: "ul",
    className: "tab-nav",
    modelEvents: {
        'change': 'render'
    },
    events: {
        'click .event-tab-show': 'goToTab'
    },
    initialize: function initialize() {
        this.model.get('tabs')[this.model.get('currentTab')].action();
    },
    goToTab: function goToTab(e) {
        var tabID = $(e.currentTarget).data('tab');
        if (tabID == this.model.get('currentTab')) return false;

        var tabSettings = this.model.get('tabs')[tabID];
        if (tabSettings.action) {
            tabSettings.action();
        }
        this.model.set('currentTab', tabID);
        return false;
    }
});