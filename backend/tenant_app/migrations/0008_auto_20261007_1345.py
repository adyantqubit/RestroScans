# Generated to reconcile the existing RestroScans model state with migration history.
# This migration records model changes that already exist in the project models.

from django.db import migrations, models
import django.core.validators
import tenant_app.validators


class Migration(migrations.Migration):

    dependencies = [
        ('tenant_app', '0007_auto_20230521_1546'),
    ]

    operations = [
        migrations.CreateModel(
            name='RatingReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.DecimalField(blank=True, decimal_places=1, max_digits=2, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5.0)])),
                ('review', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Rating and Review',
                'verbose_name_plural': 'n) Rating and Review',
            },
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='email address')),
                ('contact_number', models.CharField(max_length=10, validators=[tenant_app.validators.validate_mobile_number])),
                ('number_of_person', models.CharField(blank=True, max_length=255, null=True)),
                ('special_instructions', models.TextField(blank=True, null=True)),
                ('date', models.DateField(blank=True, null=True, verbose_name='Date')),
                ('time', models.TimeField(blank=True, null=True)),
                ('table_number', models.CharField(blank=True, max_length=255, null=True)),
                ('reservation_status', models.CharField(choices=[('Pending', 'Pending'), ('Confirm', 'Confirm')], default='Pending', max_length=100)),
            ],
            options={
                'verbose_name': 'Reservation',
                'verbose_name_plural': 'L) Reservation',
            },
        ),
        migrations.CreateModel(
            name='SocialLinks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('social_media_name', models.CharField(blank=True, max_length=255, null=True)),
                ('social_media_link', models.TextField(default='')),
                ('social_media_icon', models.ImageField(default='', upload_to='social/', validators=[django.core.validators.validate_image_file_extension])),
            ],
            options={
                'verbose_name': 'Social Link',
                'verbose_name_plural': 'M) Social Links',
            },
        ),
        migrations.CreateModel(
            name='Waiter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('contact_number', models.CharField(max_length=15, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('password', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='customerdetail',
            name='loyality_points',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AddField(
            model_name='offer',
            name='date',
            field=models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='Date & Time'),
        ),
        migrations.AddField(
            model_name='offer',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='apply_loyality_point',
            field=models.IntegerField(blank=True, default=0, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AddField(
            model_name='order',
            name='cancel_reason',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='order',
            name='cancelled_by',
            field=models.CharField(default='---', max_length=100),
        ),
        migrations.AddField(
            model_name='order',
            name='customer_email',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='customer_name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='discount_percentage',
            field=models.FloatField(blank=True, default=0.0, validators=[tenant_app.validators.validate_discount_precentage], verbose_name='Discount in (%)'),
        ),
        migrations.AddField(
            model_name='order',
            name='discount_reason',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='order',
            name='discount_rupees',
            field=models.FloatField(blank=True, default=0.0, validators=[tenant_app.validators.validate_discount_rupees], verbose_name='Discount in (₹)'),
        ),
        migrations.AddField(
            model_name='order',
            name='final_amount',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='loyality_point_calculated',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='loyality_point_price',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='loyality_point_status',
            field=models.CharField(blank=True, choices=[('is used', 'is used'), ('not used', 'not used')], default='not used', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='order_created_by',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='rating',
            field=models.DecimalField(blank=True, decimal_places=1, max_digits=2, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5.0)]),
        ),
        migrations.AddField(
            model_name='order',
            name='send_notification_on_tableNum_update',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='order',
            name='send_notifications_on_amount_update',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='send_notifications_on_order_update',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='send_notifications_on_payment_update',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='waiter_contact_number',
            field=models.CharField(blank=True, default='', max_length=15, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='waiter_name',
            field=models.CharField(blank=True, default='', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='cancel_reason',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='kot_print_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='send_notifications_on_item_update',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='setting',
            name='allow_loyality_points',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='setting',
            name='amount_for_single_loyality_point',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Loyality point calculation amount(Rs.)'),
        ),
        migrations.AddField(
            model_name='setting',
            name='discount_in',
            field=models.CharField(choices=[('Discount in (₹)', 'Discount in (₹)'), ('Discount in (%)', 'Discount in (%)')], default='Discount in (₹)', max_length=255),
        ),
        migrations.AddField(
            model_name='setting',
            name='per_loyality_point_value',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Value of single loyality point(Rs.)'),
        ),
        migrations.AlterField(
            model_name='description',
            name='content',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AlterField(
            model_name='offer',
            name='discount',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='Discount(%)'),
        ),
        migrations.AlterField(
            model_name='order',
            name='order_status',
            field=models.CharField(choices=[('Placed', 'Placed'), ('Confirm', 'Confirm'), ('Cooked', 'Cooked'), ('Served', 'Served'), ('Cancelled', 'Cancelled')], default='Placed', max_length=100),
        ),
        migrations.AlterField(
            model_name='order',
            name='payment_mode',
            field=models.CharField(blank=True, default='Cash', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='payment_status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Completed', 'Completed'), ('Paid', 'Paid')], default='Pending', max_length=100),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='item_status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Confirm', 'Confirm'), ('Cancelled', 'Cancelled')], default='Pending', max_length=100),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='quantity',
            field=models.IntegerField(default=0, validators=[tenant_app.validators.validate_qunatity]),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='serving_size',
            field=models.CharField(choices=[('Half', 'Half'), ('Full', 'Full')], max_length=255),
        ),
    ]
