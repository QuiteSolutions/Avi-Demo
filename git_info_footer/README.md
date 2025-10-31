# Git Info Footer Module

## Description

This Odoo 18 module displays git and system information in a fixed footer at the bottom-left corner of all Odoo backend screens.

## Features

- **Fixed Position**: The information div is always visible at the bottom-left of the screen
- **Git Information**: Displays current git branch and commit hash
- **Odoo Version**: Shows the current Odoo version
- **Non-intrusive**: Semi-transparent background with small, readable text
- **Always Visible**: Stays in place even when scrolling

## Display Format

```
freeText | {git-branch}/{git-commit} | {odoo-version}
```

Example:
```
freeText | main/abc1234 | 18.0
```

## Installation

1. Copy the `git_info_footer` module to your Odoo addons directory
2. Update the apps list in Odoo
3. Install the "Git Info Footer" module

## Technical Details

### Components

- **Python Controller** (`controllers/main.py`): Provides a JSON endpoint that fetches git and Odoo information
- **OWL Component** (`static/src/js/git_info_footer.js`): Frontend component that displays the information
- **XML Template** (`static/src/xml/git_info_footer.xml`): Template for rendering the footer
- **CSS Styling** (`static/src/css/git_info_footer.css`): Styling for the bottom-left fixed position

### How It Works

1. The OWL component is registered in the `main_components` registry, making it available across all backend views
2. On component initialization, it calls the `/git_info_footer/get_info` endpoint
3. The Python controller executes git commands to retrieve branch and commit information
4. The component displays the information in a fixed div at the bottom-left

## Dependencies

- `web` (Odoo web module)

## Author

Your Company

## License

LGPL-3
