from django.apps import AppConfig


class SharedAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "tenant_app"

    def ready(self):
        from . import signals  # noqa: F401
