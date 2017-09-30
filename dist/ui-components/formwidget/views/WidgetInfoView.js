'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require('marionette');

var MN = _interopRequireWildcard(_marionette);

var _info = require('../templates/info.tpl');

var _info2 = _interopRequireDefault(_info);

var _UIHelper = require('../../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = MN.ItemView.extend({
    template: _info2.default,
    className: "card-header z-10",
    onBeforeShow: function onBeforeShow() {
        _UIHelper2.default.initTooltips(this.$el);
    },

    events: {
        'click .event-step-settings': 'goToSettings'
    },
    initialize: function initialize(options) {
        this.steps = options.steps;
    },
    goToSettings: function goToSettings() {
        this.steps.set('currentStep', 'settings');
        return false;
    }
});