from django.db import migrations, models


def seed_plans(apps, schema_editor):
    from admin_app.plan_catalog import seed_catalog
    seed_catalog(apps)


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0005_admin_app_state_sync'),
    ]

    operations = [
        migrations.AddField(
            model_name='features',
            name='code',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
        migrations.RunPython(seed_plans, migrations.RunPython.noop),
    ]
