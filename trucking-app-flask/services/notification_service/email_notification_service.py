# email_notification_service.py

from .inotification_service import INotificationService

class EmailNotificationService(INotificationService):
    def send_notification(self, message):
        # Logic to send Email
        print(f"Sending Email: {message}")
