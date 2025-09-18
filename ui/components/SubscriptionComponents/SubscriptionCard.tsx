import { submitSubscriptionRequestForm } from '@/api/functions/subscription';
import { formatPlanDuration } from '@/lib/functions/_helpers.lib';
import { SelectPlanQueryFormValues, selectPlanQuerySchema } from '@/schema/subscription.yup';
import { SubscriptionCardWrap } from '@/styles/StyledComponents/SubscriptionCardWrap';
import { ISubscriptionCardProps } from '@/typescript/types/subscription.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, List, ListItem, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import PaymentSuccessModal from './PaymentSuccessModal';
import SelectPlanRequestModal from './SelectPlanRequestModal';

function SubscriptionCard({
  planName,
  planSubTitle,
  price,
  features,
  isPopular,
}: ISubscriptionCardProps) {
  const [userInfo, setUserInfo] = useState(false);
  const [payment, setPayment] = useState(false);
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SelectPlanQueryFormValues>({
    resolver: yupResolver(selectPlanQuerySchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      subscription_frequency: '',
      amount: '',
    },
  });
  const userInfoOpenHandler = (planName: string, price: number) => {
    setUserInfo(true);
    reset({
      full_name: '',
      email: '',
      phone: '',
      amount: String(price),
      subscription_frequency: planName,
    });
  };
  const userInfoCloseHandler = () => {
    setUserInfo(false);
  };

  const paymentOpenHandler = () => {
    setPayment(true);
    setUserInfo(false);
  };

  const paymentCloseHandler = () => {
    setPayment(false);
    // setUserInfo(true);
  };

  const { mutateAsync: subscriptionRequest, isPending } = useMutation({
    mutationKey: ['submitSubscriptionRequestForm'],
    mutationFn: submitSubscriptionRequestForm,
    onSuccess: res => {
      if (res?.type === 'success') {
        toast.success("Your message has been sent successfully! We'll get back to you soon.");
        reset();
        paymentOpenHandler();
      } else {
        toast.error(res?.message);
      }
    },
    onError: (error: AxiosError<{ data?: { message?: string } }>) => {
      toast.error(error?.response?.data?.data?.message || 'Something went wrong');
    },
  });

  const onSubmit = (data: SelectPlanQueryFormValues) => {
    const bodyData = {
      name: data.full_name,
      email: data.email,
      phone_number: data.phone,
      amount: data.amount,
      subscription_frequency: data.subscription_frequency,
    };
    subscriptionRequest(bodyData);
  };

  return (
    <SubscriptionCardWrap>
      {isPopular && (
        <Box className='popularChip'>
          <Typography variant='body1'>Most Popular</Typography>
        </Box>
      )}

      <Box className='basicPlanCard'>
        <Typography variant='body1' className='planTitle'>
          {planName}
        </Typography>
        <Typography variant='body1' className='planSubtitle'>
          {planSubTitle}
        </Typography>

        <Box display='flex' alignItems='baseline' className='priceBlk'>
          <Typography variant='body1' className='planPrice'>
            XAF {price}
          </Typography>
          <Typography variant='body1' className='planDuration'>
            /{formatPlanDuration(planName)}
          </Typography>
        </Box>

        <List className='planFeatures' disablePadding>
          {features.map((data, index) => (
            <ListItem key={index} disablePadding className='featureItem'>
              {data}
            </ListItem>
          ))}
        </List>
      </Box>
      <Button
        fullWidth
        variant='contained'
        color='primary'
        className='selectPlanBtn'
        onClick={() => userInfoOpenHandler(planName, price)}
      >
        Select Plan
      </Button>
      <SelectPlanRequestModal
        open={userInfo}
        onClose={userInfoCloseHandler}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        errors={errors}
        isPending={isPending}
      />

      <PaymentSuccessModal open={payment} onClose={paymentCloseHandler} />
    </SubscriptionCardWrap>
  );
}

export default SubscriptionCard;
