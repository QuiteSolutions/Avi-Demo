# Module Comparison Guide

## Quick Reference: Inheritance Patterns

### Module 1: pos_base_popup (Base)
```javascript
onButtonClick() {
    this.showAlert(_t("Hello 1"));
}
```
**Result:** Shows "Hello 1" alert

---

### Module 2: pos_extended_popup (Extension with super)
```javascript
onButtonClick() {
    super.onButtonClick();  // ← Calls base first
    this.showAlert(_t("Hello 2"));
}
```
**Result:** Shows "Hello 1" alert, then "Hello 2" alert

---

### Module 3: pos_override_popup (Override without super)
```javascript
onButtonClick() {
    // No super.onButtonClick() call
    this.showAlert(_t("Hello 3"));
}
```
**Result:** Shows only "Hello 3" alert (skips base)

---

## Installation Scenarios

### Scenario 1: Base Only
Install: `pos_base_popup`
- Button shows: "Hello 1"
- Title: "Title 1"
- Name: "Name 1"

### Scenario 2: Base + Extended
Install: `pos_base_popup` + `pos_extended_popup`
- Button shows: "Hello 1" → "Hello 2" (sequential)
- Title: "Title 2"
- Name: "Name 2"

### Scenario 3: Base + Override
Install: `pos_base_popup` + `pos_override_popup`
- Button shows: "Hello 3" (only)
- Title: "Title 3"
- Name: "Name 3"

### Scenario 4: All Three
Install: `pos_base_popup` + `pos_extended_popup` + `pos_override_popup`
- Behavior depends on load order
- Last patch wins for conflicting methods
- Generally: "Hello 3" (override wins)

---

## Key Technical Points

### Import Pattern (Extended & Override)
```javascript
import { patch } from "@web/core/utils/patch";
import { BasePopupWidget } from "@pos_base_popup/js/popup_widget";
```

### Setup Method (Both Extended & Override)
```javascript
setup() {
    super.setup();  // ← Both call super for setup
    this.state.title = _t("Title X");
    this.state.name = _t("Name X");
}
```

### The Key Difference
**pos_extended_popup:**
- `super.onButtonClick()` ✓ Called
- Preserves base behavior
- Adds new behavior

**pos_override_popup:**
- `super.onButtonClick()` ✗ NOT called
- Replaces base behavior
- New behavior only

---

## When to Use Each Pattern

### Use Extension (super calls) when:
- Adding features to existing functionality
- Need to preserve original behavior
- Building on top of base logic
- Example: Add logging after base operation

### Use Override (no super) when:
- Completely replacing functionality
- Base behavior is unwanted
- New implementation is independent
- Example: Change business logic entirely

---

## Development Tips

1. **Module Loading Order Matters**
   - Base must load first
   - Extensions load after
   - Last patch wins for same method

2. **Testing Strategy**
   - Test base module alone
   - Test each extension separately
   - Test combinations carefully

3. **Debugging**
   - Use browser console
   - Check patch application order
   - Verify super() calls work as expected

4. **Translation**
   - Each module has own translations
   - Update .pot file when adding strings
   - Test with different languages

---

## File Checklist

### pos_base_popup
- ✓ __init__.py
- ✓ __manifest__.py
- ✓ static/src/js/popup_widget.js
- ✓ static/src/js/popup_widget.xml
- ✓ i18n/he.po
- ✓ i18n/pos_base_popup.pot

### pos_extended_popup
- ✓ __init__.py
- ✓ __manifest__.py
- ✓ static/src/js/extended_popup_widget.js

### pos_override_popup
- ✓ __init__.py
- ✓ __manifest__.py
- ✓ static/src/js/override_popup_widget.js
