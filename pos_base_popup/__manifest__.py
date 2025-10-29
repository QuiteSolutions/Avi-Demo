# -*- coding: utf-8 -*-
{
    'name': 'PoS Base Popup',
    'version': '18.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Base popup widget for Point of Sale',
    'description': """
        Base popup widget component for Odoo 18 Point of Sale.
        Provides a foundation for popup inheritance patterns.
    """,
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_base_popup/static/src/js/popup_widget.js',
            'pos_base_popup/static/src/js/popup_widget.xml',
        ],
    },
    'data': [],
    'author': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
