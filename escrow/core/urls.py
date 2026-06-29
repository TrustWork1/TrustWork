"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

# from payment_handler.payment_gateways.MTN_MoMo.webhooks.collections_webhook import MtnCollectionWebhook
from orange_management.views import OkResponseView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('mtn-momo/', include('escrow_management.urls.mtn_momo')),
    path('webhooks/',include('payment_handler.payment_gateways.webhooks.urls')),
    path("stripe/", include('escrow_management.urls.stripe')),
    path("orange/", include('orange_management.urls')),
    path('ok/', OkResponseView.as_view(), name='ok-api'),
]
