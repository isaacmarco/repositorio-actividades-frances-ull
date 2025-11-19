from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .forms import ActividadForm
from .models import Actividad

# admin//admin
# python manage.py makemigrations
# python manage.py migrate
# python manage.py runserver

@login_required
def mis_actividades(request):
    actividades = Actividad.objects.filter(usuario=request.user)
    return render(request, 'mis_actividades.html', {'actividades': actividades})


def visor_actividad(request, actividad_id):
    actividad = get_object_or_404(Actividad, id=actividad_id)
    return render(request, 'visor_actividad.html', {'actividad': actividad})

def editar_actividad(request, pk):
    actividad = Actividad.objects.get(pk=pk)

    if request.method == "POST":
        form = ActividadForm(request.POST, request.FILES, instance=actividad)
        if form.is_valid():
            # NO borres la imagen manualmente
            form.save()
            return redirect('mis_actividades')

    else:
        form = ActividadForm(instance=actividad)

    return render(request, "actividad_form.html", {"form": form})

