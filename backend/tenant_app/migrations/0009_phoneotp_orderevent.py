from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tenant_app', '0008_auto_20261007_1345'),
    ]

    operations = [
        migrations.CreateModel(
            name='PhoneOtp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone', models.CharField(max_length=15)),
                ('code_hash', models.CharField(max_length=64)),
                ('attempts', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField()),
                ('consumed_at', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.AddIndex(
            model_name='phoneotp',
            index=models.Index(fields=['phone', 'created_at'], name='tenant_app_phone_phone_idx'),
        ),
        migrations.CreateModel(
            name='OrderEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_type', models.CharField(max_length=50)),
                ('order_status', models.CharField(blank=True, default='', max_length=100)),
                ('payment_status', models.CharField(blank=True, default='', max_length=100)),
                ('actor', models.CharField(blank=True, default='', max_length=80)),
                ('summary', models.CharField(blank=True, default='', max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='tenant_app.order')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]
