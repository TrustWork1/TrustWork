from rest_framework import serializers
from profile_management.models import BankDetails, UserDocuments, MembershipPlans, ProfileMembership, Profile,ProfileJobCategories,PreviousWorks, Coupons
from django.contrib.auth import get_user_model
from master.models import JobCategory
from rest_framework import serializers
from customuser.models import CustomUser
from api.master.serializers import JobCategorySerailizer
from api.auth.serializers import UserSerializer

from api.master.serializers import LocationSerailizer
# from master.serializers import LocationSerailizer
from master.models import Location
from project_management.models import Project, Bid, Feedback
from django.db.models import F
# from api.project.serializers import FeedbackSerializer

User = get_user_model()

class ProfileJobCategoriesSerializer(serializers.ModelSerializer):
    job_category_titles = serializers.SerializerMethodField()
    class Meta:
        model = ProfileJobCategories
        fields = ['job_category_titles']
    def get_job_category_titles(self, obj):
        print(obj)
        return obj.job_category.title

class BankDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankDetails
        fields = '__all__'
        read_only_fields = ['is_primary', 'created_at', 'updated_at']

class UserDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDocuments
        fields = '__all__'

class MembershipPlansSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlans
        fields = '__all__'

class LocationSerailizer(serializers.ModelSerializer):
    class Meta:
        model=Location
        fields="__all__"

class ProfileMembershipSerializer(serializers.ModelSerializer):
    # membership_plan = MembershipPlansSerializer(read_only=True)  # Nested serializer to show membership plan details
    membership_plan = serializers.PrimaryKeyRelatedField(queryset=MembershipPlans.objects.all())

    class Meta:
        model = ProfileMembership
        fields = ['profile', 'membership_plan', 'start_date', 'end_date']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['project', 'service_provider']

class ProfilePreviousWorksSerializer(serializers.ModelSerializer):
    class Meta:
        model=PreviousWorks
        fields=['profile','image','id']

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupons
        fields = ['coupon_code', 'is_active', 'expire_date']

