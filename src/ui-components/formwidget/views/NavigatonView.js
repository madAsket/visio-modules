import * as MN from 'marionette';
import UIHelper from "../../../helpers/UIHelper"
import TabsNavigationTemplate from '../templates/tabs.tpl'
import StepNavigationTemplate from '../templates/navigation.tpl'
import App from "app"

export default {
    TabsNavigationView:MN.ItemView.extend({
        template:TabsNavigationTemplate,
        tagName:"ul",
        className:"tab-nav tn-justified",
        modelEvents:{
            'change':'render'
        },
        events:{
            'click .event-widget-step':'goToStep'
        },
        onRender(){
            UIHelper.initTooltips(this.$el);
        },
        goToStep(e){
            let step = $(e.currentTarget).data('step');
            if(this.model.get('steps')[step].allow) {
                this.model.set('currentStep', step);
            }
            return false;
        }
    }),
    StepNavigationView :MN.ItemView.extend({
        template:StepNavigationTemplate,
        events:{
            'click .event-widget-next':'nextStep',
            'click .event-widget-back':'prevStep'
        },
        modelEvents:{
            'change':'render'
        },
        nextStep(){
            App.vent.trigger('formwidget:step:submit');
            return false;
        },
        prevStep(){
            let currentStep = this.model.get('currentStep');
            let hasPrev = this.model.get('stepsLoop').indexOf(currentStep) != 0;
            if(!hasPrev){
                return false;
            }
            let prevStep = this.model.get('stepsLoop')[this.model.get('stepsLoop').indexOf(currentStep) - 1];
            if(this.model.get('steps')[prevStep].allow) {
                this.model.set('currentStep', prevStep);
            }
            return false;
        }
    })
}

