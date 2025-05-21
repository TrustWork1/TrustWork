from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView,Http404
from project_management.models import Project, Bid,Feedback
from .serializers import ProjectSerializer, BidSerializer #, BidSerializerMobilie
from rest_framework.permissions import IsAuthenticated
from api.pagination import CustomPagination, CustomPaginationProjectProfile, CustomProjectPagination
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from profile_management.models import Profile
from master.models import JobCategory
from rest_framework import generics
from django.db.models import Avg
from .serializers import ProjectSerializer, ProfileSerializer
from .serializers import JobCategorySerializer
from django.db.models import Q
from rest_framework.parsers import MultiPartParser,JSONParser,FormParser
from profile_management.models import BankDetails

class MobileProjectList(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes=[MultiPartParser,JSONParser,FormParser]
    @swagger_auto_schema(
        operation_summary="Retrieve paginated projects for the current user",
        operation_description="Returns a paginated list of projects for the authenticated user, with optional filtering by project status.",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'status',
                openapi.IN_QUERY,
                description="Optional filter to retrieve projects by status",
                type=openapi.TYPE_STRING,
                required=False
            ),
        ],
        responses={
            200: "Paginated list of projects", 
            404: "Profile not found",
            400: "Invalid request"
        }
    )
    # def get(self, request):
    #     projects = Project.objects.filter(client=Profile.objects.get(user=request.user)).order_by('-updated_at')
    #     print(request.GET.get("status"))
    #     if request.GET.get("status"):
    #         projects=projects.filter(status=request.GET.get("status"))
    #     paginator = CustomPagination()
    #     projects_paginated = paginator.paginate_queryset(projects, request)
    #     serializer = ProjectSerializer(projects_paginated, many=True)

    #     return paginator.get_paginated_response(serializer.data)

    #     # serializer = ProjectSerializer(projects, many=True)
    #     # return Response(serializer.data)

    def get(self, request):
        client_profile = Profile.objects.get(user=request.user).id        
        projects = Project.objects.filter(client=client_profile).order_by('created_at')
        
        status = request.GET.get("status")
        if status:
            projects = projects.filter(status=status)
        
        search_query = request.GET.get("search")
        if search_query:
            projects = projects.filter(project_title__icontains=search_query)
        # Extrarnal Check
        # user_job_category = client_profile.job_category
        # if user_job_category:
        #     projects = projects.filter(
        #         Q(project_category=user_job_category) |
        #         Q(project_category__parent_category=user_job_category)
        #     )
        # else:
        #     projects = projects.none()
        paginator = CustomProjectPagination()
        projects_paginated = paginator.paginate_queryset(projects, request)
        
        serializer = ProjectSerializer(projects_paginated, many=True)
        return paginator.get_paginated_response(serializer.data)


    @swagger_auto_schema(
        operation_summary="Create a new project",
        operation_description="Create a new project with the specified client information.",
        request_body=ProjectSerializer,
        responses={
            201: openapi.Response(description="Project created successfully", schema=ProjectSerializer),
            400: openapi.Response(description="Invalid data provided"),
        },
    )
    def post(self, request):
        # data={**request.data}
        # data['client']=Profile.objects.get(user=request.user).id
        print(request.data)
        serializer = ProjectSerializer(data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save(client=Profile.objects.get(user=request.user),project_category=JobCategory.objects.get(id=request.data['project_category'])) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetail(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes=[MultiPartParser,JSONParser]

    def get_object(self, pk):
        try:
            return Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            raise Http404

    @swagger_auto_schema(
            operation_description="Get a project",
            manual_parameters=[
                openapi.Parameter(
                    'Authorization',
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,
                    required=True
                ),
            ],
        # request_body=ProjectSerializer,
        responses={200: ProjectSerializer(many=True), 400: "Bad Request"},
    )
    def get(self, request, pk):
        project = self.get_object(pk)
        serializer = ProjectSerializer(project)
        serializer.data.pop("client")

        


        return Response(serializer.data)

    @swagger_auto_schema(
            operation_description="Update a project",
            manual_parameters=[
                openapi.Parameter(
                    'Authorization',
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,
                    required=True
                )
            ],
        request_body=ProjectSerializer,
        # responses={200: ProjectSerializer(many=True), 400: "Bad Request"}
    )
    def put(self, request, pk):
        project = self.get_object(pk)
        serializer = ProjectSerializer(project, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete a project",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
                )
            ],
        # request_body=ProjectSerializer,
        responses={204: "No Content", 400: "Bad Request"}
    )
    def delete(self, request, pk):
        project = self.get_object(pk)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# class MobileProjectDetail(APIView):