class ProfileSerializer(serializers.ModelSerializer):
    previous_work=ProfilePreviousWorksSerializer(source="previous_works",many=True,read_only=True,required=False)
    bank_details = BankDetailsSerializer(many=True, read_only=True, source='bankdetails_set')
    user_documents = UserDocumentsSerializer(many=True, read_only=True, source='userdocuments_set') 
    last_login = serializers.DateTimeField(source='user.last_login', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    is_user_active = serializers.BooleanField(source='user.is_user_active', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_referal_code = serializers.CharField(source='user.user_referal_code', read_only=True)
    total_referal_amount = serializers.CharField(source='user.total_referal_amount', read_only=True)
    total_referal_count = serializers.CharField(source='user.total_referal_count', read_only=True)
    referred_by_code = serializers.CharField(source='user.referred_by_code', read_only=True)
    full_name = serializers.CharField(source='user.full_name')    
    memberships = ProfileMembershipSerializer(many=True, read_only=True, source='profilemembership_set')  
    user_type = serializers.CharField(source='user.get_user_type_display',read_only=True) 
    job_category = serializers.SerializerMethodField()
    # year_of_experiance = serializers.SerializerMethodField()
    year_of_experience = serializers.CharField(required=False)
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    # radius = serializers.SerializerMethodField()
    # job_category = JobCategorySerailizer(many=True, read_only=True)
    country = serializers.SerializerMethodField()
    completed_project = serializers.SerializerMethodField()
    # service_provider = serializers.SerializerMethodField()
    feedback= serializers.SerializerMethodField()
    profile_rating= serializers.SerializerMethodField()
    # coupons = serializers.SerializerMethodField()
    is_discount = serializers.BooleanField(source='user.is_discount', read_only=True)

    # def get_job_category(self, obj):
    #     # return obj.profilejobcategories_set.all().values("job_category__id").annotate(title=F("job_category__title"))
    #     # return [category.job_category.id for category in obj.profilejobcategories_set.all()]
    #     try:
    #         # Fetch job categories and annotate them with feedback data
    #         job_categories = obj.profilejobcategories_set.all().values(
    #             "job_category__id",
    #             "job_category__title"
    #         )
    #         ratings=[*job_categories]
    #         for i in obj.profile_bid.filter(status__iexact="Accepted"):
    #             response=dict()
    #             data=Feedback.objects.filter(project=i.project).values()
    #             for value_dict in data:
    #                 if i.project.project_category.title in [x.get('job_category__title') for x in ratings]:

    #                     response["rating"]+=int(value_dict['client_rating']) if value_dict['client_rating'] else int(value_dict['provider_rating'])
    #                     response['times']=int(response['times'])+1
    #                 else:
    #                     response['times']=1
    #                     response[i.project.project_category.title]=True
    #                     response['job_category__id']=i.project.project_category.id
    #                     response['job_category__title']=i.project.project_category.title
    #                     response["rating"]=value_dict['client_rating'] if value_dict['client_rating'] else value_dict['provider_rating']
                    
    #             if response.get("rating"):
    #                 response['rating']=int(response['rating'])/int(response['times'])
    #             ratings.append(response)
    #         return ratings
    #     except Exception as e:

    #         print(f"Error in get_job_category: {e}")
    #         return []

    # def get_coupons(self,obj):
    #     coupons = Coupons.objects.filter(user=obj.user, is_active=True)
    #     return CouponSerializer(coupons, many=True).data
    
    def get_job_category(self, obj):
        try:
            job_categories = obj.profilejobcategories_set.all().values(
                "job_category__id",
                "job_category__image",
                "job_category__title"
            )

            # Convert initial job categories to a list of dictionaries
            category_list = [
                {
                    "job_category__id": cat["job_category__id"],
                    "job_category__title": cat["job_category__title"],
                    "job_category__image": cat["job_category__image"],
                    "times": 0,
                    "rating": 0.0,
                    cat["job_category__title"]: True
                }
                for cat in job_categories
            ]

            # Iterate over accepted bids to calculate ratings
            for bid in obj.profile_bid.filter(status__iexact="Accepted"):
                feedback_data = Feedback.objects.filter(project=bid.project).values()
                
                for feedback in feedback_data:
                    job_category_title = bid.project.project_category.title
                    job_category_id = bid.project.project_category.id
                    
                    # Check if the category exists in the category_list
                    category = next(
                        (cat for cat in category_list if cat["job_category__title"] == job_category_title), 
                        None
                    )

                    if category:
                        # Update the existing category
                        # category["rating"] += int(feedback["client_rating"] or feedback["provider_rating"] or 0)
                        rating = feedback.get("client_rating")
                        if rating:
                            category["rating"] += int(rating)
                            category["times"] += 1
                    else:
                        # Add new category if not in the list
                        category_list.append({
                            "job_category__id": job_category_id,
                            "job_category__title": job_category_title,
                            "times": 1,
                            "rating": int(feedback["client_rating"] or 0),
                            job_category_title: True
                        })

            # Calculate average rating for each category
            for category in category_list:
                if category["times"] > 0:
                    category["rating"] /= category["times"]
                    category['rating']=round(float(category['rating']),1)
            return category_list

        except Exception as e:
            print(f"Error in get_job_category: {e}")
            return []
    def get_user(self, obj):
        data_obj={}
        user = obj.user 
        data= UserSerializer(user).data
        
        return UserSerializer(user).data if user else None
    
    def get_latitude(self, obj):
        try:
            return obj.location.latitude
        except:
            return None
        
    def get_longitude(self, obj):
        try:
            return obj.location.longitude
        except:
            return None
    # def get_radius(self, obj):
    #     try:
    #         return obj.location.radius
    #     except:
    #         return " "
    def get_country(self, obj):
        try:
            return obj.location.country
        except:
            return None

    def get_feedback(self, obj):
        try:
            print(obj.profile_feedback.all())
            fb={}
            for feedback in obj.profile_feedback.all():
                
                pass
            return FeedbackSerializer(obj.profile_feedback.all(),many=True).data
        except:
            return "No feedback"
    def get_profile_rating(self, obj):
        try:
            print(obj.profile_feedback.all())
            fb={"rating":0,'times':0}
            for feedback in obj.profile_feedback.all():
               
                rating = feedback.client_rating
                print(rating)
                if rating:
                    fb["rating"] += int(rating)
                    fb["times"] += 1

                pass
            if fb["times"] > 0:
                    fb["rating"] /= fb["times"]
                    fb['rating']=round(float(fb['rating']),1)
            return fb['rating']
        except Exception as e:
            print(e)
            return 0

    
    def get_completed_project(self, obj):
        provider_id = Project.objects.filter(bid__service_provider = obj.id, status="completed").count()
        return provider_id
    
    class Meta:
        model = Profile
        fields = ["total_referal_amount","total_referal_count","is_user_active","previous_work","phone_extension",
          'user_referal_code', 'referred_by_code', 'last_login','is_active', 'email', 'first_name', 'last_name', 'full_name','notification_enabled',
            'user_type', 'phone', 'address', 'profile_picture', 'cover_image', 'associated_organization','feedback',
            'organization_registration_id', 'service_details', 'client_notes', 'profile_bio','year_of_experience',
            'bank_details', 'user_documents', 'memberships',"user","id","status","job_category","street","profession","city","state","zip_code",
            "is_accepted_terms_conditions",'is_payment_verified', "is_profile_updated","profile_rating", "year_of_experiance" ,
            "latitude", "longitude", "country", "completed_project", "is_discount"
        ]
    
    def create(self, validated_data):
        """
        Create or get the project location and set it to the project.
        """
        latitude = self.initial_data.get("latitude")
        longitude = self.initial_data.get("longitude")
        country = self.initial_data.get("country", "")
        code = self.initial_data.get("code", "")
        print("self.initial_data", self.initial_data)
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
            validated_data["country"] = location
        # return super().create(validated_data)
        user = validated_data.get('user', None)
        if not user:
            raise serializers.ValidationError("User is required to create a profile.")

        profile = Profile.objects.create(**validated_data)
        profile.location=location
        profile.save()
        return profile
    
    # def update(self, instance, validated_data):
    #     latitude = self.initial_data.get("latitude")
    #     longitude = self.initial_data.get("longitude")
    #     country = self.initial_data.get("country", "")
    #     code = self.initial_data.get("code", "")
        
    #     if latitude and longitude:
    #         location = Location.objects.filter(
    #             latitude=latitude,
    #             longitude=longitude,
    #             country= country, 
    #             code= code
    #         ).last()
    #     if not location:
    #         location = Location.objects.update(
    #             latitude=latitude,
    #             longitude=longitude,
    #             country= country, 
    #             code= code).last()
    #         validated_data["country"] = location
    #         # instance.location = location
    #     user = validated_data.get('user', None)

    #     profile = Profile.objects.update(**validated_data)
    #     profile.location=location
    #     profile.save()
    #     # return profile
    #     if "job_category" in validated_data:
    #         try:
    #             job_categories = JobCategory.objects.filter(id__in=eval(str(validated_data.get('job_category'))))
    #             instance.job_category.set()
    #             instance.job_category.set(job_categories)
                
    #         except Exception as e:
    #                 print(e) 
    #     # Update the User model fields
    #     if "user" in validated_data:
    #         user_data = validated_data.pop('user')
    #         user = instance.user
    #         full_name=user_data.get("full_name")
    #         user.full_name=full_name
    #         user.first_name=full_name.split(" ")[0]
    #         user.last_name="" if len(full_name.split(" "))==1 else " ".join(full_name.split(" ")[1:])
    #         user.save()

    #     year_of_experience = validated_data.get('year_of_experience', None)
    #     if year_of_experience is not None:
    #         instance.year_of_experience = year_of_experience
        
    #     return super().update(instance,validated_data)
    
    def update(self, instance, validated_data):
        latitude = self.initial_data.get("latitude")
        longitude = self.initial_data.get("longitude")
        country = self.initial_data.get("country", "")
        code = self.initial_data.get("code", "")

        location = None
        if latitude and longitude:
            location = Location.objects.filter(
                latitude=latitude,
                longitude=longitude,
                country=country,
                code=code
            ).last()
            if not location:
                location = Location.objects.create(
                    latitude=latitude,
                    longitude=longitude,
                    country=country,
                    code=code
                )

        for attr, value in validated_data.items():
            if attr != 'user':
                setattr(instance, attr, value)

        if location:
            instance.location = location

        if "job_category" in validated_data:
            try:
                job_categories = JobCategory.objects.filter(id__in=eval(str(validated_data.get('job_category'))))
                instance.job_category.set(job_categories)
            except Exception as e:
                print(e)

        if "user" in validated_data:
            user_data = validated_data.pop('user')
            user = instance.user
            full_name = user_data.get("full_name")
            if full_name:
                user.full_name = full_name
                user.first_name = full_name.split(" ")[0]
                user.last_name = "" if len(full_name.split(" ")) == 1 else " ".join(full_name.split(" ")[1:])
                user.save()

        year_of_experience = validated_data.get('year_of_experience', None)
        if year_of_experience is not None:
            instance.year_of_experience = year_of_experience
        instance.save()
        return instance


class GenerateOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password_reset_otp = serializers.CharField(max_length=4)

class ChangePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'error': "New password and confirm password don't match"
            })
        return data


