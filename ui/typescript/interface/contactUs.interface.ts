export interface IContactModelData {
  id: number;
  section_header: string;
  section_description: string;
  title: string;
  description: string;
  call_center_number: string;
  email: string;
  location: string;
  latitude: string;
  longitude: string;
  social_links: {
    facebook_url: string | null;
    x_url: string | null;
    linkedin_url: string | null;
    youtube_url: string | null;
  };
  map_url: string;
  get_in_touch_title: string;
  get_in_touch_description: string;
}

export interface IContactModel {
  data: IContactModelData;
}

export interface IContactFormModel {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
}
