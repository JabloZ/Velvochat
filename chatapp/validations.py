from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
UserModel = get_user_model()


def validate_request(data):
    who_send = data['who_send']
    who_received = data['who_received']
    
    ##
    if not who_send :
        raise ValidationError('wrong sender')
    ##
    if not who_received:
        raise ValidationError('wrong receiver')
    ##
    return data