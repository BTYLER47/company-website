from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'date', 'is_read']
    list_filter = ['is_read']
    search_fields = ['name', 'email', 'message']
    list_editable = ['is_read']
    readonly_fields = ['date']
