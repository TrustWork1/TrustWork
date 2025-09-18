import assest from '@/json/assest';
import PaymentSuccessIcon from '@/ui/Icon/PaymentSuccessIcon';
import MuiModalWrapper from '@/ui/Modal/MuiModalWrapper';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const PaymentSuccessModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <MuiModalWrapper isModalHead open={open} onClose={onClose} className='paymentSuccessModal'>
      <Box className='paymentSuccessInr'>
        <Image
          src={assest.paymentSuccessLftImg}
          width={200}
          height={200}
          alt='paymentSuccessLftImg'
          className='paymentSuccessLftImg'
        />
        <Image
          src={assest.paymentSuccessRgtImg}
          width={200}
          height={200}
          alt='paymentSuccessRgtImg'
          className='paymentSuccessRgtImg'
        />
        <i>
          <PaymentSuccessIcon />
        </i>
        <Typography variant='body1' className='secHead'>
          Payment Request Sent Successfully!
        </Typography>
        <Typography variant='body1' className='secSubText'>
          Thank you for your request. We will contact you shortly via phone.
        </Typography>
      </Box>
    </MuiModalWrapper>
  );
};

export default PaymentSuccessModal;
