# Troubleshooting & Debugging Guide

**Document:** Complete debugging reference for Odoo 18 PoS module development  
**Created:** October 30, 2025  
**Applicable To:** pos_base_popup, pos_extended_popup, pos_override_popup modules

---

## Problem: Translation Not Appearing

### Symptoms
- Translated text doesn't appear in PoS interface
- "Actions" button shows English text even though Hebrew user
- No Hebrew text visible anywhere
- `window._t()` throws errors in console

### Diagnosis Flowchart

```
Is translation missing?
├─ YES → Is ir_translation table present?
│        ├─ NO → CRITICAL: Database schema issue
│        │        Action: Contact hosting provider
│        │
│        └─ YES → Is translation entry in ir_translation?
│                 ├─ NO → Translations weren't imported
│                 │        Action: Load language in Settings
│                 │
│                 └─ YES → Is user language set to Hebrew?
│                          ├─ NO → Set user language to he_IL
│                          │        Action: Edit user → Language
│                          │
│                          └─ YES → Is translation key correct?
│                                   ├─ NO → Fix msgid in .po file
│                                   │        Action: Check .po format
│                                   │
│                                   └─ YES → Frontend cache issue?
│                                            Action: Clear browser cache
│
└─ NO → Translation is working!
```

---

## Issue #1: `ir_translation` Table Missing

### Error Message
```
ERROR: relation "ir_translation" does not exist
LINE 1: SELECT * FROM ir_translation
                      ^
SQL state: 42P01
```

### Root Cause
The database schema is incomplete. The `ir_translation` table (required for all translations) was not created during database initialization.

### Solution

**Step 1: Verify table is missing**
```sql
-- Run this query
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'ir_translation';

-- If it returns empty: table is missing (confirmed)
-- If it returns row: table exists (not this problem)
```

**Step 2: Contact hosting provider**
Message:
> "Our Odoo 18 database is missing the `ir_translation` table. This table is required for the translation system to function. Can you:
> 1. Verify the database schema completeness
> 2. Restore this table if it was accidentally deleted
> 3. Or reinitialize the database with all required tables
> 
> Without this table, no translations work in any module."

**Step 3: Verify fix**
```sql
-- After fix, this should return results:
SELECT * FROM ir_translation LIMIT 1;

-- You should see columns: id, lang, type, name, res_id, src, value, state, module
```

**Step 4: Test in frontend**
```javascript
// Should now work (instead of throwing error):
console.log(window.posmodel.env._t("Actions"));
```

### Prevention
- When setting up new Odoo instance, verify schema completeness
- Compare table count with Odoo documentation
- Create backup after proper initialization

---

## Issue #2: Translation Function Undefined

### Error Message
```javascript
Uncaught TypeError: window._t is not a function
Uncaught TypeError: window.posmodel.env._t is not a function
```

### Root Cause
The translation function is created from `ir_translation` table data during PoS initialization. If the table is missing, the function is never created.

### Solution

**Depends on:** Issue #1 - Fix database first

**Verification:**
```javascript
// Before fix:
window._t                          // undefined
window.posmodel.env._t             // undefined

// After fix:
window._t("Actions")               // "פעולות" (Hebrew)
window.posmodel.env._t("Actions")  // "פעולות" (Hebrew)
```

---

## Issue #3: Language Not Configured

### Error/Symptom
```javascript
window.posmodel.env.lang           // undefined
```

### Root Cause
- Translation system not initialized (ir_translation missing), OR
- User language not set, OR
- Language not loaded in Odoo

### Solution

**Step 1: Load language in Odoo UI**
1. Log in to Odoo backend
2. Navigate: **Settings** → **Translations** → **Languages**
3. Click **"Load Language"** button
4. Select **"Hebrew - he_IL"** from dropdown
5. Click **"Load"**

Wait for import to complete (may take 1-2 minutes).

**Step 2: Set user language**
1. Navigate: **Settings** → **Users & Companies** → **Users**
2. Click on your user
3. Find **Language** field
4. Select **"Hebrew (he_IL)"** or **"Hebrew (he)"**
5. Click **Save**

**Step 3: Restart PoS session**
- Log out and log back in to PoS
- New session will use your language preference

**Step 4: Verify**
```javascript
// Should now show language code:
console.log(window.posmodel.env.lang);  // Should return "he_IL" or "he"
```

---

## Issue #4: Translations Not Imported to Database

### Symptom
- `.po` files exist and are properly formatted
- But `ir_translation` table is empty or missing entries
- SQL query returns no results

### Root Cause
Translations exist as files but were never imported to the database.

### Solution

