# -*- coding: utf-8 -*-
{
    'name': 'Git Info Footer',
    'version': '18.0.1.0.8',
    'category': 'Technical',
    'summary': 'Display git and system information in bottom-left footer',
    'description': """
        Display git and system information in a fixed footer at the bottom-left of all screens.
        Shows: freeText | {addons-git-branch}/{addons-git-commit} | {odoo-commit}
    """,
    'depends': ['base', 'web'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'git_info_footer/static/src/js/git_info_footer.js',
            'git_info_footer/static/src/xml/git_info_footer.xml',
            'git_info_footer/static/src/css/git_info_footer.css',
        ],
    },
    'author': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
