# Generated by Django 3.2.8 on 2021-10-30 21:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_rename_xml_file_userkyc_zip_file'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userkyc',
            old_name='zip_file',
            new_name='datafile',
        ),
    ]