import { globalCatchError } from '@/lib/functions/_helpers.lib';
import { BaseApiResponse } from '@/typescript/interface/common.interface';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { parseCookies } from 'nookies';
import { baseUrlApi } from '../endpoints';

const axiosInstance = axios.create({
  baseURL: baseUrlApi,
});

axiosInstance.interceptors.request.use(config => {
  const cookies = parseCookies();

  const token = cookies[process.env.NEXT_APP_TOKEN_NAME!];
  if (token && !!config.headers) {
    config.headers['x-access-token'] = `${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (res: AxiosResponse<BaseApiResponse>) => {
    // only show success notification on this routes

    // if (sucessNotificationEndPoints.includes(res?.config?.url as string)) {
    //   if (res?.data?.status !== 200) {
    //     globalCatchWarning(res);
    //   } else {
    //     globalCatchSucess(res);
    //   }
    // }

    return res;
  },
  async (error: AxiosError<BaseApiResponse>) => {
    globalCatchError(error);

    // const { data, status, config } = error.response!;
    // const originalRequest = error.config;

    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   const access_token = await refreshAccessToken();
    //   setCookieClient("token", access_token?.token);
    //   axios.defaults.headers.common["x-access-token"] = access_token?.token;
    //   return axiosInstance(originalRequest);
    // }

    return Promise.reject(error);

    // switch (status) {
    //   case 400:
    //     console.error(data);
    //     break;

    //   case 401:
    //     console.error("unauthorized");
    //     break;

    //   case 404:
    //     console.error("/not-found");
    //     break;

    //   case 500:
    //     console.error("/server-error");
    //     break;
    // }
    // return Promise.reject(error);
  }
);

export default axiosInstance;
