# pos_load_popup Module Documentation

## Overview

The `pos_load_popup` module extends the Odoo 18 Point of Sale with an interactive text input widget that provides **live preview functionality**. Users can type text and see it updated in real-time below the input field.

## Module Hierarchy

```
pos_base_popup
    ├─ pos_extended_popup
    └─ pos_override_popup
         └─ pos_load_popup (NEW)
```

This module depends on all three previous modules, making it the **top-level** component in your PoS widget hierarchy.

---

## Features

### 1. **Live Text Input Field**
- Standard text input with placeholder
- Real-time character counting
- Visual feedback for focus state
- Responsive design

### 2. **Live Preview Display**
- Shows text as user types
- Updates in real-time (no refresh needed)
- Styled preview box with visual separation
- Empty state guidance: "Preview will appear here..."

### 3. **Format Buttons** (Conditional Display)
Only appear when there's text in the input field:

- **Uppercase**: Convert preview to uppercase
  - `THIS IS UPPERCASE`
  
- **Lowercase**: Convert preview to lowercase
  - `this is lowercase`
  
- **Capitalize**: Capitalize each word
  - `This Is Capitalized`
  
- **Clear**: Reset input and preview
  - Clears both input field and preview text

### 4. **Status Indicator**
- Visual indicator showing if input is detected
- Green dot = input present
- Gray dot = waiting for input

### 5. **Character Counter**
- Displays real-time character count
- Updates as user types
- Useful for validating input length

---

## File Structure

```
pos_load_popup/
├── __init__.py                           # Python module initialization
├── __manifest__.py                       # Module configuration
├── static/
│   └── src/
│       ├── js/
│       │   └── load_popup_widget.js      # JavaScript component logic
│       └── xml/
│           └── load_popup_widget.xml     # XML template + styling
└── i18n/
    └── he_IL.po                          # Hebrew translations
```

---

## Key Components

### JavaScript Class: LoadPopupWidget

Located in: `static/src/js/load_popup_widget.js`

```javascript
export class LoadPopupWidget extends BasePopupWidget {
    setup()                    // Initialize state and component
    onInputChange(event)       // Handle input field changes
    onClearInput()            // Clear input and preview
    onFormatUppercase()       // Convert to uppercase
    onFormatLowercase()       // Convert to lowercase
    onFormatCapitalize()      // Capitalize each word
}
```

#### State Management

```javascript
this.state = {
    inputValue: "",           // Current input text
    previewText: "",          // Text to display in preview
    characterCount: 0         // Number of characters typed
}
```

### XML Template: load_popup_widget.xml

Provides:
- Input field with real-time binding
- Format buttons (conditionally displayed)
- Live preview box
- Character counter
- Status indicator
- Embedded CSS styling

---

## Module Dependencies

```
{
    'depends': [
        'pos_base_popup',      # Base widget functionality
        'pos_extended_popup',  # Extended features
        'pos_override_popup'   # Override patterns
    ]
}
```

All three previous modules must be installed for `pos_load_popup` to work.

---

## How It Works

### Input Flow

```
User types in input field
       ↓
onInputChange() triggered
       ↓
Update state.inputValue
Update state.characterCount
       ↓
Update state.previewText
       ↓
Template re-renders
       ↓
Preview displays live
```

### Example Interaction

```
User Input: "hello world"
             ↓
Preview: "hello world" (live updated)
         ↓
Buttons appear (Uppercase, Lowercase, Capitalize, Clear)
         ↓
Click "Uppercase"
         ↓
Preview becomes: "HELLO WORLD"
         ↓
Input field still shows: "hello world"
```

---

## Styling

### CSS Classes

- `.load-popup-widget` - Main container
- `.input-section` - Input field area
- `.format-buttons` - Button group container
- `.preview-box` - Preview display container
- `.preview-text` - Preview text styling
- `.status-indicator` - Status dot indicator

### Visual Features

- **Input Field**: 2px border, focus blue highlight
- **Preview Box**: Info blue border, light background
- **Buttons**: Outline style, responsive layout
- **Status**: Colored circle indicator (success green or secondary gray)

---

## Translations (Hebrew - he_IL)

```
"Text Input with Live Preview"  → "הקלדת טקסט עם תצוגה חיה"
"Enter Text:"                   → "הזן טקסט:"
"Live Preview:"                 → "תצוגה חיה:"
"Uppercase"                     → "אותיות גדולות"
"Lowercase"                     → "אותיות קטנות"
"Capitalize"                    → "capitalize"
"Clear"                         → "נקה"
"Updates as you type"           → "עדכונים תוך כדי הקלדה"
"Input detected"                → "קלט זוהה"
"Awaiting input"                → "מחכה לקלט"
```

