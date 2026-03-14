"""
Contact app models.
"""

from django.db import models


class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        db_table = 'contact_messages'
        ordering = ['-date']

    def __str__(self):
        return f"Message from {self.name} - {self.date.strftime('%Y-%m-%d')}"
