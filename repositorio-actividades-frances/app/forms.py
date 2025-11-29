from django import forms
from .models import Actividad

class ActividadForm(forms.ModelForm):
    class Meta:
        model = Actividad
        fields = ["titulo", "imagen"]
        widgets = {
            'imagen': forms.FileInput(attrs={'class': 'form-control'}),
            'json': forms.HiddenInput(),
        }

