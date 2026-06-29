import {
  TSubscriptionCheckoutPlan,
  TSubscriptionPaymentMode,
} from '@/typescript/types/subscriptionPayment.type';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import MtnMobileMoneyPayment from './MtnMobileMoneyPayment';
import OrangeMoneyPayment from './OrangeMoneyPayment';
import StripePayment from './StripePayment';

type SubscriptionPaymentTabsProps = {
  token: string;
  plan: TSubscriptionCheckoutPlan;
};

const paymentTabs: { label: string; value: TSubscriptionPaymentMode }[] = [
  { label: 'Orange Money', value: 'orange_money' },
  { label: 'MTN', value: 'mtn_mobile_money' },
  // { label: 'Stripe', value: 'stripe' },
];

const SubscriptionPaymentTabs = ({ token, plan }: SubscriptionPaymentTabsProps) => {
  const [activePaymentMode, setActivePaymentMode] =
    useState<TSubscriptionPaymentMode>('orange_money');

  const paymentModeComponent = useMemo(() => {
    const commonProps = {
      token,
      plan,
      onPaymentSubmit: (payload: Record<string, unknown>) => {
        console.info('subscription checkout payload', payload);
      },
    };

    if (activePaymentMode === 'mtn_mobile_money') {
      return <MtnMobileMoneyPayment {...commonProps} />;
    }

    if (activePaymentMode === 'stripe') {
      return <StripePayment {...commonProps} />;
    }

    return <OrangeMoneyPayment {...commonProps} />;
  }, [activePaymentMode, plan, token]);

  return (
    <Box className='checkoutPanel'>
      <Typography variant='h2' className='sectionTitle'>
        Choose Payment Method
      </Typography>
      <Typography variant='body1' className='formHint'>
        Select how you want to complete this subscription payment.
      </Typography>
      <Tabs
        value={activePaymentMode}
        onChange={(_, value: TSubscriptionPaymentMode) => setActivePaymentMode(value)}
        className='paymentTabs'
      >
        {paymentTabs.map(tab => (
          <Tab key={tab.value} label={tab.label} value={tab.value} disableRipple />
        ))}
      </Tabs>
      {paymentModeComponent}
    </Box>
  );
};

export default SubscriptionPaymentTabs;
