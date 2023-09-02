from .user import user
from .forgot_password import forgot_password

user.register_blueprint(forgot_password, url_prefix="/forgot_password")
