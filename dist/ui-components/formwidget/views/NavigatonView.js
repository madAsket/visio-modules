'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require('marionette');

var MN = _interopRequireWildcard(_marionette);

var _UIHelper = require('../../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

var _tabs = require('../templates/tabs.tpl');

var _tabs2 = _interopRequireDefault(_tabs);

var _navigation = require('../templates/navigation.tpl');

var _navigation2 = _interopRequireDefault(_navigation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
    TabsNavigationView: MN.ItemView.extend({
        template: _tabs2.default,
        tagName: "ul",
        className: "tab-nav tn-justified",
        modelEvents: {
            'change': 'render'
        },
        events: {
            'click .event-widget-step': 'goToStep'
        },
        onRender: function onRender() {
            _UIHelper2.default.initTooltips(this.$el);
        },
        goToStep: function goToStep(e) {
            var step = $(e.currentTarget).data('step');
            if (this.model.get('steps')[step].allow) {
                this.model.set('currentStep', step);
            }
            return false;
        }
    }),
    StepNavigationView: MN.ItemView.extend({
        template: _navigation2.default,
        events: {
            'click .event-widget-next': 'nextStep',
            'click .event-widget-back': 'prevStep'
        },
        modelEvents: {
            'change': 'render'
        },
        nextStep: function nextStep() {
            MN.Application.vent.trigger('formwidget:step:submit');
            return false;
        },
        prevStep: function prevStep() {
            var currentStep = this.model.get('currentStep');
            var hasPrev = this.model.get('stepsLoop').indexOf(currentStep) != 0;
            if (!hasPrev) {
                return false;
            }
            var prevStep = this.model.get('stepsLoop')[this.model.get('stepsLoop').indexOf(currentStep) - 1];
            if (this.model.get('steps')[prevStep].allow) {
                this.model.set('currentStep', prevStep);
            }
            return false;
        }
    })
};