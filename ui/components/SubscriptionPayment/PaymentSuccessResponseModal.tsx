import { clearSubscriptionCheckoutSession } from '@/lib/functions/subscriptionCheckout.lib';
import PaymentSuccessIcon from '@/ui/Icon/PaymentSuccessIcon';
import MuiModalWrapper from '@/ui/Modal/MuiModalWrapper';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface PaymentSuccessResponseModalProps {
  open: boolean;
  onClose?: () => void;
  status: 'success' | 'failed' | 'pending' | undefined;
  title: string;
  message: string;
  referenceId?: string;
  token: string;
}

const PaymentSuccessResponseModal = ({
  open,
  onClose,
  status,
  title,
  message,
  referenceId,
  token,
}: PaymentSuccessResponseModalProps) => {
  const router = useRouter();

  useEffect(() => {
    if (status !== 'success' || !open) {
      return;
    }

    clearSubscriptionCheckoutSession(token);

    const redirectTimer = window.setTimeout(() => {
      void router.push('/');
    }, 3000);

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [status, open, router, token]);

  return (
    <MuiModalWrapper
      open={open}
      onClose={status === 'success' ? undefined : onClose}
      className='paymentSuccessResponseModal'
      hideCloseButton={status === 'success'}
    >
      <Box className='paymentSuccessInr'>
        {status === 'success' && (
          <Box className='successIconWrap'>
            <PaymentSuccessIcon />
          </Box>
        )}
        {status === 'failed' && <Box className='statusIconWrap failed'>!</Box>}
        {status === 'pending' && <Box className='statusIconWrap pending'>...</Box>}
        <Typography variant='h3' className='secHead'>
          {title}
        </Typography>
        <Typography variant='body1' className='secSubText'>
          {message}
        </Typography>
        {referenceId && (
          <Typography variant='body1' className='referenceText'>
            Reference: {referenceId}
          </Typography>
        )}
      </Box>
    </MuiModalWrapper>
  );
};

export default PaymentSuccessResponseModal;
