from django.contrib import admin
from .models import Actividad

@admin.register(Actividad)
class ActividadAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'usuario', 'curso', 'mostrar_tags', 'imagen', 'id')
    list_filter = ('curso', 'tags', 'usuario')
    search_fields = ('titulo', 'usuario__username')
    ordering = ('-id',)

    # Si usas JSONField, esto hace que aparezca un editor grande:
    formfield_overrides = {
        # Puedes activar estas líneas si quieres un textarea grande:
        # models.JSONField: {'widget': admin.widgets.AdminTextareaWidget},
    }

    fieldsets = (
        ("Información general", {
            "fields": ("titulo", "usuario", "curso", "tags")
        }),
        ("Contenido", {
            "fields": ("json",)
        }),
        ("Imagen", {
            "fields": ("imagen",)
        }),
    )

    # --- Métodos para mostrar datos en columnas ---

    def mostrar_tags(self, obj):
        """Para mostrar tags de manera legible si las guardas como texto"""
        return ", ".join(obj.tags.split(",")) if obj.tags else "—"
    mostrar_tags.short_description = "Tags"
