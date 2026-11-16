import django.db.models.deletion
from django.db import migrations, models

import admin_app.plan_catalog as catalog


def copy_features_onto_each_tenant(apps, schema_editor):
    """Give every restaurant its own copy of its plan's features."""
    PlanFeature = apps.get_model('admin_app', 'PlanFeature')
    Tenant = apps.get_model('admin_app', 'Tenant')
    grouped = {}
    for plan, feature in PlanFeature.objects.values_list('plan', 'feature'):
        grouped.setdefault(plan, set()).add(feature)
    PlanFeature.objects.all().delete()
    for tenant in Tenant.objects.exclude(schema_name='public'):
        plan = (tenant.Subscribe_plan or '').strip().lower()
        if plan not in catalog.PLAN_DEFAULTS:
            plan = 'starter'
        features = grouped.get(plan) or set(catalog.PLAN_DEFAULTS[plan])
        for feature in features:
            if feature in catalog.KNOWN_CODES:
                PlanFeature.objects.create(tenant_id=tenant.id, plan=plan, feature=feature)


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0008_planfeature'),
    ]

    operations = [
        migrations.AddField(
            model_name='planfeature',
            name='tenant',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='plan_features',
                to='admin_app.tenant',
            ),
        ),
        migrations.AlterUniqueTogether(
            name='planfeature',
            unique_together=set(),
        ),
        migrations.RunPython(copy_features_onto_each_tenant, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='planfeature',
            name='plan',
        ),
        migrations.AlterField(
            model_name='planfeature',
            name='tenant',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='plan_features',
                to='admin_app.tenant',
            ),
        ),
        migrations.AlterUniqueTogether(
            name='planfeature',
            unique_together={('tenant', 'feature')},
        ),
        migrations.AlterModelOptions(
            name='planfeature',
            options={'verbose_name': 'Plan feature', 'verbose_name_plural': 'Plan features'},
        ),
        migrations.AlterField(
            model_name='tenant',
            name='Subscribe_plan',
            field=models.CharField(
                blank=True,
                choices=catalog.PLAN_CHOICES,
                default='',
                help_text="Sets this restaurant's starting features. Other restaurants are not changed.",
                max_length=50,
            ),
        ),
    ]
