/** @odoo-module **/

import { Component, onWillStart, onMounted, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { rpc } from "@web/core/network/rpc_service";

/**
 * GitInfoFooter Component
 * Displays git branch, commit, and Odoo version information
 * in a fixed footer at the bottom-left of the screen.
 */
export class GitInfoFooter extends Component {
    static template = "git_info_footer.GitInfoFooter";
    static props = {};

    setup() {
        // Initialize state
        this.state = useState({
            gitBranch: "loading...",
            gitCommit: "loading...",
            addonsBranch: "loading...",
            addonsCommit: "loading...",
            loaded: false,
            error: null,
        });

        // Use onMounted instead of onWillStart for better service availability
        onMounted(async () => {
            await this.loadGitInfo();
        });
    }

    async loadGitInfo() {
        try {
            // Use direct RPC import instead of service - avoids lifecycle issues
            const result = await rpc("/git_info_footer/get_info", {});
            this.state.gitBranch = result.git_branch || "unknown";
            this.state.gitCommit = result.git_commit || "unknown";
            this.state.addonsBranch = result.addons_branch || 'unknown';
            this.state.addonsCommit = result.addons_commit || 'unknown';
            this.state.loaded = true;
            this.state.error = null;
        } catch (error) {
            console.error("Failed to load git info:", error);
            // Provide fallback values
            this.state.gitBranch = "fetch error";
            this.state.gitCommit = "fetch error";
            this.state.addonsBranch = this.getFallbackAddonsBranch();
            this.state.addonsCommit = this.getFallbackAddonsCommit();
            this.state.loaded = true;
            this.state.error = error.message;
        }
    }

    /**
     * Get Odoo version from global objects as fallback
     */
    getFallbackOdooVersion() {
        try {
            // Try to get version from window.odoo
            if (window.odoo && window.odoo.info && window.odoo.info.server_version) {
                return window.odoo.info.server_version;
            }
            
            // Try alternative paths
            if (window.odoo && window.odoo.session_info && window.odoo.session_info.server_version) {
                return window.odoo.session_info.server_version;
            }
            
            return "unknown";
        } catch (error) {
            return "unknown";
        }
    }

    getFallbackAddonsBranch() {
        try {
            // Try to infer branch from window.odoo info if available
            if (window.odoo && window.odoo.info && window.odoo.info.server_version) {
                return 'unknown';
            }
            return 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }

    getFallbackAddonsCommit() {
        return 'unknown';
    }

    get displayText() {
        if (this.state.error) {
            return `freeText | ERROR: ${this.state.error}`;
        }

        if (!this.state.loaded) {
            return "freeText | Loading...";
        }

        // Display addons branch and commit (addons-branch/addons-git-commit)
        return `freeText | ${this.state.addonsBranch}/${this.state.addonsCommit}`;
    }

    /**
     * Get CSS class based on current state
     */
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

// Register the component in the main components registry
registry.category("main_components").add("GitInfoFooter", {
    Component: GitInfoFooter,
    sequence: 100, // Ensure it loads after core components
});
