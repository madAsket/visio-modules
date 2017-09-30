import * as MN from 'marionette';
import InfoTemplate from '../templates/info.tpl'
import UIHelper from '../../../helpers/UIHelper'

export default MN.ItemView.extend({
    template: InfoTemplate,
    className:"card-header z-10",
    onBeforeShow(){
        UIHelper.initTooltips(this.$el);
    },
    events:{
        'click .event-step-settings':'goToSettings'
    },
    initialize(options){
        this.steps = options.steps;
    },
    goToSettings(){
        this.steps.set('currentStep', 'settings');
        return false;
    }
});