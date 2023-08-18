from django.utils import timezone
import datetime
import pytz
from .models import Profile

class UpdateLastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.user.is_authenticated:
            
            prof=Profile.objects.get(user=request.user)
            prof.last_activity=datetime.datetime.now(pytz.utc)
            
            prof.save()

        return response