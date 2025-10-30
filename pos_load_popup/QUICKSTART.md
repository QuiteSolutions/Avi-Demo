# pos_load_popup - Quick Reference

## What Is It?

A new PoS module that adds an **interactive text input widget** with **live preview** functionality.

```
User types text
     ↓
Preview updates in real-time
     ↓
Format buttons available (Uppercase, Lowercase, Capitalize, Clear)
     ↓
Character counter tracks input length
```

---

## Module Structure

```
pos_load_popup/
├── __init__.py                    (empty)
├── __manifest__.py                (configuration)
├── static/src/js/
│   └── load_popup_widget.js       (JavaScript component)
├── static/src/xml/
│   └── load_popup_widget.xml      (template + inline CSS)
├── i18n/
│   └── he_IL.po                   (Hebrew translations)
└── POS_LOAD_POPUP_DOCS.md        (full documentation)
```

---

## Features at a Glance

| Feature | Description | Example |
|---------|-------------|---------|
| **Live Input** | Text input field | Type "hello" |
| **Live Preview** | Real-time display below | Shows "hello" immediately |
| **Character Count** | Track input length | "Characters: 5" |
| **Uppercase Button** | Convert to uppercase | "HELLO" |
| **Lowercase Button** | Convert to lowercase | "hello" |
| **Capitalize Button** | Capitalize words | "Hello" |
| **Clear Button** | Reset all fields | Clears input & preview |
| **Status Indicator** | Visual feedback | Green dot = input |

---

## Dependencies

```
pos_base_popup (required)
    ↓
pos_extended_popup (required)
    ↓
pos_override_popup (required)
    ↓
pos_load_popup (new module)
```

**Must install in order:**
1. pos_base_popup ✓ (already installed)
2. pos_extended_popup ✓ (already installed)
3. pos_override_popup ✓ (already installed)
4. pos_load_popup (NEW - ready to install)

---

## File Breakdown

### 1. `__manifest__.py`

Module configuration:
```python
{
    'name': 'PoS Load Popup',
    'version': '18.0.1.0.0',
    'depends': ['pos_base_popup', 'pos_extended_popup', 'pos_override_popup'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_load_popup/static/src/js/load_popup_widget.js',
            'pos_load_popup/static/src/xml/load_popup_widget.xml',
        ],
    },
}
```

### 2. `load_popup_widget.js`

JavaScript component with OWL state management:

```javascript
class LoadPopupWidget extends BasePopupWidget {
    // State for input and preview
    state = {
        inputValue: "",
        previewText: "",
        characterCount: 0
    }
    
    // Methods
    onInputChange(event)      // Update preview on typing
    onClearInput()           // Reset everything
    onFormatUppercase()      // Convert to UPPERCASE
    onFormatLowercase()      // Convert to lowercase
    onFormatCapitalize()     // Convert To Capitalized
}
```

### 3. `load_popup_widget.xml`

XML template with:
- Input field with `t-on-input` event
- Format buttons (conditionally shown)
- Live preview box
- Character counter
- Status indicator
- Embedded CSS styling

### 4. `he_IL.po`

Hebrew translations for all UI strings:
```
"Enter Text:" → "הזן טקסט:"
"Live Preview:" → "תצוגה חיה:"
"Uppercase" → "אותיות גדולות"
... (14 translations total)
```

---

## How It Works - Step by Step

### Step 1: User Types
```
Input field value: "hello"
```

### Step 2: Event Triggers
```javascript
onInputChange(event) {
    const value = event.target.value;  // "hello"
    this.state.inputValue = value;
    this.state.characterCount = 5;
    this.state.previewText = value;    // Show in preview
}
```

### Step 3: State Updates
```javascript
this.state = {
    inputValue: "hello",
    previewText: "hello",
    characterCount: 5
}
```

### Step 4: Template Re-renders
```xml
<input t-model="state.inputValue" ... />        <!-- "hello" -->
<div t-esc="state.previewText" .../>            <!-- shows "hello" -->
<span t-esc="state.characterCount" .../>        <!-- shows 5 -->
```

### Step 5: Buttons Appear
```xml
<button t-if="state.inputValue.trim()" ...>Uppercase</button>
<!-- Appears because inputValue is not empty -->
```

---

## Event Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│ User Types in Input Field                          │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
        t-on-input triggers
        onInputChange(event)
               │
               ▼
        ┌──────────────────────────────────┐
        │ Update state.inputValue          │
        │ Update state.characterCount      │
        │ Update state.previewText         │
        └──────────────────────────────────┘
               │
               ▼
        Template Re-renders
        (OWL reactive)
               │
               ▼
        ┌──────────────────────────────────┐
        │ Preview displays "hello"         │
        │ Counter shows 5                  │
        │ Buttons become visible           │
        │ Status shows: "Input detected"   │
        └──────────────────────────────────┘
```

---

## User Interaction Examples

### Example 1: Basic Typing
```
User action:    Type "test"
Result:
  - Input:      "test" (shows in input field)
  - Preview:    "test" (shows in preview box)
  - Counter:    "Characters: 4"
  - Status:     "Input detected" (green dot)
  - Buttons:    Uppercase, Lowercase, Capitalize, Clear (visible)
```

### Example 2: Format as Uppercase
```
User action:    Click "Uppercase" button
Result:
  - Input:      "test" (unchanged)
  - Preview:    "TEST" (converted to uppercase)
```

### Example 3: Format Capitalize
```
User action:    Click "Capitalize" button
Result:
  - Input:      "test" (unchanged)
  - Preview:    "Test" (capitalized)
