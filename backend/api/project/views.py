from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView,Http404
from project_management.models import Project, Bid
from .serializers import ProjectSerializer, BidSerializer
from rest_framework.permissions import IsAuthenticated
from api.pagination import CustomPagination, CustomPaginationProjectProfile
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from chat_management.models import Messages
from profile_management.models import Profile
from project_management.models import Project,Transactions
from rest_framework import generics
from .serializers import BidSerializerProjectView
from master.models import JobCategory
from .serializers import JobCategorySerializer
from payment_handle.gateways.escrow import PaymentGatewayAPI
from api.chat.serializers import MessagesSerializer
from django.db.models import Q, ProtectedError
from django.db import IntegrityError
# from payment_handle.gateways.escrow import *
from django.db import transaction
class ProjectList(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="List all projects",
        manual_parameters=[
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description="Authorization token (Bearer Token)",
            type=openapi.TYPE_STRING,
            required=True
            )
        ],
        responses={200: ProjectSerializer(many=True)},
    )
    # def get(self, request):
    #     projects = Project.objects.all().order_by("-updated_at")
    #     paginator = CustomPagination()
    #     projects = paginator.paginate_queryset(projects, request)
    #     user_profile = getattr(request.user, 'profile', None)
    #     if not user_profile:
    #         return Response({"detail": "Profile not found for the current user."}, status=400)
    #     serializer = ProjectSerializer(projects, many=True)
    #     for project, data in zip(projects, serializer.data):
    #         can_send_bid = not Bid.objects.filter(project=project, service_provider=user_profile).exists()
    #         data["can_send_bid"] = can_send_bid

        
    #     return paginator.get_paginated_response(serializer.data)

    #     serializer = ProjectSerializer(projects, many=True)
    #     return Response(serializer.data)
    
    # def get(self, request):
    #     projects = Project.objects.filter(status="active").order_by("-updated_at")
    #     paginator = CustomPagination()
    #     paginated_projects = paginator.paginate_queryset(projects, request)

    #     user_profile = getattr(request.user, 'profile', None)
    #     if not user_profile:
    #         return Response({"detail": "Profile not found for the current user."}, status=400)

    #     serializer = ProjectSerializer(paginated_projects, many=True)
        
    #     for project, data in zip(paginated_projects, serializer.data):
    #         can_send_bid = not Bid.objects.filter(project=project, service_provider=user_profile).order_by('-updated_at').exists()
    #         data["can_send_bid"] = can_send_bid

    #     return paginator.get_paginated_response(serializer.data)
    def get(self, request):
        # projects = Project.objects.filter(status="active").order_by("-updated_at") # Active Project List Showing
        search_query = request.query_params.get('search', '')
        if search_query:
            projects = Project.objects.filter(Q(project_title__icontains=search_query) | Q(project_description__icontains=search_query))
        else:
            projects = Project.objects.all().order_by("-updated_at")
        paginator = CustomPagination()
        paginated_projects = paginator.paginate_queryset(projects, request)
        user_profile = getattr(request.user, 'profile', None)
        if not user_profile:
            return Response({"detail": "Profile not found for the current user."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ProjectSerializer(paginated_projects, many=True, context={"request": request})
        
        for project, data in zip(paginated_projects, serializer.data):
            if project:
                can_send_bid = not Bid.objects.filter(project=project, service_provider=user_profile).exists()
                # bid_cost = Bid.objects.filter(project=Project.objects.get(project__id=id)).first().project_total_cost
                data["can_send_bid"] = can_send_bid
                # data["bid_cost"] = bid_cost

        return paginator.get_paginated_response(serializer.data)


    @swagger_auto_schema(
        operation_description="Create a New Add projects",
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
    )
    # def post(self, request):
    #     # serializer = ProjectSerializer(data=request.data)
    #     # if serializer.is_valid():
    #     #     serializer.save(client=Profile.objects.get(pk=request.data['client']), project_category=JobCategory.objects.get(pk=request.data['client']))
    #     #     return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #     serializer = ProjectSerializer(data=request.data)
    #     if serializer.is_valid():
    #         # Ensure the client and category are valid
    #         client = get_object_or_404(Profile, pk=request.data['client'])
    #         project_category = get_object_or_404(JobCategory, pk=request.data['project_category'])

    #         # Save the project with the provided data
    #         serializer.save(client=client, project_category=project_category)
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)

    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request):
        data = request.data
    
        client = Profile.objects.only('id').get(pk=data.get("client"))
        job_category = JobCategory.objects.only('id').get(id=data['project_category'])
    
        serializer = ProjectSerializer(data=data)
        if serializer.is_valid():
            project = serializer.save(client=client, project_category=job_category)
    
            if hasattr(project, 'project_location'):
                project.project_location.country = data['project_location']
                project.project_location.save()
    
            response = {
                "status": 201,
                "type": "success",
                "message": "Project created successfully",
                "data": ProjectSerializer(project).data
            }
            return Response(response, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def post(self, request):
    #     data = request.data
        
    #     # Step 1: Validate serializer first
    #     serializer = ProjectSerializer(data=data)
    #     if not serializer.is_valid():
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #     # Step 2: Start the atomic transaction
    #     try:
    #         with transaction.atomic():
    #             # Step 3: Fetch the client profile
    #             client_id = request.data.get("client")
    #             try:
    #                 client_profile = Profile.objects.get(pk=client_id)
    #             except Profile.DoesNotExist:
    #                 return Response({
    #                     "status": 400,
    #                     "type": "error",
    #                     "message": "Client profile does not exist."
    #                 }, status=status.HTTP_400_BAD_REQUEST)

    #             # Step 4: Fetch JobCategory before saving the project
    #             try:
    #                 project_category = JobCategory.objects.get(id=data['project_category'])
    #             except JobCategory.DoesNotExist:
    #                 return Response({
    #                     "status": 400,
    #                     "type": "error",
    #                     "message": "Project category does not exist."
    #                 }, status=status.HTTP_400_BAD_REQUEST)
                
    #             # Step 5: Prepare the project data (NO SAVE YET)
    #             project = Project(
    #                 client=client_profile,
    #                 project_location__country=request.data['project_location'],
    #                 project_category=project_category,
    #                 project_title=data['project_title'],
    #                 project_description=data['project_description']
    #             )
    #             print("project_location_country", project)


    #             # Step 6: Now Save It Once (No Multiple Save)
    #             project.save()

    #             # Step 7: Send success response
    #             response = {
    #                 "status": 201,
    #                 "type": "success",
    #                 "message": "Project created successfully",
    #                 "data": ProjectSerializer(project).data
    #             }
    #             return Response(response, status=status.HTTP_201_CREATED)

    #     # Step 8: Handle transaction failure
    #     except IntegrityError as e:
    #         transaction.rollback()
    #         return Response({
    #             "status": 500,
    #             "type": "error",
    #             "message": "Failed to create project. Please try again later."
    #         }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from master.models import Location    

# from chat_management.models import Conversation, Message
class ProjectDetail(APIView):
    permission_classes = [IsAuthenticated]

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
        # project = self.get_object(pk)
        project = Project.objects.get(id=pk)
        transaction_status = Transactions.objects.filter(project=project).last()
        message=Messages.objects.filter(Q(chat_room__user1=request.user.profile,chat_room__user2=project.client)|Q(chat_room__user2=request.user.profile,chat_room__user1=project.client))
        if transaction_status:
            transaction_status=transaction_status.status
        else:
            transaction_status="Payment pending"
        if message.last():
            message=MessagesSerializer(message.last()).data
        else:
            message=""
        serializer = ProjectSerializer(project)
        data = serializer.data
        # data.pop("client")
        data['transaction_status'] = transaction_status
        data['last_message'] = message
        # conversation = Conversation.objects.get(project=project)
        # message= Message.objects.filter(conversation=conversation).order_by("-sent_at").first()
        # message = Message.objects.filter(conversation__project=project).order_by("-sent_at").first()
    

        # data["message"] = MessageSerializer(message).data
        return Response(data)

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
        responses={200: "Updated Successfully", 400: "Bad Request"}
    )
    def put(self, request, pk):
        project = self.get_object(pk)
        serializer = ProjectSerializer(project, data=request.data,partial=True)
        if serializer.is_valid():
            if request.data.get("client"):
                client=Profile.objects.get(pk=request.data.get("client"))
                data=serializer.save(client=client)
            else:
                data=serializer.save()
                
            try:
                job_categories = JobCategory.objects.get(id=eval(str(request.data['project_category'])))
                data.project_category=job_categories            
            except Exception as e:
                print(e)
                pass    
            data.project_location.latitude = request.data.get("latitude")
            data.project_location.longitude = request.data.get("longitude")
            data.save()
            response={
                "status":200,
                "type":"success",
                "message":"profile updated successfully",
                "data":serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
            # serializer.save()
            # return Response(serializer.data)
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

from api.project.serializers import AdminProjectSerializer,ProfileSerializer

class AdminProjectDetail(APIView):
    permission_classes = [IsAuthenticated]

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
        responses={200: AdminProjectSerializer(many=True), 400: "Bad Request"},
    )

    def get(self, request, pk):
        # project = self.get_object(pk)
        project = Project.objects.get(id=pk)
        serializer = AdminProjectSerializer(project)
        # serializer.data.pop("client")
        # conversation = Conversation.objects.get(project=project)
        # message= Message.objects.filter(conversation=conversation).order_by("-sent_at").first()
        # message = Message.objects.filter(conversation__project=project).order_by("-sent_at").first()
        

        serializer.data['client']=ProfileSerializer(project.client.id)
        data = serializer.data
        # data["message"] = MessageSerializer(message).data
        return Response(data)

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
        request_body=AdminProjectSerializer,
        responses={200: "Updated Successfully", 400: "Bad Request"}
    )
    def put(self, request, pk):
        project = self.get_object(pk)
        serializer = AdminProjectSerializer(project, data=request.data,partial=True)
        if serializer.is_valid():
            data=serializer.save()
            try:
                job_categories = JobCategory.objects.get(id=eval(str(request.data['project_category'])))
                data.project_category=job_categories
                data.save()
            except Exception as e:
                print(e)
                pass    
            response={
                "status":200,
                "type":"success",
                "message":"profile updated successfully",
                "data":serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
            # serializer.save()
            # return Response(serializer.data)
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




class ChangeProjectStatusView(APIView):

    @swagger_auto_schema(
        operation_summary="Change Project Status",
        operation_description="This endpoint allows changing the status of a specified project.",
        manual_parameters=[
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description="Authorization token (Bearer Token)",
            type=openapi.TYPE_STRING,
            required=True
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['status'],
            properties={
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="New status for the project (e.g., 'active', 'completed', etc.)"
                ),
            },
            example={
                "status": "completed"
            }
        ),
        responses={
            202: openapi.Response(
                description="Project status changed successfully",
                examples={
                    "application/json": {
                        "status": 202,
                        "type": "success",
                        "message": "Project status changed successfully"
                    }
                }
            ),
            404: openapi.Response(
                description="Project not found",
                examples={
                    "application/json": {
                        "status": 404,
                        "type": "error",
                        "message": "Project not found"
                    }
                }
            )
        }
    )
    def put(self,request,pk=None,user_type=None):
        project = get_object_or_404(Project, pk=pk)
        project.status=request.data.get("status")
        if request.data.get("status")=="completed":
            try:
                gateway=PaymentGatewayAPI()
                escrow_id=Transactions.objects.get(project=project).escrow_id
                response=gateway.initialize_disbursement(escrow_id=escrow_id)
                print(response)
                Transactions.objects.create(escrow_id=escrow_id,status='in_progress',project=project,transaction_type="disbursement")
            except:
                pass
        project.save()

        response = {
            "status" : 202,
            "type" : "success",
            "message" : "Project status changed successfully"
        }
        return Response(response,status=status.HTTP_202_ACCEPTED)
    
