import { IAboutModel } from '@/typescript/interface/aboutUs.interfaces';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endpoints';

export const fetchAboutPageData = async () => {
  const res = await axiosInstance.get<IAboutModel['AboutPageResponse']>(endpoints.cms.aboutUsPage);

  const data = res?.data?.data;
  const aboutUsOtherDetails: IAboutModel['AboutUsOtherDetails'] = {
    image: data?.why_you_trust_us?.image || '',
    mission_title: data?.why_you_trust_us?.mission_title || '',
    mission_description: data?.why_you_trust_us?.mission_description || '',
    vision_title: data?.why_you_trust_us?.vision_title || '',
    vision_description: data?.why_you_trust_us?.vision_description || '',
  };
  return {
    aboutUs: data?.about_us || ({} as IAboutModel['AboutUs']),
    whyYouTrustUs: data?.why_you_trust_us || ({} as IAboutModel['WhyYouTrustUs']),
    aboutUsOtherDetails,
    download: data?.download_section || ({} as IAboutModel['DownloadSection']),
  };
};
