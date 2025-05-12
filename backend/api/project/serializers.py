from rest_framework import serializers
from project_management.models import Project,Transactions
from profile_management.models import Profile
from django.contrib.auth import get_user_model

from master.models import JobCategory,Location
from project_management.models import Feedback
from api.profile.serializers import ProfileSerializer
from api.master.serializers import LocationSerailizer
# from api.project.serializers import JobCategorySerializer


user = get_user_model()

from rest_framework import serializers
from project_management.models import Project, Bid, Profile  # Adjust the import path as necessary
from master.models import JobCategory,Location

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = '__all__'
    
    def validate_image(self, value):
        if not value and self.instance:
            return self.instance.image
        return value


# class ProjectSerializer(serializers.ModelSerializer):

#     # client_profile_pic = serializers.SerializerMethodField()
#     # client_full_name = serializers.SerializerMethodField()
#     project_category = JobCategorySerializer(read_only=True)
#     # project_location = LocationSerailizer(read_only=True)  # Corrected to use the LocationSerializer
#     project_location = serializers.SerializerMethodField()

#     # can_send_bid = serializers.SerializerMethodField()
#     provider = serializers.SerializerMethodField()
#     project_total_cost = serializers.SerializerMethodField()
#     longitude = serializers.SerializerMethodField()
#     latitude = serializers.SerializerMethodField()
# #   Cost Part changes 
#     project_total_cost = serializers.SerializerMethodField()
#     # def get_project_location(self, obj):
#     #     return obj.project_location.country if obj.project_location else None
#     bid_cost = serializers.SerializerMethodField()


#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         if instance.project_location:
#             representation["project_location"] = instance.project_location.country
#         else:
#             representation["project_location"] = ""
#         return representation
#     def get_provider(self,obj):
#         if obj.bid.filter(status__iexact="accepted").last():
#             return ProfileSerializer(obj.bid.filter(status__iexact="accepted").last().service_provider).data
#         elif obj.status=="completed" or obj.status=="Completed":
#             return ProfileSerializer(obj.bid.filter(status__iexact="accepted").last().service_provider).data
        
#     def get_bid_cost(self, obj):
#         if obj.bid.last():
#             return obj.bid.last().project_total_cost

#     def get_project_total_cost(self, obj):
#         bids = obj.bid.filter(status='accepted')
#         if bids.exists():
#             return bids.first().project_total_cost
#         return ""

#     def get_client_full_name(self, obj):
#         return obj.client.user.full_name
#         # return ""

#     def get_client_profile_pic(self,obj):
#         if obj.client.profile_picture:
#             return obj.client.profile_picture.url
#         return ""
    
#     def get_project_location(self, obj):
#         location =  JobCategory.objects.all()
#         if location:
#             return (Location.latitude, Location.longitude)
#         return ""
    
#     # def bid_budge_cost(self, obj):
#     #     if obj.project_total_cost:
#     #         return Bid.objects.filter(id=obj.project.id).first().code
#     #     return ""
#         # cost = Bid.objects.filter(id=obj.project.id).first()
#         # if cost:
#         #     return cost.budget_cost
#         # else:
#         #     pass

#     def get_project_category(self,obj):
#         category =  JobCategory.objects.all() # (id=obj.project_category.id).first()
#         if category:
#             return (category.id, category.title)
#             # return {'id': category.id, 'title': category.title}
#     def get_project_location(self,obj):
#         if obj.project_location:ject
#             return Location.objects.filter(id=obj.project_location.id).first().code
#         return ""
    

    
#     class Meta:
#         model = Project
#         #fields = '__all__'
#         fields = [
#             "longitude", "latitude", "project_hrs_week", "project_timeline", "project_budget",
#             "project_address", "project_description", "project_title", "client",
#             "project_location", "project_category","provider",'project_total_cost'
#         ]

#     def get_longitude(self, obj):
#         return obj.project_location.longitude if obj.project_location else None
    
#     def get_latitude(self, obj):
#         return obj.project_location.latitude if obj.project_location else None

#     def create(self, validated_data):
#         latitude = self.initial_data.get("latitude")
#         longitude = self.initial_data.get("longitude")
#         country = self.initial_data.get("country", "")
#         code = self.initial_data.get("code", "")

#         # Create or get the location
#         location, created = Location.objects.get_or_create(
#             latitude=latitude,
#             longitude=longitude,
#             defaults={"country": country, "code": code}
#         )
#         validated_data["project_location"] = location

