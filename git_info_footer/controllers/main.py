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
        Return git branch, commit hash, Odoo version, and configuration information.
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
            
            # Read configuration from .env file
            free_text = self._get_free_text_from_env()

            # Get addons git info - try multiple methods
            addons_branch = 'unknown'
            addons_commit = 'unknown'
            
            try:
                module_root = os.path.dirname(os.path.dirname(__file__))
                
                # Method 1: Check for deployment info in .env file
                deployment_info = self._get_deployment_info_from_env()
                if deployment_info['branch'] != 'unknown':
                    addons_branch = deployment_info['branch']
                    addons_commit = deployment_info['commit']
                
                # Method 2: Try git commands if .git exists and deployment info not found
                elif os.path.isdir(os.path.join(module_root, '.git')):
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
                    # Method 3: Parse from directory path (for deployed servers)
                    # Look for patterns like: /path/to/avi-demo.git-69034f295d6c2
                    current_path = os.path.abspath(module_root)
                    
                    # Check if we're in a path that contains git info
                    import re
                    
                    # Pattern: {repo-name}.git-{commit}
                    git_pattern = r'([^/\\]+)\.git-([a-f0-9]+)'
                    match = re.search(git_pattern, current_path)
                    
                    if match:
                        addons_branch = match.group(1)  # e.g., "avi-demo"
                        addons_commit = match.group(2)  # e.g., "69034f295d6c2"
                    else:
                        # Method 4: Try parent directory (workspace)
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
                'free_text': free_text,
            }
        except Exception as e:
            return {
                'git_branch': 'error',
                'git_commit': 'error',
                'odoo_version': 'error',
                'addons_branch': 'error',
                'addons_commit': 'error',
                'free_text': 'freeText',  # fallback
                'error': str(e)
            }

    def _get_deployment_info_from_env(self):
        """
        Read deployment information from .env file.
        """
        try:
            # Try to find .env file in common locations
            possible_paths = [
                os.path.join(os.getcwd(), '.env'),
                os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'),
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'),
            ]
            
            for env_path in possible_paths:
                if os.path.isfile(env_path):
                    # Read file once and parse all variables
                    branch = 'unknown'
                    commit = 'unknown'
                    
                    with open(env_path, 'r', encoding='utf-8') as f:
                        for line in f:
                            line = line.strip()
                            if line.startswith('DEPLOYMENT_BRANCH='):
                                branch = line.split('=', 1)[1].strip().strip('"').strip("'")
                            elif line.startswith('DEPLOYMENT_COMMIT='):
                                commit = line.split('=', 1)[1].strip().strip('"').strip("'")
                    
                    # Return if we found at least one deployment variable
                    if branch != 'unknown' or commit != 'unknown':
                        return {
                            'branch': branch,
                            'commit': commit
                        }
            
            # Fallback if .env not found or variables not in it
            return {'branch': 'unknown', 'commit': 'unknown'}
            
        except Exception:
            return {'branch': 'unknown', 'commit': 'unknown'}

    def _get_free_text_from_env(self):
        """
        Read FREE_TEXT from .env file, with fallback to default value.
        """
        try:
            # Try to find .env file in common locations
            possible_paths = [
                os.path.join(os.getcwd(), '.env'),
                os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'),
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'),
            ]
            
            for env_path in possible_paths:
                if os.path.isfile(env_path):
                    with open(env_path, 'r', encoding='utf-8') as f:
                        for line in f:
                            line = line.strip()
                            if line.startswith('FREE_TEXT='):
                                return line.split('=', 1)[1].strip().strip('"').strip("'")
            
            # Fallback to default if .env not found or FREE_TEXT not in it
            return 'freeText'
            
        except Exception as e:
            # If any error occurs, return default
            return 'freeText'
