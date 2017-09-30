import * as MN from 'marionette';
import LayoutTemplate from "../templates/preview.tpl"
import ModalBehavior from "../behaviors/ModalBehavior"

export default MN.LayoutView.extend({
    template:LayoutTemplate,
    className:"modal",
    behaviors: {
        ModalBehavior: {
            behaviorClass: ModalBehavior
        }
    }
})