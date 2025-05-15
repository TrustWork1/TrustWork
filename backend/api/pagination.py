from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 100
    def paginate_queryset(self, queryset, request, view=None):
        return super().paginate_queryset(queryset.order_by("-id"),request,view)
    def get_paginated_response(self, data):
        return Response({
            "status": 200,
            "type": "success",
            "message": "All data fetched successfully!",
            "data": data,
            "total": self.page.paginator.count,
            "page": self.page.number,
            "pages": self.page.paginator.num_pages,
            "limit": self.page.paginator.per_page,
        })

class CustomPaginationTransition(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 100
    def paginate_queryset(self, queryset, request, view=None):
        return super().paginate_queryset(queryset,request,view)
    def get_paginated_response(self, data):
        return Response({
            "status": 200,
            "type": "success",
            "message": "All data fetched successfully!",
            "data": data,
            "total": self.page.paginator.count,
            "page": self.page.number,
            "pages": self.page.paginator.num_pages,
            "limit": self.page.paginator.per_page,
        })

class CustomProjectPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 100
    def paginate_queryset(self, queryset, request, view=None):
        return super().paginate_queryset(queryset.order_by("-updated_at"),request,view)
    def get_paginated_response(self, data):
        return Response({
            "status": 200,
            "type": "success",
            "message": "All data fetched successfully!",
            "data": data,
            "total": self.page.paginator.count,
            "page": self.page.number,
            "pages": self.page.paginator.num_pages,
            "limit": self.page.paginator.per_page,
        })

class CustomPaginationProjectProfile(PageNumberPagination):
    page_size = 10                    
    page_size_query_param = 'limit'
    max_page_size = 100
    def paginate_queryset(self, queryset, request, view=None):
        return super().paginate_queryset(queryset, request, view)
        # return super().paginate_queryset(queryset.order_by("-updated_at"),request,view)
    def get_paginated_response(self, data):
        return Response({
            "status": 200,
            "type": "success",
            "message": "All data fetched successfully!",
            "data": data,
            "total": self.page.paginator.count,
            "page": self.page.number,
            "pages": self.page.paginator.num_pages,
            "limit": self.page.paginator.per_page,
        })

'''If a client makes a request with ?limit=20:
20 items per page will be returned (if there are enough items available), as it is within the range allowed by max_page_size.

If a client makes a request with ?limit=150:
The page will still return 100 items because 150 exceeds max_page_size.

If no limit query parameter is provided:
The default page_size (10 items) is used.'''