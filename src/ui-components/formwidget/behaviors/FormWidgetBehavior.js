import * as MN from 'marionette';
import WidgetInfoView from "../views/WidgetInfoView"
import _ from 'underscore'

export default MN.Behavior.extend({
    defaults: {},
    initialize(){
        this.defineSteps();
        this.listenTo(MN.Application.vent, 'formwidget:step:submit', this.submitStep);
        this.listenTo(MN.Application.vent, 'formwidget:step:commit', this.commitStep);
        this.listenTo(this.view.steps, 'change:currentStep', this.drawStep);
    },
    onBeforeShow(){
        this.drawStep();
    },
    defineSteps(){
        this.view.defineSteps();
        this.originModel = this.view.options.originModel;
        this.transitiveState = new Backbone.Model(
            _.object(this.view.steps.get('stepsLoop'),[])
        );
    },
    drawStep(){
        let step = this.view.steps.get('currentStep');
        let stepSettings = this.view.steps.get('steps')[step];
        let defineStateFunc = this.view.steps.get('steps')[step].defineState;
        if(this.originModel && this.transitiveState.get(step) == undefined && defineStateFunc){
            let self = this;
            defineStateFunc(this.originModel, function(state){
                self.transitiveState.set(step, state);
                self.showWorkflow(stepSettings);
            });
        }else{
            this.showWorkflow(stepSettings);
        }
    },
    showWorkflow(stepSettings){
        this.view.showChildView('formWidgetWorkflow',
            new stepSettings.widget({
                transitiveState:this.transitiveState,
                saveModel:this.view.options.saveModel,
                originModel:this.originModel
            })
        );
        if(stepSettings.showInfo){
            this.view.showChildView('widgetInfo', new WidgetInfoView({model:this.transitiveState}));
        }else if(this.view.getChildView('widgetInfo')){
            this.view.getChildView('widgetInfo').destroy();
        }
    },
    submitStep(){ //init saving events;
        let currentWidget = this.view.getChildView('formWidgetWorkflow');
        currentWidget.submitData();
        return false;
    },
    commitStep(invalidators){ //callback after step saved;
        if(invalidators){
            for(let i=0;i<invalidators.length;i++){
                this.transitiveState.set(invalidators[i], null);
                this.view.steps.get('steps')[invalidators[i]].allow = false;
            }
        }
        let nextStep = this.view.steps.get('stepsLoop')
            [this.view.steps.get('stepsLoop').indexOf(this.view.steps.get('currentStep')) + 1];
        this.view.steps.get('steps')[nextStep].allow = true;
        this.view.steps.set('currentStep', nextStep);
        console.log("STEP:", this.view.steps);
        return true;
    }
});