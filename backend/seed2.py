import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auis_backend.settings')
django.setup()

from lost_and_found.models import FoundItem, LostReport

FoundItem.objects.all().delete()
LostReport.objects.all().delete()

found_items = [
    {'name': 'Apple AirPods Pro', 'category': 'Electronics', 'description': 'White case, has a small scratch on the back.', 'location_found': 'Library 2nd Floor', 'status': 'found', 'photo_url': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80'},
    {'name': 'Blue AUIS Hoodie', 'category': 'Clothing', 'description': 'Size M, found on a chair.', 'location_found': 'Cafeteria', 'status': 'found', 'photo_url': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80'},
    {'name': 'Car Keys with BMW logo', 'category': 'Keys', 'description': 'Attached to a black lanyard.', 'location_found': 'Building A Parking', 'status': 'found', 'photo_url': 'https://plus.unsplash.com/premium_photo-1678853754964-672cf39db99e?q=80&w=2003'},
    {'name': 'Black Leather Wallet', 'category': 'IDs & Documents', 'description': 'Contains ID for student B. Ahmed.', 'location_found': 'Building B Room 101', 'status': 'found', 'photo_url': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80'},
    {'name': 'MacBook Pro 14', 'category': 'Electronics', 'description': 'Space gray, stickers on the back.', 'location_found': 'Cafeteria Table 5', 'status': 'found', 'photo_url': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'}
]

for item in found_items:
    FoundItem.objects.create(**item)

lost_items = [
    {'student_name': 'Faris Hasan', 'student_email': 'faris.hasan@auis.edu.krd', 'item_name': 'MacBook Pro Charger', 'category': 'Electronics', 'description': 'Standard Apple 61W USB-C charger.', 'location_lost': 'Library Study Room', 'is_resolved': False},
    {'student_name': 'Shakar Latif', 'student_email': 'shakar.latif01@gmail.com', 'item_name': 'Gold Ring', 'category': 'Accessories', 'description': 'Thin gold ring with a small stone.', 'location_lost': 'Campus Garden', 'is_resolved': False},
    {'student_name': 'Hewa Ali', 'student_email': 'hewa.ali@auis.edu.krd', 'item_name': 'Black Backpack', 'category': 'Bags', 'description': 'Nike backpack containing notebooks.', 'location_lost': 'Gym', 'is_resolved': False}
]

for item in lost_items:
    LostReport.objects.create(**item)

print('Database seeded correctly')
