'use client';

import { sessionStorageHelper } from '@/lib/functions/sessionStorageHelper';
import PaymentSuccessIcon from '@/ui/Icon/PaymentSuccessIcon';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';

type SubscriptionActiveStateProps = {
  userName?: string;
};

const SubscriptionActiveState = ({ userName }: SubscriptionActiveStateProps) => {
  const router = useRouter();
  return (
    <Box className='checkoutPanel activeSubscriptionPanel'>
      <Box className='activeSubscriptionIcon'>
        <PaymentSuccessIcon />
      </Box>
      <Typography variant='h2' className='sectionTitle'>
        Subscription Active
      </Typography>
      <Typography variant='body1' className='formHint'>
        {userName
          ? `${userName}, your payment is already verified.`
          : 'Your payment is already verified.'}
      </Typography>
      <Typography variant='body1' className='paymentNotice'>
        You can continue using TrustWork without completing another payment for this subscription.
      </Typography>
      <Button
        variant='contained'
        sx={{ my: 2 }}
        onClick={() => {
          router.push('/');
          sessionStorageHelper.clear();
        }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default SubscriptionActiveState;
