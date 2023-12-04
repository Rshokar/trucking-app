# notification_service_factory.py

from .sms_notification_service import SMSNotificationService
from .email_notification_service import EmailNotificationService

class NotificationServiceFactory:
    def get_notification_service(self, contact_method):
        if contact_method == "sms":
            return SMSNotificationService()
        elif contact_method == "email":
            return EmailNotificationService()
        else:
            raise ValueError("Unsupported contact method")
