import * as MN from 'marionette';
import NavigationView from './NavigatonView'
import FormWidgetBehavior from '../behaviors/FormWidgetBehavior'
import LayoutTemplate from '../templates/layout.tpl'


export default MN.LayoutView.extend({
    template: LayoutTemplate,
    regions:{
        'formWidgetWorkflow':"#formWidgetWorkflowRegion",
        'topStepNavigation':"#topStepNavigationRegion",
        'bottomStepNavigation':"#bottomStepNavigationRegion",
        'tabsNavigation':"#tabsNavigationRegion",
        'widgetInfo':"#widgetInfoRegion"
    },
    behaviors:{
        FormWidgetBehavior:{
            behaviorClass:FormWidgetBehavior
        }
    },
    onBeforeShow(){
        this.showChildView('topStepNavigation', new NavigationView.StepNavigationView({model:this.steps}));
        this.showChildView('bottomStepNavigation', new NavigationView.StepNavigationView({model:this.steps}));
        this.showChildView('tabsNavigation', new NavigationView.TabsNavigationView({model:this.steps}));
    },
    defineSteps(){
        
    }
});