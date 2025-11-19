from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('buscar-actividades/', views.buscar_actividades, name='buscar_actividades'),
    path('mis-actividades/', views.mis_actividades, name='mis_actividades'),
    path('actividad/<int:actividad_id>/', views.visor_actividad, name='visor_actividad'),
    path('actividad/<int:pk>/editar/', views.editar_actividad, name='editar_actividad'),
]
