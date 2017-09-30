import * as MN from 'marionette';
import LayoutTemplate from "../templates/preview"
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