**Step 1: Use Odoo UI (Recommended)**
1. Go to **Settings** → **Translations** → **Languages**
2. Click **"Load Language"** button
3. Select language
4. Wait for import

**Step 2: Verify import**
```sql
-- Check if translations were imported
SELECT COUNT(*) FROM ir_translation WHERE lang = 'he_IL';

-- Should return number > 0
-- If returns 0: import didn't work, try again

-- Check specific translation
SELECT src, value FROM ir_translation 
WHERE src = 'Actions' AND lang = 'he_IL';

-- Should return:
-- src: "Actions"
-- value: "פעולות"
```

**Step 3: If import still fails**
- Check if `ir_translation` table exists first (Issue #1)
- Check database permissions
- Contact hosting provider
- Try loading different language as test

---

## Issue #5: PoS Component Not Rendering

### Symptom
- Popup doesn't appear on screen
- No console errors
- Component seems to load but not display

### Root Cause
- Component template not loading
- Template name incorrect
- Asset file not bundled
- Component class not exported

### Solution

**Step 1: Check browser console**
```javascript
// Look for errors like:
// "Missing template: pos_base_popup.BasePopupWidget"
// Check console for any red errors
```

**Step 2: Verify manifest has asset**
```python
# In __manifest__.py:
'assets': {
    'point_of_sale._assets_pos': [
        'pos_base_popup/static/src/js/popup_widget.js',     # ✅ Must be here
        'pos_base_popup/static/src/xml/popup_widget.xml',   # ✅ Must be here
    ],
},
```

**Step 3: Verify template name matches**
```javascript
// In popup_widget.js:
export class BasePopupWidget extends Component {
    static template = "pos_base_popup.BasePopupWidget";  // ✅ Must match XML
}

// In popup_widget.xml:
<t t-name="pos_base_popup.BasePopupWidget">  <!-- ✅ Must match class -->
    <div>Template content</div>
</t>
```

**Step 4: Check component inheritance**
```javascript
// If extending from base:
import { BasePopupWidget } from "@pos_base_popup/js/popup_widget";

export class ExtendedPopupWidget extends BasePopupWidget {
    static template = "pos_extended_popup.ExtendedPopupWidget";
    
    // ✅ Make sure extended template exists in XML
}
```

**Step 5: Reload PoS**
1. Hard refresh browser (Ctrl+F5)
2. Log out of PoS
3. Log back in
4. Check if component appears

---

## Issue #6: Manifest Not Loading Correctly

### Symptom
- Module appears in "Uninstalled" but won't install
- Get errors during module installation
- Dependencies not resolving

### Root Cause
- Syntax error in `__manifest__.py`
- Invalid Python format
- Missing required fields
- Circular dependencies

### Solution

**Step 1: Check syntax**
```bash
# In PowerShell, test Python syntax:
python -m py_compile "pos_base_popup/__manifest__.py"

# If error, fix syntax
# If no error, syntax is OK
```

**Step 2: Verify manifest structure**
```python
{
    'name': 'Module Name',           # ✅ Required
    'version': '18.0.1.0.0',         # ✅ Required
    'category': 'Point of Sale',     # ✅ Recommended
    'depends': ['point_of_sale'],    # ✅ Required (list of modules)
    'assets': {...},                 # ✅ For JS/XML files
    'installable': True,             # ✅ Required
    'auto_install': False,           # ✅ Recommended
    'license': 'LGPL-3',             # ✅ Recommended
}
```

**Step 3: Check dependencies**
```python
# ✅ GOOD - Linear dependency chain
pos_base_popup depends on: ['point_of_sale']
pos_extended_popup depends on: ['pos_base_popup']

# ❌ BAD - Circular dependency
pos_base_popup depends on: ['pos_extended_popup']
pos_extended_popup depends on: ['pos_base_popup']
```

**Step 4: Verify in Odoo UI**
1. Go to **Apps** → **Update Apps List** (in Settings)
2. Search for your module
3. If appears in list: manifest is valid
4. If doesn't appear: syntax error or invalid structure

---

## Issue #7: Template Override Not Working

### Symptom
- Core template not being overridden
- Original template still displays
- Override file seems to be ignored

### Root Cause
- Wrong inherit template name
- XPath selector doesn't match actual DOM
- Override file not in assets
- XML syntax error

### Solution

**Step 1: Verify override file is in assets**
```python
# In __manifest__.py:
'assets': {
    'point_of_sale._assets_pos': [
        'pos_base_popup/static/src/xml/actionpad_override.xml',  # ✅ Must be here
    ],
},
```

**Step 2: Check inherit template name**
```xml
<!-- Get the EXACT template name from core module: -->
<t t-name="point_of_sale.ActionpadWidget" 
   t-inherit="point_of_sale.ActionpadWidget"  <!-- ✅ Must match exactly -->
   owl="1">
```

To find the exact name:
- Search core module XML files
- Look for `<t t-name="...">`
- Copy name exactly (case-sensitive)

**Step 3: Verify XPath selector**
```xml
<!-- Test your XPath in browser console: -->
<!-- Wrong: -->
<xpath expr="//span[text() = 'Actions']" position="replace">

<!-- Right: -->
<xpath expr="//span[contains(text(), 'Actions')]" position="replace">
```

**Step 4: Check XML syntax**
```xml
<!-- ✅ CORRECT -->
<t t-name="..." t-inherit="..." owl="1">
    <xpath expr="..." position="replace">
        <new-element/>
    </xpath>
</t>

<!-- ❌ WRONG - Missing owl="1" -->
<t t-name="..." t-inherit="...">
    ...
</t>

<!-- ❌ WRONG - Invalid position -->
<xpath expr="..." position="before">
    <!-- Some positions don't exist -->
</xpath>
```

**Step 5: Hard refresh and reload**
1. Hard refresh browser (Ctrl+Shift+Delete to clear cache)
2. Log out of PoS
3. Wait 5 seconds
4. Log back in
5. Check if override applied

---

## Issue #8: Wrong Translation Format

### Symptom
- Translation entry exists but shows English text
- Or shows @ symbol in wrong place
- Or shows extra spaces

### Root Cause
`.po` file entry not in correct Odoo format

### Solution

**CORRECT Format:**
```po
#. module: point_of_sale
#. odoo-javascript
#: code:addons/point_of_sale/static/src/app/screens/.../file.xml:0
msgid "Actions"
msgstr "פעולות"
```

**WRONG Formats (Fix These):**

```po
# ❌ Missing module context
msgid "Actions"
msgstr "פעולות"
# → Add #. module: point_of_sale header

# ❌ Extra spaces
msgid  "Actions"
msgstr  "פעולות"
# → Remove extra spaces after msgid/msgstr

# ❌ Wrong @ symbol position
msgid "AMOUNT"
msgstr "@ סכום"
# → Should be: msgstr "סכום @"

# ❌ Missing code location
msgid "Actions"
msgstr "פעולות"
# → Add #: code: line with location
```

**To Fix:**
1. Open `.po` file in text editor
2. Find incorrect entries (search for "msgid")
3. Add proper format:
   ```po
   #. module: point_of_sale
   #. odoo-javascript
   #: code:addons/point_of_sale/static/src/.../file.xml:0
   msgid "Original Text"
   msgstr "Hebrew Text"
   ```
4. Remove extra spaces
5. Save file
6. Reload Odoo

---

## Issue #9: Module Load Order Wrong

### Symptom
- Extended popup functionality not available
- Base popup loads but extended doesn't
- Dependencies not resolving

### Root Cause
- Dependency not set correctly
- Module installed in wrong order
- Circular or missing dependencies

### Solution

**Step 1: Check dependency order**
```python
# Correct order:
point_of_sale (core)
    ↓
pos_base_popup (depends on point_of_sale)
    ↓
pos_extended_popup (depends on pos_base_popup)
pos_override_popup (depends on pos_base_popup)
```

**In manifests:**
```python
# pos_base_popup/__manifest__.py
'depends': ['point_of_sale'],

# pos_extended_popup/__manifest__.py
'depends': ['pos_base_popup'],

# pos_override_popup/__manifest__.py
'depends': ['pos_base_popup'],
```

**Step 2: Verify in database**
```sql
SELECT m.name, m.state, m.sequence 
FROM ir_module_module m
WHERE m.name LIKE 'pos%' 
ORDER BY m.sequence;

-- Should show:
-- pos_base_popup       installed    100
-- pos_extended_popup   installed    100
-- pos_override_popup   installed    100
```

**Step 3: Uninstall and reinstall if wrong**
1. Go to **Apps** → **Uninstall**
2. Uninstall in reverse order:
   - pos_override_popup
   - pos_extended_popup
   - pos_base_popup
3. Reinstall in correct order:
   - pos_base_popup
   - pos_extended_popup
   - pos_override_popup

**Step 4: Verify load order**
```javascript
// Check in console:
console.log(window.odoo.loader.jobs);  // Should be empty (0 pending)
console.log(window.odoo.loader.failed);  // Should be empty (0 failed)
```

---

## Issue #10: Blank or Distorted UI

### Symptom
- PoS interface displays incorrectly
- Text overlaps or missing
- Layout broken

### Root Cause
- CSS/Asset conflict
- Template syntax error
- Component rendering issue

### Solution

**Step 1: Check browser console**
```javascript
// Look for errors (red text in console)
// Common patterns:
// - "Missing template: ..."
// - "Unexpected token"
// - "undefined is not a function"
```

**Step 2: Verify XML syntax**
- Missing closing tags: `</t>`
- Missing attributes: `t-name="..."` required
- Invalid t-directives: `t-esc`, `t-if`, `t-foreach` etc.

**Step 3: Check template names**
```xml
<!-- In XML files, verify all names are valid: -->
<t t-name="pos_base_popup.MyTemplate">  <!-- ✅ Module name . Template name -->
```

**Step 4: Hard refresh**
```
Ctrl + Shift + Delete  (Clear browser cache)
Then:
Ctrl + Shift + R (Hard refresh)
Or:
Ctrl + F5 (Hard refresh)
```

**Step 5: Check asset loading**
```javascript
// In console, check if assets loaded:
console.log(window.odoo);  // Should show assets in properties
```

---

## General Debugging Commands

### Console Testing
```javascript
// ✅ Safe to run - just view data
console.log(window.odoo);
console.log(window.posmodel);
console.log(window.posmodel.env);
console.log(window.posmodel.user);
console.log(window.odoo.info);

// ⚠️ May fail but safe - check if functions exist
console.log(window._t);
console.log(window.posmodel.env._t);
console.log(window.posmodel.env.lang);

// Check modules
console.log(Object.keys(window.odoo.loader.factories).length);  // Count loaded
console.log(window.odoo.loader.failed);  // Any errors?
console.log(window.odoo.loader.jobs);   // Still loading?
```

### Database Testing
```sql
-- Check if translations system initialized
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'ir_translation'
) AS table_exists;

-- List all installed modules
SELECT name, state, sequence FROM ir_module_module 
WHERE state = 'installed' ORDER BY sequence;

-- Check module dependencies
SELECT name, depends_id FROM ir_module_module_dependency 
WHERE module_id IN (
    SELECT id FROM ir_module_module 
    WHERE name IN ('pos_base_popup', 'pos_extended_popup')
);
```

---

## Debugging Checklist

When something doesn't work:

- [ ] **Check browser console** for red errors (F12)
- [ ] **Verify `ir_translation` table exists** in database
- [ ] **Confirm modules installed** (go to Apps page)
- [ ] **Check user language set** (Settings → Language)
- [ ] **Hard refresh browser** (Ctrl+Shift+Delete, then Ctrl+Shift+R)
- [ ] **Verify manifest syntax** (run Python syntax check)
- [ ] **Check template names match** (t-name vs class static template)
- [ ] **Verify dependencies correct** (order matters: base → extended)
- [ ] **Reload PoS session** (log out, log back in)
- [ ] **Check asset files included** (in __manifest__.py)

If still stuck:
- [ ] Contact hosting provider about `ir_translation` table
- [ ] Check Odoo logs at `/var/log/odoo/` or hosting console
- [ ] Try uninstall/reinstall modules
- [ ] Check for conflicting modules

---

## Contact Hosting Provider Template

When something requires infrastructure action:

**Subject:** Odoo Database Schema Issue - Missing ir_translation Table

**Message:**
```
Hello,

Our Odoo 18 instance is experiencing an issue with the translation system.
We're getting this error:

ERROR: relation "ir_translation" does not exist

Investigation shows the database schema is missing the critical 
'ir_translation' table, which is required for:
- All translation functionality
- Language configuration
- Text localization

Can you please:
1. Verify the database schema is complete
2. Restore the ir_translation table if it was deleted
3. Or reinitialize the database with all Odoo schema tables

Current server version: Odoo 18.0
Database: [your database name]

Thank you for your quick assistance.
```

---

## Resolution Summary

| Issue | Root Cause | Solution | Estimated Fix Time |
|-------|-----------|----------|-------------------|
| Translation function undefined | ir_translation table missing | Contact hosting provider | 1-2 hours |
| Translation not appearing | Language not set | Load language in Settings | 5 minutes |
| Component not rendering | Template name mismatch | Fix template t-name | 10 minutes |
| Override not working | Override file not in assets | Add to manifest assets | 5 minutes |
| Module won't install | Syntax error in manifest | Fix Python syntax | 10 minutes |
| Wrong language showing | User language not set | Set user language in Settings | 5 minutes |
| Distorted UI | Asset conflict | Hard refresh browser | 2 minutes |

---

**Last Updated:** October 30, 2025  
**Status:** Complete Debugging Guide Ready  
**Next Step:** Contact hosting provider about ir_translation table