class ProjectBidApiView(APIView):
    permission_classes=[IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Retrieve paginated list of bids for a specific project",
        operation_description="Get paginated bids for the project specified by `project_id`.",
        manual_parameters=[
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description="Authorization token (Bearer Token)",
            type=openapi.TYPE_STRING,
            required=True
            )
        ],
        responses={200: BidSerializer(many=True)},
        # responses={
        #     200: { BidSerializer(many=True), "Paginated bids data for the specified project"},
        #     404: "Project not found",
        #     500: "Server error"
        # }
    )
    def get(self,request,project_id):  
        bids=Bid.objects.filter(project__id=project_id).order_by("-updated_at")
        paginator = CustomPagination()
        bids = paginator.paginate_queryset(bids, request)
        serializer = BidSerializer(bids, many=True)

        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
            operation_summary="Update a new bid for a specific project",
            operation_description="Update a new bid for the project specified by `project_id`.",
            manual_parameters=[
                openapi.Parameter(
                    'Authorization',
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,
                    required=True
                ),
            ],
            request_body=BidSerializer,
            responses={
                200: "Bid created successfully",
                400: "Invalid request",
                404: "Project not found",
                500: "Server error"
                }
    )
    # def put(self, request, bid_id):
    #         try:
    #             bid = Bid.objects.get(id=bid_id)
    #             project_id = bid.project.id
    #             bid.status = 'Accepted'
    #             bid.save()

    #             Bid.objects.filter(project_id=project_id).exclude(id=bid_id).update(status='Rejected')

    #             serializer = BidSerializer(bid)

    #             return Response(serializer.data, status=status.HTTP_200_OK)

    #         except Bid.DoesNotExist:
    #             return Response({"error": "Bid not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, bid_id):
        """
        Accept or reject a specific bid. If accepting, rejects all other bids for the same project.
        """
        action = request.data.get("action", "").lower()

        print(f"Received action: {action}")

        if action not in ["active", "accept", "reject"]:
            return Response({
                "status": "400",
                "message": "Failed",
                "type": "error",
                "data": {
                    "error": "Invalid action. Must be 'accept' or 'reject'."
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            bid = Bid.objects.get(id=bid_id)

            if action == "active":
                bid.status = 'Accepted'
                bid.save()
                # try:
                #     bid.project.status="ongoing"
                #     bid.project.save()
                # except:
                #     pass
                Bid.objects.filter(project=bid.project).exclude(id=bid_id).update(status='Rejected')
            elif action == "accept":
                bid.status = 'Accepted'
                bid.save()
                if bid.project.status=="myoffer":
                    bid.project.status="active"
                    Transactions.objects.create(bid=bid,status='pending',project=bid.project,transaction_type="collection")

                    bid.project.save()
                # bid.project.project_budget=bid.project_total_cost
                # bid.project.save()
                #ddd
                if request.data.get("phone_number") and action == "accept":
                    try:
                        bid.project.status="ongoing"
                        bid.project.save()
                        gateway=PaymentGatewayAPI()
                        client_details={
                            "mobile_number":request.data.get("phone_number",bid.service_provider.phone),
                            "email":bid.project.client.user.email
                        }
                        provider_details={
                            "mobile_number":bid.service_provider.phone if bid.service_provider.phone else bid.service_provider.phone ,
                            "email":bid.service_provider.user.email,
                        }
                        response=gateway.initialize_collection(bid.project_total_cost,'EUR',client_details,provider_details,bid.project.id)
                        print(response)
                        try:
                            Transactions.objects.create(escrow_id=response['escrow_id'],bid=bid,status='in_progress',project=bid.project,transaction_type="collection")
                            # bid.project.status="ongoing"
                            # bid.project.save()
                        except:
                            pass
                        Bid.objects.filter(project=bid.project).exclude(id=bid_id).update(status='Rejected')
                    except Exception as e:
                        print(e)
                        response={}
            elif action == "reject":
                bid.status = 'Rejected'
                bid.project.status='active'
                bid.project.save()
                bid.save()
                

            serializer = BidSerializer(bid).data
            try:
                serializer['payment_response']=response
            except:
                pass
            return Response(serializer, status=status.HTTP_200_OK)

        except Bid.DoesNotExist:
            return Response({"error": "Bid not found."}, status=status.HTTP_404_NOT_FOUND)


    # def put(self, request, bid_id):
    #         """
    #         Accept a specific bid and reject all other bids for the same project.
    #         """
    #         try:
    #             bid = Bid.objects.get(id=bid_id)
                
    #             bid.status = 'Accepted'
    #             bid.save()

    #             Bid.objects.filter(project=bid.project).exclude(id=bid_id).update(status='Rejected')

    #             serializer = BidSerializer(bid)
    #             return Response(serializer.data, status=status.HTTP_200_OK)

    #         except Bid.DoesNotExist:
    #             return Response({"error": "Bid not found."}, status=status.HTTP_404_NOT_FOUND)

class BidList(APIView):
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
        bids = Bid.objects.all().order_by("-updated_at")
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
            request_body=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                required=['project', 'amount'],
                properties={
                    'project': openapi.Schema(
                        type=openapi.TYPE_INTEGER,
                        description='Project ID'
                        ),
                'amount': openapi.Schema(
                    type=openapi.TYPE_NUMBER,
                    description='Bid amount'
                    )
                    }
            ),
            responses={
                201: "Bid created",
                400: "Project not found",
                500: "Server error"
                }
    )
    # def post(self, request):
    #     serializer = BidSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save(service_provider=Profile.objects.get(id=request.data['service_provider']),project=Project.objects.get(id=request.data['project']))  # Adjust if necessary
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, *args, **kwargs):
        profile = request.user.profile
        project_id = request.data.get('project')

        #  Check if project_id is provided
        if not project_id:
            return Response({'error': 'Project ID is required.'}, status=400)

        #  Check if the project exists
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found.'}, status=404)

        #  Block if an active bid already exists except 'Rejected'
        if Bid.objects.filter(
            service_provider=profile, 
            project=project
        ).exclude(status__iexact='Rejected').exists():
            return Response({'error': 'You already have an active bid on this project.'}, status=400)

        #  Now properly create the bid and associate it with the project
        serializer = BidSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            #  This line will now pass the Project object instead of project_id
            serializer.save(service_provider=profile, project=project)
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)
    
    # def post(self, request):
    #     serializer = BidSerializer(data=request.data)
    #     if serializer.is_valid():
    #         service_provider_id = request.data.get('service_provider')
    #         if not service_provider_id:
    #             return Response(
    #                 {"error": "Service provider ID is required."},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         service_provider = get_object_or_404(Profile, id=service_provider_id)
    #         serializer.save(service_provider=service_provider)
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request):
    #     serializer = BidSerializer(data=request.data)
        
    #     if serializer.is_valid():
    #         try:
    #             service_provider = Profile.objects.get(id=request.data['service_provider'])
    #         except Profile.DoesNotExist:
    #             return Response({"error": "Service provider not found."}, status=status.HTTP_404_NOT_FOUND)
    #         serializer.save(service_provider=service_provider)
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BidDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Bid.objects.get(pk=pk)
        except Bid.DoesNotExist:
            raise Http404

    @swagger_auto_schema(
            operation_summary="Get a bid",
            operation_description="Get a bid for a project.",
            manual_parameters=[
                openapi.Parameter(
                    'Authorization',
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,
                    required=True
                    )
                ],
            request_body=None,
            responses={
                200: "Bid retrieved",
                404: "Bid not found",
                500: "Server error"
                }
    )
    def get(self, request, pk):
        bid = self.get_object(pk)
        serializer = BidSerializer(bid)
        return Response(serializer.data)

    @swagger_auto_schema(
            operation_summary="Update a bid",
            operation_description="Update a bid for a project.",
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
                200: "Bid updated",
                404: "Bid not found",
                500: "Server error"
                }
    )
    def put(self, request, pk):
        bid = self.get_object(pk)
        serializer = BidSerializer(bid, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
            operation_summary="Delete a bid",
            operation_description="Delete a bid for a project.",
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
                204: "Bid Deleted",
                404: "Bid not found",
                500: "Server error"
            }
    )
    def delete(self, request, pk):
        try:
            bid = get_object_or_404(Bid, id=pk)
            
            Transactions.objects.filter(bid=bid, status="failed").delete()
            
            if Transactions.objects.filter(bid=bid).exists():
                return Response(
                    {"error": "Cannot delete bid because it is referenced by non-failed transactions."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            bid.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({"error": "Bid Does not exists"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Serch By Project ID
# class ServiceProviderListView(generics.ListAPIView):
#     permission_classes = [IsAuthenticated]
#     # queryset = ServiceProvider.objects.all()
#     serializer_class = BidSerializerProjectView

#     @swagger_auto_schema(
#         operation_summary="list of service providers of specific project",
#         operation_description="list of service providers",
#         manual_parameters=[
#             openapi.Parameter(
#                 'Authorization',
#                 openapi.IN_HEADER,
#                 description="Authorization token (Bearer Token)",
#                 type=openapi.TYPE_STRING,
#                 required=True
#                 ),
#                 # openapi.Parameter(
#                 #     'project_id',
#                 #     openapi.IN_PATH,
#                 #     description="ID of the project",
#                 #     type=openapi.TYPE_INTEGER,
#                 #     required=True
#                 # ),
#         ],
#         request_body=BidSerializerProjectView,
#         responses={
#             200: BidSerializerProjectView(many=True),
#             404: openapi.Response(
#                 description="No bids found for this project.",
#                 examples={
#                     "application/json": {
#                         "detail": "No bids found"
#                     }
#                 }
#             ),
#         },
#     )
#     def get_queryset(self):
#         project_id = self.kwargs['project_id']
#         return Bid.objects.filter(project_id=project_id)

#     def get(self, request, *args, **kwargs):
#         project_id = kwargs.get('project_id')
#         queryset = self.get_queryset()
#         if not queryset.exists():
#             return Response({"detail": "No bids found"}, status=status.HTTP_404_NOT_FOUND)
        
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)

from django.db.models import F, Case, When, Value, BooleanField

from rest_framework.pagination import PageNumberPagination
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size'
    max_page_size = 100

class ServiceProviderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BidSerializerProjectView

    # def get_queryset(self):
    #     search = self.request.query_params.get('search', None)

    #     if search:
    #         queryset = queryset.filter(service_provider__name__icontains=search) 

    #     return queryset

    @swagger_auto_schema(
        operation_summary="list of all project on service provider",
        operation_description="retrive list of all project",
        manual_parameters=[
                openapi.Parameter(
                    'Authorization',
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,
                    required=True
                )
            ],
        responses={200: BidSerializerProjectView(many=True)}
    )
    # Previous Working Code 
    # def get(self, request, *args, **kwargs):
    #     search_query = request.query_params.get('search', '')
    #     bids = Bid.objects.filter(service_provider=Profile.objects.get(user=request.user)).exclude(project__status__iexact='myoffer')

    #     queryset = Project.objects.filter(bid__in=bids).distinct()
    #     if search_query:
    #         queryset = queryset.filter(status=search_query)
    #     if search_query:
    #         queryset = Project.objects.filter(Q(project_title__icontains=search_query), Q(project_description__icontains=search_query), Q(project_status__icontains=search_query))
    #     if not queryset.exists():
    #         return Response([], status=status.HTTP_200_OK)
        
    #     paginator = CustomPaginationProjectProfile()
    #     paginated_queryset = paginator.paginate_queryset(queryset.distinct("id"), request)
        
    #     serializer = BidSerializerProjectView(paginated_queryset, many=True)
    #     return paginator.get_paginated_response(serializer.data)
    #     # # return Response([*queryset.values()])

    def get(self, request, *args, **kwargs):
        search_query = request.query_params.get('search', '')
        status2 = request.query_params.get("status")
        if status2=="active":
            bids = Bid.objects.filter(service_provider=Profile.objects.get(user=request.user)).exclude(project__status__iexact="Completed").exclude(project__status__iexact="myoffer").exclude(project__status__iexact="Rejected") # .include(project__status__iexact="ongoing"), status=status2)
        if status2=="completed":
            bids = Bid.objects.filter(service_provider=Profile.objects.get(user=request.user), status__iexact="Accepted").exclude(project__status__iexact="Ongoing").exclude(project__status__iexact="myoffer").exclude(project__status__iexact="Rejected")
        try:  
            queryset = Project.objects.filter(bid__in=bids).exclude(status__iexact='active').distinct()
        except:
            pass
        if search_query:
            queryset = queryset.filter(
                Q(project_title__icontains=search_query) |
                Q(project_description__icontains=search_query) |
                Q(status=search_query)
            ).order_by("id", "-updated_at")
        queryset=queryset.exclude(status__iexact="myoffer")
        try:
            if not queryset.exists():
                return Response([], status=status.HTTP_200_OK)
        except:
            return Response([{"message":"Please provide the correct status name"}], status=status.HTTP_406_NOT_ACCEPTABLE)
        queryset=queryset.annotate(
            can__send_bid=Case(
                When(Q(bid__service_provider=request.user.profile)&Q(status__iexact="Rejected"), then=Value(False)),
                default=Value(True),
                output_field=BooleanField()
            )
        )
        paginator = CustomPaginationProjectProfile()
        paginated_queryset = paginator.paginate_queryset(queryset.distinct("id"), request)
        
        serializer = BidSerializerProjectView(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)


class ServiceProviderHomeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        search_query = request.query_params.get('search', '')
        projects=Project.objects.filter(project_category__in=request.user.profile.job_category.all()).exclude(status__iexact="inactive").exclude(status__iexact="completed").exclude(status__iexact="ongoing").exclude(status__iexact="myoffer").order_by("created_at")
        if search_query:
            projects = projects.filter(project_title__icontains=search_query)
        print(projects)
        projects=projects.annotate(
            can__send_bid=Case(
                When(Q(bid__service_provider=request.user.profile)&Q(status__iexact="Rejected"), then=Value(False)),
                default=Value(True),
                output_field=BooleanField()
            )
        )
        projects=projects.distinct("id")
        paginator = CustomPagination()
        projects = paginator.paginate_queryset(projects, request)
        serializer = ProjectSerializer(projects, many=True)
        return paginator.get_paginated_response(serializer.data)

        # projects=ProjectSerializer(projects,many=True)
        # return Response(projects.data,status=200)

class MobileprojectActiveList(APIView):
    permission_classes = [IsAuthenticated]
    # def get(self, request):
    #     search_query = request.query_params.get('search', '')
    #     projects = Project.objects.filter(status="active" & status="myoffer").order_by("created_at")
    #     if search_query:
    #         projects = projects.filter(project_title__icontains=search_query)
    #         paginator = CustomPagination()
    #         projects = paginator.paginate_queryset(projects, request)
    #         serializer = ProjectSerializer(projects, many=True)
    #         return paginator.get_paginated_response(serializer.data)
    #     else:
    #         paginator = CustomPagination()
    #         projects = paginator.paginate_queryset(projects, request)
    #         serializer = ProjectSerializer(projects, many=True)
    #         return paginator.get_paginated_response(serializer.data)
        
    def get(self, request):
        client_profile = Profile.objects.get(user=request.user).id        
        # projects = Project.objects.filter(client=client_profile).order_by('created_at')
        search_query = request.query_params.get('search', '')
        projects = Project.objects.filter(Q(client=client_profile) &( Q(status="active") | Q(status="myoffer"))).order_by("created_at")

        if search_query:
            projects = projects.filter(project_title__icontains=search_query)
        
        paginator = CustomPagination()
        projects = paginator.paginate_queryset(projects, request)
        serializer = ProjectSerializer(projects, many=True)
        return paginator.get_paginated_response(serializer.data)



# class JobCategoryViewSet(viewsets.ModelViewSet):
#     queryset = JobCategory.objects.all()
#     class_serializer = JobCategorySerializer

#     def create(self, request, *args, **kwargs):
#         title = request.data.get('title')
#         if JobCategory.objects.filter(title=title).exists():
#             return Response({'error': 'Job category already exists.'}, status=status.HTTP_400_BAD_REQUEST)

#         return super().create(request, *args, **kwargs)

 
class JobCategoryView(APIView):
    def get(self, request, pk=None):
        try:
            if pk:
                job_category = JobCategory.objects.get(pk=pk)
                serializer = JobCategorySerializer(job_category)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                job_categories = JobCategory.objects.all()
                paginator = CustomPaginationProjectProfile()
                projects_paginated = paginator.paginate_queryset(job_categories, request)
                        
                serializer = JobCategorySerializer(projects_paginated, many=True)
            return paginator.get_paginated_response(serializer.data)
            #     serializer = JobCategorySerializer(job_categories, many=True)
            # return Response(serializer.data, status=status.HTTP_200_OK)
        except JobCategory.DoesNotExist:
            return Response({"status": 404, "message": "Job category not found."},status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"message": "Error Occurred Please Check"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # def get(self, request, pk=None):
    #     try:
    #         if pk:
    #             job_category = JobCategory.objects.filter(pk=pk).order_by("updated_at").first()
    #             if not job_category:
    #                 return Response(
    #                     {"message": "Job category not found or inactive"},
    #                     status=status.HTTP_404_NOT_FOUND
    #                 )
    #             serializer = JobCategorySerializer(job_category)
    #         else:
    #             job_categories = JobCategory.objects.filter(status="active")
    #             serializer = JobCategorySerializer(job_categories, many=True)
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     except Exception as e:
    #         return Response(
    #             {"message": "Error occurred. Please check", "details": str(e)},
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #         )
    
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
        except ProtectedError:
            return Response({
                "status": "400",
                "message": "Failed",
                "type": "error",
                "data": {
                    "category": ["This Category is used in other projects"]
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        except JobCategory.DoesNotExist:
            return Response({
                "status": "404",
                "message": "Failed",
                "type": "error",
                "data": {
                    "category": ["Job category not found"]
                }
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({"message": "Error Occurred Please Check"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from .serializers import SwitchRoleSerializer 

class SwitchRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SwitchRoleSerializer(instance=request.user) 
        updated_user = serializer.update(request.user, {}) 
        return Response({
        "message": f"User type switched to {updated_user.user_type}.", "new_user_type": updated_user.user_type
        })
########################################################################################

from project_management.models import Feedback, Project, Profile
from api.profile.serializers import FeedbackSerializer




class FeedbackDetailView(APIView):
    """
    API to retrieve, update, or delete feedback.
    """
    permission_classes = [IsAuthenticated]

    # def get(self, request, pk, *args, **kwargs):
    #     feedback = get_object_or_404(Feedback, pk=pk)
    #     serializer = FeedbackSerializer(feedback)
    #     return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request, pk, *args, **kwargs):
        """
        Create a new feedback entry for a specific service provider.
        """
        project_id=request.query_params.get('project_id')

        project = get_object_or_404(Project, pk=project_id)
        serializer = FeedbackSerializer(data=request.data)
        service_provider = get_object_or_404(Profile, pk=pk)
        if service_provider.user.user_type != "provider":
            return Response(
            {"error": "The specified profile is not a service provider."},
            status=status.HTTP_400_BAD_REQUEST
        )
        data = request.data
        serializer = FeedbackSerializer(data=data)

        if serializer.is_valid():
            try:
                feedback = Feedback.objects.create(
                    service_provider=service_provider,
                    project=project,
                    review=data.get('review'),
                    rating=data.get('rating'),
                )
                feedback.save()

                return Response(
                    FeedbackSerializer(feedback).data,
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, *args, **kwargs):
        """
        Update an existing feedback entry partially.
        """
        feedback = get_object_or_404(Feedback, pk=pk)
        serializer = FeedbackSerializer(feedback, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        feedback = get_object_or_404(Feedback, pk=pk)
        serializer = FeedbackSerializer(feedback, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        feedback = get_object_or_404(Feedback, pk=pk)
        feedback.delete()
        return Response({"message": "Feedback deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
########################### 22-12

from .serializers import  ProjectSerializer

# class FeedbackView(APIView):  #  to the service provider
#     permission_classes = [IsAuthenticated]

#     def post(self, request, project_id):
#         print('#######',project_id)
#         try:
#             project = Project.objects.get(id=project_id)
#         except Project.DoesNotExist:
#             return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

#         data = request.data.copy()
#         if not data.get('client_review', '') or not data.get('client_rating', ''):
#             return Response({"error": "Both 'client_review' and 'client_rating' fields are required."},
#         status=status.HTTP_400_BAD_REQUEST
#     )

#         data['project'] = project.id
#         print("data['project'] ", data['project'] )
#         data['service_provider'] = Bid.objects.get(project__id=project_id,status="Accepted").service_provider.pk
#         print("data['service_provider']", data['service_provider'])
#         feedback, created = Feedback.objects.update_or_create(
#             project=project,
#             service_provider=bid.service_provider,
#             defaults={
#                 'client_review': data.get('client_review'),
#                 'client_rating': data.get('client_rating'),
#                 'provider_review': data.get('provider_review'),
#                 'provider_rating': data.get('provider_rating'),
#             }
#         )


#         serializer = FeedbackSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(data=serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request, project_id,pk):
#         """Retrieve Feedback with Project Details"""
#         print("@@@@@@@@", project_id)
#         try:
#             project = Project.objects.get(id=project_id)
#         except Project.DoesNotExist:
#             return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

#         feedbacks = Feedback.objects.filter(project=project).last()
#         project_serializer = ProjectSerializer(project)
#         feedback_serializer = FeedbackSerializer(feedbacks)

#         return Response({
#             "project_details": project_serializer.data if project_serializer.data else [],
#             "feedbacks": feedback_serializer.data if feedback_serializer.data else []
#         }, status=status.HTTP_200_OK)

#     def put(self, request, project_id):
#         feedback_id = request.data.get("feedback_id", "")

#         try:
#             feedback = Feedback.objects.get(id=feedback_id)
#         except Feedback.DoesNotExist:
#             return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

#         # if feedback.project.client.user != request.user:
#         #     return Response({"error": "You are not authorized to update this feedback"}, status=status.HTTP_403_FORBIDDEN)

#         serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(data=serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, feedback_id):
   
#         try:
#             feedback = Feedback.objects.get(id=feedback_id)
#         except Feedback.DoesNotExist:
#             return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

#         if feedback.project.client.user != request.user:
#             return Response({"error": "You are not authorized to delete this feedback"}, status=status.HTTP_403_FORBIDDEN)

#         feedback.delete()
#         return Response({"message": "Feedback deleted successfully"}, status=status.HTTP_200_OK)

# New Code
class FeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        """
        Create feedback from the client to the service provider.
        """
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        # Validate request data
        data = request.data.copy()
        if not data.get('client_review') or not data.get('client_rating'):
            return Response({"error": "Both 'client_review' and 'client_rating' fields are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            accepted_bid = Bid.objects.get(project=project, status="Accepted")
        except Bid.DoesNotExist:
            return Response({"error": "Accepted bid not found for this project"}, status=status.HTTP_404_NOT_FOUND)

        data['project'] = project.id
        data['service_provider'] = accepted_bid.service_provider.id

        # Save feedback
        serializer = FeedbackSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, project_id, pk=None):
        """
        Retrieve feedback for a specific project.
        """
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        feedbacks = Feedback.objects.filter(project=project).last()
        project_serializer = ProjectSerializer(project)
        feedback_serializer = FeedbackSerializer(feedbacks)

        return Response({
            "project_details": project_serializer.data if project_serializer.data else [],
            "feedback": feedback_serializer.data if feedback_serializer.data else []
        }, status=status.HTTP_200_OK)

    def put(self, request, project_id):
        """
        Update existing feedback from the client.
        """
        feedback_id = request.data.get("feedback_id", "")

        try:
            feedback = Feedback.objects.get(id=feedback_id)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the logged-in user is the client for this feedback
        if feedback.project.client.user != request.user:
            return Response({"error": "You are not authorized to update this feedback"}, status=status.HTTP_403_FORBIDDEN)

        serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, feedback_id):
        """
        Delete feedback.
        """
        try:
            feedback = Feedback.objects.get(id=feedback_id)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

        if feedback.project.client.user != request.user:
            return Response({"error": "You are not authorized to delete this feedback"}, status=status.HTTP_403_FORBIDDEN)

        feedback.delete()
        return Response({"message": "Feedback deleted successfully"}, status=status.HTTP_200_OK)

# class ProviderFeedbackView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, project_id):
#         """
#         Create feedback from the service provider to the client.
#         """
#         try:
#             project = Project.objects.get(id=project_id)
#         except Project.DoesNotExist:
#             return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
#         provider_id = request.data.get('provider_id')
#         bid = Bid.objects.filter(project=project, service_provider__id=provider_id).first()
#         # Ensure the logged-in user is the service provider for this project
#         # if bid.service_provider.user != request.user:
#         #     return Response({"error": "You are not authorized to give feedback for this project"}, status=status.HTTP_403_FORBIDDEN)

#         data = request.data.copy()
#         if not data.get('provider_review', '') or not data.get('provider_rating', ''):
#             return Response({"error": "Both 'provider_review' and 'provider_rating' fields are required."},
#         status=status.HTTP_400_BAD_REQUEST
#     )
#         data['project'] = project.id
#         data['client'] = project.client.id
#         data['service_provider'] =bid.service_provider.id

#         serializer = FeedbackSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(data=serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request, project_id):
#         """
#         Retrieve the last feedback given for a specific project with project details.
#         """
#         try:
#             project = Project.objects.get(id=project_id)
#         except Project.DoesNotExist:
#             return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

#         feedback = Feedback.objects.filter(project=project).last()
#         project_serializer = ProjectSerializer(project)
#         feedback_serializer = FeedbackSerializer(feedback)

#         return Response({
#             "project_details": project_serializer.data,
#             "feedback": feedback_serializer.data
#         }, status=status.HTTP_200_OK)

#     def put(self, request, project_id):
#         """
#         Update existing feedback.
#         """
#         feedback_id = request.data.get("feedback_id", "")

#         try:
#             feedback = Feedback.objects.get(id=feedback_id)
#         except Feedback.DoesNotExist:
#             return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

#         # Ensure the logged-in user is the service provider who created this feedback
#         if feedback.project.service_provider.user != request.user:
#             return Response({"error": "You are not authorized to update this feedback"}, status=status.HTTP_403_FORBIDDEN)

#         serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(data=serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, feedback_id):
#         """
#         Delete feedback.
#         """
#         try:
#             feedback = Feedback.objects.get(id=feedback_id)
#         except Feedback.DoesNotExist:
#             return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

#         # Ensure the logged-in user is the service provider who created this feedback
#         if feedback.project.service_provider.user != request.user:
#             return Response({"error": "You are not authorized to delete this feedback"}, status=status.HTTP_403_FORBIDDEN)

#         feedback.delete()
#         return Response({"message": "Feedback deleted successfully"}, status=status.HTTP_200_OK)

# New Code
class ProviderFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    # def post(self, request, project_id):
    #     """
    #     Create feedback from the service provider to the client.
    #     """
    #     try:
    #         project = Project.objects.get(id=project_id)
    #     except Project.DoesNotExist:
    #         return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        
    #     provider_id = request.data.get('provider_id')
    #     bid = Bid.objects.filter(project=project, service_provider__id=provider_id).first()
    #     if not bid:
    #         return Response({"error": "Bid not found for the service provider"}, status=status.HTTP_404_NOT_FOUND)

    #     if request.user != bid.service_provider.user:
    #         return Response({"error": "You are not authorized to provide feedback for this project"}, status=status.HTTP_403_FORBIDDEN)

    #     data = request.data.copy()
    #     if not data.get('provider_review') or not data.get('provider_rating'):
    #         return Response({"error": "Both 'provider_review' and 'provider_rating' fields are required."},
    #                         status=status.HTTP_400_BAD_REQUEST)

    #     # Prepare data
    #     data['project'] = project.id
    #     data['service_provider'] = bid.service_provider.id
    #     data['client'] = project.client.id

    #     # Save feedback
    #     feedback=Feedback.objects.get(project=project)
    #     if feedback:
    #         serializer = FeedbackSerializer(data=data,instance=feedback,partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, project_id):
        """
        Create or update feedback from the service provider to the client.
        """
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        
        provider_id = request.data.get('provider_id')
        bid = Bid.objects.filter(project=project, service_provider__id=provider_id).first()
        if not bid:
            return Response({"error": "Bid not found for the service provider"}, status=status.HTTP_404_NOT_FOUND)

        if request.user != bid.service_provider.user:
            return Response({"error": "You are not authorized to provide feedback for this project"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        if not data.get('provider_review') or not data.get('provider_rating'):
            return Response({"error": "Both 'provider_review' and 'provider_rating' fields are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Prepare data
        data['project'] = project.id
        data['service_provider'] = bid.service_provider.id
        data['client'] = project.client.id

        # Check if feedback exists, otherwise create a new one
        feedback = Feedback.objects.filter(project=project, service_provider=bid.service_provider).first()
        if feedback:
            serializer = FeedbackSerializer(instance=feedback, data=data, partial=True)  # Update
        else:
            serializer = FeedbackSerializer(data=data)  # Create new

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, project_id):
        """
        Retrieve the last feedback given for a specific project with project details.
        """
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        feedback = Feedback.objects.filter(project=project).last()
        project_serializer = ProjectSerializer(project)
        feedback_serializer = FeedbackSerializer(feedback)

        return Response({
            "project_details": project_serializer.data,
            "feedback": feedback_serializer.data if feedback else None
        }, status=status.HTTP_200_OK)

    def put(self, request, project_id):
        """
        Update existing feedback.
        """
        feedback_id = request.data.get("feedback_id", "")

        try:
            feedback = Feedback.objects.get(id=feedback_id)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the logged-in user is the service provider who created this feedback
        if feedback.service_provider.user != request.user:
            return Response({"error": "You are not authorized to update this feedback"}, status=status.HTTP_403_FORBIDDEN)

        serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, feedback_id):
    #     """
    #     Delete feedback.
    #     """
    #     try:
    #         feedback = Feedback.objects.get(id=feedback_id)
    #     except Feedback.DoesNotExist:
    #         return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

    #     # Ensure the logged-in user is the service provider who created this feedback
    #     if feedback.service_provider.user != request.user:
    #         return Response({"error": "You are not authorized to delete this feedback"}, status=status.HTTP_403_FORBIDDEN)

    #     feedback.delete()
    #     return Response({"message": "Feedback deleted successfully"}, status=status.HTTP_200_OK)
    
    def delete(self, request, feedback_id):
        """
        Delete feedback based on the feedback_id.
        """
        try:
            feedback = Feedback.objects.get(id=feedback_id)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the logged-in user is the service provider who created this feedback
        if feedback.service_provider.user != request.user:
            return Response({"error": "You are not authorized to delete this feedback."}, status=status.HTTP_403_FORBIDDEN)

        feedback.delete()
        return Response({"message": "Feedback deleted successfully"}, status=status.HTTP_200_OK)
    
