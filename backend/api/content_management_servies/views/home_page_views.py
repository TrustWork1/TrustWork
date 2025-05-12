from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import json
from rest_framework.parsers import MultiPartParser, FormParser

from content_management.models.home_page_models import *
from api.content_management_servies.serializers.home_page_serializers import *

class AppInfoView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, pk=None):
        app_info = AppInfo.objects.last()
        if not app_info:
            return Response([], status=status.HTTP_200_OK)

        # Flatten data from AppInfo and AppDownload
        data = {
            "id": app_info.id,
            "tagline": app_info.tagline,
            "title": app_info.title,
            "description": app_info.description,
            "playstore_link": app_info.app_download.playstore_link if app_info.app_download else None,
            "appstore_link": app_info.app_download.appstore_link if app_info.app_download else None,
            "image": request.build_absolute_uri(app_info.image.url) if app_info.image else None,
        }

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        # Check if AppInfo already has data
        if AppInfo.objects.exists():
            return Response({"error": "AppInfo Section already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if AppDownload already exists
        created = False
        app_download = AppDownload.objects.first()
        if not app_download:
            # Create a new one if it doesn't exist
            created = True  # Mark that we're creating a new one
            playstore_link = request.data.get('playstore_link')
            appstore_link = request.data.get('appstore_link')
            app_download = AppDownload.objects.create(
                playstore_link=playstore_link,
                appstore_link=appstore_link
            )

        app_info_data = {
            'tagline': request.data.get('tagline'),
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'app_download': app_download.id,
            'image': request.FILES.get('image')  # File upload
        }

        serializer = AppInfoSerializer(data=app_info_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            if created:
                app_download.delete()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            app_info = AppInfo.objects.last()
        except AppInfo.DoesNotExist:
            return Response({"error": "AppInfo not found"}, status=status.HTTP_404_NOT_FOUND)

        # Update download links
        app_download = app_info.app_download
        app_download.playstore_link = request.data.get('playstore_link', app_download.playstore_link)
        app_download.appstore_link = request.data.get('appstore_link', app_download.appstore_link)
        app_download.save()

        # Update AppInfo
        app_info.tagline = request.data.get('tagline', app_info.tagline)
        app_info.title = request.data.get('title', app_info.title)
        app_info.description = request.data.get('description', app_info.description)
        if 'image' in request.FILES:
            app_info.image = request.FILES['image']
        app_info.save()

        serializer = AppInfoSerializer(app_info)
        data = serializer.data
        data['playstore_link'] = app_download.playstore_link
        data['appstore_link'] = app_download.appstore_link
        return Response(data, status=status.HTTP_200_OK)

class FeaturesSectionView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        feature_section = FeatureSection.objects.last()
        if not feature_section:
            return Response([], status=status.HTTP_200_OK)
        
        serializer = FeatureSectionSerializer(feature_section)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Check if FeatureSection already exists
        if FeatureSection.objects.exists():
            return Response({"message": "FeatureSection already exists. Use PUT to update."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FeatureSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        feature_section = FeatureSection.objects.first()
        if not feature_section:
            return Response({"message": "FeatureSection does not exist. Use POST to create."},
                            status=status.HTTP_404_NOT_FOUND)
        
        serializer = FeatureSectionSerializer(feature_section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "FeatureSection updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeaturesView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, pk=None):
        if pk:
            try:
                feature = Feature.objects.get(id=pk)
                data = {
                    "id": feature.id,
                    "title": feature.title,
                    "description": feature.description,
                    "icon": request.build_absolute_uri(feature.icon.url) if feature.icon else None
                }
                return Response(data, status=status.HTTP_200_OK)
            except Feature.DoesNotExist:
                return Response({"error": "Feature not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            features = Feature.objects.all()
            data = [
                {
                    "id": feature.id,
                    "title": feature.title,
                    "description": feature.description,
                    "icon": request.build_absolute_uri(feature.icon.url) if feature.icon else None
                }
                for feature in features
            ]
            return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request):
        # Check if FeatureSection already exists
        feature_section = FeatureSection.objects.first()
        if not feature_section:
            return Response({"error": "Feature Section not available"}, status=status.HTTP_404_NOT_FOUND)

        features_data = {
            'feature_section': feature_section.id,
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'icon': request.FILES.get('icon')  # File upload
        }

        serializer = FeatureSerializer(data=features_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def put(self, request, pk=None):
        if pk:
            try:
                feature = Feature.objects.get(id=pk)
                feature.title = request.data.get('title', feature.title)
                feature.description = request.data.get('description', feature.description)

                if 'icon' in request.FILES:
                    feature.icon = request.FILES.get('icon')

                feature.save()
            except Feature.DoesNotExist:
                return Response({"error": "Feature not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Feature updated successfully"}, status=status.HTTP_200_OK)

    def delete(self, request, pk=None):
        try:
            feature = Feature.objects.get(id=pk)
            feature.delete()
            return Response({"message": "Feature deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Feature.DoesNotExist:
            return Response({"error": "Feature not found"}, status=status.HTTP_404_NOT_FOUND)

class HowItWorksSectionView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        howitworks_section = HowItWorksSection.objects.last()
        if not howitworks_section:
            return Response([], status=status.HTTP_200_OK)
        
        serializer = HowItWorksSectionSerializer(howitworks_section)
        data = serializer.data
        if howitworks_section.image:
            data['image'] = request.build_absolute_uri(howitworks_section.image.url)
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        # Check if HowItWorksSection already exists
        if HowItWorksSection.objects.exists():
            return Response({"message": "HowItWorksSection already exists. Use PUT to update."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        serializer = HowItWorksSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        howitworks_section = HowItWorksSection.objects.first()
        if not howitworks_section:
            return Response({"message": "HowItWorksSection does not exist. Use POST to create."},
                            status=status.HTTP_404_NOT_FOUND)
        
        serializer = HowItWorksSectionSerializer(howitworks_section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "HowItWorksSection updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HowItWorksView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, pk=None):
        if pk:
            try:
                step = HowItWorksStep.objects.get(id=pk)
                data = {
                    "id": step.id,
                    "title": step.title,
                    "description": step.description,
                    "icon": request.build_absolute_uri(step.icon.url) if step.icon else None
                }
            except HowItWorksStep.DoesNotExist:
                return Response({"error": "Step not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            steps = HowItWorksStep.objects.all()
            data = [
                {
                    "id": step.id,
                    "title": step.title,
                    "description": step.description,
                    "icon": request.build_absolute_uri(step.icon.url) if step.icon else None
                }
                for step in steps
            ]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        # Check if HowItWorksSection already exists
        howitworks_section = HowItWorksSection.objects.first()
        if not howitworks_section:
            return Response({"error": "howitworks Section not available"}, status=status.HTTP_404_NOT_FOUND)

        step_data = {
            'howitworks_section': howitworks_section.id,
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'icon': request.FILES.get('icon')
        }

        serializer = HowItWorksStepSerializer(data=step_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        if pk:
            try:
                step = HowItWorksStep.objects.get(id=pk)
                step.title = request.data.get('title', step.title)
                step.description = request.data.get('description', step.description)
                if 'icon' in request.FILES:
                    step.icon = request.FILES.get('icon')
                step.save()
            except HowItWorksStep.DoesNotExist:
                return Response({"error": "Step not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Step updated successfully"}, status=status.HTTP_200_OK)

    def delete(self, request, pk=None):
        try:
            step = HowItWorksStep.objects.get(id=pk)
            step.delete()
            return Response({"message": "Step deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except HowItWorksStep.DoesNotExist:
            return Response({"error": "Step not found"}, status=status.HTTP_404_NOT_FOUND)

class ReferralSectionView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        try:
            referral = ReferralSection.objects.last()
            if not referral:
                return Response([], status=status.HTTP_200_OK)

            serializer = ReferralSectionSerializer(referral)
            data = serializer.data
            if referral.image:
                data['image'] = request.build_absolute_uri(referral.image.url)
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        # Check if ReferralSection already has data
        if ReferralSection.objects.exists():
            return Response({"error": "Referral Section already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
        serializer = ReferralSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            if 'image' in request.FILES:
                data['image'] = request.build_absolute_uri(serializer.instance.image.url)
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            referral = ReferralSection.objects.last()
            if not referral:
                return Response({"error": "Referral Section not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = ReferralSectionSerializer(referral, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                data = serializer.data
                if referral.image:
                    data['image'] = request.build_absolute_uri(referral.image.url)
                return Response(data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except ReferralSection.DoesNotExist:
            return Response({"error": "Referral Section not found"}, status=status.HTTP_404_NOT_FOUND)
    
class DownloadSectionView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, pk=None):
        download_section = DownloadSection.objects.last()
        if not download_section:
            return Response([], status=status.HTTP_200_OK)

        data = {
            "id": download_section.id,
            "title": download_section.title,
            "description": download_section.description,
            "playstore_link": download_section.app_download.playstore_link if download_section.app_download else None,
            "appstore_link": download_section.app_download.appstore_link if download_section.app_download else None,
            "image": request.build_absolute_uri(download_section.image.url) if download_section.image else None,
        }
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        # Check if DownloadSection already has data
        if DownloadSection.objects.exists():
            return Response({"error": "Download Section already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if AppDownload already exists
        app_download = AppDownload.objects.first()
        created = False
        if not app_download:
            app_download = AppDownload.objects.create(
                playstore_link=request.data.get('playstore_link'),
                appstore_link=request.data.get('appstore_link')
            )
            created = True

        download_section_data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'app_download': app_download.id,
            'image': request.FILES.get('image')
        }

        serializer = DownloadSectionSerializer(data=download_section_data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            if 'image' in request.FILES:
                data['image'] = request.build_absolute_uri(serializer.instance.image.url)
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            if created:
                app_download.delete()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            download_section = DownloadSection.objects.last()
        except DownloadSection.DoesNotExist:
            return Response({"error": "Download Section not found"}, status=status.HTTP_404_NOT_FOUND)

        # Update AppDownload Link
        app_download = download_section.app_download
        app_download.playstore_link = request.data.get('playstore_link', app_download.playstore_link)
        app_download.appstore_link = request.data.get('appstore_link', app_download.appstore_link)
        app_download.save()

        # Update DownloadSection
        download_section.title = request.data.get('title', download_section.title)
        download_section.description = request.data.get('description', download_section.description)
        if 'image' in request.FILES:
            download_section.image = request.FILES['image']
        download_section.save()

        serializer = DownloadSectionSerializer(download_section)
        data = serializer.data
        if download_section.image:
            data['image'] = request.build_absolute_uri(download_section.image.url)
        data['playstore_link'] = app_download.playstore_link
        data['appstore_link'] = app_download.appstore_link
        return Response(data, status=status.HTTP_200_OK)

class PackagesSectionCMSView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        package_section = PricingPlanSection.objects.first()
        if not package_section:
            return Response([], status=status.HTTP_200_OK)
        
        serializer = PricingPlanSectionSerializer(package_section)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Check if PricingPlanSection already exists
        if PricingPlanSection.objects.exists():
            return Response({"message": "PricingPlanSection already exists. Use PUT to update."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        serializer = PricingPlanSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        package_section = PricingPlanSection.objects.first()
        if not package_section:
            return Response({"message": "PricingPlanSection does not exist. Use POST to create."},
                            status=status.HTTP_404_NOT_FOUND)
        
        serializer = PricingPlanSectionSerializer(package_section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "PricingPlanSection updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PackagesSectionView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, pk=None):
        if pk:
            try:
                plan = PricingPlan.objects.get(id=pk)
                plan_features = PriceFeatures.objects.filter(pricing_plan=plan.id)
                data = {
                    "id": plan.id,
                    "plan_name": plan.plan_name,
                    "description": plan.description,
                    "price": str(plan.price),
                    "billing_cycle": str(plan.billing_cycle),
                    "features": [
                        {
                            "id": feature.id,
                            "features": feature.features,
                            "is_active": feature.is_active
                        }
                        for feature in plan_features
                    ]
                }
                return Response(data, status=status.HTTP_200_OK)
            except PricingPlan.DoesNotExist:
                return Response({"error": "Pricing plan not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            plans = PricingPlan.objects.all()
            data = []  # This is the key fix!
            for plan in plans:
                plan_features = PriceFeatures.objects.filter(pricing_plan=plan.id)
                plan_data = {
                    "id": plan.id,
                    "plan_name": plan.plan_name,
                    "description": plan.description,
                    "price": str(plan.price),
                    "billing_cycle": str(plan.billing_cycle),
                    "features": [
                        {
                            "id": feature.id,
                            "features": feature.features
                        }
                        for feature in plan_features
                    ]
                }
                data.append(plan_data)
            return Response({"plans": data}, status=status.HTTP_200_OK)

    def post(self, request):
        # Check if PricingPlanSection exists, else create
        section = PricingPlanSection.objects.first()
        if not section:
            return Response({"error": "Packages Section not available"}, status=status.HTTP_404_NOT_FOUND)

        # Create a PricingPlan linked to the section
        plan_data = {
            'pricingplan_section': section.id,
            'plan_name': request.data.get('plan_name'),
            'description': request.data.get('description'),
            'price': request.data.get('price'),
            'billing_cycle': request.data.get('billing_cycle')
        }

        pricing_plan_serializer = PricingPlanSerializer(data=plan_data)
        if pricing_plan_serializer.is_valid():
            pricing_plan = pricing_plan_serializer.save()

            features_raw = request.data.get('features', [])
            if isinstance(features_raw, str):
                try:
                    features_data = json.loads(features_raw)
                except json.JSONDecodeError:
                    return Response({"error": "Invalid format for features"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                features_data = features_raw

            for feature_data in features_data:
                feature_obj = PriceFeatures(
                    features=feature_data.get('features'),
                    pricing_plan=pricing_plan
                )
                feature_obj.save()

            return Response(pricing_plan_serializer.data, status=status.HTTP_201_CREATED)
        return Response(pricing_plan_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "Plan ID is required for update"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plan = PricingPlan.objects.get(id=pk)
        except PricingPlan.DoesNotExist:
            return Response({"error": "Pricing plan not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PricingPlanSerializer(plan, data=request.data, partial=True)
        if serializer.is_valid():
            updated_plan = serializer.save()

            features_raw = request.data.get('features', [])
            if isinstance(features_raw, str):
                try:
                    features_data = json.loads(features_raw)
                except json.JSONDecodeError:
                    return Response({"error": "Invalid format for features"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                features_data = features_raw

            PriceFeatures.objects.filter(pricing_plan=updated_plan).delete()
            for feature_data in features_data:
                PriceFeatures.objects.create(
                    features=feature_data.get('features'),
                    pricing_plan=updated_plan
                )

            # Step 5: Prepare response
            created_features = PriceFeatures.objects.filter(pricing_plan=updated_plan)
            features_serializer = PriceFeaturesSerializer(created_features, many=True)

            response_data = serializer.data
            response_data['features'] = features_serializer.data

            return Response({"message": "Plan updated successfully", "data": response_data}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Package ID (pk) is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plan = PricingPlan.objects.get(id=pk)
        except PricingPlan.DoesNotExist:
            return Response({"error": "Pricing plan not found"}, status=status.HTTP_404_NOT_FOUND)

        feature_names = list(plan.price_features.values_list('features', flat=True))
        plan.delete()

        return Response({
            "message": "Pricing plan and its features deleted successfully",
            "deleted_features": feature_names
        }, status=status.HTTP_200_OK)


class HomePageView(APIView):
    def get(self, request):
        response_data = {}

        # App Info
        app_info = AppInfo.objects.last()
        if app_info:
            response_data["app_info"] = {
                "id": app_info.id,
                "tagline": app_info.tagline,
                "title": app_info.title,
                "description": app_info.description,
                "playstore_link": app_info.app_download.playstore_link if app_info.app_download else None,
                "appstore_link": app_info.app_download.appstore_link if app_info.app_download else None,
                "image": request.build_absolute_uri(app_info.image.url) if app_info.image else None,
            }

        # Feature Section
        featuresection = FeatureSection.objects.last()
        if featuresection:
            features = Feature.objects.filter(feature_section=featuresection)
            response_data["feature_section"] = {
                "id": featuresection.id,
                "header": featuresection.header,
                "description": featuresection.description,
                "features": [
                    {
                        "id": feature.id,
                        "title": feature.title,
                        "description": feature.description,
                        "icon": request.build_absolute_uri(feature.icon.url) if feature.icon else None
                    }
                    for feature in features
                ]
            }

        # How It Works
        howitworks_section = HowItWorksSection.objects.last()
        if howitworks_section:
            steps = HowItWorksStep.objects.filter(howitworks_section=howitworks_section)
            response_data["how_it_works_section"] = {
                "id": howitworks_section.id,
                "header": howitworks_section.header,
                "description": howitworks_section.description,
                "image": request.build_absolute_uri(howitworks_section.image.url) if howitworks_section.image else None,
                "steps": [
                    {
                        "id": step.id,
                        "title": step.title,
                        "description": step.description,
                        "icon": request.build_absolute_uri(step.icon.url) if step.icon else None
                    }
                    for step in steps
                ]
            }
        
        # Pricing Plan Section
        package_section = PricingPlanSection.objects.first()
        if package_section:
            plans = PricingPlan.objects.filter(pricingplan_section=package_section)
            pricing_plans = []
            for plan in plans:
                features = PriceFeatures.objects.filter(pricing_plan=plan.id)
                pricing_plans.append({
                    "id": plan.id,
                    "plan_name": plan.plan_name,
                    "description": plan.description,
                    "price": str(plan.price),
                    "billing_cycle": str(plan.billing_cycle),
                    "features": [
                        {
                            "id": feature.id,
                            "features": feature.features
                        }
                        for feature in features
                    ]
                })
            response_data["pricing_plan_section"] = {
                "id": package_section.id,
                "header": package_section.header,
                "description": package_section.description,
                "pricing_plans": pricing_plans
            }
        
        # Referral Section
        referral = ReferralSection.objects.last()
        if referral:
            referral_data = ReferralSectionSerializer(referral).data
            referral_data['image'] = request.build_absolute_uri(referral.image.url) if referral.image else None
            response_data["referral_section"] = referral_data

        # Download Section
        download_section = DownloadSection.objects.last()
        if download_section:
            response_data["download_section"] = {
                "id": download_section.id,
                "title": download_section.title,
                "description": download_section.description,
                "playstore_link": download_section.app_download.playstore_link if download_section.app_download else None,
                "appstore_link": download_section.app_download.appstore_link if download_section.app_download else None,
                "image": request.build_absolute_uri(download_section.image.url) if download_section.image else None,
            }
        return Response(response_data, status=status.HTTP_200_OK)
