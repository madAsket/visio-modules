'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require('marionette');

var MN = _interopRequireWildcard(_marionette);

var _UIHelper = require('../../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = MN.Behavior.extend({
    defaults: {},
    events: {
        'click .event-modal-close': 'removePopup',
        'keyup :input': 'removePopup'
    },
    initialize: function initialize() {
        this.view.modalBehavior = this;
    },
    onRender: function onRender() {
        var _this = this;

        this.$el.modal('show');
        setTimeout(function () {
            _UIHelper2.default.scrollBar(_this.$el.find(".scroll-ui"));
        });
    },
    removePopup: function removePopup(e) {
        if (this.checkPopupEscape(e)) return false;
        this.$el.modal('hide');
        this.view.destroy();
        return false;
    },
    onDestroy: function onDestroy() {
        this.$el.modal('hide');
    },

    checkPopupEscape: function checkPopupEscape(e) {
        if (e && e.type == 'keyup') {
            if (e.keyCode != 27) return true;
        }
        return false;
    }
});