# Odoo 18 Point of Sale - Inheritance Pattern Modules

This repository contains three interconnected Odoo 18 modules demonstrating different inheritance patterns for Point of Sale popup widgets using OWL components and the patch system.

## Module Overview

### 1. pos_base_popup (Base Module)
The foundation module that provides the base popup widget component.

**Features:**
- Base OWL component with state management
- Alert dialog integration
- Translatable UI elements
- Hebrew translation support

**Components:**
- `BasePopupWidget` - Main popup component registered as a POS screen

### 2. pos_extended_popup (Extension Pattern)
Demonstrates extending functionality while preserving base behavior using `super()` calls.

**Behavior:**
- Calls parent `setup()` to preserve base initialization
- Calls parent `onButtonClick()` to execute base logic
- Adds additional functionality after base execution
- Shows both "Hello 1" (from base) and "Hello 2" (extended) alerts

**Use Case:** When you want to add features while keeping original behavior intact.

### 3. pos_override_popup (Override Pattern)
Demonstrates completely replacing functionality without calling `super()`.

**Behavior:**
- Calls parent `setup()` for initialization
- Does NOT call parent `onButtonClick()` 
- Completely replaces button click behavior
- Shows only "Hello 3" alert (skips base "Hello 1")

**Use Case:** When you want to completely replace specific methods while maintaining component structure.

## Installation

### Prerequisites
- Odoo 18.0 or higher
- Point of Sale module installed

### Installation Steps

1. **Copy modules to Odoo addons directory:**
   ```bash
   cp -r pos_base_popup /path/to/odoo/addons/
   cp -r pos_extended_popup /path/to/odoo/addons/
   cp -r pos_override_popup /path/to/odoo/addons/
   ```

2. **Update Odoo apps list:**
   - Go to Apps menu
   - Click "Update Apps List"

3. **Install modules in order:**
   - First: Install `pos_base_popup` (required base)
   - Then: Install either `pos_extended_popup` OR `pos_override_popup` (or both for comparison)

**Important:** `pos_base_popup` must be installed first as the other two modules depend on it.

## Module Structure

```
pos_base_popup/
├── __init__.py
├── __manifest__.py
├── i18n/
│   ├── he.po                      # Hebrew translations
│   └── pos_base_popup.pot         # Translation template
└── static/
    └── src/
        └── js/
            ├── popup_widget.js    # OWL component
            └── popup_widget.xml   # QWeb template

pos_extended_popup/
├── __init__.py
├── __manifest__.py
└── static/
    └── src/
        └── js/
            └── extended_popup_widget.js  # Extends with super()

pos_override_popup/
├── __init__.py
├── __manifest__.py
└── static/
    └── src/
        └── js/
            └── override_popup_widget.js  # Overrides without super()
```

## Technical Details

### Inheritance Patterns

#### Pattern 1: Extension (pos_extended_popup)
```javascript
patch(BasePopupWidget.prototype, {
    onButtonClick() {
        super.onButtonClick();  // ✓ Calls parent method
        this.showAlert(_t("Hello 2"));  // Adds new behavior
    }
});
```

#### Pattern 2: Override (pos_override_popup)
```javascript
patch(BasePopupWidget.prototype, {
    onButtonClick() {
        // ✗ Does NOT call super.onButtonClick()
        this.showAlert(_t("Hello 3"));  // Replaces behavior completely
    }
});
```

### Key Technologies

- **OWL (Odoo Web Library):** Component framework
- **Patch System:** Odoo 18's preferred method for extending components
- **State Management:** `useState` hook for reactive state
- **Translation:** `_t()` function for internationalization
- **Dialog System:** AlertDialog component integration

### Component Lifecycle

1. **setup():** Initialize component state and hooks
2. **onButtonClick():** Handle button click events
3. **showAlert():** Display alert dialogs via POS dialog service

## Usage in Point of Sale

To integrate these popups into the POS Product Screen or other screens, you can patch the target screen:

```javascript
/** @odoo-module **/

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { BasePopupWidget } from "@pos_base_popup/js/popup_widget";

patch(ProductScreen.prototype, {
    setup() {
        super.setup();
        // Initialize or integrate popup widget
        // this.popupWidget = new BasePopupWidget(this);
    }
});
```

## Translation Support

The base module includes Hebrew translations as an example. To add more languages:

1. Create a new `.po` file in the `i18n/` folder (e.g., `es.po` for Spanish)
2. Copy the structure from `pos_base_popup.pot`
3. Translate the `msgstr` entries
4. Update the module to reload translations

## Development Guidelines

### Best Practices

1. **Always use patch, not inheritance:** Odoo 18 uses the patch system for extending components
2. **Module independence:** pos_extended_popup and pos_override_popup are independent and can be installed separately
3. **Translation ready:** Use `_t()` for all user-facing strings
4. **Asset bundling:** Register JavaScript and XML files in `__manifest__.py` assets
5. **Proper dependencies:** Declare all module dependencies in `depends` list

### Debugging

To debug these modules:

1. Enable developer mode in Odoo
2. Open browser console (F12)
3. Look for errors in the JavaScript console
4. Use `console.log()` in component methods for debugging
5. Check the Network tab for asset loading issues

## Compatibility

- **Odoo Version:** 18.0+
- **Edition:** Community and Enterprise
- **Dependencies:** point_of_sale (core module)

## License

LGPL-3 - See Odoo License for full details

## Support

For issues, questions, or contributions related to these modules, please refer to the Odoo documentation:
- [Odoo 18 Documentation](https://www.odoo.com/documentation/18.0/)
- [OWL Framework](https://github.com/odoo/owl)
- [Point of Sale Development](https://www.odoo.com/documentation/18.0/developer/reference/frontend/javascript_modules.html)

## Key Differences Summary

| Aspect | pos_extended_popup | pos_override_popup |
|--------|-------------------|-------------------|
| setup() | Calls super.setup() | Calls super.setup() |
| onButtonClick() | Calls super.onButtonClick() | Does NOT call super |
| Behavior | Base + Extended | Only Override |
| Alerts Shown | "Hello 1" + "Hello 2" | "Hello 3" only |
| Use Case | Add features | Replace features |

## Installation Order

```
1. pos_base_popup (required)
   ↓
2a. pos_extended_popup (optional)
   OR
2b. pos_override_popup (optional)
   OR
   Both can be installed together for comparison
```

This structure provides a clear demonstration of Odoo 18's component inheritance patterns using modern OWL components and the patch system.
