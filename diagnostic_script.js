// PoS Translation Diagnostic Script
// Copy this entire script into browser console (F12) while PoS is open

(function() {
    console.clear();
    console.log("%c═══════════════════════════════════════", "color: cyan; font-weight: bold;");
    console.log("%c  PoS TRANSLATION DIAGNOSTIC REPORT", "color: cyan; font-weight: bold;");
    console.log("%c═══════════════════════════════════════", "color: cyan; font-weight: bold;");
    
    const diagnostics = {
        timestamp: new Date().toISOString(),
        sections: []
    };
    
    // 1. Environment Check
    console.log("\n%c1️⃣  ENVIRONMENT CHECK", "color: yellow; font-weight: bold;");
    const env = window.posmodel?.env;
    const hasEnv = !!env;
    console.log(`   ✓ PosModel exists: ${!!window.posmodel}`);
    console.log(`   ✓ Environment exists: ${hasEnv}`);
    
    if (!hasEnv) {
        console.error("   ❌ CRITICAL: Environment not found!");
        return;
    }
    
    diagnostics.sections.push({
        name: "Environment",
        status: hasEnv ? "OK" : "FAILED"
    });
    
    // 2. Language Configuration
    console.log("\n%c2️⃣  LANGUAGE CONFIGURATION", "color: yellow; font-weight: bold;");
    const currentLang = env.lang;
    const userLang = window.posmodel.user?.lang;
    
    console.log(`   Current Language (env.lang): ${currentLang || "❌ UNDEFINED"}`);
    console.log(`   User Language (user.lang): ${userLang || "❌ UNDEFINED"}`);
    
    diagnostics.sections.push({
        name: "Language Config",
        status: currentLang ? "OK" : "MISSING"
    });
    
    // 3. Translation Function
    console.log("\n%c3️⃣  TRANSLATION FUNCTION", "color: yellow; font-weight: bold;");
    const hasTranslationFn = typeof env._t === 'function';
    console.log(`   Translation function (_t) available: ${hasTranslationFn ? "✅ YES" : "❌ NO"}`);
    
    if (!hasTranslationFn) {
        console.error("   ❌ CRITICAL: Translation function not found!");
    }
    
    diagnostics.sections.push({
        name: "Translation Function",
        status: hasTranslationFn ? "OK" : "MISSING"
    });
    
    // 4. Test Translations
    console.log("\n%c4️⃣  TRANSLATION TESTS", "color: yellow; font-weight: bold;");
    
    const testWords = ["Actions", "Amount", "Access Denied", "Guests?", "Hello"];
    const results = [];
    
    if (hasTranslationFn) {
        testWords.forEach(word => {
            const translated = env._t(word);
            const isTranslated = translated !== word;
            console.log(`   "${word}" → "${translated}" ${isTranslated ? "✅" : "⚠️"}`);
            
            results.push({
                source: word,
                translated: translated,
                isTranslated: isTranslated
            });
        });
    } else {
        console.error("   ❌ Cannot test - translation function missing");
    }
    
    diagnostics.sections.push({
        name: "Translation Tests",
        translations: results
    });
    
    // 5. Localization Service
    console.log("\n%c5️⃣  LOCALIZATION SERVICE", "color: yellow; font-weight: bold;");
    const localization = env.services?.localization;
    
    if (localization) {
        console.log("   ✅ Localization service found");
        console.log(`   Date Format: ${localization.dateFormat}`);
        console.log(`   Time Format: ${localization.timeFormat}`);
        console.log(`   Decimal Point: ${localization.decimalPoint}`);
        console.log(`   Thousands Separator: ${localization.thousandsSeparator}`);
    } else {
        console.warn("   ⚠️  Localization service not found");
    }
    
    diagnostics.sections.push({
        name: "Localization",
        status: localization ? "FOUND" : "NOT_FOUND"
    });
    
    // 6. User Info
    console.log("\n%c6️⃣  USER INFORMATION", "color: yellow; font-weight: bold;");
    const user = window.posmodel.user;
    
    if (user) {
        console.log(`   User ID: ${user.id}`);
        console.log(`   User Name: ${user.name}`);
        console.log(`   User Language: ${user.lang || "NOT SET"}`);
    } else {
        console.error("   ❌ User not found");
    }
    
    diagnostics.sections.push({
        name: "User",
        userId: user?.id,
        userName: user?.name,
        userLang: user?.lang
    });
    
    // 7. PoS Configuration
    console.log("\n%c7️⃣  POS CONFIGURATION", "color: yellow; font-weight: bold;");
    const pos = window.posmodel;
    
    console.log(`   Session ID: ${pos.session?.id}`);
    console.log(`   Config ID: ${pos.config?.id}`);
    console.log(`   Config Name: ${pos.config?.name}`);
    
    diagnostics.sections.push({
        name: "PoS Config",
        sessionId: pos.session?.id,
        configId: pos.config?.id,
        configName: pos.config?.name
    });
    
    // 8. Module Factories
    console.log("\n%c8️⃣  MODULE FACTORIES", "color: yellow; font-weight: bold;");
    const factoriesCount = window.odoo.loader.factories?.size || 0;
    console.log(`   Total modules loaded: ${factoriesCount}`);
    
    if (factoriesCount === 0) {
        console.warn("   ⚠️  WARNING: No modules in loader factories!");
    }
    
    diagnostics.sections.push({
        name: "Modules",
        factoriesCount: factoriesCount
    });
    
    // Summary
    console.log("\n%c═══════════════════════════════════════", "color: cyan; font-weight: bold;");
    console.log("%c📊 SUMMARY", "color: cyan; font-weight: bold;");
    console.log("%c═══════════════════════════════════════", "color: cyan; font-weight: bold;");
    
    const criticalIssues = [];
    
    if (!currentLang) {
        criticalIssues.push("❌ Language not set in environment");
    }
    if (!hasTranslationFn) {
        criticalIssues.push("❌ Translation function not available");
    }
    if (!userLang) {
        criticalIssues.push("⚠️  User language not configured");
    }
    if (factoriesCount === 0) {
        criticalIssues.push("❌ No modules loaded");
    }
    
    if (criticalIssues.length === 0) {
        console.log("%c✅ All systems operational!", "color: green; font-weight: bold;");
    } else {
        console.log("%c⚠️  ISSUES FOUND:", "color: red; font-weight: bold;");
        criticalIssues.forEach(issue => console.log(`   ${issue}`));
    }
    
    console.log("\n%c📋 DIAGNOSTIC DATA (for sharing):", "color: blue; font-weight: bold;");
    console.table(diagnostics.sections.map(s => ({
        "Section": s.name,
        "Status": s.status || (s.translations ? `${s.translations.filter(t => t.isTranslated).length}/${s.translations.length} translated` : "INFO")
    })));
    
    // Export for debugging
    window.posTranslationDiagnostics = diagnostics;
    console.log("\n%c💾 Diagnostics saved to: window.posTranslationDiagnostics", "color: magenta;");
    
})();
