# Odoo 18 PoS Frontend Objects Documentation

## Overview

This document describes the key frontend objects available in the Odoo 18 Point of Sale (PoS) system, particularly those accessed through the browser console and window context.

---

## 1. PosStore (`window.posmodel`)

### Overview
The primary state management object for the entire PoS application. It's a **Proxy wrapper** around the reactive `PosStore` instance.

### Structure
```
Proxy(PosStore) {
  [[Handler]]: Object,
  [[Target]]: PosStore,
  [[IsRevoked]]: false
}
```

### Key Properties

#### Business Data & Configuration
| Property | Type | Purpose |
|----------|------|---------|
| `config` | Base | PoS configuration settings |
| `company` | Base | Current company information |
| `currency` | Base | Currency configuration |
| `user` | Base | Current logged-in user |
| `cashier` | Base | Current cashier information |
| `session` | (getter) | Current PoS session |

#### Order Management
| Property | Type | Purpose |
|----------|------|---------|
| `selectedOrder` | (getter) | Currently selected order |
| `selectedOrderUuid` | string | UUID of selected order |
| `selectedTable` | RestaurantTable | Currently selected table (restaurant) |
| `selectedPartner` | null/object | Customer associated with order |
| `pendingOrder` | object | Changes pending sync: `{write: Set, delete: Set, create: Set}` |
| `order_sequence` | number | Sequence number for orders |

#### UI State
| Property | Type | Purpose |
|----------|------|---------|
| `isEditMode` | boolean | Whether in edit mode |
| `mainScreen` | object | Current main screen: `{props: {...}, component: function}` |
| `previousScreen` | string | Name of previous screen (e.g., "FloorScreen") |
| `mobile_pane` | string | Mobile pane position: "left" or "right" |
| `productListView` | string | Product display mode: "grid" or "list" |
| `loadingOrderState` | boolean | Whether loading order state |
| `loadingSkipButtonIsShown` | boolean | Loading skip button visibility |
| `tableSyncing` | boolean | Table sync in progress |

#### Data Management
| Property | Type | Purpose |
|----------|------|---------|
| `data` | PosData | ORM data layer with sync handling |
| `models` | object | Model definitions: `{pos.session, pos.config, pos.order, ...}` |
| `deviceSync` | DevicesSynchronisation | Device data synchronization service |

#### Services & Tools
| Property | Type | Purpose |
|----------|------|---------|
| `dialog` | object | Dialog management: `{add: fn, closeAll: fn}` |
| `alert` | object | Alert management: `{add: fn, dismiss: fn}` |
| `notification` | object | Notifications: `{add: fn}` |
| `barcodeReader` | BarcodeReader | Barcode scanning service |
| `hardwareProxy` | HardwareProxy | Connection to hardware (scales, printers) |
| `printer` | PosPrinterService | Receipt printing service |
| `scale` | PosScaleService | Weight scale integration |
| `sound` | SoundEffects | Sound effects playback |
| `numberBuffer` | NumberBuffer | Numeric input buffer for quantities |

#### Environment & Meta
| Property | Type | Purpose |
|----------|------|---------|
| `env` | object | OWL environment: `{bus: EventBus, services: {...}, debug: '1', utils: {...}}` |
| `ready` | Promise | Resolves when PoS is fully loaded |
| `bus` | object | Event bus for inter-component communication |
| `ui` | object | UI state: `{bus: EventBus, size: 5, isSmall: false, ...}` |

#### Other Properties
| Property | Type | Purpose |
|----------|------|---------|
| `company_logo` | null/string | Company logo (null if not set) |
| `company_logo_base64` | string | Base64 encoded logo |
| `floorPlanStyle` | string | Table layout style: "default", etc. |
| `searchProductWord` | string | Current product search query |
| `hiddenProductIds` | Set | Set of hidden product IDs |
| `mainProductVariant` | object | Main product variant selection |
| `numpadMode` | string | Numpad mode: "quantity", "discount", etc. |
| `printers_category_ids_set` | Set | Printer categories in use |
| `unwatched` | object | Unobserved properties: `{printers: []}` |
| `pushOrderMutex` | Mutex | Mutex lock for push operations |
| `syncingOrders` | Set | Orders currently being synced |
| `validated_orders_name_server_id_map` | object | Map of validated orders to IDs |

