# -*- coding: utf-8 -*-
{
    'name': 'PoS Load Popup',
    'version': '18.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Extended popup with live input preview',
    'description': """
        Extended popup widget for Odoo 18 Point of Sale.
        Adds a text input field with live preview display below it.
        Updates preview text in real-time as user types.
    """,
    'depends': ['pos_base_popup', 'pos_extended_popup', 'pos_override_popup'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_load_popup/static/src/js/load_popup_widget.js',
            'pos_load_popup/static/src/xml/load_popup_widget.xml',
        ],
    },
    'author': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
