import { fetchAboutPageData } from '@/api/functions/aboutUs.cms';
import KnowMoreAbout from '@/components/AboutOthers/KnowMoreAbout';
import Mission from '@/components/AboutOthers/Mission';
import WhyUs from '@/components/AboutOthers/WhyUs';
import ErrorBoundary from '@/components/Error/ErrorBoundary';
import { DownloadApp } from '@/components/HomeOthers/DownloadApp';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import Wrapper from '@/layout/wrapper/Wrapper';
import { AboutUsInner } from '@/styles/StyledComponents/AboutusStyled';
import { TAboutTypes } from '@/typescript/types/aboutUs.type';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { Suspense } from 'react';

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
  const { aboutUs, whyYouTrustUs, aboutUsOtherDetails, download, downloadUrls } = props;

  return (
    <Wrapper downloadUrls={downloadUrls}>
      <AboutUsInner>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <InnerBanner
              heading={aboutUs?.section_header}
              subTitle={aboutUs?.section_description}
            />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <KnowMoreAbout aboutUsInfo={aboutUs} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <WhyUs whyUsInfo={whyYouTrustUs} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <Mission missionInfo={aboutUsOtherDetails} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={'Loading.....'}>
            <DownloadApp downloadInfo={download} />
          </Suspense>
        </ErrorBoundary>
      </AboutUsInner>
    </Wrapper>
  );
}
