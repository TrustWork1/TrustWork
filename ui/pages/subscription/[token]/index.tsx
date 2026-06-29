import { validateSubscriptionToken } from '@/api/functions/subscription';
import SubscriptionActiveState from '@/components/SubscriptionPayment/SubscriptionActiveState';
import SubscriptionCheckout from '@/components/SubscriptionPayment/SubscriptionCheckout';
import { SessionStorageKey } from '@/lib/functions/keys/sesssionStorageKeys';
import { sessionStorageHelper } from '@/lib/functions/sessionStorageHelper';
import { SubscriptionPaymentWrap } from '@/styles/StyledComponents/SubscriptionPaymentStyled';
import Loader from '@/ui/Loader/Loder';
import { Box, Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const SubscriptionTokenPage = () => {
  const router = useRouter();
  const token = typeof router.query.token === 'string' ? router.query.token : '';
  const {
    data: validationResponse,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['subscription-validate-token', token],
    queryFn: () =>
      validateSubscriptionToken({
        token,
      }),
    enabled: router.isReady && Boolean(token),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const planId = sessionStorageHelper.get<number>(SessionStorageKey.SubscriptionPlan);

  if (!planId) {
    return;
  }

  const validationData = validationResponse?.data ?? validationResponse;
  const validationUser = validationData?.user;
  const isPaymentVerified = Boolean(validationUser?.is_payment_verified);
  const isValidToken = Boolean(validationData?.valid);
  const isValidating = !router.isReady || (Boolean(token) && isFetching);

  if (isValidating) {
    return (
      <SubscriptionPaymentWrap>
        <Container fixed>
          <Box className='checkoutPanel validationStatePanel'>
            <Loader />
            <Typography variant='body1' className='formHint'>
              Validating your subscription session...
            </Typography>
          </Box>
        </Container>
      </SubscriptionPaymentWrap>
    );
  }

  if (!token || isError || !isValidToken) {
    return (
      <SubscriptionPaymentWrap>
        <Container fixed>
          <Box className='checkoutPanel validationStatePanel'>
            <Typography variant='h2' className='sectionTitle'>
              Session Expired
            </Typography>
            <Typography variant='body1' className='formHint'>
              Please login again before continuing to subscription payment.
            </Typography>
          </Box>
        </Container>
      </SubscriptionPaymentWrap>
    );
  }

  if (isPaymentVerified) {
    return (
      <SubscriptionPaymentWrap>
        <Container fixed>
          <SubscriptionActiveState userName={validationUser?.full_name} />
        </Container>
      </SubscriptionPaymentWrap>
    );
  }

  return <SubscriptionCheckout token={token} planId={planId} />;
};

export default SubscriptionTokenPage;