```

### Example 4: Clear
```
User action:    Click "Clear" button
Result:
  - Input:      "" (cleared)
  - Preview:    "Preview will appear here..." (reset)
  - Counter:    "Characters: 0"
  - Status:     "Awaiting input" (gray dot)
  - Buttons:    All hidden (no input)
```

---

## Technical Details

### State Management (OWL Pattern)

```javascript
setup() {
    super.setup();
    
    this.state = useState({
        inputValue: "",
        previewText: "Preview will appear here...",
        characterCount: 0,
    });
}
```

### Template Binding

```xml
<!-- Two-way binding (updates state when input changes) -->
<input t-model="state.inputValue" ... />

<!-- One-way binding (displays state value) -->
<div t-esc="state.previewText" ... />

<!-- Conditional rendering (shows/hides based on state) -->
<button t-if="state.inputValue.trim()" ...>
```

### Event Handlers

```javascript
// Input event fires on every keystroke
onInputChange(event)

// Button click events
onFormatUppercase()
onFormatLowercase()
onFormatCapitalize()
onClearInput()
```

---

## Styling

### CSS Classes

```css
.load-popup-widget                  /* Main container */
.input-section                      /* Input area */
.form-control:focus                 /* Input focus state */
.preview-box                        /* Preview display box */
.preview-text                       /* Preview text styling */
.format-buttons                     /* Button group */
.status-indicator                   /* Status dot */
```

### Visual Design

- **Input Border**: 2px gray, turns blue on focus
- **Preview Box**: Light blue background, info blue border
- **Buttons**: Outline style, blue text
- **Status**: Green dot = input, gray dot = waiting
- **Font**: Responsive, readable sizing

---

## Installation Steps

### Step 1: Verify Dependencies
```
Apps → Search "pos_base_popup" → Should be installed ✓
Apps → Search "pos_extended_popup" → Should be installed ✓
Apps → Search "pos_override_popup" → Should be installed ✓
```

### Step 2: Install New Module
```
Apps → Search "pos_load_popup" → Install
```

### Step 3: Import Translations (Optional)
```
Settings → Translations → Import/Export
Language: Hebrew (he_IL)
File: Browse to pos_load_popup/i18n/he_IL.po
Click Import
```

### Step 4: Restart
```
Settings → Restart (or restart Odoo service)
```

### Step 5: Test
```
Point of Sale → Open session
Look for the input widget
Type text → See live preview
```

---

## Customization Ideas

### Add More Buttons

```javascript
// Add to JavaScript
onFormatReverse() {
    this.state.previewText = this.state.inputValue
        .split("")
        .reverse()
        .join("");
}

onFormatTrim() {
    this.state.previewText = this.state.inputValue.trim();
}
```

```xml
<!-- Add to XML template -->
<button t-on-click="() => this.onFormatReverse()">
    <i class="fa fa-exchange"/>Reverse
</button>
```

### Add Validation

```javascript
onInputChange(event) {
    const value = event.target.value;
    
    // Limit to 100 characters
    if (value.length > 100) {
        this.state.previewText = "Max 100 characters!";
        return;
    }
    
    this.state.inputValue = value;
    this.state.previewText = value;
}
```

### Add Save Feature

```javascript
onSaveText() {
    // Save to backend
    this.pos.data.savedTexts = this.pos.data.savedTexts || [];
    this.pos.data.savedTexts.push(this.state.inputValue);
    
    // Show notification
    this.env.notification.notify({
        title: "Saved",
        message: `"${this.state.inputValue}" saved successfully`,
        type: "info"
    });
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Preview not updating | Check browser console (F12) for errors |
| Buttons always hidden | Verify `t-if="state.inputValue.trim()"` condition |
| Translations not showing | Import .po file and restart Odoo |
| Styling looks broken | Clear browser cache (Ctrl+Shift+Delete) |
| Module won't install | Check all 3 dependencies are installed first |

---

## Performance

- **File Size**: ~3KB JavaScript + 2KB XML
- **Re-renders**: Only when state changes (OWL optimized)
- **Memory**: Minimal overhead (small state object)
- **DB Queries**: None (local client-side only)

**Result**: Fast, responsive, lightweight! ✅

---

## Comparison with Base Module

| Feature | pos_base_popup | pos_load_popup |
|---------|---|---|
| Input field | No | Yes ✓ |
| Live preview | No | Yes ✓ |
| Format buttons | No | Yes ✓ |
| Character count | No | Yes ✓ |
| Status indicator | No | Yes ✓ |
| Hebrew support | Yes ✓ | Yes ✓ |

---

## Module Inheritance Chain

```
BasePopupWidget (pos_base_popup)
        ▲
        │
ExtendedPopupWidget (pos_extended_popup)
        ▲
        │
OverridePopupWidget (pos_override_popup)
        ▲
        │
LoadPopupWidget (pos_load_popup) ← NEW
```

Each layer adds new features while keeping compatibility with previous layers.

---

## Next Steps

1. **Review** - Read full docs in `POS_LOAD_POPUP_DOCS.md`
2. **Install** - Follow installation steps above
3. **Test** - Try typing in the input widget
4. **Customize** - Add more format buttons if needed
5. **Deploy** - Push to production when ready

---

## Support

**Questions about:**
- Module structure → See `__manifest__.py`
- JavaScript logic → See `load_popup_widget.js`
- Template/XML → See `load_popup_widget.xml`
- Translations → See `he_IL.po`
- Full docs → See `POS_LOAD_POPUP_DOCS.md`

**All files included in the module!** 📦

---

**Created:** 2025-10-30  
**Status:** Ready to deploy  
**Version:** 1.0.0  
