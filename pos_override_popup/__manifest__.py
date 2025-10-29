# -*- coding: utf-8 -*-
{
    'name': 'PoS Override Popup',
    'version': '18.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Override popup widget without calling super methods',
    'description': """
        Override popup widget for Odoo 18 Point of Sale.
        Demonstrates inheritance pattern without super() calls.
        Completely replaces base functionality with custom behavior.
    """,
    'depends': ['pos_base_popup'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_override_popup/static/src/js/override_popup_widget.js',
        ],
    },
    'author': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
