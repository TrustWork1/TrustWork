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
from django.urls import path,include
from .MTN.collections_webhook import *
from .MTN.disbursement_webhook import *
from .stripe.stripe_webhook import *
# from payment_handler.payment_gateways.MTN_MoMo.webhooks.collections_webhook import MtnCollectionWebhook
urlpatterns = [
    # path('webhooks/',include('payment_handler.payment_gateways.webhooks.urls')),

    path('mtn-collection',MtnCollectionWebhook.as_view()),
    path('mtn-disbursement',MtnDisbursementWebhook.as_view()),
    # path("stripe-webhook/", ProcessStripeSession.as_view(), name="stripe_webhook"),
    # path("stripe-webhook", stripe_webhook, name="stripe_webhook"),
    # path("stripe/process-session", stripe_webhook, name="stripe_webhook"),
    path("stripe/process-session/", ProcessStripeSession.as_view(), name="stripe_webhook"),
]
