import * as MN from 'marionette';
import TabsNavigationTemplate from "../templates/tabs.tpl"

export default MN.ItemView.extend({
    template:TabsNavigationTemplate,
    tagName:"ul",
    className:"tab-nav",
    modelEvents:{
        'change':'render'
    },
    events:{
        'click .event-tab-show':'goToTab'
    },
    initialize(){
        this.model.get('tabs')[this.model.get('currentTab')].action();
    },
    goToTab(e){
        let tabID = $(e.currentTarget).data('tab');
        if(tabID == this.model.get('currentTab')) return false;

        let tabSettings = this.model.get('tabs')[tabID];
        if(tabSettings.action){
            tabSettings.action();
        }
        this.model.set('currentTab', tabID);
        return false;
    }
});