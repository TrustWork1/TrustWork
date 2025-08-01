import KnowMoreAbout from '@/components/AboutOthers/KnowMoreAbout';
import Mission from '@/components/AboutOthers/Mission';
import WhyUs from '@/components/AboutOthers/WhyUs';
import { DownloadApp } from '@/components/HomeOthers/DownloadApp';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import Wrapper from '@/layout/wrapper/Wrapper';
import { AboutUsInner } from '@/styles/StyledComponents/AboutusStyled';

export default function AboutUs() {
  return (
    <Wrapper>
      <AboutUsInner>
        <InnerBanner
          heading='About Us'
          subTitle='Nulla non enim tortor est euismod tempus maecenas vel adipiscing. Eget accumsan urna gravida placerat egestas dolor. Sed molestie.'
        />
        <KnowMoreAbout />
        <WhyUs />
        <Mission />
        <DownloadApp />
      </AboutUsInner>
    </Wrapper>
  );
}
