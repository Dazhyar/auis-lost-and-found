from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserProfileViewSet, basename='userprofile')
router.register(r'found-items', views.FoundItemViewSet)
router.register(r'lost-reports', views.LostReportViewSet)
router.register(r'item-reports', views.ItemReportViewSet)
router.register(r'schedules', views.PickupScheduleViewSet)
router.register(r'claims', views.ClaimRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/google/', views.google_auth),

    path('admin/stats/', views.admin_stats),
]
