# -*- coding: utf-8 -*-
{
    'name': 'PoS Extended Popup',
    'version': '18.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Extended popup widget that calls super methods',
    'description': """
        Extended popup widget for Odoo 18 Point of Sale.
        Demonstrates inheritance pattern with super() calls.
        Extends pos_base_popup functionality while preserving base behavior.
    """,
    'depends': ['pos_base_popup'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_extended_popup/static/src/js/extended_popup_widget.js',
        ],
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
