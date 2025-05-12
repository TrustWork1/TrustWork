export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const baseUrlApi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/`;
export const baseUrlMedia = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

export const mediaUrl = (url: string) => {
  return `${baseUrlMedia}/uploads/${url}`;
};

export const endpoints = {
  cms: {
    homePage: '/home-page/',
    aboutUsPage: '/aboutus-page/',
    contactUs: '/contactus-page/',
    contactUsFormSubmit: '/contactus-form/',
    termCondition: '/terms-conditions-page/',
    privacyPolicy: '/privacy-policy-page/',
  },
};

export const sucessNotificationEndPoints = [
  // endpoints.auth.signup,
];
