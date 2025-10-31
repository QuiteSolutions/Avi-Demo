/** @odoo-module **/

import { Component, onMounted, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

/**
 * GitInfoFooter Component - Odoo 18 Compatible Version
 * Uses lazy loading and direct fetch to avoid service dependency issues
 */
export class GitInfoFooterSafe extends Component {
    static template = "git_info_footer.GitInfoFooter";
    static props = {};

    setup() {
        this.state = useState({
            gitBranch: "loading...",
            gitCommit: "loading...",
            odooVersion: "loading...",
            loaded: false,
            error: null,
        });

        // Use onMounted for better timing - DOM is ready, services are available
        onMounted(() => {
            // Use setTimeout to ensure we're outside the OWL lifecycle
            setTimeout(() => {
                this.loadGitInfoSafe();
            }, 100);
        });
    }

    /**
     * Safe git info loading using native fetch instead of Odoo RPC service
     */
    async loadGitInfoSafe() {
        try {
            // Get CSRF token for the request
            const csrfToken = this.getCsrfToken();
            
            // Use native fetch instead of Odoo RPC service
            const response = await fetch('/git_info_footer/get_info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {},
                    id: Math.floor(Math.random() * 1000000),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message || 'Server error');
            }

            const result = data.result || {};
            this.state.gitBranch = result.git_branch || "unknown";
            this.state.gitCommit = result.git_commit || "unknown";
            this.state.odooVersion = result.odoo_version || this.getFallbackOdooVersion();
            this.state.loaded = true;
            this.state.error = null;
            
        } catch (error) {
            console.error("Failed to load git info:", error);
            this.state.gitBranch = "fetch error";
            this.state.gitCommit = "fetch error";
            this.state.odooVersion = this.getFallbackOdooVersion();
            this.state.loaded = true;
            this.state.error = error.message;
        }
    }

    /**
     * Get CSRF token from various possible sources
     */
    getCsrfToken() {
        // Try multiple sources for CSRF token
        if (window.odoo && window.odoo.csrf_token) {
            return window.odoo.csrf_token;
        }
        
        // Try meta tag
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
            return metaTag.getAttribute('content');
        }
        
        // Try cookie
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrf_token') {
                return value;
            }
        }
        
        return '';
    }

    /**
     * Get Odoo version from global objects as fallback
     */
    getFallbackOdooVersion() {
        try {
            if (window.odoo && window.odoo.info && window.odoo.info.server_version) {
                return window.odoo.info.server_version;
            }
            
            if (window.odoo && window.odoo.session_info && window.odoo.session_info.server_version) {
                return window.odoo.session_info.server_version;
            }
            
            return "18.0"; // Default fallback
        } catch (error) {
            return "18.0";
        }
    }

    get displayText() {
        if (this.state.error) {
            return `freeText | ERROR: ${this.state.error}`;
        }
        
        if (!this.state.loaded) {
            return "freeText | Loading...";
        }
        
        return `freeText | ${this.state.gitBranch}/${this.state.gitCommit} | ${this.state.odooVersion}`;
    }

    get statusClass() {
        if (this.state.error) {
            return "git-info-error";
        }
        if (!this.state.loaded) {
            return "git-info-loading";
        }
        return "git-info-loaded";
    }
}

// Register with lower sequence to load after core components
registry.category("main_components").add("GitInfoFooterSafe", {
    Component: GitInfoFooterSafe,
    sequence: 200, // Load after other components
});