export interface ITermsAndConditions {
  id: number;
  section_header: string;
  section_description: string;
  details: string;
  download_section: {
    playstore_link: string;
    appstore_link: string;
  };
}
