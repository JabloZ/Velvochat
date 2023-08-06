from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
import os
from django.core.exceptions import ValidationError

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

def validate_file_extension(data):
    
    ext = os.path.splitext(data.name)[1]  # [0] returns path+filename
    valid_extensions = ['.jpg', '.png', '.mp4', '.mov']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')