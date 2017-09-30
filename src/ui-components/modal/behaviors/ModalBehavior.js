import * as MN from 'marionette';
import UIHelper from "../../../helpers/UIHelper"


export default MN.Behavior.extend({
    defaults: {},
    events: {
        'click .event-modal-close':'removePopup',
        'keyup :input':'removePopup'
    },
    initialize(){
        this.view.modalBehavior = this;
    },
    onRender(){
        this.$el.modal('show');
        setTimeout(()=>{
            UIHelper.scrollBar(this.$el.find(".scroll-ui"));
        });
    },
    removePopup(e) {
        if(this.checkPopupEscape(e))
            return false;
        this.$el.modal('hide');
        this.view.destroy();
        return false;
    },
    onDestroy(){
        this.$el.modal('hide');
    },
    checkPopupEscape:function(e){
        if (e && e.type == 'keyup') {
            if (e.keyCode != 27)
                return true;
        }
        return false;
    }
});