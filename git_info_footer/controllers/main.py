# -*- coding: utf-8 -*-

import subprocess
import os
from odoo import http
from odoo.http import request
import odoo


class GitInfoController(http.Controller):
    
    @http.route('/git_info_footer/get_info', type='json', auth='user')
    def get_git_info(self):
        """
        Return git branch, commit hash, and Odoo version information.
        """
        try:
            # Try to get git info from Odoo installation directory
            # First attempt: Odoo package location
            odoo_root = os.path.dirname(os.path.dirname(odoo.__file__))
            
            # If that doesn't work, try the current working directory
            if not os.path.isdir(os.path.join(odoo_root, '.git')):
                odoo_root = os.getcwd()
            
            # Get git branch
            try:
                git_branch = subprocess.check_output(
                    ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
                    cwd=odoo_root,
                    stderr=subprocess.DEVNULL,
                    text=True,
                    timeout=5
                ).strip()
            except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
                git_branch = 'unknown'
            
            # Get git commit (short hash)
            try:
                git_commit = subprocess.check_output(
                    ['git', 'rev-parse', '--short', 'HEAD'],
                    cwd=odoo_root,
                    stderr=subprocess.DEVNULL,
                    text=True,
                    timeout=5
                ).strip()
            except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
                git_commit = 'unknown'
            
            # Get Odoo version/commit
            odoo_version = odoo.release.version

            # Additionally, try to get git info for the addons (this module)
            try:
                module_root = os.path.dirname(os.path.dirname(__file__))
                # If module root is not a git repo, try the parent (workspace) dir
                addons_branch = 'unknown'
                addons_commit = 'unknown'
                if os.path.isdir(os.path.join(module_root, '.git')):
                    addons_branch = subprocess.check_output(
                        ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
                        cwd=module_root,
                        stderr=subprocess.DEVNULL,
                        text=True,
                        timeout=5
                    ).strip()
                    addons_commit = subprocess.check_output(
                        ['git', 'rev-parse', '--short', 'HEAD'],
                        cwd=module_root,
                        stderr=subprocess.DEVNULL,
                        text=True,
                        timeout=5
                    ).strip()
                else:
                    # try workspace / current working directory as fallback
                    cwd = os.getcwd()
                    if os.path.isdir(os.path.join(cwd, '.git')):
                        addons_branch = subprocess.check_output(
                            ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
                            cwd=cwd,
                            stderr=subprocess.DEVNULL,
                            text=True,
                            timeout=5
                        ).strip()
                        addons_commit = subprocess.check_output(
                            ['git', 'rev-parse', '--short', 'HEAD'],
                            cwd=cwd,
                            stderr=subprocess.DEVNULL,
                            text=True,
                            timeout=5
                        ).strip()
            except Exception:
                addons_branch = 'unknown'
                addons_commit = 'unknown'

            return {
                'git_branch': git_branch,
                'git_commit': git_commit,
                'odoo_version': odoo_version,
                'addons_branch': addons_branch,
                'addons_commit': addons_commit,
            }
        except Exception as e:
            return {
                'git_branch': 'error',
                'git_commit': 'error',
                'odoo_version': 'error',
                'addons_branch': 'error',
                'addons_commit': 'error',
                'error': str(e)
            }
