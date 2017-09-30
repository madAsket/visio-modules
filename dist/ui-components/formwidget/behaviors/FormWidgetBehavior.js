'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require('marionette');

var MN = _interopRequireWildcard(_marionette);

var _WidgetInfoView = require('../views/WidgetInfoView');

var _WidgetInfoView2 = _interopRequireDefault(_WidgetInfoView);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _app = require('app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = MN.Behavior.extend({
    defaults: {},
    initialize: function initialize() {
        this.defineSteps();
        this.listenTo(_app2.default.vent, 'formwidget:step:submit', this.submitStep);
        this.listenTo(_app2.default.vent, 'formwidget:step:commit', this.commitStep);
        this.listenTo(this.view.steps, 'change:currentStep', this.drawStep);
    },
    onBeforeShow: function onBeforeShow() {
        this.drawStep();
    },
    defineSteps: function defineSteps() {
        this.view.defineSteps();
        this.originModel = this.view.options.originModel;
        this.transitiveState = new Backbone.Model(_underscore2.default.object(this.view.steps.get('stepsLoop'), []));
    },
    drawStep: function drawStep() {
        var step = this.view.steps.get('currentStep');
        var stepSettings = this.view.steps.get('steps')[step];
        var defineStateFunc = this.view.steps.get('steps')[step].defineState;
        if (this.originModel && this.transitiveState.get(step) == undefined && defineStateFunc) {
            var self = this;
            defineStateFunc(this.originModel, function (state) {
                self.transitiveState.set(step, state);
                self.showWorkflow(stepSettings);
            });
        } else {
            this.showWorkflow(stepSettings);
        }
    },
    showWorkflow: function showWorkflow(stepSettings) {
        this.view.showChildView('formWidgetWorkflow', new stepSettings.widget({
            transitiveState: this.transitiveState,
            saveModel: this.view.options.saveModel,
            originModel: this.originModel
        }));
        if (stepSettings.showInfo) {
            this.view.showChildView('widgetInfo', new _WidgetInfoView2.default({ model: this.transitiveState }));
        } else if (this.view.getChildView('widgetInfo')) {
            this.view.getChildView('widgetInfo').destroy();
        }
    },
    submitStep: function submitStep() {
        //init saving events;
        var currentWidget = this.view.getChildView('formWidgetWorkflow');
        currentWidget.submitData();
        return false;
    },
    commitStep: function commitStep(invalidators) {
        //callback after step saved;
        if (invalidators) {
            for (var i = 0; i < invalidators.length; i++) {
                this.transitiveState.set(invalidators[i], null);
                this.view.steps.get('steps')[invalidators[i]].allow = false;
            }
        }
        var nextStep = this.view.steps.get('stepsLoop')[this.view.steps.get('stepsLoop').indexOf(this.view.steps.get('currentStep')) + 1];
        this.view.steps.get('steps')[nextStep].allow = true;
        this.view.steps.set('currentStep', nextStep);
        console.log("STEP:", this.view.steps);
        return true;
    }
});