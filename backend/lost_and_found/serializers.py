from rest_framework import serializers
from .models import FoundItem, LostReport, ItemReport, PickupSchedule, UserProfile, ClaimRequest


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


class FoundItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoundItem
        fields = '__all__'


class LostReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = LostReport
        fields = '__all__'


class ItemReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemReport
        fields = '__all__'
        read_only_fields = ['status', 'reviewed_at', 'converted_item', 'submitted_at']


class PickupScheduleSerializer(serializers.ModelSerializer):
    found_item_name = serializers.CharField(source='found_item.name', read_only=True)
    found_item_location = serializers.CharField(source='found_item.location_found', read_only=True)
    time_slot_display = serializers.CharField(source='get_time_slot_display', read_only=True)

    class Meta:
        model = PickupSchedule
        fields = '__all__'


class ClaimRequestSerializer(serializers.ModelSerializer):
    found_item_name = serializers.CharField(source='found_item.name', read_only=True)
    found_item_location = serializers.CharField(source='found_item.location_found', read_only=True)
    found_item_custody = serializers.CharField(source='found_item.custody_status', read_only=True)

    class Meta:
        model = ClaimRequest
        fields = '__all__'
