from django.db import migrations, models

import admin_app.plan_catalog as catalog


def tidy_rows(apps, schema_editor):
    """Give every row a valid, unique plan name / feature code before the stricter fields apply."""
    Plans = apps.get_model('admin_app', 'Plans')
    Features = apps.get_model('admin_app', 'Features')
    PlannedFeatures = apps.get_model('admin_app', 'PlannedFeatures')
    Tenant = apps.get_model('admin_app', 'Tenant')

    plan_names = {name for name, _label in catalog.PLAN_CHOICES}
    kept_plans = {}
    for plan in Plans.objects.order_by('id'):
        name = (plan.plan_name or '').strip().lower()
        if name not in plan_names or name in kept_plans:
            # A misspelled or duplicate plan: its restaurants fall back to the plan kept for that name, or to none.
            target = kept_plans.get(name)
            Tenant.objects.filter(Subscribe_plan_id=plan.id).update(Subscribe_plan=target)
            plan.delete()
            continue
        kept_plans[name] = plan
        if plan.plan_name != name:
            plan.plan_name = name
            plan.save(update_fields=['plan_name'])

    kept_features = {}
    for feature in Features.objects.order_by('id'):
        code = (feature.code or '').strip() or catalog.feature_code(feature.feature_name)
        if code not in catalog.KNOWN_CODES or code in kept_features:
            feature.delete()
            continue
        kept_features[code] = feature
        feature.code = code
        feature.feature_name = catalog.FEATURE_LABELS[code]
        feature.save(update_fields=['code', 'feature_name'])

    seen = set()
    for row in PlannedFeatures.objects.order_by('id'):
        key = (row.plan_selected_id, row.feature_selected_id)
        if key in seen or None in key:
            row.delete()
        seen.add(key)

    catalog.seed_catalog(apps)


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0006_plan_catalog'),
    ]

    operations = [
        migrations.RunPython(tidy_rows, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='plans',
            name='plan_name',
            field=models.CharField(choices=catalog.PLAN_CHOICES, max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='features',
            name='code',
            field=models.CharField(choices=catalog.FEATURE_CHOICES, max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='features',
            name='feature_name',
            field=models.CharField(blank=True, default='', editable=False, max_length=50),
        ),
        migrations.AlterUniqueTogether(
            name='plannedfeatures',
            unique_together={('plan_selected', 'feature_selected')},
        ),
    ]