#         return super().create(validated_data)
#     # def get_can_send_bid(self, obj):
#     #     request = self.context.get('request')
#     #     if request and hasattr(request, 'user'):
#     #         user = request.user
#     #         return not Bid.objects.filter(service_provider=Profile.objects.get(user=user),project=obj)
#     #         # return not obj.bids.filter(service_provider=user).exists()
#     #     return True

    
#     # def get_can_send_bid(self, obj):
#     #     request = self.context.get('request')
#     #     if request and hasattr(request, 'user'):
#     #         user = request.user
#     #         try:
#     #             user_profile = Profile.objects.get(user=user)
#     #             bid_exists = Bid.objects.filter(service_provider=user_profile, project=obj).exists()
#     #             return bid_exists
#     #         except Profile.DoesNotExist:
#     #             return False
#     #     return False

#     def get_can_send_bid(self, obj):
#         request = self.context.get('request')
#         if request and hasattr(request, 'user'):
#             user = request.user
#             try:
#                 # Get the user profile
#                 user_profile = Profile.objects.get(user=user)
#                 bid_exists = Bid.objects.filter(service_provider=user_profile, project=obj).exists()
#                 return not bid_exists
#             except Profile.DoesNotExist:
#                 return False
#         return False


class ProjectSerializer(serializers.ModelSerializer):
    client_profile_pic = serializers.SerializerMethodField()
    client_full_name = serializers.SerializerMethodField()
    # project_category = JobCategorySerializer(read_only=True)
    project_category = serializers.SerializerMethodField()
    project_location = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    can_send_bid = serializers.SerializerMethodField()
    provider = serializers.SerializerMethodField()
    project_total_cost = serializers.SerializerMethodField(method_name="get_bid_cost")
    bid_cost = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    # bis_sent = serializers.SerializerMethodField()
    client_id = serializers.CharField(source='user.first_name',read_only=True)
    document=serializers.FileField(required=False)
    # country = serializers.SerializerMethodField()
    bid = serializers.SerializerMethodField()
    project_timeline=serializers.CharField()
    project_hrs_week=serializers.CharField()
    # bid_time_line=serializers.SerializerMethodField()
    # bid_time_line_hour=serializers.SerializerMethodField()
    client = ProfileSerializer(read_only=True)
    # can__send_bid=serializers.SerializerMethodField()
        
    def get_bid(self, obj):
        try:
            #bid = obj.bid.filter(status__iexact="Accepted").last()
            bid = obj.bid.all().last()
            data={
                "bid_id":bid.id,
                "bid_details":bid.bid_details,
                "quotation_details":bid.quotation_details,
                "project_total_cost":bid.project_total_cost,
                "time_line":bid.time_line,
                "time_line_hour":bid.time_line_hour,
            }
            return data
        except Exception as e:
            print(e)
            return []

    def get_can_send_bid(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            profile = request.user.profile
            
            # if obj.project.status == "myoffer":
            #     return True
            
            existing_bid = Bid.objects.filter(
                service_provider=profile, 
                project=obj.id
            ).exists()
            
            return not existing_bid
        return False
    
    def get_can__send_bid(self, obj):
        try:
            if obj.can__send_bid:
                return obj.can__send_bid
            else:
                return True
        except:
            return True
    def get_email(self, obj):
        return obj.client.user.email
    
    def get_payment_status(self, obj):
        transaction=Transactions.objects.filter(bid__project=obj,status="in_progress").last()
        if transaction:
            return "in_progress"
        return " "
        # obj.payment_status if obj.payment_status else

    # def get_provider(self, obj):
    #     accepted_bid = obj.bid.filter(status__iexact="accepted").last()
    #     if accepted_bid:
    #         return ProfileSerializer(accepted_bid.service_provider).data
    #     return None

    def get_provider(self,obj):
        if obj.bid.filter(status__iexact="accepted").last():
            return ProfileSerializer(obj.bid.filter(status__iexact="accepted").last().service_provider).data
        elif obj.status=="completed" or obj.status=="Completed":
            return ProfileSerializer(obj.bid.filter(status__iexact="accepted").last().service_provider.all()).data # .last()
        elif obj.status=="ongoing" or obj.status=="Ongoing":
            return ProfileSerializer(obj.bid.filter(status__iexact="ongoing").last().service_provider.all()).data
        else:
            return ProfileSerializer(obj.bid.all().last().service_provider).data
        
    def get_bid_cost(self, obj):
        try:
            last_bid = obj.bid.filter(status__iexact="accepted").last()
            print("last_bid---", last_bid)
            if last_bid:
                return last_bid.project_total_cost
            return ""
        except:
            return ""


    def get_client_full_name(self, obj):
        return obj.client.user.full_name if obj.client else ""

    def get_client_profile_pic(self, obj):
        if obj.client and obj.client.profile_picture:
            return obj.client.profile_picture.url
        return ""

    # def get_project_location(self,obj):
    #     if obj.project_location:
    #         return Location.objects.filter(id=obj.project_location.id).first().code
    #     return ""
    # def get_project_location(self, obj):
    #     return obj.project_location.code if obj.project_location else ""

    def get_provider(self, obj):
        accepted_bid = obj.bid.filter(status__iexact="accepted").last()
        if accepted_bid:
            return ProfileSerializer(accepted_bid.service_provider).data
        return None


    # def get_bis_sent(self, obj):
    #     request = self.context.get('request')
    #     if request and request.user.is_authenticated:
    #         return obj.bid.service_provider == request.user.profile
    #     return True
    
    # def get_project_total_cost(self, obj):
    #     accepted_bids = obj.bid.filter(status='accepted')
    #     if accepted_bids.exists():
    #         return accepted_bids.first().project_total_cost
    #     return None
    # def get_project_total_cost(self,obj):
    #     return obj.project_budget
    def get_client_full_name(self, obj):
        return obj.client.user.full_name if obj.client else ""

    # def get_client_profile_pic(self, obj):
    #     if obj.client and obj.client.profile_picture:
    #         return obj.client.profile_picture.url
    #     return ""

    # def get_project_category(self, obj):
    #     try:
    #         category =  JobCategory.objects.all() #filter(id=obj.project_category.id).first()
    #         if category:
    #             return (category)
    #             # return (category.id, category.title)
    #     except:
    #         " "
    def get_project_category(self, obj):
        try:
            return JobCategorySerializer(JobCategory.objects.filter(id=obj.project_category.id).first()).data
        except:
            return ""


    def get_project_location(self, obj):
        return obj.project_location.country if obj.project_location else ""

    def get_longitude(self, obj):
        return obj.project_location.longitude if obj.project_location else ""

    def get_latitude(self, obj):
        return obj.project_location.latitude if obj.project_location else ""

    # def get_can_send_bid(self, obj):
    #     request = self.context.get('request')
    #     if request and hasattr(request, 'user'):
    #         user = request.user
    #         try:
    #             user_profile = Profile.objects.get(user=user)
    #             return not Bid.objects.filter(service_provider=user_profile, project=obj).exists()
    #         except Profile.DoesNotExist:
    #             return False
    #     return False

    ################## ADDED ################
    # def get_can_send_bid(self, obj):
    #     request = self.context.get('request')
    #     if request and hasattr(request, 'user'): 
    #         user = request.user
    #         try:
    #             user_profile = Profile.objects.get(user=user)
    #             existing_bid = Bid.objects.filter(service_provider=user_profile, project=obj).exists() 
    #             return not existing_bid
    #         except Profile.DoesNotExist: 
    #             return True
    #     return False
    class Meta:
        model = Project
        fields = '__all__'



    def create(self, validated_data):
        latitude = self.initial_data.get("latitude")
        longitude = self.initial_data.get("longitude")
        country = self.initial_data.get("project_location", "")
        code = self.initial_data.get("code", "")

        location = Location.objects.filter(
            latitude=latitude,
            longitude=longitude,
            country= country, 
            code= code
        ).last()
        if not location:
            location = Location.objects.create(
                latitude=latitude,
                longitude=longitude,
                country= country, 
                code= code)
            # validated_data["country"] = location

        validated_data["project_location"] = location

        project = super().create(validated_data)

        if project.client:
            profile = project.client
            profile.location = location
            profile.save()

        return project


class AdminProjectSerializer(serializers.ModelSerializer):
    client_profile_pic = serializers.SerializerMethodField()
    client_full_name = serializers.SerializerMethodField()
    project_category = JobCategorySerializer(read_only=True)
    project_location = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    can_send_bid = serializers.SerializerMethodField()
    provider = serializers.SerializerMethodField()
    project_total_cost = serializers.SerializerMethodField()
    bid_cost = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    # client = serializers.SerializerMethodField()
    # country = serializers.SerializerMethodField()
    client = ProfileSerializer(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
    
    def get_field_names(self, declared_fields, info):
        fields= super().get_field_names(declared_fields, info)
        return fields.append("client")
    def get_email(self, obj):
        return obj.client.user.email
    
    def get_payment_status(self, obj):
        return " "
        # obj.payment_status if obj.payment_status else

    # def get_provider(self, obj):
    #     accepted_bid = obj.bid.filter(status__iexact="accepted").last()
    #     if accepted_bid:
    #         return ProfileSerializer(accepted_bid.service_provider).data
    #     return None

    def get_provider(self,obj):
        if obj.bid.filter(status__iexact="accepted").last():
            return ProfileSerializer(obj.bid.filter(status__iexact="accepted").last().service_provider).data
        elif obj.status=="completed" or obj.status=="Completed":
            return ProfileSerializer(obj.bid.filter(status__iexact="completed").last().service_provider).data
        elif obj.status=="ongoing" or obj.status=="Ongoing":
            return ProfileSerializer(obj.bid.filter(status__iexact="ongoing").last().service_provider).data
        else:
            return ProfileSerializer(obj.service_provider).data


    def get_project_total_cost(self, obj):
        accepted_bids = obj.bid.filter(status='accepted')
        if accepted_bids.exists():
            return accepted_bids.first().project_total_cost
        return None

    def get_client_full_name(self, obj):
        return obj.client.user.full_name if obj.client else ""

    def get_client_profile_pic(self, obj):
        if obj.client and obj.client.profile_picture:
            return obj.client.profile_picture.url
        return ""

    # def get_project_location(self,obj):
    #     if obj.project_location:
    #         return Location.objects.filter(id=obj.project_location.id).first().code
    #     return ""
    # def get_project_location(self, obj):
    #     return obj.project_location.code if obj.project_location else ""

    def get_provider(self, obj):
        accepted_bid = obj.bid.filter(status__iexact="accepted").last()
        if accepted_bid:
            return ProfileSerializer(accepted_bid.service_provider).data
        return " "

    def get_bid_cost(self, obj):
        last_bid = obj.bid.all().last()
        if last_bid:
            return last_bid.project_total_cost
        return " "

    def get_project_total_cost(self, obj):
        accepted_bids = obj.bid.filter(status='accepted')
        if accepted_bids.exists():
            return accepted_bids.first().project_total_cost
        return " "

    def get_client_full_name(self, obj):
        return obj.client.user.full_name if obj.client else ""

    def get_client_profile_pic(self, obj):
        if obj.client and obj.client.profile_picture:
            return obj.client.profile_picture.url
        return ""

    def get_project_location(self, obj):
        return obj.project_location.country if obj.project_location else ""

    def get_longitude(self, obj):
        return obj.project_location.longitude if obj.project_location else ""

    def get_latitude(self, obj):
        return obj.project_location.latitude if obj.project_location else ""

    # def get_can_send_bid(self, obj):
    #     request = self.context.get('request')
    #     if request and hasattr(request, 'user'):
    #         user = request.user
    #         try:
    #             user_profile = Profile.objects.get(user=user)
    #             return not Bid.objects.filter(service_provider=user_profile, project=obj).exists()
    #         except Profile.DoesNotExist:
    #             return False
    #     return False

    # def get_can_send_bid(self, obj):
    #     request = self.context.get('request')
    #     if request and hasattr(request, 'user'): 
    #         user = request.user
    #         try:
    #             user_profile = Profile.objects.get(user=user)
    #             existing_bid = Bid.objects.filter(service_provider=user_profile, project=obj).exists() 
    #             return not existing_bid
    #         except Profile.DoesNotExist: 
    #             return False
    #     return False
    # def create(self, validated_data):
    #     validated_data.pop('bid_send', None)
    #     return super().create(validated_data)

    def create(self, validated_data):
        latitude = self.initial_data.get("latitude")
        longitude = self.initial_data.get("longitude")
        country = self.initial_data.get("project_location", "")
        code = self.initial_data.get("code", "")
        validated_data.pop('bid_send', "")


        location, created = Location.objects.get_or_create(
            latitude=latitude,
            longitude=longitude,
            country=country,
            code=code
            # defaults={"country": country, "code": code}
        )

        validated_data["project_location"] = location

        project = super().create(validated_data)

        if project.client:
            profile = project.client
            profile.location = location
            profile.save()

        return project

# class BidSerializerMobilie(serializers.ModelSerializer):
#     project = ProjectSerializer(read_only=True) 
#     service_provider = serializers.SerializerMethodField() 
#     def get_service_provider(self, obj):
#         if obj.service_provider.profile_picture:
#             return {"id":obj.service_provider.id,"full_name":obj.service_provider.user.full_name, "profile_picture":obj.service_provider.profile_picture.url, "email":obj.service_provider.user.email, "phone":obj.service_provider.phone, "profile_rating":obj.service_provider.profile_rating, "address":obj.service_provider.address}
#         else:
#             return {"id":obj.service_provider.id,"full_name":obj.service_provider.user.full_name, "profile_picture":"", "email":obj.service_provider.user.email, "phone":obj.service_provider.phone, "profile_rating":obj.service_provider.profile_rating, "address":obj.service_provider.address}

#     # return [category.job_category.id for category in obj.profilejobcategories_set.all()] # profile = ProfileSerializer(read_only=True)
#     client_name = serializers.SerializerMethodField() 
#     def get_client_name(self, obj):
#         full_name =obj.project.client.user.full_name 
#         return full_name

#     def validate(self, data):
#         service_provider = self.context['request'].user.profile 
#         print("service_provider", service_provider)
#         if service_provider.id != data['service_provider'].id:
#             raise serializers.ValidationError({"service_provider": "You can't bid on a project"})
        
#         project = data.get('project') 
#         print("project", project)

#         if Bid.objects.filter(service_provider=service_provider, project=project).exists():
#             raise serializers.ValidationError("Aready submitted a bid ") 
#         return data
    
#     class Meta:
#         model = Bid
#         fields = ' all '

#     # def create(self, validated_data):
#     #	print(validated_data)
#     #	bid=super().create(validated_data)
#     #	bid.project=validated_data['project'] #	bid.save()
#     #	return bid

#     def create(self, validated_data): 
#         request = self.context.get('request')

#         if not request or not hasattr(request, 'user'):
#             raise serializers.ValidationError("User information is required.")

#         try:
#             service_provider = request.user.profile
#         except Profile.DoesNotExist:
#             raise serializers.ValidationError("The logged-in user does not have a profile.")

#         bid = Bid.objects.create( 
#             service_provider=service_provider, 
#             project=validated_data.get('project'), 
#             bid_details=validated_data.get('bid_details'),
#             quotation_details=validated_data.get('quotation_details'), 
#             project_total_cost=validated_data.get('project_total_cost'), 
#             time_line=validated_data.get('time_line'), 
#             time_line_hour=validated_data.get('time_line_hour')
#         )

#         return bid

class BidSerializer(serializers.ModelSerializer):
    client = ProfileSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    # project = serializers.SerializerMethodField()
    service_provider = serializers.SerializerMethodField()
    # can__send_bid = serializers.SerializerMethodField()
    bis_sent = serializers.SerializerMethodField()
    is_accepted = serializers.BooleanField(read_only=True)
    project_title = serializers.CharField(source="project.project_title", read_only=True)

    def get_service_provider(self, obj):
        if obj.service_provider.profile_picture:
            return {"id":obj.service_provider.id,"full_name":obj.service_provider.user.full_name, "profile_picture":obj.service_provider.profile_picture.url, "email":obj.service_provider.user.email, "phone":obj.service_provider.phone, "profile_rating":obj.service_provider.profile_rating, "address":obj.service_provider.address}
        else:
            return {"id":obj.service_provider.id,"full_name":obj.service_provider.user.full_name, "profile_picture":"", "email":obj.service_provider.user.email, "phone":obj.service_provider.phone, "profile_rating":obj.service_provider.profile_rating, "address":obj.service_provider.address}

    service_provider = ProfileSerializer(read_only=True)
        # return [category.job_category.id for category in obj.profilejobcategories_set.all()]
    # profile = ProfileSerializer(read_only=True)
    client_name = serializers.SerializerMethodField()
    def get_client_name(self, obj):
        full_name =obj.project.client.user.full_name
        return full_name
    

    def get_bis_sent(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.service_provider == request.user.profile
        return True

    # def validate(self, data):
    #     request = self.context.get('request')
    #     if request:
    #         service_provider = Profile.objects.get(user=request.user).id
    #         project = data.get('project')
    #         if Bid.objects.filter(service_provider=service_provider, project=project).exists():
    #             raise serializers.ValidationError("You have already submitted a bid for this project.")
    #     return data
    
    def validate(self, data):
        request = self.context.get('request')
        if request:
            service_provider = Profile.objects.get(user=request.user)
            project = data.get('project')
        
            # Check if any non-rejected bids exist
            has_active_bid = Bid.objects.filter(
                service_provider=service_provider, 
                project=project
            ).exclude(status='Rejected').exists()
        
            if has_active_bid:
                raise serializers.ValidationError("You already have an active bid for this project. You cannot submit another bid until your current bid is rejected.")
        return data
    # def get_project(self, obj):
    #     project = list(Project.objects.filter(id=obj.project_id).values())[0]
    #     project['bid_cost']=obj.project_total_cost
    #     return project

    # def get_can__send_bid(self, obj):
    #     try:
    #         if obj.can__send_bid:
    #             return obj.can__send_bid
    #         else:
    #             return True
    #     except:
    #         pass
    #     request = self.context.get('request')
    #     if request and request.user.is_authenticated:
    #         profile = request.user.profile
            
    #         if obj.project.status == "myoffer":
    #             return False
            
    #         existing_bid = Bid.objects.filter(
    #             service_provider=profile, 
    #             project=obj.project
    #         ).exists()
            
    #         return not existing_bid
    #     return False
    
    def get_can__send_bid(self, obj):
        request = self.context.get('request')
    
        if not request or not request.user.is_authenticated:
            return False  # Block if no user or request

        profile = request.user.profile
        project = obj.project if hasattr(obj, 'project') else obj

        # Ensure no active or pending bid exists except 'Rejected'
        existing_bid = Bid.objects.filter(
            service_provider=profile, 
            project=project
        ).exclude(status__iexact='Rejected').exists()  

        return not existing_bid  # Return False if active bid exists

    class Meta:
        model = Bid
        fields = '__all__'
        read_only_fields = ['is_accepted']

    # def create(self, validated_data):
    #     print(validated_data)
    #     bid=super().create(validated_data)
    #     bid.project=validated_data['project']
    #     bid.save()
    #     return bid

class BidSerializerProjectView(serializers.ModelSerializer):
    project_category = serializers.SerializerMethodField()
    client_name = serializers.SerializerMethodField()
    client_location = serializers.SerializerMethodField()
    can_send_bid=serializers.SerializerMethodField()
    bid = serializers.SerializerMethodField()
    def get_can_send_bid(self,obj):
        try:
            if obj.can_send_bid:
                return obj.can_send_bid
            else:
                return True
        except:
            return True
    def get_bid(self, obj):
        bid = obj.bid #.filter(status='Accepted') #.all()
        return BidSerializer(bid, many=True).data
    
    # project=ProjectSerializer(read_only=True)
    def get_project_category(self,obj):
        if obj.project_category:
            # job_category = JobCategory.objects.filter(id=obj.project_category.id).first()
            # return job_category.title if job_category else None
            return JobCategory.objects.filter(id=obj.project_category.id).first().title
        # return None
    def get_client_name(self, obj):
        full_name =obj.client.user.full_name
        return full_name if full_name else " "
    
    def get_client_location(self, obj):
        if obj.client.location:
            location = obj.client.location.country
        else:
            location=''
        return location if location else " "
    class Meta:
        model = Project
        fields = '__all__'




class TransectionSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    bid = BidSerializer(read_only=True)
    transection_amount = serializers.ReadOnlyField(source='bid.project_total_cost')
    created_at = serializers.SerializerMethodField()
    class Meta:
        model = Transactions
        fields = ['escrow_id', 'status', 'transaction_type', 'bid', 'project', 'transection_amount', 'created_at']

    def get_created_at(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
        # return self.instance.created_at.strftime('%Y-%m-%d %H:%M:%S')

# class JobCategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = JobCategory
#         fields = '__all__'

    # def create(self, validated_data):
    #     return super().create(validated_data)


################



# class ProjectDetailsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Project
#         fields = [
#             'id', 'client', 'project_title', 'project_category', 'project_description',
#             'project_address', 'project_budget', 'project_historytimeline', 'project_hrs_week',
#             'project_location', 'status'
#         ]

from customuser.models import CustomUser

class SwitchRoleSerializer(serializers.ModelSerializer): 
    class Meta:
        model = CustomUser
        fields = ['user_type']

    def update(self, instance, validated_data): 
        if instance.user_type == 'client':
            instance.user_type = 'provider' 
        elif instance.user_type == 'provider':
            instance.user_type = 'client' 
        instance.save()
        return instance
    

