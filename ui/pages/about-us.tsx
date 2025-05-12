import { fetchAboutPageData } from '@/api/functions/aboutUs.cms';
import KnowMoreAbout from '@/components/AboutOthers/KnowMoreAbout';
import Mission from '@/components/AboutOthers/Mission';
import WhyUs from '@/components/AboutOthers/WhyUs';
import { DownloadApp } from '@/components/HomeOthers/DownloadApp';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import Wrapper from '@/layout/wrapper/Wrapper';
import { AboutUsInner } from '@/styles/StyledComponents/AboutusStyled';
import { TAboutTypes } from '@/typescript/types/aboutUs.type';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export const getServerSideProps = (async () => {
  try {
    const aboutUsPageRes = await fetchAboutPageData();

    if (!aboutUsPageRes) {
      return { notFound: true };
    }
    return {
      props: { ...aboutUsPageRes },
    };
  } catch {
    return { notFound: true };
  }
}) satisfies GetServerSideProps<TAboutTypes>;
export default function AboutUs(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { aboutUs, whyYouTrustUs, aboutUsOtherDetails, download } = props;
console.log(aboutUsOtherDetails,'ddd')
  return (
    <Wrapper>
      <AboutUsInner>
        <InnerBanner heading={aboutUs?.section_header} subTitle={aboutUs?.section_description} />
        <KnowMoreAbout aboutUsInfo={aboutUs} />
        <WhyUs whyUsInfo={whyYouTrustUs} />
        <Mission missionInfo={aboutUsOtherDetails} />
        <DownloadApp downloadInfo={download} />
      </AboutUsInner>
    </Wrapper>
  );
}