### Methods

#### Action Control
```javascript
doAction(actionRequest, options={})         // Execute Odoo action
doActionButton(params, {isEmbeddedAction}={})  // Execute action button
loadAction(actionRequest, context)          // Load action asynchronously
```

#### State Management
```javascript
loadState()                 // Load current session state
restore(jsId)              // Restore previous state
switchView(viewType, props={})  // Switch to different view
markReady()                // Mark PoS as ready
```

#### Dialog/Screen Management
```javascript
showScreen(screenName)     // Show screen (e.g., "BasePopupWidget")
dialog.add(Component, {...})  // Add dialog
dialog.closeAll()          // Close all dialogs
alert.add(message)         // Show alert
notification.add(message)  // Show notification
```

### Reactive Properties (Getters)
These are computed properties that re-evaluate:
- `categoryCount` - Count of product categories
- `currentSequenceNumber` - Current order sequence
- `firstScreen` - Initial screen to show
- `idleTimeout` - Idle timeout duration
- `isTicketScreenShown` - Whether ticket screen visible
- `linesToRefund` - Lines marked for refund
- `orderPreparationCategories` - Categories in preparation
- `productListViewMode` - Product view mode
- `productViewMode` - Product display preference
- `selectedOrder` - Currently selected order
- `session` - Current session info
- `showSaveOrderButton` - Button visibility

---

## 2. Window Object (`window`)

### Purpose
The browser's global window object with all standard DOM APIs plus Odoo-specific additions.

### Key Odoo-Specific Properties

#### Odoo Core
```javascript
window.odoo = {
  csrf_token: string,              // CSRF security token
  from_backend: number,            // Backend source indicator
  login_number: string,            // Login session number
  pos_session_id: number,          // Current PoS session ID
  pos_config_id: number,           // PoS configuration ID
  access_token: string,            // API access token
  debug: string,                   // Debug mode flag
  info: {
    db: string,                    // Database name
    server_version: string,        // Odoo version (e.g., "18.0")
    server_version_info: array,    // Version components
    isEnterprise: boolean          // Enterprise edition flag
  },
  loader: ModuleLoader,            // Module system
  define: function,                // Define modules
  startTour: async function,       // Start guided tours
  isTourReady: function,           // Check tour status
  loadMenusPromise: Promise        // Menu loading promise
}
```

#### OWL Framework
```javascript
window.owl = {
  App: function,                   // OWL App class
  Component: function,             // OWL Component class
  EventBus: function,              // Event bus implementation
  OwlError: function,              // Owl-specific errors
  // ... many more OWL utilities
}
```

#### PoS Model
```javascript
window.posmodel    // Proxy(PosStore) - Main PoS store
```

#### Debugging
```javascript
window.__OWL_DEVTOOLS__              // OWL dev tools
window.__OWL__DEVTOOLS_GLOBAL_HOOK__ // OWL devtools hook
window.debugMode = "1"               // Debug mode indicator
```

#### Browser Utilities
```javascript
window.console       // Console API
window.localStorage  // Local storage
window.sessionStorage // Session storage
window.fetch         // Fetch API
window.location      // URL and navigation
window.history       // Browser history
// ... standard DOM APIs
```

---

## 3. Odoo Object (`window.odoo`)

### Complete Structure

#### Authentication & Session
```javascript
{
  csrf_token: "...",           // CSRF protection token
  access_token: "...",         // API access token
  from_backend: 1,             // Indicates backend source
  login_number: "1"            // Session identifier
}
```

#### Server Information
```javascript
{
  info: {
    db: "cr60hi2nt4i.cloudpepper.site",  // Database
    server_version: "18.0",               // Odoo version
    server_version_info: [18, 0, ...],    // Version array
    isEnterprise: false                   // Edition type
  }
}
```

#### PoS Configuration
```javascript
{
  pos_session_id: 51,    // Current PoS session
  pos_config_id: 1       // PoS configuration ID
}
```

#### Module System
```javascript
{
  loader: ModuleLoader {
    bus: EventTarget,
    checkErrorProm: null,
    factories: Map(592),     // Loaded modules
    failed: Set(0),          // Failed modules
    jobs: Set(0)             // Pending jobs
  },
  define: function()         // Define new modules
}
```

