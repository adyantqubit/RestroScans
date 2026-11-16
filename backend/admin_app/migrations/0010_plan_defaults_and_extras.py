import django.db.models.deletion
from django.db import migrations, models

import admin_app.plan_catalog as catalog


def keep_only_extras(apps, schema_editor):
    """A restaurant keeps a feature as an extra only when its plan does not already include it."""
    PlanFeature = apps.get_model('admin_app', 'PlanFeature')
    Tenant = apps.get_model('admin_app', 'Tenant')
    TenantExtraFeature = apps.get_model('admin_app', 'TenantExtraFeature')
    for row in PlanFeature.objects.all():
        tenant = Tenant.objects.filter(pk=row.tenant_id).first()
        if tenant is None or tenant.schema_name == 'public':
            continue
        plan = (tenant.Subscribe_plan or '').strip().lower()
        if plan not in catalog.PLAN_DEFAULTS:
            plan = 'starter'
        if row.feature in catalog.KNOWN_CODES and row.feature not in catalog.PLAN_DEFAULTS[plan]:
            TenantExtraFeature.objects.get_or_create(tenant_id=tenant.id, feature=row.feature)
    PlanFeature.objects.all().delete()


def seed_plan_defaults(apps, schema_editor):
    PlanFeature = apps.get_model('admin_app', 'PlanFeature')
    if PlanFeature.objects.exists():
        return
    for plan, features in catalog.PLANS:
        for feature in features:
            PlanFeature.objects.create(plan=plan, feature=feature)


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0009_tenant_plan_features'),
    ]

    operations = [
        migrations.CreateModel(
            name='TenantExtraFeature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feature', models.CharField(choices=catalog.FEATURE_CHOICES, max_length=50)),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='extra_features', to='admin_app.tenant')),
            ],
            options={
                'verbose_name': 'Extra feature',
                'verbose_name_plural': 'Extra features',
                'unique_together': {('tenant', 'feature')},
            },
        ),
        migrations.RunPython(keep_only_extras, migrations.RunPython.noop),
        migrations.AlterUniqueTogether(
            name='planfeature',
            unique_together=set(),
        ),
        migrations.RemoveField(
            model_name='planfeature',
            name='tenant',
        ),
        migrations.AddField(
            model_name='planfeature',
            name='plan',
            field=models.CharField(choices=catalog.PLAN_CHOICES, default='starter', max_length=50),
        ),
        migrations.AlterField(
            model_name='planfeature',
            name='plan',
            field=models.CharField(choices=catalog.PLAN_CHOICES, max_length=50),
        ),
        migrations.AlterUniqueTogether(
            name='planfeature',
            unique_together={('plan', 'feature')},
        ),
        migrations.RunPython(seed_plan_defaults, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='tenant',
            name='Subscribe_plan',
            field=models.CharField(
                blank=True,
                choices=catalog.PLAN_CHOICES,
                default='',
                help_text='This restaurant only. Saving a plan here does not change any other restaurant.',
                max_length=50,
            ),
        ),
    ]
