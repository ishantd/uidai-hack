# Generated by Django 3.2.8 on 2021-10-30 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('address', '0005_auto_20211030_2322'),
    ]

    operations = [
        migrations.AddField(
            model_name='tenantrequesttolandlord',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
