
# from .models import Conversation
# from profile_management.models import Profile
# from customuser.models import CustomUser

# def get_or_create_conversation(profile1, profile2,project_id):
#     if profile1.user.user_type == profile2.user.user_type:
#         raise ValueError("Only service providers can chat with clients and vice versa.")

#     conversation = (
#         Conversation.objects.filter(participants=profile1)
#         .filter(participants=profile2)
#         .first()
#     )
#     if not conversation:
#         conversation = Conversation.objects.create(project=project_id)
#         conversation.participants.add(profile1, profile2)

#     return conversation


'''  """
    Get an existing conversation between two profiles or create a new one.
    Ensure that only service providers can chat with clients and vice versa.
    """'''