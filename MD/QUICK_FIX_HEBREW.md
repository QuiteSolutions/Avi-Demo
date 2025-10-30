# Quick Fix: Set Hebrew Language in PoS

## 🚀 Quick Start (5 minutes)

### Step 1: Backend Configuration (Odoo Admin Panel)

#### A. Load Hebrew Language
1. Go to **Settings** → **Translations** → **Languages**
2. Look for **Hebrew** (code: `he` or `he_IL`)
3. If not found:
   - Click **Create**
   - Name: `Hebrew`
   - Code: `he_IL`
   - Direction: `RTL` (Right-to-Left)
   - Click **Save**
4. **Important:** Make sure the language has **Active** checked ✓

#### B. Set User Language
1. Go to **Settings** → **Users & Companies** → **Users**
2. Click on **Administrator** (or your user)
3. In the **Language** field, select **Hebrew (he_IL)**
4. Click **Save**

#### C. Optional: Set PoS Config Language
1. Go to **Point of Sale** → **Configuration** → **Point of Sale**
2. Click on your PoS configuration
3. Look for a **Language** field (if it exists)
4. Set to **Hebrew (he_IL)**
5. Click **Save**

---

### Step 2: Import Translations

1. Go to **Settings** → **Translations** → **Import/Export**
2. Under **Import**, select:
   - **Language:** Hebrew (he_IL)
   - **File:** Browse to your `.po` file
     - Example: `pos_base_popup/i18n/he_IL.po`
3. Click **Import**
4. Wait for confirmation message

---

### Step 3: Restart & Reload

#### Option A: Cloud Deployment (Odoo.sh / CloudPepper)
1. Go to your admin panel
2. Look for **Maintenance** or **Restart** option
3. Click to restart the worker
4. Wait 30-60 seconds

#### Option B: Local Installation
```bash
# Restart Odoo service
sudo systemctl restart odoo

# Or if running directly:
# Stop it (Ctrl+C) and restart the process
```

#### Option C: Just Clear Cache & Reload
1. Open PoS in browser
2. **Hard refresh:** `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
3. **Clear all browser cache:** `Ctrl + Shift + Delete`
4. Close PoS tab completely
5. Open PoS fresh in new tab

---

### Step 4: Verify It Works

1. Open PoS application
2. **Open Browser Console:** Press `F12`
3. **Paste this command:**

```javascript
console.log("Language:", window.posmodel.env.lang);
console.log("Actions translation:", window.posmodel.env._t("Actions"));
```

**Expected Output:**
```
Language: he_IL
Actions translation: פעולות
```

If you see this, **congratulations! 🎉 Translations are working!**

---

## ❌ Troubleshooting

### Problem: `Language: undefined`

**Cause:** User doesn't have language set

**Fix:**
1. Go to Settings → Users → Administrator
2. Set Language field to Hebrew
3. Save
4. Hard refresh PoS (`Ctrl+Shift+R`)

---

### Problem: `Actions translation: Actions` (not translated)

**Cause:** Translation not imported or cached

**Fix:**
1. Go to Settings → Translations → Import/Export
2. Import your `.po` file again
3. Select Language: Hebrew (he_IL)
4. Click Import
5. If on CloudPepper: Trigger a restart
6. Hard refresh PoS (`Ctrl+Shift+R`)

---

### Problem: Language shows but still getting English

**Cause:** Browser cache not cleared

**Fix:**
1. Close PoS tab completely
2. Clear browser cache: `Ctrl+Shift+Delete` → Clear All
3. Close entire browser
4. Reopen and load PoS fresh

---

### Problem: Still not working after all steps

**Debug with this script:**

Copy-paste into browser console (F12):

```javascript
// Full diagnostic
(function() {
    const env = window.posmodel.env;
    console.group("Translation Debug");
    console.log("1. env.lang:", env.lang);
    console.log("2. user.lang:", window.posmodel.user.lang);
    console.log("3. _t exists:", !!env._t);
    console.log("4. _t('Actions'):", env._t("Actions"));
    console.log("5. Localization:", env.services.localization);
    console.groupEnd();
})();
```

**Share the output with me and I'll help!**

---

## 📋 Verification Checklist

Before assuming it's broken, verify:

- [ ] Hebrew language exists in Odoo (Settings → Languages)
- [ ] Hebrew language is **Active** (checkbox enabled)
- [ ] User has Hebrew language selected (Settings → Users)
- [ ] `.po` file was imported (Settings → Translations → Import)
- [ ] Odoo worker restarted (if applicable)
- [ ] Browser cache cleared completely
- [ ] PoS hard refreshed (`Ctrl+Shift+R`)
- [ ] Used fresh browser tab (no cached resources)
- [ ] Console shows: `env.lang` = `he_IL` or `he`
- [ ] Console shows: `_t("Actions")` = Hebrew text

---

## 🎯 Key Points

1. **Language must be set in TWO places:**
   - System level (Settings → Languages)
   - User level (Settings → Users)

2. **Translations are loaded:**
   - From `.po` files on module installation
   - Into worker memory (not database table in Odoo 16+)
   - At startup time

3. **To reload translations:**
   - Import the `.po` file again
   - Restart the Odoo worker
   - Clear browser cache

4. **PoS won't translate without:**
   - Language code set (`env.lang`)
   - Translation function loaded (`env._t`)
   - User language configured

---

## Next: After Translations Work

Once Hebrew translations work, you can:

1. Add more translations to `.po` files
2. Override core Odoo translations from your modules
3. Test with multiple languages
4. Deploy to production

Need help with any step? Let me know! 🚀
