from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tenant_app', '0032_setting_login_background_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='waiter',
            name='contact_number',
            field=models.CharField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='staffemployee',
            name='phone',
            field=models.CharField(blank=True, max_length=254),
        ),
    ]
