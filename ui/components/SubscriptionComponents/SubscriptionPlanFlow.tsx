import { useEffect, useState } from 'react';
import SubscriptionEmailCheckModal from './SubscriptionEmailCheckModal';
import SubscriptionLoginModal from './SubscriptionLoginModal';
import SubscriptionPasswordSentModal from './SubscriptionPasswordSentModal';

type SubscriptionPlanFlowProps = {
  open: boolean;
  onClose: () => void;
  planId: number;
  planName: string;
  price: number;
};

type FlowStep = 'emailCheck' | 'passwordSent' | 'login';

const SubscriptionPlanFlow = ({ open, onClose, planId }: SubscriptionPlanFlowProps) => {
  const [step, setStep] = useState<FlowStep>('emailCheck');
  const [email, setEmail] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);

  const closeFlow = () => {
    onClose();
    setStep('emailCheck');
  };

  const handleEmailChecked = (checkedEmail: string, emailExists: boolean) => {
    setEmail(checkedEmail);
    setIsExistingUser(emailExists);
    setStep(emailExists ? 'login' : 'passwordSent');
  };

  const handlePasswordSentContinue = () => {
    setStep('login');
  };

  useEffect(() => {
    if (!open || step !== 'passwordSent') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      handlePasswordSentContinue();
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [open, step]);

  return (
    <>
      <SubscriptionEmailCheckModal
        open={open && step === 'emailCheck'}
        onClose={closeFlow}
        onEmailChecked={handleEmailChecked}
      />
      <SubscriptionPasswordSentModal
        open={open && step === 'passwordSent'}
        onClose={closeFlow}
        email={email}
      />
      <SubscriptionLoginModal
        open={open && step === 'login'}
        onClose={closeFlow}
        email={email}
        isExistingUser={isExistingUser}
        planId={planId}
      />
    </>
  );
};

export default SubscriptionPlanFlow;
