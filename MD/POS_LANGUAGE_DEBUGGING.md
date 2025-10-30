# PoS Language Setup & Translation Debugging Guide

## Step 1: Check Current Language Configuration

### In Browser Console (Open DevTools - F12):

```javascript
// 1. Check if language is set in PoS environment
console.log("Current PoS Language:", window.posmodel.env.lang);

// 2. Check user information
console.log("Current User:", window.posmodel.user);
console.log("User Lang:", window.posmodel.user.lang);

// 3. Check available languages in system
console.log("Available Languages:", window.posmodel.env.services.localization);

// 4. Check if translation function exists and works
console.log("Translation function exists:", typeof window.posmodel.env._t);
console.log("Test translation:", window.posmodel.env._t("Actions"));

// 5. Check localization settings
const localization = window.posmodel.env.services.localization;
console.log("Localization Service:", localization);
```

---

## Step 2: Backend Language Configuration

### In Odoo Backend:

1. **Go to Settings → Translations → Languages**
   - Verify **Hebrew (he_IL)** or **Hebrew (he)** is listed
   - Click on it and check **Status: Active** ✓

2. **Set User Language:**
   - Go to Settings → Users & Companies → Users
   - Click on your Administrator user
   - Find **Language** field
   - Set to **Hebrew (he_IL)** or **Hebrew (he)**
   - Save

3. **Check PoS Configuration:**
   - Go to Point of Sale → Configuration → Point of Sale
   - Click on your PoS config
   - Look for **Language** field (if exists)
   - Set to Hebrew if available
   - Save

4. **Reload/Restart:**
   - **Clear browser cache** (Ctrl+Shift+Delete)
   - **Hard refresh** PoS (Ctrl+Shift+R)
   - Or wait for worker to auto-reload

---

## Step 3: Database Verification (SQL Queries)

Run these in pgAdmin to verify language setup:

```sql
-- 1. Check if Hebrew language exists
SELECT id, code, name, active, direction FROM res_lang 
WHERE code LIKE '%he%' OR name LIKE '%Hebrew%';

-- 2. Check user language setting
SELECT id, name, lang FROM res_users 
WHERE id = 2;  -- Usually 2 is Administrator

-- 3. Check PoS config language (if field exists)
SELECT id, name FROM pos_config LIMIT 5;

-- 4. Verify translation caching - check for "Actions"
-- (Note: Code translations may not be in DB in Odoo 18)
SELECT * FROM ir_model_fields 
WHERE model = 'pos.config' AND name = 'language';
```

---

## Step 4: Verify .po Files Are Properly Formatted

Your translations should follow this format:

```po
#. module: pos_base_popup
#. odoo-javascript
#: code:addons/point_of_sale/static/src/app/screens/product_screen/action_pad/action_pad.xml:0
msgid "Actions"
msgstr "פעולות"
```

**Check:**
- ✓ `msgid` (English source)
- ✓ `msgstr` (Hebrew translation) 
- ✓ Module comment (`#. module:`)
- ✓ Type comment (`#. odoo-javascript`)
- ✓ Location comment (`#: code:`)

---

## Step 5: Translation Loading Verification

### Test Translation Resolution Chain:

```javascript
// 1. Basic environment check
const env = window.posmodel.env;
console.log("Environment has _t function:", !!env._t);
console.log("Current language:", env.lang);

// 2. Try to translate a known string
const result = env._t("Actions");
console.log("Translation result:", result);
console.log("Is translated (not equal to source)?", result !== "Actions");

// 3. Monitor translation calls (intercept)
const originalT = env._t;
env._t = function(text) {
    const result = originalT.call(this, text);
    if (text === "Actions") {
        console.log(`%c[TRANSLATION] "${text}" => "${result}"`, 'color: green; font-weight: bold;');
    }
    return result;
};

// Now click the "Actions" button and check console
```

### What Each Result Means:

