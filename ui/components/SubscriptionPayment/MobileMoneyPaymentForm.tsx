import {
  TMobileMoneyPaymentForm,
  mobileMoneyPaymentSchema,
} from '@/schema/subscriptionPayment.yup';
import { TSubscriptionPaymentFormProps } from '@/typescript/types/subscriptionPayment.type';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { NoteIcon } from '@/ui/Icon/NoteIcon';
import UserIcon from '@/ui/Icon/UserIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import FormTextField from '../Forms/FormTextField';

type MobileMoneyPaymentFormProps = TSubscriptionPaymentFormProps & {
  provider: 'orange_money' | 'mtn_mobile_money';
  providerName: string;
  buttonText?: string;
  disabled?: boolean;
  loading?: boolean;
  notice?: string;
  phoneHelperText?: string;
  statusContent?: ReactNode;
};

const MobileMoneyPaymentForm = ({
  token,
  plan,
  provider,
  providerName,
  onPaymentSubmit,
  buttonText,
  disabled = false,
  loading = false,
  notice,
  phoneHelperText,
  statusContent,
}: MobileMoneyPaymentFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TMobileMoneyPaymentForm>({
    resolver: yupResolver(mobileMoneyPaymentSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      phone: '',
    },
  });

  const onSubmit = (data: TMobileMoneyPaymentForm) => {
    const payload = {
      payment_mode: provider,
      token,
      plan_id: plan.id,
      plan_name: plan.planName,
      amount: String(plan.amount),
      ...data,
    };

    // console.info(`${providerName} payment payload`, payload);
    onPaymentSubmit?.(payload);
  };

  return (
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
          {providerName} Phone Number
        </Typography>
        <FormTextField
          name='phone'
          placeHolder='Enter a valid Cameroon Orange Money number, e.g. 697279682. You may also paste it with +237.'
          endAdornment={<NoteIcon />}
          control={control}
          errors={errors}
          type='tel'
          inputattributes={{
            inputMode: 'tel',
          }}
        />
        {phoneHelperText && (
          <Typography variant='caption' className='fieldHelperText'>
            {phoneHelperText}
          </Typography>
        )}
      </Box>
      <Typography variant='body1' className='paymentNotice'>
        {notice || 'A payment prompt will be sent to this mobile money number.'}
      </Typography>
      {statusContent}
      <CustomButtonPrimary
        type='submit'
        variant='contained'
        color='primary'
        className='payBtn'
        disabled={disabled}
      >
        {loading ? (
          <>
            <CircularProgress size={18} color='inherit' />
            {buttonText || `Pay With ${providerName}`}
          </>
        ) : (
          buttonText || `Pay With ${providerName}`
        )}
      </CustomButtonPrimary>
    </Box>
  );
};

export default MobileMoneyPaymentForm;
