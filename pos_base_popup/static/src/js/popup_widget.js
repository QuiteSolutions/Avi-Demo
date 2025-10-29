/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { _t } from "@web/core/l10n/translation";

export class BasePopupWidget extends Component {
    static template = "pos_base_popup.BasePopupWidget";
    static props = {};

    setup() {
        super.setup();
        this.pos = usePos();
        this.state = useState({
            title: _t("Title 1"),
            name: _t("Name 1"),
            inputValue: ""
        });
    }
    
    onButtonClick() {
        this.showAlert(_t("Hello 1"));
    }
    
    showAlert(message) {
        this.pos.dialog.add(AlertDialog, {
            title: this.state.title,
            body: message,
        });
    }
}

registry.category("pos_screens").add("BasePopupWidget", BasePopupWidget);
