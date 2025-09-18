import { fetchHomePageData } from '@/api/functions/home.cms';
import ErrorBoundary from '@/components/Error/ErrorBoundary';
import BestPackage from '@/components/HomeOthers/BestPackage';
import { DownloadApp } from '@/components/HomeOthers/DownloadApp';
import HomeBanner from '@/components/HomeOthers/HomeBanner';
import { HowItWorks } from '@/components/HomeOthers/HowItWorks';
import { FeatureCard } from '@/components/HomeOthers/OurFeatures';
import ReferFriend from '@/components/HomeOthers/ReferFriend';
import Wrapper from '@/layout/wrapper/Wrapper';
import { HomePageBox } from '@/styles/StyledComponents/HomeStyled';
import { THomeTypes } from '@/typescript/types/home.cms.type';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Suspense } from 'react';

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
  const { appInfo, featureSection, howItWorks, pricingPlans, referral, download, downloadUrls } =
    props;

  return (
    <Wrapper downloadUrls={downloadUrls}>
      <HomePageBox>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <HomeBanner appInfo={appInfo} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <FeatureCard featureSectionInfo={featureSection} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <HowItWorks howItWorksInfo={howItWorks} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <BestPackage packageInfo={pricingPlans} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <ReferFriend referralInfo={referral} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <DownloadApp downloadInfo={download} />
          </Suspense>
        </ErrorBoundary>
      </HomePageBox>
    </Wrapper>
  );
};

export default Home;
