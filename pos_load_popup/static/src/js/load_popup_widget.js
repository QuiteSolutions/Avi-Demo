import { Component, useState } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { BasePopupWidget } from "pos_base_popup/static/src/js/popup_widget";

/**
 * LoadPopupWidget
 * 
 * Extends the BasePopupWidget to add:
 * - Text input field
 * - Live preview text below the input
 * - Real-time updates as user types
 * - State management for input and preview
 */
export class LoadPopupWidget extends BasePopupWidget {
    static template = "pos_load_popup.LoadPopupWidget";

    setup() {
        super.setup();
        
        // State management for input field and live preview
        this.state = useState({
            inputValue: "",
            previewText: "Preview will appear here...",
            characterCount: 0,
        });
    }

    /**
     * Handle input field changes
     * Updates preview text in real-time
     */
    onInputChange(event) {
        const value = event.target.value;
        this.state.inputValue = value;
        this.state.characterCount = value.length;
        
        // Update preview text
        if (value.trim() === "") {
            this.state.previewText = "Preview will appear here...";
        } else {
            this.state.previewText = value;
        }
    }

    /**
     * Clear the input field and preview
     */
    onClearInput() {
        this.state.inputValue = "";
        this.state.previewText = "Preview will appear here...";
        this.state.characterCount = 0;
    }

    /**
     * Format the preview text (example: uppercase)
     */
    onFormatUppercase() {
        this.state.previewText = this.state.inputValue.toUpperCase();
    }

    /**
     * Format the preview text (example: lowercase)
     */
    onFormatLowercase() {
        this.state.previewText = this.state.inputValue.toLowerCase();
    }

    /**
     * Capitalize each word
     */
    onFormatCapitalize() {
        const formatted = this.state.inputValue
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        this.state.previewText = formatted;
    }
}

// Patch the base popup widget to include load popup functionality
patch(BasePopupWidget.prototype, {
    /**
     * Extended initialization to support load popup features
     */
    setup() {
        // Call original setup
        this.constructor._original_setup?.call(this);
        
        // Add state for extended features
        if (!this.state) {
            this.state = {};
        }
        
        this.state.showPreview = false;
        this.state.previewMode = "live"; // 'live' or 'manual'
    },
});
