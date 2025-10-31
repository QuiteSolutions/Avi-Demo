// Service Diagnostic Script for Odoo 18
// Run this in browser console to check service availability

console.log("=== Odoo 18 Service Diagnostic ===");

// Check if OWL is available
if (typeof window.owl !== 'undefined') {
    console.log("✅ OWL Framework: Available");
    console.log("OWL Version:", window.owl.version || "Unknown");
} else {
    console.log("❌ OWL Framework: Not Available");
}

// Check if Odoo services are available
if (typeof window.odoo !== 'undefined') {
    console.log("✅ Odoo Core: Available");
    console.log("CSRF Token:", window.odoo.csrf_token ? "Present" : "Missing");
    console.log("Session Info:", window.odoo.session_info ? "Present" : "Missing");
} else {
    console.log("❌ Odoo Core: Not Available");
}

// Check service registry
try {
    const { registry } = window.odoo.__DEBUG__.services;
    const services = registry.category("services");
    
    console.log("✅ Service Registry: Available");
    console.log("Available Services:", services.getEntries().map(([name]) => name));
    
    // Check specific services
    const criticalServices = ['rpc', 'dialog', 'notification', 'router'];
    criticalServices.forEach(serviceName => {
        if (services.contains(serviceName)) {
            console.log(`✅ ${serviceName} service: Available`);
        } else {
            console.log(`❌ ${serviceName} service: Missing`);
        }
    });
    
} catch (error) {
    console.log("❌ Service Registry: Not Available or Error:", error.message);
}

// Check POS specific services
try {
    if (window.posmodel) {
        console.log("✅ POS Model: Available");
        console.log("POS Services:", Object.keys(window.posmodel.env.services || {}));
        console.log("Translation Function:", typeof window.posmodel.env._t);
    } else {
        console.log("❌ POS Model: Not Available (may be normal if not in POS mode)");
    }
} catch (error) {
    console.log("❌ POS Check Error:", error.message);
}

// Component lifecycle check
console.log("\n=== Component Lifecycle Recommendations ===");
console.log("1. Use onWillStart() for async service initialization");
console.log("2. Implement service availability checks in setup()");
console.log("3. Add error handling for missing services");
console.log("4. Consider lazy loading for non-critical services");

console.log("\n=== Module Loading Order ===");
console.log("Current module dependencies should be:");
console.log("base → web → point_of_sale → your_modules");