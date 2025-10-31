// Fixed Debug Script - Run in Odoo browser console
// This version uses the correct domain instead of github.com

console.log("=== Git Info Footer Debug (Fixed) ===");

// Get the current domain
const currentDomain = window.location.origin;
console.log("Using domain:", currentDomain);

// Test controller
async function testControllerFixed() {
    console.log("\n--- Testing Controller ---");
    
    try {
        const response = await fetch(`${currentDomain}/git_info_footer/get_info`, {
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
        console.log("✅ Controller Response:", data.result);
        
        if (data.result) {
            const { free_text, addons_branch, addons_commit, git_commit } = data.result;
            console.log("\n=== Current Values ===");
            console.log("- free_text:", free_text);
            console.log("- addons_branch:", addons_branch);
            console.log("- addons_commit:", addons_commit); 
            console.log("- git_commit (odoo):", git_commit);
            
            console.log("\n=== Expected Format ===");
            console.log(`Expected: ${free_text} | ${addons_branch}/${addons_commit} | ${git_commit}`);
        }
        
        return data;
    } catch (error) {
        console.error("❌ Controller Error:", error);
        return null;
    }
}

// Test footer display
function testFooterDisplay() {
    console.log("\n--- Testing Footer Display ---");
    
    const footer = document.querySelector('.git-info-footer');
    if (footer) {
        console.log("✅ Footer found:", footer.textContent);
        
        // Check if it matches expected format
        if (footer.textContent.includes(' | ') && footer.textContent.split(' | ').length === 3) {
            console.log("✅ Footer has correct 3-part format!");
            const parts = footer.textContent.split(' | ');
            console.log("- Part 1 (freeText):", parts[0]);
            console.log("- Part 2 (addons):", parts[1]);  
            console.log("- Part 3 (odoo commit):", parts[2]);
        } else {
            console.log("⚠️ Footer format may not match expected pattern");
        }
    } else {
        console.log("❌ Footer not found in DOM");
    }
}

// Run tests
async function runFixedTests() {
    await testControllerFixed();
    testFooterDisplay();
    
    console.log("\n=== Next Steps ===");
    console.log("1. If controller shows old values, update module in Apps menu");
    console.log("2. Current version should be 18.0.1.0.3");
    console.log("3. Expected footer: 'freeText | unknown/unknown | 4247d8d7'");
}

runFixedTests();