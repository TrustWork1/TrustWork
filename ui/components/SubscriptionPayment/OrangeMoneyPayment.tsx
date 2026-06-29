import { useOrangeSubscriptionPayment } from '@/api/hooks/orange.hooks';
import { TSubscriptionPaymentFormProps } from '@/typescript/types/subscriptionPayment.type';
import { Suspense, useEffect, useState } from 'react';
import MobileMoneyPaymentForm from './MobileMoneyPaymentForm';
import PaymentResponseCard from './PaymentResponseCard';
import PaymentSuccessResponseModal from './PaymentSuccessResponseModal';
import ErrorBoundary from '../Error/ErrorBoundary';

const OrangeMoneyPayment = (props: TSubscriptionPaymentFormProps) => {
  const { plan, token } = props;
  const [isResultPopupOpen, setIsResultPopupOpen] = useState(false);

  const {
    initiateOrangePayment,
    isCheckingStatus,
    isFailed,
    isInitiating,
    isPaid,
    isPendingPayment,
    referenceId,
    errorMessage,
    nextActionMessage,
  } = useOrangeSubscriptionPayment({
    planId: plan.id,
    token,
  });

  const paymentResultStatus = isPaid ? 'success' : isFailed ? 'failed' : undefined;
  const paymentResultTitle = isPaid ? 'Payment Successful' : 'Payment Failed';
  const successMessage = `Your Orange Money payment is verified and your subscription has been activated. Redirecting to homepage in 3 seconds...`;
  const failureMessage = errorMessage || 'Please check your number and try again.';
  const pendingMessage = `Payment request sent. Please approve the Orange Money prompt on your phone. ${
    nextActionMessage ||
    'If the prompt does not appear automatically, open your Orange Money approval flow and check pending payment requests.'
  }`;

  useEffect(() => {
    if (isPaid || isFailed) {
      setIsResultPopupOpen(true);
    }
  }, [isPaid, isFailed]);

  const handleOrangeSubmit = (payload: Record<string, unknown>) => {
    if (typeof payload.phone !== 'string') {
      return;
    }

    initiateOrangePayment(payload.phone);
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
            provider='orange_money'
            providerName='Orange Money'
            onPaymentSubmit={payload => {
              handleOrangeSubmit(payload);
            }}
            // phoneHelperText='Enter a valid Cameroon Orange Money number, e.g. 697279682. You may also paste it with +237.'
            notice='We will send an Orange Money approval prompt to this number. Please approve it on your phone.'
            buttonText={isInitiating ? 'Sending Request...' : 'Pay With Orange Money'}
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

export default OrangeMoneyPayment;
