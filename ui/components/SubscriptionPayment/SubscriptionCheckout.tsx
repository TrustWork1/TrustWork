import { useGetSubscriptionPlanDetails } from '@/api/hooks/subscriptionPlans.hooks';
import { SubscriptionPaymentWrap } from '@/styles/StyledComponents/SubscriptionPaymentStyled';
import { TSubscriptionCheckoutPlan } from '@/typescript/types/subscriptionPayment.type';
import { Container, Grid2 } from '@mui/material';
import { useMemo } from 'react';
import SubscriptionPaymentTabs from './SubscriptionPaymentTabs';
import SubscriptionPlanSummary from './SubscriptionPlanSummary';

type SubscriptionCheckoutProps = {
  token: string;
  planId: number;
};

const SubscriptionCheckout = ({ token, planId }: SubscriptionCheckoutProps) => {
  const {
    data: subscriptionPlanDetails,
    isLoading,
    isError,
  } = useGetSubscriptionPlanDetails(planId);

  const subscriptionPlan: TSubscriptionCheckoutPlan = useMemo(() => {
    if (!subscriptionPlanDetails?.subscriptionDetails) {
      return {
        id: 0,
        planName: '',
        description: '',
        amount: 0,
        currency: '',
        interval: '',
        features: [],
        billingCycle: '',
      };
    }
    return {
      id: subscriptionPlanDetails?.subscriptionDetails?.id,
      planName: subscriptionPlanDetails?.subscriptionDetails?.plan_name,
      description: subscriptionPlanDetails?.subscriptionDetails?.description,
      amount: Number(subscriptionPlanDetails?.subscriptionDetails?.amount),
      currency: subscriptionPlanDetails?.subscriptionDetails?.currency,
      interval: subscriptionPlanDetails?.subscriptionDetails?.subscription_frequency,
      features: subscriptionPlanDetails?.subscriptionDetails?.features?.map(item => item?.features),
      billingCycle: subscriptionPlanDetails?.subscriptionDetails?.billing_cycle,
    };
  }, [subscriptionPlanDetails]);

  console.info('subscriptionPlan', { subscriptionPlan });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }
  return (
    <SubscriptionPaymentWrap>
      <Container fixed>
        <Grid2 container spacing={4} className='checkoutGrid'>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <SubscriptionPlanSummary plan={subscriptionPlan} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <SubscriptionPaymentTabs token={token} plan={subscriptionPlan} />
          </Grid2>
        </Grid2>
      </Container>
    </SubscriptionPaymentWrap>
  );
};

export default SubscriptionCheckout;
