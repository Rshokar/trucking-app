# inotification_service.py

class INotificationService:
    def send_notification(self, message):
        raise NotImplementedError("This method should be overridden in subclasses.")
