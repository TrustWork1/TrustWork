import { BaseApiResponse } from './common.interface';

export interface IAboutModel {
  AboutUs: {
    id: number;
    section_header: string;
    section_description: string;
    title: string;
    description: string;
    image1: string;
    image2: string;
  };

  WhyYouTrustUs: {
    id: number;
    section_header: string;
    section_description: string;
    section_image: string;
    image: string;
    mission_title: string;
    mission_description: string;
    vision_title: string;
    vision_description: string;

    features: {
      id: number;
      title: string;
      description: string;
      icon: string;
    }[];
  };

  AboutUsOtherDetails: {
    image: string;
    mission_title: string;
    mission_description: string;
    vision_title: string;
    vision_description: string;
  };

  DownloadSection: {
    id: number;
    title: string;
    description: string;
    playstore_link: string;
    appstore_link: string;
    image: string;
  };

  AboutPageResponse: {
    data: {
      about_us: IAboutModel['AboutUs'];
      why_you_trust_us: IAboutModel['WhyYouTrustUs'];
      aboutus_other_details: IAboutModel['AboutUsOtherDetails'];
      download_section: IAboutModel['DownloadSection'];
    };
  } & BaseApiResponse;
}
