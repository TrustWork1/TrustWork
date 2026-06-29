import { useMtnSubscriptionPayment } from '@/api/hooks/mtn.hooks';
import { TSubscriptionPaymentFormProps } from '@/typescript/types/subscriptionPayment.type';
import { Suspense, useEffect, useState } from 'react';
import MobileMoneyPaymentForm from './MobileMoneyPaymentForm';
import PaymentResponseCard from './PaymentResponseCard';
import PaymentSuccessResponseModal from './PaymentSuccessResponseModal';
import ErrorBoundary from '../Error/ErrorBoundary';

const MtnMobileMoneyPayment = (props: TSubscriptionPaymentFormProps) => {
  const { plan, token } = props;
  const [isResultPopupOpen, setIsResultPopupOpen] = useState(false);

  const {
    initiateMtnPayment,
    isCheckingStatus,
    isFailed,
    isInitiating,
    isPaid,
    isPendingPayment,
    referenceId,
    errorMessage,
    nextActionMessage,
  } = useMtnSubscriptionPayment({
    planId: plan.id,
  });

  const paymentResultStatus = isPaid ? 'success' : isFailed ? 'failed' : undefined;
  const paymentResultTitle = isPaid ? 'Payment Successful' : 'Payment Failed';
  const successMessage = `Your MTN payment is verified and your subscription has been activated. Redirecting to homepage in 3 seconds...`;
  const failureMessage = errorMessage || 'Please check your number and try again.';
  const pendingMessage = `Payment request sent. Please approve the MTN Mobile Money prompt on your phone. ${
    nextActionMessage ||
    'If the prompt does not appear, open your MTN MoMo app or dial the MTN MoMo code and check pending payment requests.'
  }`;

  useEffect(() => {
    if (isPaid || isFailed) {
      setIsResultPopupOpen(true);
    }
  }, [isPaid, isFailed]);

  const handleMtnSubmit = (payload: Record<string, unknown>) => {
    if (typeof payload.phone !== 'string') {
      return;
    }

    initiateMtnPayment(payload.phone);
  };

  return (
    <>
      <PaymentSuccessResponseModal
        open={Boolean(paymentResultStatus) && isResultPopupOpen}
        onClose={isPaid ? undefined : () => setIsResultPopupOpen(false)}
        status={paymentResultStatus}
        title={paymentResultTitle}
        message={isPaid ? successMessage : failureMessage}
        referenceId={referenceId}
        token={token}
      />
      <ErrorBoundary>
        <Suspense fallback={'Loading.....'}>
          <MobileMoneyPaymentForm
            {...props}
            provider='mtn_mobile_money'
            providerName='MTN Mobile Money'
            onPaymentSubmit={payload => {
              handleMtnSubmit(payload);
            }}
            // phoneHelperText='Enter a valid Cameroon MTN MoMo number, e.g. 675708549. You may also paste it with +237.'
            notice='We will send an MTN approval prompt to this number. Please approve it on your phone.'
            buttonText={isInitiating ? 'Sending Request...' : 'Pay With MTN Mobile Money'}
            loading={isInitiating}
            disabled={isInitiating || isCheckingStatus || isPendingPayment}
            statusContent={
              <>
                {isPendingPayment && (
                  <PaymentResponseCard
                    status='pending'
                    title='Payment Pending'
                    message={pendingMessage}
                    referenceId={referenceId}
                  />
                )}
                {isFailed && (
                  <PaymentResponseCard
                    status='failed'
                    title='Payment Failed'
                    message={failureMessage}
                    referenceId={referenceId}
                  />
                )}
              </>
            }
          />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default MtnMobileMoneyPayment;
