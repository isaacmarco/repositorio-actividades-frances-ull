from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .forms import ActividadForm
from .models import Actividad

# admin//admin
# python manage.py makemigrations
# python manage.py migrate
# python manage.py runserver
# página de iconos https://www.flaticon.es/packs/education-633
# .\run.bat

def inicio(request):
    return render(request, 'inicio.html')


@login_required
def buscar_actividades(request):
    curso_seleccionado = request.GET.get('curso')
    if curso_seleccionado in [Actividad.Curso.INFANTIL, Actividad.Curso.PRIMARIA]:
        actividades = Actividad.objects.filter(curso=curso_seleccionado)
    else:
        actividades = Actividad.objects.all() # si no encuentra nada mostramos todas las actividades
    return render(request, 'buscar_actividades.html', {
        'actividades': actividades,
        'curso_seleccionado': curso_seleccionado
    })


@login_required
def mis_actividades(request):
    actividades = Actividad.objects.filter(usuario=request.user)
    return render(request, 'mis_actividades.html', {'actividades': actividades})


@login_required()
def borrar_actividad(request, pk):
    actividad = get_object_or_404(Actividad, id=pk)
    actividad.delete()
    return redirect('mis_actividades')


@login_required
def visor_actividad(request, pk):
    actividad = get_object_or_404(Actividad, id=pk)
    return render(request, 'visor_actividad.html', {'actividad': actividad})


@login_required
def nueva_actividad(request):
    # creamos un registro vacío con lo mínimo y redirigimos al editor
    actividad = Actividad.objects.create(
        usuario = request.user,
        titulo="Escribe un título",
    )
    return redirect('editar_actividad', pk=actividad.pk)


@login_required
def editar_actividad(request, pk):
    actividad = Actividad.objects.get(pk=pk)
    if request.method == "POST":
        form = ActividadForm(request.POST, request.FILES, instance=actividad)
        if form.is_valid():
            form.save()
            # return redirect('mis_actividades')
    else:
        form = ActividadForm(instance=actividad)
    return render(request, "editor_actividad.html", {"form": form})

