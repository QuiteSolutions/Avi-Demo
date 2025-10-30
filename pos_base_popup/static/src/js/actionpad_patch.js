import { patch } from "@web/core/utils/patch";
import { ActionpadWidget } from "@point_of_sale/app/screens/product_screen/action_pad/action_pad";

patch(ActionpadWidget.prototype, {
    get actionName() {
        // Return translated "Actions" text
        return this.env._t("Actions");
    },
});
