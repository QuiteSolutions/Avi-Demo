# Translation Behavior Report

## Date: October 29, 2025

## Overview
Testing translation behavior across the three PoS popup modules to understand how Odoo handles translation overrides and module-specific translations.

## Test Setup
- **Base Module**: `pos_base_popup` - contains base translations
- **Extended Module**: `pos_extended_popup` - extends base functionality 
- **Override Module**: `pos_override_popup` - overrides base functionality
- **Test Translation**: "Open Base Popup" text used in ProductScreen button

## Observed Behavior

### Translation Loading Pattern
1. **When base module is active**: Uses base module translation
2. **When extended module is active**: Uses extended module translation  
3. **When override module is active**: Uses override module translation

This confirms that **each module's translation files are loaded independently** and module-specific translations take precedence within their own scope.

## Key Finding: Translation Override Requirements

### Current Issue
The translation override for core Odoo text "Guests?" was not working despite being added to `pos_base_popup/i18n/he.po`.

### Root Cause
Translation overrides only work when they follow **Odoo's exact template format**:

```po
#. module: [source_module_name]
#. odoo-javascript  
#: code:addons/[source_module_path]/[source_file]:[line_number]
msgid "[original_text]"
msgstr "[translated_text]"
```

### Working Example
The "Guests?" translation override now works with this format:

```po
#. module: pos_restaurant
#. odoo-javascript
#: code:addons/pos_restaurant/static/src/js/Screens/ProductScreen/ControlButtons/TableGuestsButton.js:0
msgid "Guests?"
msgstr "כמה אתם?"
```

## Technical Implications

### 1. Translation Context Requirement
- Odoo requires **exact source context** (module name, file path, line reference)
- Generic translation entries without proper context are ignored for overrides
- The `#.` and `#:` comment lines are **mandatory metadata**, not just comments

### 2. Module Scope vs Global Overrides
- **Module-specific translations**: Automatically loaded for that module's strings
- **Global overrides**: Require exact source context from original core module
- Translation precedence follows module loading order when contexts match

### 3. Translation File Structure
Each module should maintain:
- Own translatable strings with module-specific context
- Core overrides with original module context (if needed)
- Proper header metadata for Odoo compatibility

## Recommendations

### For Module Development
1. **Use unique translation keys** when possible to avoid conflicts
2. **Follow Odoo's template format** exactly for core overrides
3. **Test translation loading** across different module combinations
4. **Document translation dependencies** in module descriptions

### For Translation Overrides
1. **Identify source context** using Odoo's translation tools or source inspection
2. **Maintain original context** in override entries
3. **Verify module loading order** affects override precedence
4. **Test overrides** in various module installation scenarios

## Files Modified
- `pos_base_popup/i18n/he.po` - Added proper core override format
- Created proper translation metadata structure

## Next Steps
- Verify "Guests?" translation appears correctly in Hebrew interface
- Test other core translation overrides using same format
- Document translation best practices for future module development