# Quick Start Guide

Get up and running with the POS inheritance pattern modules in 5 minutes.

## 🚀 Fast Installation

### Step 1: Copy Modules (30 seconds)
```bash
# Copy all three modules to your Odoo addons directory
cp -r pos_base_popup /path/to/odoo/addons/
cp -r pos_extended_popup /path/to/odoo/addons/
cp -r pos_override_popup /path/to/odoo/addons/
```

### Step 2: Update Apps List (10 seconds)
```bash
# Restart Odoo with update flag
/path/to/odoo-bin -u all -d your_database
```

Or via UI:
1. Go to Apps menu
2. Click "Update Apps List"
3. Search for "PoS Base Popup"

### Step 3: Install Modules (1 minute)
1. Install **pos_base_popup** first (required)
2. Install **pos_extended_popup** (optional - for extension pattern)
3. Install **pos_override_popup** (optional - for override pattern)

### Step 4: Test in POS (2 minutes)
1. Go to Point of Sale → New Session
2. Navigate to the screen: `this.pos.showScreen("BasePopupWidget")`
3. Test the popup functionality

## 📝 What You Get

### With pos_base_popup Only
- Title: "Title 1"
- Name: "Name 1"
- Button shows: "Hello 1" alert

### With pos_base_popup + pos_extended_popup
- Title: "Title 2"
- Name: "Name 2"  
- Button shows: "Hello 1" → "Hello 2" alerts (both)

### With pos_base_popup + pos_override_popup
- Title: "Title 3"
- Name: "Name 3"
- Button shows: "Hello 3" alert (only)

## 🎯 Quick Integration Example

Want to add a button to the Product Screen? Create this file:

**my_integration/static/src/js/product_screen_patch.js**
```javascript
/** @odoo-module **/
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";

patch(ProductScreen.prototype, {
    onShowPopup() {
        this.pos.showScreen("BasePopupWidget");
    }
});
```

**my_integration/__manifest__.py**
```python
{
    'name': 'My Integration',
    'depends': ['pos_base_popup'],
    'assets': {
        'point_of_sale._assets_pos': [
            'my_integration/static/src/js/product_screen_patch.js',
        ],
    },
}
```

Done! 🎉

## 🔍 Quick Testing

### Test Base Module
```javascript
// In browser console while in POS
odoo.loader.modules.get('@pos_base_popup/js/popup_widget').BasePopupWidget
// Should return the class
```

### Test Navigation
```javascript
// In browser console while in POS
odoo.__DEBUG__.services['pos'].showScreen("BasePopupWidget")
```

### Test Patch Applied
```javascript
// Check if patch is active
const widget = new odoo.loader.modules.get('@pos_base_popup/js/popup_widget').BasePopupWidget();
console.log(widget);
```

## 🐛 Troubleshooting

### Module Not Found
```bash
# Clear Odoo cache
rm -rf /path/to/odoo/.cache/
# Restart Odoo
```

### Assets Not Loading
1. Check browser console for 404 errors
2. Verify paths in __manifest__.py
3. Clear browser cache (Ctrl+Shift+R)

### Screen Not Showing
```javascript
// Check if registered
odoo.__DEBUG__.services['registry'].category('pos_screens').get('BasePopupWidget')
```

## 📚 Next Steps

1. **Read the docs**: Check [README.md](README.md) for full details
2. **Compare patterns**: See [MODULE_COMPARISON.md](MODULE_COMPARISON.md)
3. **Integration**: Read [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
4. **Architecture**: Understand [ARCHITECTURE.md](ARCHITECTURE.md)

## ⚡ Quick Commands

### Development Mode
```bash
# Run Odoo with auto-reload
odoo-bin --dev=all -d your_database
```

### Check Module Status
```bash
# List installed POS modules
odoo-bin shell -d your_database
>>> env['ir.module.module'].search([('name', 'ilike', 'pos_')]).mapped('name')
```

### Update Module
```bash
# After code changes
odoo-bin -u pos_base_popup -d your_database
```

## 🎓 Learn by Example

### Extend a Method (Keep Base Behavior)
```javascript
patch(BasePopupWidget.prototype, {
    onButtonClick() {
        console.log("Before base");
        super.onButtonClick();  // ← Call base
        console.log("After base");
    }
});
```

### Override a Method (Replace Base Behavior)
```javascript
patch(BasePopupWidget.prototype, {
    onButtonClick() {
        // Don't call super
        console.log("Completely new behavior");
        this.showAlert(_t("Custom message"));
    }
});
```

### Add New Method
```javascript
patch(BasePopupWidget.prototype, {
    myNewMethod() {
        console.log("Brand new method!");
    }
});
```

### Modify State
```javascript
patch(BasePopupWidget.prototype, {
    setup() {
        super.setup();
        this.state.myCustomField = "value";
    }
});
```

## 💡 Pro Tips

1. **Always install base first** - Other modules depend on it
2. **Use developer mode** - Easier debugging
3. **Clear cache often** - Avoid stale assets
4. **Check console** - JavaScript errors show here
5. **Read the docs** - Comprehensive guides included

## ⏱️ Time Estimates

- Initial setup: **5 minutes**
- Understanding patterns: **15 minutes**
- First integration: **30 minutes**
- Custom module: **1-2 hours**

## 🎬 Ready to Start!

You now have everything you need to use these modules. Start with the base module, test it, then experiment with extensions and overrides.

Happy coding! 🚀

---

**Need Help?**
- Check the [README.md](README.md) for detailed information
- Review [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for integration examples
- See [MODULE_COMPARISON.md](MODULE_COMPARISON.md) for pattern differences
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