---

## Installation & Usage

### 1. Install the Module

```
Apps → Search for "pos_load_popup"
Click "Install"
```

### 2. Verify Translations (Optional)

```
Settings → Translations → Import/Export
Language: Hebrew (he_IL)
File: pos_load_popup/i18n/he_IL.po
Click Import
```

### 3. Test in PoS

```
Point of Sale → Open session
Look for interactive text input widget
Type text to see live preview
```

---

## Advanced Customization

### Add More Format Options

Edit `load_popup_widget.js`:

```javascript
onFormatReverse() {
    this.state.previewText = this.state.inputValue
        .split("")
        .reverse()
        .join("");
}
```

Add button to template:

```xml
<button 
    class="btn btn-outline-primary btn-sm"
    t-on-click="() => this.onFormatReverse()"
    t-if="state.inputValue.trim()">
    <i class="fa fa-exchange me-1"/>Reverse
</button>
```

### Add Validation

```javascript
onInputChange(event) {
    const value = event.target.value;
    // Add validation
    if (value.length > 50) {
        this.state.previewText = "Maximum 50 characters exceeded!";
        return;
    }
    this.state.inputValue = value;
    this.state.characterCount = value.length;
    this.state.previewText = value;
}
```

### Add Save Functionality

```javascript
onSaveText() {
    // Send to backend or store in cache
    console.log("Saved:", this.state.inputValue);
    this.pos.create_notification({
        title: "Saved",
        message: "Text saved successfully"
    });
}
```

---

## Testing Checklist

- [ ] Module installs without errors
- [ ] Widget appears in PoS interface
- [ ] Input field accepts text
- [ ] Preview updates as you type (live)
- [ ] Character counter increments correctly
- [ ] Format buttons appear when text entered
- [ ] Uppercase button works
- [ ] Lowercase button works
- [ ] Capitalize button works
- [ ] Clear button resets field
- [ ] Status indicator shows/hides correctly
- [ ] Hebrew translations display (if enabled)
- [ ] Responsive on mobile view

---

## Architecture Overview

```
Component Hierarchy:

BasePopupWidget (pos_base_popup)
    ↓
ExtendedPopupWidget (pos_extended_popup)
    ↓
OverridePopupWidget (pos_override_popup)
    ↓
LoadPopupWidget (pos_load_popup) ← You are here
    ├─ Input Field
    ├─ Format Buttons
    ├─ Live Preview Box
    └─ Status Indicator
```

---

## Performance Notes

- ✅ Uses OWL reactive state (no manual DOM manipulation)
- ✅ Efficient re-renders (only affected elements update)
- ✅ No database queries for live preview
- ✅ Lightweight JavaScript (< 2KB minified)
- ✅ Inline CSS styling (no external dependencies)

---

## Integration with Existing Modules

The module works with your existing setup:

```
pos_base_popup         - Base functionality ✓
pos_extended_popup     - Extended features ✓
pos_override_popup     - Override patterns ✓
pos_load_popup         - NEW: Live preview ✓
```

All translation overrides from previous modules are inherited.

---

## Troubleshooting

### Preview Not Updating
- Check browser console for errors (F12)
- Verify `state` object is initialized
- Ensure input event listeners are bound

### Buttons Not Appearing
- Check if `state.inputValue.trim()` has value
- Verify template condition: `t-if="state.inputValue.trim()"`

### Translations Not Showing
- Import he_IL.po file (Settings → Translations → Import)
- Restart Odoo worker
- Clear browser cache (Ctrl+Shift+Delete)

### Styling Issues
- Check CSS in XML template
- Verify Bootstrap classes available
- Check for CSS conflicts with other modules

---

## Next Steps

1. **Test locally** - Verify all features work
2. **Customize** - Add more format options if needed
3. **Deploy** - Push to production
4. **Monitor** - Check for any issues in logs

---

## Related Files

- `pos_base_popup/` - Base widget system
- `pos_extended_popup/` - Extended functionality
- `pos_override_popup/` - Override patterns
- `ACTION_PLAN.md` - Setup instructions
- `VISUAL_FLOWCHART.md` - Architecture diagrams

---

**Created:** 2025-10-30  
**Version:** 1.0.0  
**Compatible with:** Odoo 18.0  
**Author:** Your Company  
