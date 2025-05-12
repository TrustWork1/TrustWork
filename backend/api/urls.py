from django.urls import path,include
from api.auth.views import VerifyOTPView, RegisterView, LoginView, LogoutView,RequestPasswordResetEmail,PasswordTokenCheckAPI,SetNewPasswordAPIView,ChangePasswordAPIView,UserProfileCreateView, ChangePasswordView
from api.profile.views import BankDetailsAPIView,PrimaryBankView,ProfileDetailUpdateView, UserDocumentsAPIView, MembershipPlansAPIView, ProfileMembershipAPIView, ProfileAPIView,ChangeProfileStatusView, ProfileAPIViewSearch,HandleSubscription, CouponsView
from api.auth.views import VerifyOTPView, RegisterView, LoginView, LogoutView,RequestPasswordResetEmail,PasswordTokenCheckAPI,SetNewPasswordAPIView,ChangePasswordAPIView,UserProfileCreateView
from api.profile.views import BankDetailsAPIView,HandleWithdraw,ProfileDetailUpdateView, UserDocumentsAPIView, MembershipPlansAPIView, ProfileMembershipAPIView, ProfileAPIView,ChangeProfileStatusView, ProfileAPIViewSearch,ProfileSelfView, ProfileCoverImageUpdateAPIView, PaymentStatusView, ProfileDetails, ProjectDetails,PreviousWorksApiView
# from api.bids.views import BidsApiView
from api.admin_management.views import CMSDetailAPIView,CMSListCreateAPIView,FAQListCreateAPIView,FAQDetailAPIView,QMSAPIView,QMSResponseApiView, DashboardAnalyticsView
from api.master.views import LocationApiView,JobCategoryApiView
from api.project.views import ProjectList,ChangeProjectStatusView,ProjectDetail,BidDetail,BidList,ProjectBidApiView, ServiceProviderListView,ServiceProviderHomeView, JobCategoryView,FeedbackView, AdminProjectDetail,ProviderFeedbackView, SwitchRoleView, MobileprojectActiveList #, ServiceProviderListAdminView # , ServiceProviderListViewOfferView
from project_management.models import Project,Bid
from api.project.mobile_views import MobileBidList, MobileProjectList, ClientActiveProjectsView, ProviderViewProject, ServiceDetailsAPIView, OfferProjectAPIView, OfferDetailAPIView, CreateAndOfferProjectAPIView, MyOfferProjectListAPIView #, ClientProjectsAdminView, AdminMobileProjectList # ProviderViewProjectActive
from api.referal_management.views import ReferalHandlerView
from api.auth.views import GenerateOTPView, AuthVerifyOTPView, ChangePasswordView,ResendOtp
from api.chat.views import SendNotificationView,NotificationListView,ChangeNotificationStatusView,ChatHandlerView,ChatListView # ,AttatchmentView # SendAttachmentAPIView #AttatchmentChatViewSent 
from api.payment_management.views import PaymentApiView, PendingPayment, PaymentFailerView
from api.payment_management.views import CreateCheckoutSessionView, CheckPaymentStatus, StripeBalanceAPIView, DeleteStripeAccountAPIView, TriggerPayoutView, TransectionProjectView, TransectionView,PaymentHistoryApiView ,SendPaymentRequestApiView# InitiatePaymentAPIView, PaymentResponseAPIView, CreateCheckoutSessionViewAPI
from payment_handle.webhooks import ProcessStripeSession
from api.content_management_servies.views.home_page_views import AppInfoView, FeaturesSectionView, FeaturesView, HowItWorksSectionView, HowItWorksView, ReferralSectionView, DownloadSectionView, PackagesSectionCMSView, PackagesSectionView, HomePageView
from api.content_management_servies.views.aboutus_page_views import AboutUsSectionView, TrustUsSectionView, TrustUsFeatureView, AboutUsView
from api.content_management_servies.views.terms_condition_page_views import TermsConditionsSectionView, TermsConditionsView
from api.content_management_servies.views.privacy_policy_page_views import PrivacyPolicySectionView, PrivacyPolicyView
from api.content_management_servies.views.contactus_page_views import ContactUsDetailsView, ContactUsFormView, ContactUsView
urlpatterns = [
    path('home-page/', HomePageView.as_view(), name='home-page'),
    path('aboutus-page/', AboutUsView.as_view(), name='aboutus-page'),
    path('contactus-page/', ContactUsView.as_view(), name='contactus-page'),
    path('terms-conditions-page/', TermsConditionsView.as_view(), name='terms-conditions-page'),
    path('privacy-policy-page/', PrivacyPolicyView.as_view(), name='privacy-policy-page'),

    path('app-info/', AppInfoView.as_view(), name='app-info-detail'),
    path('app-features-cms/', FeaturesSectionView.as_view(), name='app-features-cms'),
    path('app-features/', FeaturesView.as_view(), name='app-features-detail'),
    path('app-features/<int:pk>/', FeaturesView.as_view(), name='feature-detail'),
    path('app-howitworks-cms/', HowItWorksSectionView.as_view(), name='app-howitworks-cms'),
    path('app-howitworks/', HowItWorksView.as_view(), name='app-howitworks-detail'),
    path('app-howitworks/<int:pk>/', HowItWorksView.as_view(), name='howitworks-detail'),
    path('app-packages-cms/', PackagesSectionCMSView.as_view(), name='app-packages-cms'),
    path('app-packages/', PackagesSectionView.as_view(), name='app-packages-detail'),
    path('app-packages/<int:pk>/', PackagesSectionView.as_view(), name='packages-detail'),
    path('app-referral/', ReferralSectionView.as_view(), name='app-referral-detail'),
    path('app-download/', DownloadSectionView.as_view(), name='app-download-detail'),
    path('terms-conditions-cms/', TermsConditionsSectionView.as_view(), name='terms-conditions-cms'),
    path('privacy-policy-cms/', PrivacyPolicySectionView.as_view(), name='privacy-policy-cms'),
    path('aboutus-section/', AboutUsSectionView.as_view(), name='aboutus-section-detail'),
    path('why-you-trustus-cms/', TrustUsSectionView.as_view(), name='why-you-trustus-cms'),
    path('why-you-trustus/', TrustUsFeatureView.as_view(), name='why-you-trustus-detail'),
    path('why-you-trustus/<int:pk>/', TrustUsFeatureView.as_view(), name='trustus-detail'),
    path('contactus-detail/', ContactUsDetailsView.as_view(), name='contactus-details'),
    path('contactus-form/', ContactUsFormView.as_view(), name='contactus-forms'),
    path('contactus-form/<int:pk>/', ContactUsFormView.as_view(), name='contactus-form'),
    
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/login/', LoginView.as_view(), name='admin-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    path('password-reset/', RequestPasswordResetEmail.as_view(), name='password-reset-'),

    path('admin/forgot-password/', RequestPasswordResetEmail.as_view(), name='password-reset'),
    
    path('password-reset-confirm/<uidb64>/<token>/', PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('password-reset-complete/', SetNewPasswordAPIView.as_view(), name='password-reset-complete-'),
    path('profile/change_password/',ChangePasswordAPIView.as_view(),name='change-password'),
    path('admin/reset-password/', SetNewPasswordAPIView.as_view(), name='password-reset-complete'),

    path('generate-otp/', GenerateOTPView.as_view(), name='generate-otp'),
    path('otp-verify/', AuthVerifyOTPView.as_view(), name='verify-otp'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    path('bank-details/', BankDetailsAPIView.as_view(), name='bank-details-list'),
    path('bank-details/<int:pk>/', BankDetailsAPIView.as_view(), name='bank-detail'),
    path('bank-primary/<int:pk>/', PrimaryBankView.as_view(), name='primary-bank'),

    path('user-documents/', UserDocumentsAPIView.as_view(), name='user-documents-list'),
    path('user-documents/<int:pk>/', UserDocumentsAPIView.as_view(), name='user-document-detail'),

    path('membership-plans/', MembershipPlansAPIView.as_view(), name='membership-plans-list'),
    path('membership-plans/<int:pk>/', MembershipPlansAPIView.as_view(), name='membership-plan-detail'),
    path('membership-plans/search', MembershipPlansAPIView.as_view(), name='membership-plan-detail'),

    path('profile-memberships/', ProfileMembershipAPIView.as_view(), name='profile-memberships-list'),
    path('profile-memberships/<int:pk>/', ProfileMembershipAPIView.as_view(), name='profile-membership-detail'),
    path('profile-memberships/search', ProfileMembershipAPIView.as_view(), name='profile-membership-detail'),

    path('users/', ProfileAPIView.as_view(), name='profiles-list'),
    path('users/<int:pk>/', ProfileAPIView.as_view(), name='profile-detail'),
    path('users/details/<int:pk>/', ProfileAPIView.as_view(), name='profile-detail'),
    path('users/<str:user_type>/', ProfileAPIView.as_view(), name='profile-detail-list'),
    path("user/status/<int:pk>/",ChangeProfileStatusView.as_view(),name='change-profile-status'),
    
    path("user/register/",UserProfileCreateView.as_view(),name='user-profile-create'),
    
    # path('bids/',BidsApiView.as_view(),name='bids'),

    # path('projects/',ProjectApiView.as_view(),name='project-list'),
    path('user/<str:user_type>/list', ProfileAPIView.as_view(), name='profile-detail-list'),
    path('user/<str:user_type>/details/<int:pk>/', ProfileAPIView.as_view(), name='profile-detail'),

    path('admin/dashboards/analytics/', DashboardAnalyticsView.as_view(), name='admin-dashboard'),
    path('admin/<str:user_type>/list', ProfileAPIView.as_view(), name='profile-detail-list'),
    path('admin/<str:user_type>/details/<int:pk>/', ProfileAPIView.as_view(), name='profile-detail'),
    path('admin/<str:user_type>/edit/<int:pk>/', ProfileAPIView.as_view(), name='profile-edit'),
    path('admin/<str:user_type>/delete/<int:pk>/', ProfileAPIView.as_view(), name='profile-delete'),
    path('admin/<str:user_type>/add/', ProfileAPIView.as_view(), name='profile-add'),
    path('admin/<str:user_type>/status/change/<int:pk>/', ChangeProfileStatusView.as_view(), name='profile-status-edit'),

    path('admin/<str:user_type>/profile', ProfileAPIViewSearch.as_view(), name='Profile-API-View-Search'),
    path('qms/list/',QMSAPIView.as_view(),name='qms'),
    path('qms/add/',QMSAPIView.as_view(),name='qms'),
    path('qms/details/<int:pk>',QMSAPIView.as_view(),name='qms'),
    path('qms/edit/<int:pk>/',QMSAPIView.as_view(),name='qms'),
    path('qms/delete/<int:pk>/',QMSAPIView.as_view(),name='qms'),
    path('qms/response/create/',QMSResponseApiView.as_view(),name='qms'),
    path('qms/response/details/<int:pk>/',QMSResponseApiView.as_view(),name='qms'),
    
    
    path('project/list/',ProjectList.as_view(),name='project'),
    path('project/details/<int:pk>',ProjectDetail.as_view(),name='project'),
    path('project/edit/<int:pk>/',ProjectDetail.as_view(),name='project'),
    path('project/delete/<int:pk>/',ProjectDetail.as_view(),name='project'),

    path('mobile/project/add/',MobileProjectList.as_view(),name='project'),
    # path('admin/mobile/project/view/',AdminMobileProjectList.as_view(),name='project'),
    path('mobile/category/add/',JobCategoryView.as_view(),name='project'),
    # path('project/list/',ProjectList.as_view(),name='project')
    
    path('bid/list/',BidList.as_view(),name='bid'),
    path('bid/add/',BidList.as_view(),name='bid'),
    path('bid/details/<int:pk>',BidDetail.as_view(),name='bid'),
    path('bid/edit/<int:pk>/',BidDetail.as_view(),name='bid'),
    path('bid/delete/<int:pk>/',BidDetail.as_view(),name='bid'),
    path("project/bid/<int:project_id>",ProjectBidApiView.as_view()),
    
    path('project/bids/<int:bid_id>/', ProjectBidApiView.as_view(), name=' -bid'),

    path('mobile/bid/add/',MobileBidList.as_view(),name='bid'),
    path('mobile/project/view/list',MobileprojectActiveList.as_view(), name='project'),
    # path("project/bid/<int:project_id>",ProjectBidApiView.as_view()),

    
    path('project/list/',ProjectList.as_view(),name='project'),
    path('project/add/',ProjectList.as_view(),name='project'),
    path('project/details/<int:pk>',ProjectDetail.as_view(),name='project'),
    path('project/edit/<int:pk>/',ProjectDetail.as_view(),name='project'),
    path('project/delete/<int:pk>/',ProjectDetail.as_view(),name='project'),
    path('project/status/change/<int:pk>/',ChangeProjectStatusView.as_view(),name='project'),
    path('admin/project/details/<int:pk>/',AdminProjectDetail.as_view(),name='project'),
    
    path('bid/list/',BidList.as_view(),name='bid'),
    path('bid/add/',BidList.as_view(),name='bid'),
    path('bid/details/<int:pk>',BidDetail.as_view(),name='bid'),
    path('bid/edit/<int:pk>/',BidDetail.as_view(),name='bid'),
    path('bid/delete/<int:pk>/',BidDetail.as_view(),name='bid'),
    path('bid/status/change/<int:pk>/',BidDetail.as_view(),name='bid'),
    path("project/bid/<int:project_id>",ProjectBidApiView.as_view()),
    
    path('bid/filtered/', ClientActiveProjectsView.as_view(), name='filtered-project-list'),
    # path('admin/bid/filtered/', ClientProjectsAdminView.as_view(), name='filtered-project-list'),

    path('cms/list/', CMSListCreateAPIView.as_view(), name='cms-list-create'),#get
    path('cms/add/', CMSListCreateAPIView.as_view(), name='cms-list-create'),#post
    path('cms/details/<int:pk>/', CMSDetailAPIView.as_view(), name='cms-detail'),#get
    path('cms/edit/<int:pk>/', CMSDetailAPIView.as_view(), name='cms-detail'),#put
    path('cms/delete/<int:pk>/', CMSDetailAPIView.as_view(), name='cms-delete'),#put
    path('cms/status/change/<int:pk>/', CMSDetailAPIView.as_view(), name='cms-detail'),#put
    path('faq/list/', FAQListCreateAPIView.as_view(), name='faq-list-create'),#get
    path('faq/add/', FAQListCreateAPIView.as_view(), name='faq-list-create'),#post
    path('faq/edit/<int:pk>/', FAQDetailAPIView.as_view(), name='faq-detail'),#get
    path('faq/details/<int:pk>/', FAQDetailAPIView.as_view(), name='faq-detail'),#put
    path('faq/delete/<int:pk>/', FAQDetailAPIView.as_view(), name='faq-delete'),#put
    path('faq/status/change/<int:pk>/', FAQDetailAPIView.as_view(), name='faq-detail'),#put
    path('location/list/', LocationApiView.as_view(), name='location-list'),#put
    path('job_category/list/', JobCategoryApiView.as_view(), name='job_category-list'),#put ProfileDetailUpdateView
    path('profile/edit/', ProfileDetailUpdateView.as_view(), name='profile-update-detail'),#put ProfileDetailUpdateView
    path('profile/details/admin/', ProfileDetailUpdateView.as_view(), name='profile-update-detail'),#put ProfileDetailUpdateView

    path('category/<int:pk>/', JobCategoryView.as_view(), name='Job-Category-ViewSet'),
    path('category/', JobCategoryView.as_view(), name='Job-Category-ViewSet'),
    path('category/add/', JobCategoryView.as_view(), name='Job-Category-ViewSet'),
    path('category/edit/<int:pk>/', JobCategoryView.as_view(), name='Job-Category-ViewSet'),
    path('category/delete/<int:pk>/', JobCategoryView.as_view(), name='Job-Category-ViewSet'),
   
    path('profile/', ProfileSelfView.as_view(), name='self-update-detail'),#put ProfileDetailUpdateView
    
    path('profile/update-cover-image/', ProfileCoverImageUpdateAPIView.as_view(), name='profile-update-cover-image'),
    
    path('profile/payment-status/', PaymentStatusView.as_view(), name='profile-payment-status'),
    
    path('projects/service-providers/', ServiceProviderHomeView.as_view(), name='service-provider-list'),
    path('service-providers/projects/', ServiceProviderListView.as_view(), name='service-provider-project-list'),
    # path('service/projects/offer/', ServiceProviderListViewOfferView.as_view(), name='service-provider-project-list'),
    # path('admin/providers/projects/view/', ServiceProviderListAdminView.as_view(), name='service-provider-project-list'),

    path('provider/myoffers/', MyOfferProjectListAPIView.as_view(), name='provider-myoffers'),

    # ProfileSelfView
    path('provider/view/project', ProviderViewProject.as_view(), name='Provider-View-Project'),
    path('profile/details', ProfileDetails.as_view(), name='Profile-Details'),
    path('profile/details/<int:pk>', ProfileDetails.as_view(), name='Profile-Details'),

    # path('provider/view/project/', ProviderViewProjectActive.as_view(), name = 'ProviderViewProjectActive'),

    path('project/view/', ProjectDetails.as_view(), name='project-details'),
    path('project/view/<int:pk>', ProjectDetails.as_view(), name='project-details'),
 

    # path('chat-list/', SendMessageView.as_view(), name='send_message'),

    path('projects/<int:project_id>/feedback/', FeedbackView.as_view(), name='feedback-create-retrieve'),
    path('projects/<int:project_id>/feedback/update/', FeedbackView.as_view(), name='feedback-create-retrieve'),
    # path('feedback/<int:feedback_id>/', FeedbackView.as_view(), name='feedback-update-delete'),


    path('projects/<int:project_id>/feedback/', FeedbackView.as_view(), name='feedback-create-retrieve'),
    path('projects/<int:project_id>/feedback/update/', FeedbackView.as_view(), name='feedback-create-retrieve'),
    # path('feedback/<int:feedback_id>/', FeedbackView.as_view(), name='feedback-update-delete'),


    # path('chat-list/', SendMessageView.as_view(), name='send_message'),

    path('projects/<int:project_id>/feedback/<int:pk>', FeedbackView.as_view(), name='feedback-create-retrieve'),
    path('projects/<int:project_id>/feedback/update/', FeedbackView.as_view(), name='feedback-create-retrieve'),
    path("provider/<int:provider_id>/service/<int:job_category_id>/", ServiceDetailsAPIView.as_view(), name="service-details"),
    path('feedback/<project_id>/', ProviderFeedbackView.as_view(), name='feedback-update-delete'),
    path('feedback/delete/<int:feedback_id>/', ProviderFeedbackView.as_view(), name='delete-feedback'),
    path('notifications/send/', SendNotificationView.as_view(), name='send_notification'),
    path('notifications/', NotificationListView.as_view(), name='list_notifications'),
    path('notifications_status_change/', ChangeNotificationStatusView.as_view(), name='notifications_status'),

    # Search List
    path('projects', MobileProjectList.as_view(), name='profile-api-view-search'),

    path('direct-offer/', OfferProjectAPIView.as_view(), name='direct-offer'),
    path('direct-offer/client/', CreateAndOfferProjectAPIView.as_view(), name='direct-offer'),
    path('offers/<int:offer_id>/', OfferDetailAPIView.as_view(), name='offer-detail'),
    path('offers/', OfferDetailAPIView.as_view(), name='offer-detail'),

    path('switch-role/', SwitchRoleView.as_view(), name='switch-role'),
    path('create_chat_room/', ChatHandlerView.as_view(), name='ChatHandlerView'),
    path('chat_messages/list/<int:chat_id>/', ChatHandlerView.as_view(), name='ChatHandlerView'),
    path('chat_messages/list/', ChatHandlerView.as_view(), name='ChatHandlerView'),
    # path('chat_messages/attachment/', AttatchmentView.as_view(), name='AttatchmentView'),
    path('list_chat_rooms/', ChatListView.as_view(), name='ChatListView'),
    path('get_referal_code/', ReferalHandlerView.as_view(), name='ReferalHandlerView'),
    path('add-referal/', ReferalHandlerView.as_view(), name='ReferalHandlerView'),
    path('membership-payment/', PaymentApiView.as_view(), name='PaymentApiView'),
    path('membership-payment/list/', PaymentApiView.as_view(), name='PaymentApiViewGet'),
    path('membership-payment-pending/list/', PendingPayment.as_view(), name='PaymentApiViewGet'),
    path("webhooks/",include('api.webhook_urls')),
    path("handle_subscription/",HandleSubscription.as_view()),
    path("handle_withdraw/",HandleWithdraw.as_view()),
    # path('initiate-payment/', InitiatePaymentAPIView.as_view(), name='initiate-payment'),
    # path('payment-response/', PaymentResponseAPIView.as_view(), name='payment-response'),
    path('api/checkout-session/', CreateCheckoutSessionView.as_view(), name='payment-response'),
    path('api/payment-status/', CheckPaymentStatus.as_view(), name='payment-response'),
    # path('api/payment-create/', CreateCheckoutSessionViewAPI.as_view(), name='payment-response'),
    path('stripe-webhook/', ProcessStripeSession.as_view(), name='payment-response'),
    path('stripe-balance/', StripeBalanceAPIView.as_view(), name='payment-response'),
    path('stripe-delete/', DeleteStripeAccountAPIView.as_view(), name='payment-response'),
    path('stripe-bank-payout/', TriggerPayoutView.as_view(), name='payment-response'),
    path('resend-otp/', ResendOtp.as_view(), name='payment-response'),
    path('previous-works/', PreviousWorksApiView.as_view(), name='previous-works'),
    path('previous-works/<int:pk>/', PreviousWorksApiView.as_view(), name='previous-works'),
    path('transection-project-view/<int:pk>/', TransectionProjectView.as_view(), name='transection-payment-project'),
    path('transection-view/', TransectionView.as_view(), name='transection-payment'),
    path('service-provider/payment-history/', PaymentHistoryApiView.as_view(), name='PaymentHistoryApiView-payment'),
    path('send-payment-request/', SendPaymentRequestApiView.as_view(), name='PaymentHistoryApiView-payment'),
    path('payment/transactions_failed/<int:bid_id>', PaymentFailerView.as_view(), name='failed_transaction'),
    path('coupons', CouponsView.as_view(), name='coupons')
    
]