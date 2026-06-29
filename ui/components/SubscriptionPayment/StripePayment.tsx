import { useStripeSubscriptionPayment } from '@/api/hooks/stripe.hooks';
import {
  createStripePaymentPayload,
  getSubscriptionPaymentReferenceId,
} from '@/lib/functions/subscriptionPayment.lib';
import { TStripePaymentForm, stripePaymentSchema } from '@/schema/subscriptionPayment.yup';
import { TSubscriptionPaymentFormProps } from '@/typescript/types/subscriptionPayment.type';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { NoteIcon } from '@/ui/Icon/NoteIcon';
import UserIcon from '@/ui/Icon/UserIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography, useTheme } from '@mui/material';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import ErrorBoundary from '../Error/ErrorBoundary';
import FormTextField from '../Forms/FormTextField';
import PaymentResponseCard from './PaymentResponseCard';
import PaymentSuccessResponseModal from './PaymentSuccessResponseModal';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';

const getStripePromise = () => {
  return stripePublishableKey ? loadStripe(stripePublishableKey) : null;
};

const StripePaymentForm = ({ token, plan, onPaymentSubmit }: TSubscriptionPaymentFormProps) => {
  const elements = useElements();
  const stripe = useStripe();
  const theme = useTheme();
  const [isCreatingPaymentMethod, setIsCreatingPaymentMethod] = useState(false);
  const [isResultPopupOpen, setIsResultPopupOpen] = useState(false);

  const {
    handleStripePaymentFailed,
    handleStripePaymentStarted,
    handleStripePaymentSubmitted,
    initiateStripePayment,
    isCheckingStatus,
    isFailed,
    isInitiating,
    isPaid,
    isPendingPayment,
    paymentMessage,
    paymentIntentId,
  } = useStripeSubscriptionPayment({
    planId: plan.id,
    token,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TStripePaymentForm>({
    resolver: yupResolver(stripePaymentSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      email: '',
    },
  });

  const isPaymentSubmitting = isCreatingPaymentMethod || isInitiating || isPendingPayment;
  const isStripeReady = Boolean(stripePublishableKey) && Boolean(stripe) && Boolean(elements);
  const paymentResultStatus = isPaid ? 'success' : isFailed ? 'failed' : undefined;
  const paymentResultTitle = isPaid ? 'Payment Successful' : 'Payment Failed';
  const successMessage = `${paymentMessage} Redirecting to homepage in 3 seconds...`;

  useEffect(() => {
    if ((isPaid || isFailed) && paymentIntentId) {
      setIsResultPopupOpen(true);
    }
  }, [isFailed, isPaid, paymentIntentId]);

  const stripeElementOptions = useMemo(
    () => ({
      disabled: false,
      style: {
        base: {
          color: theme.palette.customColors.dark,
          fontFamily: theme.typography.fontFamily,
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: theme.palette.customColors.dark,
            fontSize: '12px',
          },
        },
        invalid: {
          color: theme.palette.error.main,
        },
      },
    }),
    [theme]
  );

  const onSubmit = async (data: TStripePaymentForm) => {
    if (!stripePublishableKey) {
      handleStripePaymentFailed('Stripe publishable key is missing.');
      return;
    }

    if (!stripe || !elements || isPaymentSubmitting) {
      handleStripePaymentFailed('Stripe payment form is not ready.');
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);

    if (!cardNumber) {
      handleStripePaymentFailed('Stripe card number element is not ready.');
      return;
    }

    setIsCreatingPaymentMethod(true);
    handleStripePaymentStarted();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumber,
      billing_details: {
        email: data.email,
        name: data.full_name,
      },
    });

    if (error || !paymentMethod) {
      setIsCreatingPaymentMethod(false);
      handleStripePaymentFailed(error?.message || 'Stripe payment method creation failed.');
      return;
    }

    const payload = createStripePaymentPayload({
      plan,
      token,
    });

    onPaymentSubmit?.(payload);

    const response = await initiateStripePayment(payload);

    if (!response?.client_secret) {
      setIsCreatingPaymentMethod(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmCardPayment(response.client_secret, {
      payment_method: paymentMethod.id,
    });

    setIsCreatingPaymentMethod(false);

    if (confirmError) {
      handleStripePaymentFailed(confirmError.message);
      return;
    }

    await handleStripePaymentSubmitted(getSubscriptionPaymentReferenceId(response));
  };

  return (
    <>
      <PaymentSuccessResponseModal
        open={Boolean(paymentResultStatus) && isResultPopupOpen}
        onClose={isPaid ? undefined : () => setIsResultPopupOpen(false)}
        status={paymentResultStatus}
        title={paymentResultTitle}
        message={isPaid ? successMessage : paymentMessage}
        referenceId={paymentIntentId}
        token={token}
      />

      <Box component='form' className='paymentForm' onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Typography variant='body1' className='fieldLabel'>
            Full name
          </Typography>
          <FormTextField
            name='full_name'
            placeHolder='Enter full name'
            endAdornment={<UserIcon />}
            control={control}
            errors={errors}
          />
        </Box>
        <Box>
          <Typography variant='body1' className='fieldLabel'>
            Email
          </Typography>
          <FormTextField
            name='email'
            placeHolder='Enter email address'
            endAdornment={<NoteIcon />}
            control={control}
            errors={errors}
          />
        </Box>
        <Box>
          <Typography variant='body1' className='fieldLabel'>
            Card number
          </Typography>
          <Box className='stripeElementBox'>
            <CardNumberElement options={stripeElementOptions} />
          </Box>
        </Box>
        <Box className='stripeCardGrid'>
          <Box>
            <Typography variant='body1' className='fieldLabel'>
              Expiry date
            </Typography>
            <Box className='stripeElementBox'>
              <CardExpiryElement options={stripeElementOptions} />
            </Box>
          </Box>
          <Box>
            <Typography variant='body1' className='fieldLabel'>
              CVV
            </Typography>
            <Box className='stripeElementBox'>
              <CardCvcElement options={stripeElementOptions} />
            </Box>
          </Box>
        </Box>
        <Typography variant='body1' className='paymentNotice'>
          Stripe will collect and process your card details securely.
        </Typography>
        {isPendingPayment && (
          <PaymentResponseCard
            status='pending'
            title='Payment Processing'
            message={paymentMessage}
            referenceId={paymentIntentId}
          />
        )}
        {isPaid && (
          <PaymentResponseCard
            status='success'
            title='Payment Successful'
            message={successMessage}
            referenceId={paymentIntentId}
          />
        )}
        {isFailed && (
          <PaymentResponseCard
            status='failed'
            title='Payment Failed'
            message={paymentMessage}
            referenceId={paymentIntentId}
          />
        )}
        {!stripePublishableKey && (
          <PaymentResponseCard
            status='failed'
            title='Stripe Key Missing'
            message='Please add NEXT_PUBLIC_STRIPE_PUBLIC_KEY or NEXT_APP_STRIPE_PUBLIC_KEY in the environment file.'
          />
        )}
        <CustomButtonPrimary
          type='submit'
          variant='contained'
          color='primary'
          className='payBtn'
          disabled={!isStripeReady || isCheckingStatus || isPaymentSubmitting || isPaid}
        >
          {isPaymentSubmitting ? 'Processing...' : 'Pay With Stripe'}
        </CustomButtonPrimary>
      </Box>
    </>
  );
};

const StripePayment = (props: TSubscriptionPaymentFormProps) => {
  const stripePromise = useMemo(() => getStripePromise(), []);

  return (
    <Elements stripe={stripePromise}>
      <ErrorBoundary>
        <Suspense fallback={'Loading.....'}>
          <StripePaymentForm {...props} />
        </Suspense>
      </ErrorBoundary>
    </Elements>
  );
};

export default StripePayment;
