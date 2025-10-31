// Debug Script for Git Info Footer
// Run this in browser console (F12) while logged into Odoo

console.log("=== Git Info Footer Debug ===");

// Test 1: Check if the controller endpoint responds correctly
async function testController() {
    console.log("\n--- Testing Controller Endpoint ---");
    
    try {
        const response = await fetch('/git_info_footer/get_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.odoo?.csrf_token || ''
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {},
                id: 1
            })
        });
        
        const data = await response.json();
        console.log("✅ Controller Response:", data);
        
        if (data.result) {
            console.log("Expected keys present?");
            console.log("- addons_branch:", data.result.addons_branch || "MISSING");
            console.log("- addons_commit:", data.result.addons_commit || "MISSING");
            console.log("- free_text:", data.result.free_text || "MISSING");
        }
        
        return data;
    } catch (error) {
        console.error("❌ Controller Error:", error);
        return null;
    }
}

// Test 2: Check if the component is registered and loaded
function testComponentRegistration() {
    console.log("\n--- Testing Component Registration ---");
    
    try {
        if (window.odoo && window.odoo.__DEBUG__ && window.odoo.__DEBUG__.services) {
            const registry = window.odoo.__DEBUG__.services.registry;
            const mainComponents = registry.category("main_components");
            
            console.log("Main components registered:");
            const entries = mainComponents.getEntries();
            entries.forEach(([name, config]) => {
                console.log(`- ${name}:`, config);
                if (name.includes('GitInfo')) {
                    console.log("  ✅ GitInfoFooter found!");
                }
            });
            
            return entries;
        } else {
            console.log("❌ Registry not accessible");
            return null;
        }
    } catch (error) {
        console.error("❌ Registry Error:", error);
        return null;
    }
}

// Test 3: Check if assets are loaded correctly
function testAssetLoading() {
    console.log("\n--- Testing Asset Loading ---");
    
    // Check if our JS file is loaded
    const scripts = Array.from(document.scripts);
    const gitInfoScripts = scripts.filter(script => 
        script.src && (script.src.includes('git_info_footer') || script.src.includes('GitInfo'))
    );
    
    console.log("Git Info Footer scripts found:", gitInfoScripts.length);
    gitInfoScripts.forEach(script => {
        console.log("- Script:", script.src);
    });
    
    // Check if the component is in DOM
    const footerElements = document.querySelectorAll('.git-info-footer');
    console.log("Footer elements in DOM:", footerElements.length);
    footerElements.forEach((el, index) => {
        console.log(`- Footer ${index}:`, el.textContent);
    });
}

// Test 4: Check module installation status
async function testModuleStatus() {
    console.log("\n--- Testing Module Status ---");
    
    try {
        const response = await fetch('/web/dataset/call_kw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.odoo?.csrf_token || ''
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    model: 'ir.module.module',
                    method: 'search_read',
                    args: [[['name', '=', 'git_info_footer']]],
                    kwargs: {
                        fields: ['name', 'state', 'installed_version']
                    }
                },
                id: 2
            })
        });
        
        const data = await response.json();
        if (data.result && data.result.length > 0) {
            const module = data.result[0];
            console.log("✅ Module Status:", module);
            console.log("- State:", module.state);
            console.log("- Version:", module.installed_version);
            
            if (module.state !== 'installed') {
                console.log("⚠️ Module is not installed! State:", module.state);
            }
        } else {
            console.log("❌ Module not found in database");
        }
        
        return data;
    } catch (error) {
        console.error("❌ Module Status Error:", error);
        return null;
    }
}

// Run all tests
async function runAllTests() {
    console.log("Starting comprehensive debug...\n");
    
    await testController();
    testComponentRegistration();
    testAssetLoading();
    await testModuleStatus();
    
    console.log("\n=== Debug Summary ===");
    console.log("1. Check controller response for new fields");
    console.log("2. Verify component registration");
    console.log("3. Check if assets are loaded");
    console.log("4. Verify module installation status");
    console.log("\nIf controller returns old data, the module needs to be restarted/updated.");
    console.log("If assets aren't loaded, clear browser cache or check manifest.");
}

// Auto-run
runAllTests();