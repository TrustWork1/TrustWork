import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { fetchHomePageData } from '@/api/functions/home.cms';
import BestPackage from '@/components/HomeOthers/BestPackage';
import { DownloadApp } from '@/components/HomeOthers/DownloadApp';
import HomeBanner from '@/components/HomeOthers/HomeBanner';
import { HowItWorks } from '@/components/HomeOthers/HowItWorks';
import { FeatureCard } from '@/components/HomeOthers/OurFeatures';
import ReferFriend from '@/components/HomeOthers/ReferFriend';
import Wrapper from '@/layout/wrapper/Wrapper';
import { HomePageBox } from '@/styles/StyledComponents/HomeStyled';
import { THomeTypes } from '@/typescript/types/home.cms.type';

export const getServerSideProps = (async () => {
  try {
    const homePageRes = await fetchHomePageData();

    if (!homePageRes) {
      return { notFound: true };
    }
    return {
      props: { ...homePageRes },
    };
  } catch (err) {
    console.error('Error fetching homepage data:', err);
    return { notFound: true };
  }
}) satisfies GetServerSideProps<THomeTypes>;

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { appInfo, featureSection, howItWorks, pricingPlans, referral, download } = props;

  return (
    <Wrapper>
      <HomePageBox>
        <HomeBanner appInfo={appInfo} />
        <FeatureCard featureSectionInfo={featureSection} />
        <HowItWorks howItWorksInfo={howItWorks} />
        <BestPackage packageInfo={pricingPlans} />
        <ReferFriend referralInfo={referral} />
        <DownloadApp downloadInfo={download} />
      </HomePageBox>
    </Wrapper>
  );
};

export default Home;