#     permission_classes = [IsAuthenticated]

#     def get_object(self, pk):
#         try:
#             return Project.objects.get(pk=pk)
#         except Project.DoesNotExist:
#             raise Http404

#     @swagger_auto_schema(
#             operation_description="Get a project",
#             manual_parameters=[
#                 openapi.Parameter(
#                     'Authorization',
#                     openapi.IN_HEADER,
#                     description="Authorization token (Bearer Token)",
#                     type=openapi.TYPE_STRING,
#                     required=True
#                 ),
#             ],
#         # request_body=ProjectSerializer,
#         responses={200: ProjectSerializer(many=True), 400: "Bad Request"},
#     )
#     def get(self, request, pk):
#         project = self.get_object(pk)
#         serializer = ProjectSerializer(project)
#         serializer.data.pop("client")
#         return Response(serializer.data)

#     @swagger_auto_schema(
#             operation_description="Update a project",
#             manual_parameters=[
#                 openapi.Parameter(
#                     'Authorization',
#                     openapi.IN_HEADER,
#                     description="Authorization token (Bearer Token)",
#                     type=openapi.TYPE_STRING,
#                     required=True
#                 )
#             ],
#         request_body=ProjectSerializer,
#         # responses={200: ProjectSerializer(many=True), 400: "Bad Request"}
#     )
#     def put(self, request, pk):
#         project = self.get_object(pk)
#         serializer = ProjectSerializer(project, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     @swagger_auto_schema(
#         operation_description="Delete a project",
#         manual_parameters=[
#             openapi.Parameter(
#                 'Authorization',
#                 openapi.IN_HEADER,
#                 description="Authorization token (Bearer Token)",
#                 type=openapi.TYPE_STRING,
#                 required=True
#                 )
#             ],
#         # request_body=ProjectSerializer,
#         responses={204: "No Content", 400: "Bad Request"}
#     )
#     def delete(self, request, pk):
#         project = self.get_object(pk)
#         project.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

class ChangeProjectStatusView(APIView):
    def put(self,request,pk=None,user_type=None):
        project = get_object_or_404(Project, pk=pk)
        project.status=request.data.get("status")
        project.save()

        response = {
            "status" : 202,
            "type" : "success",
            "message" : "Project status changed successfully"
        } 
        return Response(response,status=status.HTTP_202_ACCEPTED)

class ProjectBidApiView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,project_id):  
        bids=Bid.objects.filter(project__id=project_id)
        paginator = CustomPagination()
        bids = paginator.paginate_queryset(bids, request)
        serializer = BidSerializer(bids, many=True)

        return paginator.get_paginated_response(serializer.data)

# previous working code
# class ClientActiveProjectsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         client_profile = request.user.profile
#         projects = Project.objects.filter(client=client_profile)

#         project_status = request.GET.get("status")
#         if project_status:
#             projects = projects.filter(status=project_status)

#         bids = Bid.objects.filter(project__in=projects)

#         paginator = CustomPagination()  
#         paginated_projects = paginator.paginate_queryset(bids, request)

#         serializer = BidSerializer(paginated_projects, many=True)

#         return paginator.get_paginated_response(serializer.data)
#         # try:
#         #     client_profile = Profile.objects.get(user=request.user)
#         # except Profile.DoesNotExist:
#         #     return Response({"error": "Client profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
#         # active_projects = Project.objects.filter(client=client_profile, status="active")
        
#         # paginator = CustomPagination()
#         # paginated_projects = paginator.paginate_queryset(active_projects, request)
#         # serializer = ProjectSerializer(paginated_projects, many=True)
        
#         # return paginator.get_paginated_response(serializer.data)

class ClientActiveProjectsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BidSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        client_profile = self.request.user.profile
        print("client_profile", client_profile)
        # projects = Project.objects.filter(client=client_profile)
        # project_status = self.request.GET.get("status")
        status_filter = self.request.query_params.get("status")

        queryset = Bid.objects.filter(service_provider__user=self.request.user)
    
        if status_filter in ['ongoing','accepted','active']:
            if status_filter in ["accepted" ,"Accepted"]:
                queryset = queryset.filter(status__iexact=status_filter).exclude(project__status__iexact="completed")
            else:
                queryset = queryset.filter(project__status__iexact=status_filter).exclude(status__iexact="accepted")
                # status_filter="Accepted"
            #     queryset = queryset.filter(status__icontains=status_filter)
            # else:
            #     queryset = queryset.filter(~Q(status__icontains="accepted"), project__status__iexact=status_filter)
        elif status_filter:
            queryset = queryset.filter(project__status=status_filter)
        # queryset=queryset.filter(service_provider__user=self.request.user)
        return queryset

    # def get(self, request):
    #     user_profile = getattr(request.user, 'profile', None)
    #     if not user_profile:
    #         return Response({"detail": "Profile not found for the current user."}, status=400)

    #     if user_profile == "client":
    #         projects = Project.objects.filter(client=user_profile, status="active")
    #     elif user_profile == "provider":
    #         projects = Project.objects.filter(
    #             bid__service_provider=user_profile, status="active"
    #         ).distinct()
    #     else:
    #         return Response({"detail": "Invalid role"}, status=403)

    #     paginator = CustomPagination()
    #     paginated_projects = paginator.paginate_queryset(projects, request)
    #     serializer = ProjectSerializer(paginated_projects, many=True)

    #     if user_profile == "provider":
    #         for project, data in zip(paginated_projects, serializer.data):
    #             can_send_bid = not Bid.objects.filter(project=project, service_provider=user_profile).exists()
    #             data["can_send_bid"] = can_send_bid

    #     return paginator.get_paginated_response(serializer.data)

    #     # if project_status or status_filter:
    #     #     projects = projects.filter(status=project_status or status_filter)
    #     #     bids = Bid.objects.filter(project__in=projects)
    #     #     return bids
    #     # return Bid.objects.none()

        
    #     return super().get_queryset()| Bid.objects.filter(project__client__user=self.request.user)

# class ClientActiveProjectsView(generics.ListAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = BidSerializer
#     pagination_class = CustomPagination

#     def get_queryset(self):
#         client_profile = self.request.user.profile
#         print("client_profile", client_profile)

#         status_filter = self.request.query_params.get("status")
#         queryset = Bid.objects.filter(service_provider__user=self.request.user)
        
#         if status_filter in ['completed','ongoing','accepted']:
#             if status_filter.lower() == "accepted":
#                 queryset = queryset.filter(is_accepted=True)
#             elif status_filter in ["completed", "ongoing"]:
#                 queryset = queryset.filter(project__status__iexact=status_filter).exclude(is_accepted=True)
#             else:
#                 queryset = queryset.filter(status__iexact=status_filter)

#         return queryset


