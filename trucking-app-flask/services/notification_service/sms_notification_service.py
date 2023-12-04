# sms_notification_service.py

from .inotification_service import INotificationService

class SMSNotificationService(INotificationService):
    def send_operator_verification(self, operator, token, company_name):
        # Logic to send SMS
        print(f"Sending SMS: HELLO WOROD")
