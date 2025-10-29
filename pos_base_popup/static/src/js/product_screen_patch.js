/** @odoo-module **/

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";

patch(ProductScreen.prototype, {
    /**
     * Open the BasePopupWidget screen when the button is clicked
     */
    onShowBasePopup() {
        this.pos.showScreen("BasePopupWidget");
    }
});
