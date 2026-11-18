from django.db import migrations

import admin_app.theme_catalog as theme_catalog


def seed_default_themes(apps, schema_editor):
    AppTheme = apps.get_model('admin_app', 'AppTheme')
    theme_catalog.ensure_default_themes(AppTheme)


def noop_reverse(apps, schema_editor):
    # Keep built-in themes; restaurants may already reference them.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0010_plan_defaults_and_extras'),
    ]

    operations = [
        migrations.RunPython(seed_default_themes, noop_reverse),
    ]
