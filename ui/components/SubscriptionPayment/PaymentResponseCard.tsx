import PaymentSuccessIcon from '@/ui/Icon/PaymentSuccessIcon';
import { Box, Typography } from '@mui/material';

type PaymentResponseCardProps = {
  status: 'pending' | 'success' | 'failed';
  title: string;
  message: string;
  referenceId?: string;
};

const PaymentResponseCard = ({ status, title, message, referenceId }: PaymentResponseCardProps) => {
  return (
    <Box className={`paymentResponseCard ${status}`}>
      <Box className='paymentResponseIcon'>
        {status === 'success' ? <PaymentSuccessIcon /> : status === 'pending' ? '...' : '!'}
      </Box>
      <Box>
        <Typography variant='h3' className='paymentResponseTitle'>
          {title}
        </Typography>
        <Typography variant='body1' className='paymentResponseText'>
          {message}
        </Typography>
        {referenceId && (
          <Typography variant='body1' className='paymentResponseRef'>
            Reference: {referenceId}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PaymentResponseCard;
