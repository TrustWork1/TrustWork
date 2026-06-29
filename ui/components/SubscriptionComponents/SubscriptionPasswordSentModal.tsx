import PaymentSuccessIcon from '@/ui/Icon/PaymentSuccessIcon';
import MuiModalWrapper from '@/ui/Modal/MuiModalWrapper';
import { Box, Typography } from '@mui/material';

type SubscriptionPasswordSentModalProps = {
  open: boolean;
  onClose: () => void;
  email: string;
};

const SubscriptionPasswordSentModal = ({
  open,
  onClose,
  email,
}: SubscriptionPasswordSentModalProps) => {
  return (
    <MuiModalWrapper open={open} onClose={onClose} className='subscriptionFlowModal'>
      <Box className='subscriptionFlowInr'>
        <Box className='successIcon'>
          <PaymentSuccessIcon />
        </Box>
        <Typography variant='h4' className='flowTitle'>
          Check Your Email
        </Typography>
        <Typography variant='body1' className='flowSubText'>
          We have sent a secure, auto-generated password to {email}.
        </Typography>
        <Box className='infoNote'>
          <Typography variant='body1'>
            Please check your inbox and spam folder for the password.
          </Typography>
        </Box>
      </Box>
    </MuiModalWrapper>
  );
};

export default SubscriptionPasswordSentModal;
