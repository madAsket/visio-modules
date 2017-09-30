'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require('marionette');

var MN = _interopRequireWildcard(_marionette);

var _NavigatonView = require('./NavigatonView');

var _NavigatonView2 = _interopRequireDefault(_NavigatonView);

var _FormWidgetBehavior = require('../behaviors/FormWidgetBehavior');

var _FormWidgetBehavior2 = _interopRequireDefault(_FormWidgetBehavior);

var _layout = require('../templates/layout.tpl');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = MN.LayoutView.extend({
    template: _layout2.default,
    regions: {
        'formWidgetWorkflow': "#formWidgetWorkflowRegion",
        'topStepNavigation': "#topStepNavigationRegion",
        'bottomStepNavigation': "#bottomStepNavigationRegion",
        'tabsNavigation': "#tabsNavigationRegion",
        'widgetInfo': "#widgetInfoRegion"
    },
    behaviors: {
        FormWidgetBehavior: {
            behaviorClass: _FormWidgetBehavior2.default
        }
    },
    onBeforeShow: function onBeforeShow() {
        this.showChildView('topStepNavigation', new _NavigatonView2.default.StepNavigationView({ model: this.steps }));
        this.showChildView('bottomStepNavigation', new _NavigatonView2.default.StepNavigationView({ model: this.steps }));
        this.showChildView('tabsNavigation', new _NavigatonView2.default.TabsNavigationView({ model: this.steps }));
    },
    defineSteps: function defineSteps() {}
});