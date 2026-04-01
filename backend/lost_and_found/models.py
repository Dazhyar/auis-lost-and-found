from django.db import models
from django.utils import timezone


class UserProfile(models.Model):
    google_id = models.CharField(max_length=200, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=200, blank=True)
    photo_url = models.URLField(blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    email_notifications = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    @property
    def is_authenticated(self):
        return True

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class FoundItem(models.Model):
    STATUS_CHOICES = [
        ('found', 'Found'),
        ('claimed', 'Claimed'),
        ('expired', 'Expired'),
    ]

    CUSTODY_CHOICES = [
        ('office', 'University Office'),
        ('finder', 'With Finder'),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    location_found = models.CharField(max_length=200)
    date_found = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='found')
    custody_status = models.CharField(max_length=20, choices=CUSTODY_CHOICES, default='finder')
    photo_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='found_items/', blank=True, null=True)
    reported_by_email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} - {self.status}"


class LostReport(models.Model):
    student_name = models.CharField(max_length=200)
    student_email = models.EmailField()
    item_name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField()
    date_lost = models.DateTimeField(default=timezone.now)
    location_lost = models.CharField(max_length=200, blank=True)
    is_resolved = models.BooleanField(default=False)
    photo_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='lost_items/', blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Lost: {self.item_name} by {self.student_email}"


class ItemReport(models.Model):
    """Community-submitted found item reports pending admin approval."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    CUSTODY_CHOICES = [
        ('office', 'University Office'),
        ('finder', 'With Finder'),
    ]

    reporter_name = models.CharField(max_length=200)
    reporter_email = models.EmailField()
    item_name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    location_found = models.CharField(max_length=200)
    date_found = models.DateTimeField(default=timezone.now)
    photo_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='found_items/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    custody_status = models.CharField(max_length=20, choices=CUSTODY_CHOICES, default='finder')
    submitted_at = models.DateTimeField(default=timezone.now)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    converted_item = models.ForeignKey(
        FoundItem, null=True, blank=True, on_delete=models.SET_NULL, related_name='source_report'
    )

    def __str__(self):
        return f"Report: {self.item_name} by {self.reporter_email} [{self.status}]"


class PickupSchedule(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    TIME_SLOT_CHOICES = [
        ('09:00', '9:00 AM – 10:00 AM'),
        ('10:00', '10:00 AM – 11:00 AM'),
        ('11:00', '11:00 AM – 12:00 PM'),
        ('13:00', '1:00 PM – 2:00 PM'),
        ('14:00', '2:00 PM – 3:00 PM'),
        ('15:00', '3:00 PM – 4:00 PM'),
        ('16:00', '4:00 PM – 5:00 PM'),
    ]

    student_name = models.CharField(max_length=200)
    student_email = models.EmailField()
    found_item = models.ForeignKey(FoundItem, on_delete=models.CASCADE, related_name='schedules')
    pickup_date = models.DateField()
    time_slot = models.CharField(max_length=10, choices=TIME_SLOT_CHOICES)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Pickup: {self.student_email} – {self.found_item.name} on {self.pickup_date} at {self.time_slot}"


class ClaimRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    student_name = models.CharField(max_length=200)
    student_email = models.EmailField()
    found_item = models.ForeignKey(FoundItem, on_delete=models.CASCADE, related_name='claims')
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Claim: {self.student_email} – {self.found_item.name}"
