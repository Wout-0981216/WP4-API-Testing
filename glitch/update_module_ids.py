import uuid
from django.core.management.base import BaseCommand
from game.models import Modules

class Command(BaseCommand):
    help = 'Update existing module IDs to valid UUIDs'

    def handle(self, *args, **kwargs):
        modules = Modules.objects.all()
        for module in modules:
            if not self.is_valid_uuid(module.id):
                module.id = uuid.uuid4()
                module.save()
                self.stdout.write(self.style.SUCCESS(f'Updated module {module.naam} with new UUID'))

    def is_valid_uuid(self, value):
        try:
            uuid.UUID(str(value))
            return True
        except ValueError:
            return False
