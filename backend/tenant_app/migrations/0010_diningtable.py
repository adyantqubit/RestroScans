from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tenant_app', '0009_phoneotp_orderevent'),
    ]

    operations = [
        migrations.CreateModel(
            name='DiningTable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('seats', models.PositiveIntegerField(default=4)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Table',
                'verbose_name_plural': 'Tables',
                'ordering': ['name'],
            },
        ),
    ]
