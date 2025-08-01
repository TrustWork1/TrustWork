import BestPackage from '@/components/HomeOthers/BestPackage';
import { DownloadApp } from '@/components/HomeOthers/DownloadApp';
import HomeBanner from '@/components/HomeOthers/HomeBanner';
import { HowItWorks } from '@/components/HomeOthers/HowItWorks';
import { FeatureCard } from '@/components/HomeOthers/OurFeatures';
import ReferFriend from '@/components/HomeOthers/ReferFriend';
import Wrapper from '@/layout/wrapper/Wrapper';
import { HomePageBox } from '@/styles/StyledComponents/HomeStyled';

export default function Home() {
  return (
    <Wrapper>
      <HomePageBox>
        <HomeBanner />
        <FeatureCard />
        <HowItWorks />
        <BestPackage />
        <ReferFriend />
        <DownloadApp />
      </HomePageBox>
    </Wrapper>
  );
}
