import { useSubscriptionLogin } from '@/hooks/subscription/useSubscriptionLogin';
import { SubscriptionLoginFormValues, subscriptionLoginSchema } from '@/schema/subscription.yup';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { MailIcon } from '@/ui/Icon/Maillcon';
import MuiModalWrapper from '@/ui/Modal/MuiModalWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormTextField from '../Forms/FormTextField';

type SubscriptionLoginModalProps = {
  open: boolean;
  onClose: () => void;
  email: string;
  isExistingUser: boolean;
  planId: number;
};

const SubscriptionLoginModal = ({
  open,
  onClose,
  email,
  isExistingUser,
  planId,
}: SubscriptionLoginModalProps) => {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionLoginFormValues>({
    resolver: yupResolver(subscriptionLoginSchema),
    mode: 'onChange',
    defaultValues: {
      email,
      password: '',
      remember_me: false,
    },
  });

  useEffect(() => {
    reset({
      email,
      password: '',
      remember_me: false,
    });
    setErrorMessage('');
  }, [email, open, reset]);

  const { handleLoginSubmit, handleResendGeneratedPassword, isLoginPending, isResendPending } =
    useSubscriptionLogin({
      email,
      isExistingUser,
      onClose,
      onErrorMessage: setErrorMessage,
      planId,
    });

  const onSubmit = async (data: SubscriptionLoginFormValues) => {
    setErrorMessage('');
    await handleLoginSubmit(data);
  };

  return (
    <MuiModalWrapper open={open} onClose={onClose} className='subscriptionFlowModal'>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} className='subscriptionFlowInr'>
        <Typography variant='h4' className='flowTitle'>
          {isExistingUser ? 'Welcome Back!' : 'Login to Your Account'}
        </Typography>
        <Typography variant='body1' className='flowSubText'>
          {isExistingUser
            ? 'Login to your existing account.'
            : 'We have sent a password to your email.'}
        </Typography>
        <FormTextField
          name='email'
          placeHolder='Email'
          endAdornment={<MailIcon />}
          control={control}
          errors={errors}
          isDisable={!isExistingUser}
        />
        {errorMessage && (
          <Alert severity='error' className='loginErrorAlert'>
            {errorMessage}
          </Alert>
        )}
        <FormTextField
          name='password'
          placeHolder={
            isExistingUser ? 'Enter your password' : 'Enter the password sent to your email'
          }
          control={control}
          errors={errors}
          isPassword
        />
        {isExistingUser ? (
          <Box className='loginMetaRow'>
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={watch('remember_me')}
                  onChange={event => setValue('remember_me', event.target.checked)}
                />
              }
              label='Remember me'
            /> */}
            {/* <Link href='#' underline='none'>
              Forgot Password?
            </Link> */}
          </Box>
        ) : (
          <Link
            href='#'
            underline='none'
            className='resendPasswordLink'
            onClick={event => {
              event.preventDefault();
              void handleResendGeneratedPassword();
            }}
          >
            {isResendPending ? 'Resending...' : 'Resend Generated Password'}
          </Link>
        )}
        <CustomButtonPrimary
          type='submit'
          variant='contained'
          color='primary'
          className='flowBtn'
          disabled={isLoginPending || isSubmitting || isResendPending}
        >
          {isLoginPending ? 'Logging in...' : 'Login'}
        </CustomButtonPrimary>
      </Box>
    </MuiModalWrapper>
  );
};

export default SubscriptionLoginModal;
