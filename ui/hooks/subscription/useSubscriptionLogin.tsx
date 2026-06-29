import { loginSubscriptionUser, resendSubscriptionPassword } from '@/api/functions/subscription';
import { SessionStorageKey } from '@/lib/functions/keys/sesssionStorageKeys';
import { sessionStorageHelper } from '@/lib/functions/sessionStorageHelper';
import {
  getSubscriptionAccessToken,
  saveSubscriptionAuthToken,
} from '@/lib/functions/subscriptionCheckout.lib';
import { setLoginData } from '@/redux-toolkit/slices/userSlice';
import { SubscriptionLoginFormValues } from '@/schema/subscription.yup';
import { userData } from '@/typescript/types/common.type';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAppDispatch } from 'hooks/redux/useAppDispatch';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

type UseSubscriptionLoginParams = {
  email: string;
  isExistingUser: boolean;
  onClose: () => void;
  onErrorMessage?: (message: string) => void;
  planId: number;
};

type SubscriptionAuthErrorResponse = {
  message?: string;
  data?: {
    error?: string;
  };
};

const getSubscriptionAuthErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<SubscriptionAuthErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.data?.error ||
      'Invalid credentials. Please check your email and password.'
    );
  }

  return 'Something went wrong while logging in. Please try again.';
};

export const useSubscriptionLogin = ({
  email,
  isExistingUser,
  onClose,
  onErrorMessage,
  planId,
}: UseSubscriptionLoginParams) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutateAsync: loginUser, isPending: isLoginPending } = useMutation({
    mutationKey: ['subscription-login'],
    mutationFn: loginSubscriptionUser,
  });

  const { mutateAsync: resendPassword, isPending: isResendPending } = useMutation({
    mutationKey: ['subscription-resend-password'],
    mutationFn: resendSubscriptionPassword,
  });

  const handleResendGeneratedPassword = async () => {
    if (isExistingUser || !email || isResendPending) {
      return;
    }

    const response = await resendPassword({
      email,
    });

    if (response) {
      toast.success('New password has been sent to the email please check and enter');
    }
  };

  const handleLoginSubmit = async (data: SubscriptionLoginFormValues) => {
    try {
      const response = await loginUser({
        email: data.email,
        username: data.email,
        password: data.password,
      });

      const token = getSubscriptionAccessToken(response);

      if (!token) {
        return;
      }

      saveSubscriptionAuthToken(token);

      const responseUser =
        response.user || response.UserData || response.data?.user || response.data?.UserData;
      if (responseUser) {
        dispatch(setLoginData(responseUser as userData));
      }
      sessionStorageHelper.set(SessionStorageKey.SubscriptionPlan, planId);

      await router.push(`/subscription/${token}`);
      onClose();
    } catch (error) {
      onErrorMessage?.(getSubscriptionAuthErrorMessage(error));
    }
  };

  return {
    handleLoginSubmit,
    handleResendGeneratedPassword,
    isLoginPending,
    isResendPending,
  };
};