class MobileBidList(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
            operation_summary="Retrieve paginated list of bids",
            operation_description="Get paginated bids for all projects.",
            manual_parameters=[
                openapi.Parameter(
                    'Authorization',
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,
                    required=True
                    )
                ],
            responses={
                200: "Paginated bids data for all projects",
                400: "Project not found",
                500: "Server error"
                }
    )
    def get(self, request):
        bids = Bid.objects.all().order_by('-updated_at')
        serializer = BidSerializer(bids, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
            operation_summary="Create a new bid",
            operation_description="Create a new bid for a project.",
            manual_parameters=[
                openapi.Parameter(
                    'Authorization',
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,
                    required=True
                )
            ],
            request_body=BidSerializer,
            responses={
                201: "Bid created",
                400: "Project not found",
                500: "Server error"
                }
    )
    def post(self, request):
        service_provider=Profile.objects.get(user=request.user)
        check_bank_account = BankDetails.objects.filter(user_profile=service_provider.id).exists()
        if not check_bank_account:
            return Response({
                "status": "400",
                "type": "error",
                "data": {
                    "detail": "You have to add Bank/MTN account."
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = BidSerializer(data=request.data,partial=True)
        if serializer.is_valid():
            bid=serializer.save(service_provider=service_provider,project=Project.objects.get(id=request.data.get("project")))  # Adjust if necessary
            bid.project.bid_count += 1
            bid.project.save()
            bid.bid_sent = False
            bid.is_accepted = True
            bid.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request):
    #     try:
    #         project = Project.objects.get(id=request.data.get("project"))
    #         serializer = BidSerializer(data=request.data, partial=True, context={'request': request})
    #         if serializer.is_valid():
    #             service_provider = Profile.objects.get(user=request.user)
    #             bid = serializer.save(
    #                 service_provider=service_provider,
    #                 project=project
    #             )
    #             project.bid_count += 1
    #             if project.status == "myoffer":
    #                 project.can_send_bid = True
    #             project.save()
    #             bid.bid_sent = False
    #             bid.is_accepted = True
    #             bid.save()
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #     except Project.DoesNotExist:
    #         return Response({"message": "Project not found"}, status=status.HTTP_200_OK)
    #     except Exception as e:
    #         return Response({"detail": str(e)},status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request):
    #     project_id = request.data.get("project")
    #     service_provider = Profile.objects.get(user=request.user)

    #     try:
    #         project = Project.objects.get(id=project_id)
    #     except Project.DoesNotExist:
    #         return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        
    #     # can_send_bid = project.bid_count < 1

    #     # if Project.bid_count == 1:
    #     #     print("OK")
    #     bid_send = project.bid_count == 1
    #     can_send_bid = project.bid_count == 0
    #     existing_bid= Bid.objects.filter(service_provider=service_provider, project=project).exists()
    #     if existing_bid:
    #         if not can_send_bid:
    #             return Response(
    #                 {"detail": "Bids are no longer accepted for this project.", 
    #                 "bid_send": bid_send, 
    #                 "can_send_bid": can_send_bid},
    #                 status=status.HTTP_400_BAD_REQUEST,
    #             )
    #         if project.bid_count == 1:
    #             return Response({"detail": "Bids are no longer accepted for this project."}, status=status.HTTP_400_BAD_REQUEST)

    #         bids = Bid.objects.filter(service_provider=Profile.objects.get(user=request.user))
    #         queryset = Project.objects.filter(bid__in=bids, status='myoffer')
    #         if queryset.exists():
    #             return Response(can_send_bid)
    #             #     {"detail": "You have already submitted a bid for this project.", "can_send_bid": can_send_bid},
    #             #     status=status.HTTP_400_BAD_REQUEST,
    #             # )
    #         # if Bid.objects.filter(service_provider=service_provider, project=Project.objects.get(status__in=queryset)):    #.status == "myoffer":
    #             # bid_send = False
    #         if queryset.exists():
    #             return Response({"detail": "You have already submitted a bid for this project."}, status=status.HTTP_400_BAD_REQUEST)
    #     # if Bid.objects.filter(service_provider=service_provider, project=project).first():
    #     #     # bid_send = False
    #     #     return Response({"detail": "You have already submitted a bid for this project."}, status=status.HTTP_400_BAD_REQUEST)
        
    #     serializer = BidSerializer(data=request.data, partial=True, context={'request': request})
    #     if serializer.is_valid():
    #         bid = serializer.save(service_provider=service_provider, project=project)
    #         bid.project.bid_count += 1
    #         bid.project.save()
    #         bid.bid_send = True

    #         # can_send_bid = bid.project.bid_count < 1
    #         bid_send = project.bid_count == 1
    #         can_send_bid = project.bid_count == 0

    #         return Response( #serializer.data, bid_send, can_send_bid)
    #             {"data":serializer.data,  
    #                          "bid_send": bid_send, 
    #                          "can_send_bid": can_send_bid}, 
    #                     status=status. HTTP_201_CREATED) # "bid_send": bid.bid_send, "can_send_bid": can_send_bid

    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BidDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Bid.objects.get(pk=pk)
        except Bid.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        bid = self.get_object(pk)
        serializer = BidSerializer(bid)
        return Response(serializer.data)

    def put(self, request, pk):
        bid = self.get_object(pk)
        serializer = BidSerializer(bid, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        bid = self.get_object(pk)
        bid.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class JobCategoryView(APIView):
    # def get(self, request, pk):
    #     try:
    #         if pk:
    #             job_category = JobCategory.objects.get(pk=pk)
    #             serializer = JobCategorySerializer(job_category)
    #         else:
    #             job_categories = JobCategory.objects.all()
    #             serializer = JobCategorySerializer(job_categories, many=True)
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     except Exception:
    #         return Response({"message": "Error Occurred Please Check"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request, pk=None):
        try:
            if pk:
                job_category = JobCategory.objects.filter(pk=pk).order_by("updated_at").first()
                if not job_category:
                    return Response(
                        {"message": "Job category not found or inactive"},
                        status=status.HTTP_404_NOT_FOUND
                    )
                serializer = JobCategorySerializer(job_category)
            else:
                job_categories = JobCategory.objects.filter(status="active")
                serializer = JobCategorySerializer(job_categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": "Error occurred. Please check", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    # def get(self, request, pk=None):
    #     try:
    #         if pk:
    #             job_category = JobCategory.objects.filter(pk=pk).order_by("updated_at").first()
    #             if not job_category:
    #                 return Response(
    #                     {"message": "Job category not found"},
    #                     status=status.HTTP_404_NOT_FOUND
    #                 )
    #             serializer = JobCategorySerializer(job_category)
    #             return Response(serializer.data, status=status.HTTP_200_OK)
    #         else:
    #             active_categories = JobCategory.objects.filter(status="active").order_by("updated_at")
    #             inactive_categories = JobCategory.objects.filter(status="inactive").order_by("updated_at")
                
    #             active_serializer = JobCategorySerializer(active_categories, many=True)
    #             inactive_serializer = JobCategorySerializer(inactive_categories, many=True)
                
    #             return Response(
    #                 {
    #                     "active_categories": active_serializer.data,
    #                     "inactive_categories": inactive_serializer.data
    #                 },
    #                 status=status.HTTP_200_OK
    #             )
    #     except Exception as e:
    #         return Response(
    #             {"message": "Error occurred. Please check", "details": str(e)},
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #         )

    def post(self, request):
        try:
            serializer = JobCategorySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"message": "Data Not found "}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, pk):
        try:
            job_category = JobCategory.objects.get(pk=pk)
            serializer = JobCategorySerializer(job_category, data=request.data, partial=True)
            if serializer.is_valid():
                # if job_category.status=
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, {'message': 'Job category updated successfully.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"message": "Error Occurred Please Check"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, pk):
        try:
            job_category = JobCategory.objects.get(pk=pk)
            job_category.delete()
            return Response({'message': 'Job category deleted successfully.'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"message": "Error Occurred Please Check"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# class ProviderViewProject(APIView):
#     permission_classes = [IsAuthenticated]
#     print ("***************************************************")
#     def get(self, request):
#         client_profile = self.request.user.profile
#         print("client_profile", client_profile)
#         status_filter = self.request.query_params.get("status")
#         print("status_filter----------", status_filter)
#         print(Project.objects.filter(status=status_filter))

#         return Response("OK")
#         # status_filter = self.request.query_params.get("status")
#         # query1 = Bid.objects.filter(service_provider__user=self.request.user)
#         # print("queryquery", query)

#         # if status_filter in ['accepted', 'completed', 'ongoing']:
#         #     # query = Bid.objects.filter(service_provider__user=self.request.user)
#         #     # print("queryquery", query)
#         #     if status_filter == "accepted":
#         #         query = Project.objects.filter(client=query1, status=status_filter).order_by('updated_at')
#         #     elif status_filter == "completed":
#         #         query = Project.objects.filter(client=query1, status=status_filter)
#         #     elif status_filter == "ongoing":
#         #         query = Project.objects.filter(client=query1, status=status_filter)
#         #     else:
#         #         query = Project.objects.filter(client=query1).order_by('-created_at')
#         # else:
#         #     query = Project.objects.filter(client=query1).order_by('-created_at')

#         # serializer = BidSerializer(query, many=True)

#         # return Response({
#         #     "status": "success",
#         #     "data": serializer.data
#         # }, status=status.HTTP_200_OK)
 
#     # def get(self, request):
#     #     projects = Project.objects.filter(service_provider=Profile.objects.get(user=request.user))
#     #     serializer = ProjectSerializer(projects, many=True)
#     #     return Response(serializer.data)

# class ProviderViewProject(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         client_profile = self.request.user.profile

#         status_filter = self.request.query_params.get("status")
#         print("status_filter", status_filter)
#         query = Project.objects.filter(client=client_profile)
#         print("query", query)
#         if status_filter in ['accepted', 'completed', 'ongoing']:
#             query = query.filter(status=status_filter)

#         query = query.order_by('-created_at') 
#         projects_with_bids = query.prefetch_related('bid').all()

#         project_data = []
#         for project in projects_with_bids:
#             project_serializer = ProjectSerializer(project)

#             accepted_bid = Bid.objects.filter(project=project, status='accepted').first()

#             if accepted_bid:
#                 provider_data = ProfileSerializer(accepted_bid.service_provider).data
#                 project_data.append({
#                     **project_serializer.data,
#                     'provider': provider_data
#                 })
#             # elif not accepted_bid:
#             #     project_data.append(project_serializer.data)

#             else:
#                 project_data.append(project_serializer.data)
#         return Response(project_data)
#         # return Response({
#         #     "status": "success",
#         #     "data": project_data
#         # }, status=status.HTTP_200_OK)

class ProviderViewProject(APIView):
    permission_classes = [IsAuthenticated]
    # pagination_class = CustomPagination
    def get(self, request):
        client_profile = self.request.user.profile
        print("client_profile", client_profile)
        # status_filter = self.request.query_params.get("status")
        query = Bid.objects.filter(project__in=Project.objects.filter(client=client_profile, status__iexact='active')) # | Bid.objects.filter() # Accepted
        # query = Project.objects.filter(client=client_profile, status__iexact='active')
        query = query.order_by('created_at')
        # return Response(query)
        paginator = CustomPaginationProjectProfile()
        projects_paginated = paginator.paginate_queryset(query, request)
        
        # serializer = ProjectSerializer(projects_paginated, many=True)
        serializer = BidSerializer(projects_paginated, many=True)
        return paginator.get_paginated_response(serializer.data)
        # return Response(ProjectSerializer(query,many=True).data, status=status.HTTP_200_OK)

# class ProviderViewProjectActive(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         client_profile = self.request.user.profile

#         status_filter = self.request.query_params.get("status")

#         query = Project.objects.filter(client=client_profile)
#         if status_filter in ['accepted', 'completed', 'ongoing']:
#             query = query.filter(status=status_filter)

#         query = query.order_by('-created_at')
        
#         projects_with_bids = query.prefetch_related('bid').all()

#         project_data = []
#         for project in projects_with_bids:
#             accepted_bid = Bid.objects.filter(project=project, status='accepted').first()

#             if accepted_bid:
#                 project_serializer = ProjectSerializer(project)
#                 provider_data = ProfileSerializer(accepted_bid.service_provider).data
                
#                 project_data.append({
#                     **project_serializer.data,
#                     'provider': provider_data
#                 })

#         return Response({
#             "status": "success",
#             "data": project_data
#         }, status=status.HTTP_200_OK)

# class ProviderViewProject(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         client_profile = self.request.user.profile

#         status_filter = self.request.query_params.get("status")

#         query = Project.objects.filter(client=client_profile)
#         if status_filter in ['accepted', 'completed', 'ongoing']:
#             query = query.filter(status=status_filter)

#         query = query.order_by('-created_at')
        
#         projects_with_bids = query.prefetch_related('bid').all()

#         project_data = []
#         for project in projects_with_bids:
#             accepted_bid = Bid.objects.filter(project=project, status='accepted').first()

#             if accepted_bid:
#                 project_serializer = ProjectSerializer(project)
#                 provider_data = ProfileSerializer(accepted_bid.service_provider).data
                
#                 project_data.append({
#                     **project_serializer.data,
#                     'provider': provider_data
#                 })
#         return Response(project_data)
#         # return Response({
#         #     "status": "success",
#         #     "data": project_data
#         # }, status=status.HTTP_200_OK)

class OfferProjectAPIView(APIView):
    def post(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        provider_id = request.data.get('provider_id')

        project = get_object_or_404(Project, id=project_id, client=request.user.profile)

        provider = get_object_or_404(Profile, id=provider_id)

        if project.status != "active":
            return Response(
                {"error": "This project cannot be offered at its current status."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        project.status = "ongoing"
        project.save()

        # Optionally, you can create a bid for tracking purposes
        Bid.objects.create(
            project=project,
            service_provider=provider,
            bid_details="Direct offer from client",
            quotation_details="N/A",
            project_total_cost=str(project.project_budget),
            time_line=str(project.project_timeline),
        )

        return Response(
            {
                "message": "Project successfully offered to the service provider.",
                "project": ProjectSerializer(project).data,
            },
            status=status.HTTP_200_OK,
        )
import json
class CreateAndOfferProjectAPIView(APIView):
    parser_classes=[MultiPartParser,JSONParser,FormParser]

    def post(self, request, *args, **kwargs):
        print(request.data)
        provider_id = request.data.get('provider_id')
        project_data = json.loads(request.data.get('project_data',"{}"))

        if not provider_id or not project_data:
            return Response(
                {"error": "Both 'provider_id' and 'project_data' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        provider = get_object_or_404(Profile, id=provider_id)

        if not hasattr(request.user, 'profile'):
            return Response(
                {"error": "Authenticated user must have a linked profile."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client_profile = request.user.profile

        try:
            serializer = ProjectSerializer(data=project_data, context={'request': request})
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            project = serializer.save(client=client_profile,project_category=JobCategory.objects.get(id=project_data.get("project_category")), status="myoffer")#.exclude(status__in="completed")
            
            document=request.FILES['document']
            
            Bid.objects.create(
                project=project,
                service_provider=provider,
                bid_details="Direct offer from client",
                quotation_details="Thank you for inviting us to quote for your project.",
                project_total_cost=str(project.project_budget),
                time_line=str(project.project_timeline),
                time_line_hour=str(project.project_hrs_week)
            )
            if document:
                project.document=document
            project.can_send_bid = True
            project.save()

            return Response(
                {
                    "message": "Project created and successfully offered to the provider.",
                    "project": ProjectSerializer(project, context={'request': request}).data,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            print(e)
            return Response(serializer.errors,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MyOfferProjectListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not hasattr(request.user, 'profile'):
            return Response(
                {"error": "Authenticated user must have a linked profile."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        provider_profile = request.user.profile

        projects = Project.objects.filter(
            bid__service_provider=provider_profile,
            status="myoffer" 
        ).exclude(bid__status__icontains="reject").distinct()

        paginator = CustomPaginationProjectProfile()
        paginated_queryset = paginator.paginate_queryset(projects, request)
        
        serializer = ProjectSerializer(paginated_queryset, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

#         provider = get_object_or_404(Profile, id=provider_id)

# class MyOfferProjectListAPIView(APIView):
#     permission_classes = [IsAuthenticated] 

#     def get(self, request, *args, **kwargs):
#         if not hasattr(request.user, 'profile'):
#             return Response(
#                 {"error": "Authenticated user must have a linked profile."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         provider_profile = request.user.profile
#         projects = Project.objects.filter(
#             bid__service_provider=provider_profile,
#             status="myoffer" 
#         ).distinct()

#         project_data = []
#         for project in projects:
#             bids = Bid.objects.filter(project=project, service_provider=provider_profile)
#             project_data.append({
#                 "project": ProjectSerializer(project, context={'request': request}).data,
#                 "bids": BidSerializer(bids, many=True, context={'request': request}).data
#             })

#         return Response(project_data, status=status.HTTP_200_OK)


class   OfferDetailAPIView(APIView):
    parser_classes=[MultiPartParser,JSONParser,FormParser]

    # def get(self, request, offer_id, *args, **kwargs):
    #     """
    #     Retrieve the details of an offer (project and bid) by ID.
    #     """
    #     try:
    #         project = Project.objects.get(id=offer_id)
    #         bid = Bid.objects.filter(project=project).first()

    #         project_data = ProjectSerializer(project).data
    #         bid_data = BidSerializer(bid).data if bid else None

    #         return Response(
    #             {"project": project_data, "bid": bid_data},
    #             status=status.HTTP_200_OK
    #         )
    #     except Project.DoesNotExist:
    #         return Response(
    #             {"error": "Offer not found."},
    #             status=status.HTTP_404_NOT_FOUND
    #         )

    def get(self, request, *args, **kwargs):
        try:
            projects = Project.objects.all()
            # project_data = ProjectSerializer(projects, many=True).data #  context={'request': request}
            response_data = []
            for project in projects:
                bid = Bid.objects.filter(project=project).first() 
                bid_data = BidSerializer(bid).data if bid else None

                response_data.append({
                    "project": ProjectSerializer(project, context={'request': request}).data,
                    "bid": bid_data,
                })

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    def put(self, request, offer_id, args, *kwargs):
        """
        Edit an existing offer (project and bid) by ID.
        """
        try:
            # Retrieve the project and bid
            project = Project.objects.get(id=offer_id)
            bid = Bid.objects.filter(project=project).first()

            # Update project details
            project_serializer = ProjectSerializer(project, data=request.data, partial=True)
            if project_serializer.is_valid():
                project_serializer.save()
            else:
                return Response(
                    {"error": project_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update bid details (if provided in the request)
            if bid:
                bid_serializer = BidSerializer(bid, data=request.data, partial=True)
                if bid_serializer.is_valid():
                    bid_serializer.save()
                else:
                    return Response(
                        {"error": bid_serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            return Response(
                {
                    "message": "Offer updated successfully.",
                    "project": project_serializer.data,
                    "bid": BidSerializer(bid).data if bid else None,
                },
                status=status.HTTP_200_OK
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Offer not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# class ServiceDetailsAPIView(APIView):
#     def get(self, request, provider_id, service_name):
#         try:
#             # Fetch the service provider profile
#             service_provider = Profile.objects.filter(
#                 id=provider_id, user__user_type="provider"
#             ).first()

#             if not service_provider:
#                 return Response({"error": "Service Provider not found"}, status=status.HTTP_404_NOT_FOUND)

#             # Filter feedback for the given service and calculate the overall rating
#             feedbacks = Feedback.objects.filter(
#                 service_provider=service_provider, project__project_category__title=service_name
#             )
            
#             if not feedbacks.exists():
#                 return Response({"error": f"No feedback found for the service '{service_name}'."}, status=status.HTTP_404_NOT_FOUND)

#             overall_rating = feedbacks.aggregate(average_rating=Avg("rating"))["average_rating"]

#             # Fetch details of clients who gave ratings
#             client_feedbacks = [
#                 {
#                     "client_name": f"{feedback.client.user.first_name} {feedback.client.user.last_name}",
#                     "description": feedback.client.profile_bio if feedback.client.profile_bio else "No description available",
#                     "rating": feedback.rating,
#                 }
#                 for feedback in feedbacks
#             ]

#             # Construct the response dictionary
#             response_data = {
#                 "service_name": service_name,
#                 "title": f"Service Details for {service_name}",
#                 "overall_rating": overall_rating,
#                 "clients_feedback": client_feedbacks,
#             }

#             return Response(response_data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ServiceDetailsAPIView(APIView):  #client to provider
    def get(self, request, provider_id, job_category_id):
        try:
            # Fetch the service provider profile
            service_provider = Profile.objects.filter(id=provider_id,).last()
            print(service_provider.user)
            # service_category_id=Project.objects.get(job_category_type=project_category_title)

            project_description= Project.objects.filter(project_category__id=job_category_id).first()
            if project_description:
                project_description=project_description.project_description
            # if service_provider.user.user_type == 'client':
                # Filter feedback for the given service and calculate the overall rating
            # client = Profile.objects.filter(id=client_id).last()
            # print(client.user)
            job_category = JobCategory.objects.get(id=job_category_id)
            # client_review=request.get()
            feedbacks = Feedback.objects.filter(
                service_provider=service_provider, project__project_category__id=job_category_id)
            # feedback=Feedback.objects.get(client_review=client_review)
            
            if not feedbacks.exists():
                return Response(
                    {
                    "Message": f"No feedback found for the service '{job_category_id}'.",
                        "client_name": "",
                        "provider_review": " ",#project.client.profile_bio if feedback.project.client.profile_bio else "No review available",
                        "provider_rating": "",
                         "service_id" : job_category.id,
                        "service_name": job_category.title,
                        "description": job_category.description,
                        "overall_rating": 0,
                        "clients_feedback": "",
                        "client_review": "",
                        "client_rating": 0,
                        
                    })
        # "Message": f"No feedback found for the service '{job_category_id}'.")
    # status=status.HTTP_200_OK ,status=status.HTTP_200_OK)
            
            try:
                overall_rating = round(float(feedbacks.aggregate(average_rating=Avg("client_rating"))["average_rating"]),1)
                project_description= Project.objects.filter(project_category__id=job_category_id).first().project_description
                # job_category = Profile.objects.filter(job_category=job_category_id)
                # job_category_id = Profile.objects.get(id=provider_id).job_category.filter('id',flat=True).first()
                # job_category_title = JobCategory.objects.get(title=job_category_id)

                client_feedbacks = [
                    {"service_id" : job_category_id,
                        "service_name": job_category.title,
                        "client_name": f"{feedback.project.client.user.first_name} {feedback.project.client.user.last_name}",
                        "provider_review": feedback.provider_review if feedback.provider_review else [],#project.client.profile_bio if feedback.project.client.profile_bio else "No review available",
                        "provider_rating": feedback.provider_rating if feedback.provider_rating else 0,
                        "client_review": feedback.client_review if feedback.client_review else [],
                        "client_rating":feedback.client_rating if feedback.client_rating else [],
                        "profile_pic" : feedback.project.client.profile_picture.url if feedback.project.client.profile_picture else ''
                    }
                    for feedback in feedbacks if feedback.client_rating
                ]
                try:
                    response_data = {
                        "service_id" : job_category_id,
                        "service_name": job_category.title,
                        "description": project_description,
                        "overall_rating": overall_rating,
                        **client_feedbacks
                        
                    }
                    print(response_data)
                except:
                    return response_data.job_category.title
                return Response(response_data, status=status.HTTP_200_OK)
            except:
                return Response({"message": "no rating found", "service_id" : job_category_id,
                        "service_name": job_category.title,
                        "description": project_description,
                        "overall_rating": overall_rating,
                        "clients_feedback": client_feedbacks,},status=status.HTTP_204_NO_CONTENT)

            # else:
            #     rendturn Response({"error": "Service Provider not found"}, status=status.HTTP_404_NOT_FOUND
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
