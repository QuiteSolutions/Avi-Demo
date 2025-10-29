# Integration Guide: Adding Popup to Product Screen

This guide shows how to integrate the BasePopupWidget into the Point of Sale Product Screen.

## Method 1: Add Button to Product Screen

Create a new module that patches the ProductScreen to add a button that opens the popup.

### File: pos_product_screen_integration/static/src/js/product_screen_patch.js

```javascript
/** @odoo-module **/

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { BasePopupWidget } from "@pos_base_popup/js/popup_widget";

patch(ProductScreen.prototype, {
    setup() {
        super.setup();
        // Additional setup if needed
    },
    
    onOpenPopup() {
        // Method to trigger the popup
        this.pos.showScreen("BasePopupWidget");
    }
});
```

### File: pos_product_screen_integration/static/src/xml/product_screen_buttons.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<templates id="template" xml:space="preserve">
    <t t-name="pos_product_screen_integration.ProductScreen" t-inherit="point_of_sale.ProductScreen" t-inherit-mode="extension">
        <xpath expr="//div[hasclass('product-screen')]" position="inside">
            <button class="btn btn-secondary" t-on-click="onOpenPopup">
                Open Custom Popup
            </button>
        </xpath>
    </t>
</templates>
```

---

## Method 2: Add to Control Panel

Add a custom button to the control panel or action bar.

### File: pos_control_panel_integration/static/src/js/control_panel_patch.js

```javascript
/** @odoo-module **/

import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";

patch(ControlButtons.prototype, {
    get customButtons() {
        return [
            {
                name: _t("Custom Popup"),
                class: "btn-custom-popup",
                click: () => this.pos.showScreen("BasePopupWidget")
            }
        ];
    }
});
```

---

## Method 3: Add as Popup Component

Use the popup as a dialog instead of a full screen.

### File: pos_popup_dialog/static/src/js/popup_dialog.js

```javascript
/** @odoo-module **/

import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { _t } from "@web/core/l10n/translation";
import { useState } from "@odoo/owl";

export class CustomPopupDialog extends AbstractAwaitablePopup {
    static template = "pos_popup_dialog.CustomPopupDialog";
    
    setup() {
        super.setup();
        this.state = useState({
            inputValue: ""
        });
    }
    
    confirm() {
        // Handle confirmation
        this.props.close({ confirmed: true, value: this.state.inputValue });
    }
    
    cancel() {
        this.props.close({ confirmed: false });
    }
}
```

### Trigger from Product Screen:

```javascript
async onCustomAction() {
    const { confirmed, value } = await this.pos.popup.add(CustomPopupDialog, {
        title: _t("Custom Input"),
        message: _t("Enter your value")
    });
    
    if (confirmed) {
        console.log("User entered:", value);
        // Process the value
    }
}
```

---

## Method 4: Add to Point of Sale Session

Modify the POS session to include the widget in the main interface.

### File: pos_session_integration/static/src/js/pos_session_patch.js

```javascript
/** @odoo-module **/

import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";

patch(PosStore.prototype, {
    async showCustomWidget() {
        // Navigate to the custom screen
        this.showScreen("BasePopupWidget");
    }
});
```

---

## Complete Example Module Structure

```
pos_custom_integration/
├── __init__.py
├── __manifest__.py
└── static/
    └── src/
        ├── js/
        │   └── custom_integration.js
        └── xml/
            └── custom_integration.xml
```

### __manifest__.py

```python
{
    'name': 'PoS Custom Integration',
    'version': '18.0.1.0.0',
    'category': 'Point of Sale',
    'depends': ['pos_base_popup'],  # or pos_extended_popup or pos_override_popup
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_custom_integration/static/src/js/custom_integration.js',
            'pos_custom_integration/static/src/xml/custom_integration.xml',
        ],
    },
    'installable': True,
}
```

### custom_integration.js

```javascript
/** @odoo-module **/

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";

patch(ProductScreen.prototype, {
    onShowCustomPopup() {
        this.pos.showScreen("BasePopupWidget");
    }
});
```

### custom_integration.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<templates id="template" xml:space="preserve">
    <t t-name="pos_custom_integration.ProductScreenExtension" 
       t-inherit="point_of_sale.ProductScreen" 
       t-inherit-mode="extension">
        <xpath expr="//div[hasclass('leftpane')]" position="inside">
            <div class="custom-popup-trigger">
                <button class="btn btn-lg btn-primary" 
                        t-on-click="onShowCustomPopup">
                    <i class="fa fa-window-maximize"/> Custom Popup
                </button>
            </div>
        </xpath>
    </t>
</templates>
```

---

## Best Practices

### 1. Component Registration
Always register screens in the registry:
```javascript
registry.category("pos_screens").add("BasePopupWidget", BasePopupWidget);
```

### 2. Navigation
Use POS store methods for navigation:
```javascript
this.pos.showScreen("BasePopupWidget");
```

### 3. State Management
Use reactive state with useState:
```javascript
this.state = useState({ ... });
```

### 4. Translation
Always use _t() for user-facing strings:
```javascript
_t("Show Message")
```

### 5. Dependencies
Declare all dependencies in __manifest__.py:
```python
'depends': ['point_of_sale', 'pos_base_popup']
```

---

## Testing Your Integration

1. **Install the modules in order:**
   - pos_base_popup
   - Your integration module

2. **Start a POS session:**
   - Go to Point of Sale → Dashboard
   - Click "New Session"

3. **Navigate to Product Screen:**
   - Should see your custom button/trigger

4. **Test the popup:**
   - Click the button
   - Verify the popup appears
   - Test input and button functionality

5. **Check browser console:**
   - Look for JavaScript errors
   - Verify component lifecycle logs

---

## Troubleshooting

### Popup doesn't appear
- Check screen is registered in registry
- Verify asset loading in Network tab
- Check for JavaScript errors in console

### Button not visible
- Verify XPath expression in XML template
- Check template inheritance mode
- Inspect HTML structure in browser

### State not updating
- Ensure useState is used
- Check reactive bindings in template
- Verify event handlers are bound correctly

### Translation not working
- Update .pot file
- Load language in Odoo
- Clear browser cache

---

## Advanced: Custom Popup Component

For a fully custom popup that doesn't use the screen system:

```javascript
/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";

export class MyCustomDialog extends Component {
    static template = "my_module.MyCustomDialog";
    static components = { Dialog };
    
    setup() {
        this.state = useState({
            value: this.props.defaultValue || ""
        });
    }
    
    onConfirm() {
        this.props.confirm(this.state.value);
        this.props.close();
    }
}

// Usage:
this.dialog.add(MyCustomDialog, {
    defaultValue: "test",
    confirm: (value) => console.log("Confirmed:", value)
});
```

This approach gives you maximum flexibility and control over the dialog behavior.
