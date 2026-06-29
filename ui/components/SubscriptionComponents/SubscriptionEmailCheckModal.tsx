import { checkSubscriptionEmail } from '@/api/functions/subscription';
import {
  SubscriptionEmailCheckFormValues,
  subscriptionEmailCheckSchema,
} from '@/schema/subscription.yup';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { MailIcon } from '@/ui/Icon/Maillcon';
import MuiModalWrapper from '@/ui/Modal/MuiModalWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import FormTextField from '../Forms/FormTextField';

type SubscriptionEmailCheckModalProps = {
  open: boolean;
  onClose: () => void;
  onEmailChecked: (email: string, emailExists: boolean) => void;
};

const SubscriptionEmailCheckModal = ({
  open,
  onClose,
  onEmailChecked,
}: SubscriptionEmailCheckModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionEmailCheckFormValues>({
    resolver: yupResolver(subscriptionEmailCheckSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const { mutateAsync: checkEmail, isPending } = useMutation({
    mutationKey: ['subscription-email-check'],
    mutationFn: checkSubscriptionEmail,
  });

  const onSubmit = async (data: SubscriptionEmailCheckFormValues) => {
    const response = await checkEmail({
      email: data.email,
    });

    const responseData = response.data ?? response;
    const email = responseData.email || data.email;
    const emailExists = Boolean(responseData.exists);
    const passwordSent = Boolean(responseData.password_sent);
    const canLogin = (responseData.can_login ?? emailExists) || passwordSent;

    if (!canLogin && !passwordSent && !emailExists) {
      return;
    }

    onEmailChecked(email, emailExists);
  };

  return (
    <MuiModalWrapper open={open} onClose={onClose} className='subscriptionFlowModal'>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} className='subscriptionFlowInr'>
        <Box className='flowIcon'>
          <MailIcon />
        </Box>
        <Typography variant='h4' className='flowTitle'>
          Check Your Email
        </Typography>
        <Typography variant='body1' className='flowSubText'>
          Enter your email address and we will check if you already have an account.
        </Typography>
        <FormTextField
          name='email'
          placeHolder='Enter your email address'
          endAdornment={<MailIcon />}
          control={control}
          errors={errors}
        />
        <CustomButtonPrimary
          type='submit'
          variant='contained'
          color='primary'
          className='flowBtn'
          disabled={isPending}
        >
          Continue
        </CustomButtonPrimary>
      </Box>
    </MuiModalWrapper>
  );
};

export default SubscriptionEmailCheckModal;
