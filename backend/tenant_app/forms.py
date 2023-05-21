# Created by- Suman sahu  On 07/05/2023
# reason- change django default image field character validation message

from django import forms
from tenant_app.models import *

# Added by- Suman sahu  On 07/05/2023
# reason- change django default image field character validation message
class PaymentMethodForm(forms.ModelForm):
        class Meta:
            model = PaymentMethod
            fields = '__all__'
            error_messages = {
                'scanner': {
                    'max_length': ('Filename should be below 100 characters'),
                },
            }

class MenuForm(forms.ModelForm):
        class Meta:
            model = Menu
            fields = '__all__'
            error_messages = {
                'icon': {
                    'max_length': ('Filename should be below 100 characters'),
                },
            }

class CategoryForm(forms.ModelForm):
        class Meta:
            model = Category
            fields = '__all__'
            error_messages = {
                'icon': {
                    'max_length': ('Filename should be below 100 characters'),
                },
            }

class ItemForm(forms.ModelForm):
        class Meta:
            model = Item
            fields = '__all__'
            error_messages = {
                'icon': {
                    'max_length': ('Filename should be below 100 characters'),
                },
            }

class OfferForm(forms.ModelForm):
        class Meta:
            model = Offer
            fields = '__all__'
            error_messages = {
                'offer_image': {
                    'max_length': ('Filename should be below 100 characters'),
                },
            }

# End of added code by-Suman sahu On 07/05/2023

# End of created code by-Suman sahu On 07/05/2023