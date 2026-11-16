from django.db import migrations, models
from django.utils import timezone
import ckeditor.fields


def column_exists(schema_editor, model, column_name):
    # Avoid tenant_schemas introspection compatibility issue with newer PostgreSQL.
    # Query PostgreSQL catalog directly in the CURRENT schema.
    table_name = model._meta.db_table
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = current_schema()
              AND table_name = %s
              AND column_name = %s
            LIMIT 1
            """,
            [table_name, column_name],
        )
        return cursor.fetchone() is not None


def add_adyant_support_link_if_missing(apps, schema_editor):
    model = apps.get_model("admin_app", "AppSetting")
    if column_exists(schema_editor, model, "adyant_support_link"):
        return

    field = models.CharField(blank=True, default="", max_length=255, null=True)
    field.set_attributes_from_name("adyant_support_link")
    schema_editor.add_field(model, field)


def add_created_at_if_missing(apps, schema_editor):
    model = apps.get_model("admin_app", "GetRestroscansRequest")
    if column_exists(schema_editor, model, "created_at"):
        return

    field = models.DateTimeField(null=True)
    field.set_attributes_from_name("created_at")
    schema_editor.add_field(model, field)

    table = schema_editor.quote_name(model._meta.db_table)
    column = schema_editor.quote_name("created_at")
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            f"UPDATE {table} SET {column} = %s WHERE {column} IS NULL",
            [timezone.now()],
        )
        cursor.execute(
            f"ALTER TABLE {table} ALTER COLUMN {column} SET NOT NULL"
        )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("admin_app", "0004_auto_20230521_1546"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="gallerysettings",
            options={
                "verbose_name": "Gallery settings",
                "verbose_name_plural": "Gallery settings",
            },
        ),
        migrations.AlterModelOptions(
            name="pricingplans",
            options={"verbose_name_plural": "Pricing plans"},
        ),
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(
                    add_adyant_support_link_if_missing,
                    noop_reverse,
                ),
            ],
            state_operations=[
                migrations.AddField(
                    model_name="appsetting",
                    name="adyant_support_link",
                    field=models.CharField(
                        blank=True,
                        default="",
                        max_length=255,
                        null=True,
                    ),
                ),
            ],
        ),
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(add_created_at_if_missing, noop_reverse),
            ],
            state_operations=[
                migrations.AddField(
                    model_name="getrestroscansrequest",
                    name="created_at",
                    field=models.DateTimeField(auto_now_add=True),
                ),
            ],
        ),
        migrations.AlterField(
            model_name="pricingplans",
            name="content",
            field=ckeditor.fields.RichTextField(default="<div></div>"),
        ),
        migrations.AlterField(
            model_name="restaurantrequest",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name="restaurantrequest",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
    ]
