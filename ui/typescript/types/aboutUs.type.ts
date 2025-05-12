import { IAboutModel } from '../interface/aboutUs.interfaces';

export type TAboutTypes = {
  aboutUs: IAboutModel['AboutUs'];
  whyYouTrustUs: IAboutModel['WhyYouTrustUs'];
  aboutUsOtherDetails: IAboutModel['AboutUsOtherDetails'];
  download: IAboutModel['DownloadSection'];
};
