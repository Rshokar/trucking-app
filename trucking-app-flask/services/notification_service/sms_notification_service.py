# sms_notification_service.py

from .inotification_service import INotificationService

class SMSNotificationService(INotificationService):
    def send_notification(self, message):
        # Logic to send SMS
        print(f"Sending SMS: {message}")
