/** @odoo-module **/

import { Component, onWillStart, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

/**
 * GitInfoFooter Component
 * Displays git branch, commit, and Odoo version information
 * in a fixed footer at the bottom-left of the screen.
 */
export class GitInfoFooter extends Component {
    static template = "git_info_footer.GitInfoFooter";
    static props = {};

    setup() {
        this.rpc = useService("rpc");
        this.state = useState({
            gitBranch: "loading...",
            gitCommit: "loading...",
            odooVersion: "loading...",
            loaded: false,
        });

        onWillStart(async () => {
            await this.loadGitInfo();
        });
    }

    async loadGitInfo() {
        try {
            const result = await this.rpc("/git_info_footer/get_info", {});
            this.state.gitBranch = result.git_branch || "unknown";
            this.state.gitCommit = result.git_commit || "unknown";
            this.state.odooVersion = result.odoo_version || "unknown";
            this.state.loaded = true;
        } catch (error) {
            console.error("Failed to load git info:", error);
            this.state.gitBranch = "error";
            this.state.gitCommit = "error";
            this.state.odooVersion = "error";
            this.state.loaded = true;
        }
    }

    get displayText() {
        return `freeText | ${this.state.gitBranch}/${this.state.gitCommit} | ${this.state.odooVersion}`;
    }
}

// Register the component in the main components registry
registry.category("main_components").add("GitInfoFooter", {
    Component: GitInfoFooter,
});