| Scenario | What it means | Solution |
|----------|-------------|----------|
| `window.posmodel.env.lang === undefined` | Language not set | Go to Step 2 (Backend config) |
| `window.posmodel.env._t === undefined` | Translation system broken | Restart Odoo worker |
| `env._t("Actions") === "Actions"` | Translation not found | Update/reload .po files |
| `env._t("Actions") === "פעולות"` | ✅ Translation working! | Success! |

---

## Step 6: If Still Not Working - Force Translation Reload

### In Odoo Backend:

1. **Go to Settings → Translations → Import/Export**
2. **Import a Translation File:**
   - Select **Language:** Hebrew (he_IL)
   - Select **File:** Your `.po` file
   - Click **Import**

3. **Or reload all translations:**
   - Go to Apps → Search for your module
   - Click the module
   - Click **Upgrade** button
   - This forces all translations to reload

4. **Restart Odoo Worker:**
   - If using Odoo.sh or local: Restart the service
   - Clear browser cache
   - Reload PoS

---

## Step 7: Debugging Command Summary

**Quick Copy-Paste for Browser Console:**

```javascript
// All-in-one diagnostics
(function debugTranslations() {
    const env = window.posmodel.env;
    const user = window.posmodel.user;
    
    console.group("🔍 Translation System Diagnostics");
    
    console.log("📍 Environment Language:", env.lang || "❌ UNDEFINED");
    console.log("👤 User Language:", user.lang || "❌ UNDEFINED");
    console.log("📦 Translation Function:", env._t ? "✅ Available" : "❌ Missing");
    
    if (env._t) {
        console.log("🧪 Test: 'Actions' =>", env._t("Actions"));
        console.log("🧪 Test: 'Hello' =>", env._t("Hello"));
    }
    
    console.log("🌍 Localization Service:", env.services?.localization || "❌ Not found");
    
    console.groupEnd();
})();
```

---

## Step 8: Common Issues & Solutions

### Issue: `env.lang` is `undefined`

**Cause:** User or PoS config doesn't have language set

**Solution:**
1. Go to Odoo Settings → Users & Companies
2. Edit your user
3. Set Language to Hebrew
4. Save
5. Hard refresh PoS (Ctrl+Shift+R)

---

### Issue: `env._t` returns "Actions" (not translated)

**Cause:** Translation not in cache (not imported into Odoo)

**Solution:**
1. Go to Settings → Translations → Import/Export
2. Select your `.po` file
3. Select Language: Hebrew
4. Click Import
5. Reload Odoo worker
6. Clear browser cache
7. Reload PoS

---

### Issue: Error when calling `env._t()`

**Cause:** Translation function corrupted or not loaded

**Solution:**
1. Restart Odoo service
2. Clear browser cache (Ctrl+Shift+Delete)
3. Reload PoS in new tab

---

## Step 9: Monitoring Production Translations

Once working, you can verify in production:

```javascript
// Create a translation verification function
function verifyTranslations(words) {
    console.table(words.map(word => ({
        English: word,
        Hebrew: window.posmodel.env._t(word),
        IsTranslated: window.posmodel.env._t(word) !== word
    })));
}

// Usage:
verifyTranslations(["Actions", "Amount", "Access Denied", "Guests?"]);
```

---

## Checklist Before Assuming Failure

- [ ] Hebrew language added to Odoo (Settings → Translations → Languages)
- [ ] Hebrew language marked as Active
- [ ] User language set to Hebrew (Settings → Users)
- [ ] .po file has proper format (msgid/msgstr pairs)
- [ ] .po file imported in Odoo (Settings → Translations → Import)
- [ ] Odoo worker restarted after language/import changes
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] PoS page hard refreshed (Ctrl+Shift+R)
- [ ] `env.lang` shows Hebrew code in console
- [ ] `env._t("Actions")` returns Hebrew text

---

## Next Steps After Diagnosis

1. **Run Step 1 console commands** - Tell me what you see
2. **Check Step 2 backend settings** - Confirm language is set
3. **Run Step 5 translation test** - Check if translation function works
4. **Report findings** - Share console output and results

Once I see your diagnostics, I can pinpoint the exact issue! 🎯
