from django.db import migrations, models

import admin_app.plan_catalog as catalog


def copy_plan_features(apps, schema_editor):
    """Move each restaurant's plan and each plan's features onto the single PlanFeature table."""
    Plans = apps.get_model('admin_app', 'Plans')
    Features = apps.get_model('admin_app', 'Features')
    PlannedFeatures = apps.get_model('admin_app', 'PlannedFeatures')
    PlanFeature = apps.get_model('admin_app', 'PlanFeature')
    Tenant = apps.get_model('admin_app', 'Tenant')

    plan_names = {plan.id: (plan.plan_name or '').strip().lower() for plan in Plans.objects.all()}
    feature_codes = {feature.id: (feature.code or '').strip() for feature in Features.objects.all()}
    known_plans = {name for name, _label in catalog.PLAN_CHOICES}

    for tenant in Tenant.objects.all():
        name = plan_names.get(tenant.Subscribe_plan_id, '')
        tenant.subscribe_plan_name = name if name in known_plans else ''
        tenant.save(update_fields=['subscribe_plan_name'])

    seen = set()
    for row in PlannedFeatures.objects.all():
        plan = plan_names.get(row.plan_selected_id, '')
        feature = feature_codes.get(row.feature_selected_id, '')
        if plan not in known_plans or feature not in catalog.KNOWN_CODES or (plan, feature) in seen:
            continue
        seen.add((plan, feature))
        PlanFeature.objects.create(plan=plan, feature=feature)


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0007_plan_feature_choices'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlanFeature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan', models.CharField(choices=catalog.PLAN_CHOICES, max_length=50)),
                ('feature', models.CharField(choices=catalog.FEATURE_CHOICES, max_length=50)),
            ],
            options={
                'verbose_name_plural': 'Plan features',
                'unique_together': {('plan', 'feature')},
            },
        ),
        migrations.AddField(
            model_name='tenant',
            name='subscribe_plan_name',
            field=models.CharField(blank=True, choices=catalog.PLAN_CHOICES, default='', max_length=50),
        ),
        migrations.RunPython(copy_plan_features, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='tenant',
            name='Subscribe_plan',
        ),
        migrations.RenameField(
            model_name='tenant',
            old_name='subscribe_plan_name',
            new_name='Subscribe_plan',
        ),
        migrations.DeleteModel(name='PlannedFeatures'),
        migrations.DeleteModel(name='Features'),
        migrations.DeleteModel(name='Plans'),
    ]