#### Debug & Tours
```javascript
{
  debug: "1",                          // Debug flag
  isTourReady: (tourName) => {...},   // Check tour status
  startTour: async (tourName, options) => {...},
  use_pos_fake_tours: false,           // Use fake tours
  loadMenusPromise: Promise,           // Menu loading
  __WOWL_DEBUG__: { root: Chrome }    // Devtools
}
```

---

## 4. Data Flow Architecture

### Component Communication Path
```
User Interaction (Click/Input)
         ↓
OWL Component Event Handler
         ↓
posmodel (PosStore) State Update
         ↓
Reactive Properties Update
         ↓
Component Re-renders
         ↓
UI Updated
```

### Data Synchronization Path
```
PoS Frontend (window.posmodel)
         ↓
PosData Layer (posmodel.data)
         ↓
ORM Queries (posmodel.data.orm)
         ↓
Backend API
         ↓
Database
```

### Dialog/Alert System
```
Component calls posmodel.dialog.add(Component)
         ↓
Dialog Service adds to stack
         ↓
Dialog renders in modal
         ↓
User interaction triggers callback
         ↓
Dialog closes/updates state
```

---

## 5. Common Usage Patterns

### Access PoS State
```javascript
// Get current order
const order = window.posmodel.selectedOrder;

// Get products
const products = window.posmodel.data.records['product.product'];

// Get configuration
const config = window.posmodel.config;
```

### Show Dialog/Notification
```javascript
// Show alert
window.posmodel.alert.add({
  title: "Title",
  body: "Message"
});

// Show notification
window.posmodel.notification.add({
  message: "Notification",
  type: "info"
});

// Show custom dialog
window.posmodel.dialog.add(MyComponent, {
  props: { ... }
});
```

### Change Screen
```javascript
// Show a screen
window.posmodel.showScreen("BasePopupWidget");

// Switch view
window.posmodel.switchView("kanban", { props: {...} });
```

### Access Translation
```javascript
// Using OWL's translation in components
const translated = this.env._t("Your text");

// Or directly (if available)
const translated = window._t("Your text");
```

---

## 6. Service Registry

The PoS uses an Odoo service registry pattern. Common services:

```javascript
window.posmodel.env.services = {
  bus: {...},              // Event bus
  orm: {...},              // ORM layer
  rpc: {...},              // RPC calls
  notification: {...},     // Notifications
  dialog: {...},           // Dialog management
  // ... many more services
}
```

---

## 7. Event System

### Event Bus Pattern
```javascript
// Listen to events
window.posmodel.bus.addEventListener("order_updated", (data) => {
  console.log("Order updated:", data);
});

// Trigger events
window.posmodel.bus.trigger("order_updated", { orderId: 123 });
```

### Reactive Watchers
```javascript
// Properties marked with getters automatically trigger re-renders
// when their dependencies change
```

---

## 8. Debugging Tips

### In Browser Console

```javascript
// View entire PosStore
console.log(window.posmodel);

// Access specific data
console.log(window.posmodel.selectedOrder);

// Show screen
window.posmodel.showScreen("BasePopupWidget");

// List all loaded modules
console.log(Object.keys(window.odoo.loader.factories));

// Check translations
console.log(window._t("Your text"));

// View environment services
console.log(window.posmodel.env.services);
```

---

## 9. Performance Considerations

- **PosStore is Reactive**: Changes trigger component updates automatically
- **Services are Lazy-loaded**: Services initialize on first use
- **Proxy Wrapper**: PosStore uses Proxy for reactivity interception
- **Mutex Locks**: `pushOrderMutex` prevents concurrent writes

---

## 10. Security Notes

- **CSRF Token**: Required for backend API calls (`window.odoo.csrf_token`)
- **Access Token**: Used for API authentication (`window.odoo.access_token`)
- **Session ID**: Tied to server session (`window.odoo.pos_session_id`)
- **Debug Mode**: Only in development (`window.odoo.debug`)

---

## References

- **Odoo 18 Documentation**: https://www.odoo.com/documentation/18.0/
- **OWL Framework**: https://github.com/odoo/owl
- **Point of Sale Module**: Core PoS business logic
- **Browser DevTools**: For inspecting objects in real-time
