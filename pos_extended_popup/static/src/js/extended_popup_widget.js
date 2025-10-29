/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { BasePopupWidget } from "@pos_base_popup/js/popup_widget";
import { _t } from "@web/core/l10n/translation";

patch(BasePopupWidget.prototype, {
    setup() {
        super.setup();
        this.state.title = _t("Title 2");
        this.state.name = _t("Name 2");
    },
    
    onButtonClick() {
        // Execute base logic
        super.onButtonClick();
        // Add extended functionality
        this.showAlert(_t("Hello 2"));
    }
});
