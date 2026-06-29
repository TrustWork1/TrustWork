import { useQuery } from '@tanstack/react-query';
import { fetchSubscriptionDetails } from '../functions/subscription';

export const useGetSubscriptionPlanDetails = (planId: number) =>
  useQuery({
    queryKey: ['subscription-plan-details', planId],
    queryFn: () => fetchSubscriptionDetails(planId),
    enabled: !!planId,
  });