# from rest_framework import serializers
# from django.contrib.auth.tokens import PasswordResetTokenGenerator
# from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
# from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

# class OTPSerializer(serializers.Serializer):
#     email = serializers.EmailField()

# class VerifyOTPSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     otp = serializers.CharField()

# class ChangePasswordSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     old_password = serializers.CharField()
#     new_password = serializers.CharField()

# class PasswordResetSerializer(serializers.Serializer):
#     email = serializers.EmailField()

# class SetNewPasswordResetOtpSerializer(serializers.Serializer):
#     password_reset_otp = serializers.CharField(write_only=True)
#     email = serializers.EmailField(write_only=True)
#     token = serializers.CharField()

#     def validate(self, data):
#         try:
#             password_reset_otp = data.get('password_reset_otp')
#             email = data.get("email")
#             token = data.get('token')
#             user = CustomUser.objects.get(email=email)
#             if not PasswordResetTokenGenerator().check_token(user, token):
#                 raise serializers.ValidationError('The reset link is invalid or has expired.')
#             if password_reset_otp != user.password_reset_otp:
#                 raise serializers.ValidationError('Invalid OTP')
#             return data
#         except DjangoUnicodeDecodeError:
#             raise serializers.ValidationError('Invalid UID')

#     def save(self):
#         user = self.validated_data['user']
#         user.save()
#         return user

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'user_type']

# class ProfileSerializerRetrieveUpdate(serializers.ModelSerializer):
#     user = CustomUserSerializer(read_only=True)

#     class Meta:
#         model = Profile
#         fields = [
#             'user', 'membership_plan', 'phone', 'address', 'profile_picture',
#             'associated_organization', 'organization_registration_id',
#             'service_details', 'client_notes', 'profile_bio', 'profession',
#             'street', 'city', 'state', 'zip_code', 'country', 'job_category',
#             'is_accepted_terms_conditions'
#         ]


class ProfileCoverImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'user', 'membership_plan', 'phone', 'address', 'profile_picture', 'cover_image', 
            'associated_organization', 'organization_registration_id', 'service_details', 
            'client_notes', 'profile_bio', 'profession', 'street', 'city', 'state', 'zip_code', 
            'country', 'notification_status', 'job_category', 'is_accepted_terms_conditions', 
            'is_payment_verified', 'is_profile_updated'
        ]
        read_only_fields = ['user']


class ProfilePaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['is_payment_verified']

    # def update(self, instance, validated_data):
    #     instance.is_payment_verified = False
    #     instance.save()
    #     return instance