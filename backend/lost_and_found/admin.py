from django.contrib import admin
from django.utils import timezone
from .models import FoundItem, LostReport, ItemReport, PickupSchedule, UserProfile, ClaimRequest

admin.site.register(UserProfile)
admin.site.register(FoundItem)
admin.site.register(LostReport)
admin.site.register(PickupSchedule)

@admin.register(ItemReport)
class ItemReportAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if obj.status == 'approved' and not obj.converted_item:

            found_item = FoundItem.objects.create(
                name=obj.item_name,
                category=obj.category,
                description=obj.description,
                location_found=obj.location_found,
                date_found=obj.date_found,
                photo_url=obj.photo_url,
                image=obj.image,
                reported_by_email=obj.reporter_email,
                custody_status=obj.custody_status,
                status='found',
            )

            obj.converted_item = found_item
            obj.reviewed_at = timezone.now()
        elif obj.status == 'rejected' and not obj.reviewed_at:
            obj.reviewed_at = timezone.now()

        super().save_model(request, obj, form, change)

@admin.register(ClaimRequest)
class ClaimRequestAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if obj.status == 'approved':

            found_item = obj.found_item

            if found_item and found_item.status != 'claimed':
                found_item.status = 'claimed'
                found_item.save()

        super().save_model(request, obj, form, change)
