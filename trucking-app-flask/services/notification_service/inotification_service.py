# inotification_service.py

class INotificationService:
    def send_operator_verification(self, operator, token, company_name):
        raise NotImplementedError("This method should be overridden in subclasses.")
    
    def send_operator_verification_update_contact_method(self, operator, token, company_name): 
        raise NotImplementedError("This method should be overridden in subclasses.")
    
    
    def send_operator_rfo(self, rfo, operator, dispatch, company, token):
        raise NotImplementedError("This method should be overridden in subclasses.")
    
    def send_operator_rfo_update(self, rfo, operator, dispatch, company, token):
        raise NotImplementedError("This method should be overridden in subclasses.")
        