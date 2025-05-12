// import { GetProfileDetails } from '@/api/functions/user.api';
// import { logout, setLoginData } from '@/redux-toolkit/slices/userSlice';
// import { useQuery } from '@tanstack/react-query';
// import { useEffect } from 'react';
// import { useAppDispatch } from '../redux/useAppDispatch';

// const useUser = () => {
//   // const cookies = parseCookies();
//   // const token: string = cookies[process.env.NEXT_APP_TOKEN_NAME!];
//   const dispatch = useAppDispatch();
//   // const { userData } = useAppSelector(s => s.userSlice);

//   const profileDetails = useQuery({
//     queryKey: ['userdetails'],
//     queryFn: GetProfileDetails,
//     // enabled: !!token && userData === null,

//     // onSuccess(data) {
//     //   if (data?.data?.status === 401) {
//     //     dispatch(logout());
//     //   } else {
//     //     dispatch(setLoginData(data?.data?.data));
//     //   }
//     // },
//     // onError() {
//     //   dispatch(logout());
//     // }
//   });

//   useEffect(() => {
//     if (profileDetails?.data) {
//       if (profileDetails?.data?.status === 401) {
//         dispatch(logout());
//       } else {
//         dispatch(setLoginData(profileDetails?.data?.data?.data));
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [profileDetails?.status, profileDetails?.data]);

//   return { ...profileDetails };
// };

// export default useUser;

function useUser() {
  return <div>test</div>;
}

export default useUser;
